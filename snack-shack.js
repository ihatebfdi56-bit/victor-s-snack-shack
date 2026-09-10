const snacks = [
  {id:'sandwich',name:'Breakfast Sandwich',type:'savory',label:'Hot & ready',price:5.5,description:'Egg, cheddar, and crisp lettuce on toasted brioche.',image:'menu-breakfast-sandwich.svg'},
  {id:'wrap',name:'Garden Wrap',type:'savory',label:'Fresh pick',price:7.25,description:'Roasted vegetables, greens, and herby sauce.',image:'menu-garden-wrap.svg'},
  {id:'berry',name:'Berry Yogurt Cup',type:'sweet',label:'Cold & creamy',price:4.25,description:'Yogurt, berries, granola, and honey drizzle.',image:'menu-berry-cup.svg'},
  {id:'pasta',name:'Veggie Pasta Salad',type:'savory',label:'Chef pick',price:6.95,description:'Pasta, tomatoes, olives, and basil vinaigrette.',image:'menu-pasta-salad.svg'},
  {id:'cookie',name:'Chocolate Chip Cookie',type:'sweet',label:'Baked today',price:2.5,description:'Soft center, crispy edge, serious chocolate.',image:'menu-berry-cup.svg'},
  {id:'trailmix',name:'Trail Mix Pouch',type:'sweet',label:'Study fuel',price:3.75,description:'Pretzels, raisins, cereal, and chocolate chips.',image:'menu-pasta-salad.svg'}
];
let cart = JSON.parse(localStorage.getItem('snackShackCart') || '{}');
let activeFilter = 'all';
const $ = selector => document.querySelector(selector);
const money = value => `$${value.toFixed(2)}`;

function renderMenu(){
  const query = $('#menu-search').value.trim().toLowerCase();
  const matches = snacks.filter(snack => (activeFilter === 'all' || snack.type === activeFilter) && `${snack.name} ${snack.description}`.toLowerCase().includes(query));
  $('#menu-grid').innerHTML = matches.map(snack => `<article class="snack-card"><div class="snack-image"><img src="${snack.image}" alt="${snack.name}"></div><span class="snack-type">${snack.label}</span><h3>${snack.name}</h3><p>${snack.description}</p><div class="card-bottom"><span class="price">${money(snack.price)}</span><button class="add-button" type="button" data-add="${snack.id}" aria-label="Add ${snack.name} to snack bag">+</button></div></article>`).join('');
  $('#empty-state').hidden = matches.length > 0;
}
function cartCount(){return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0)}
function saveCart(){localStorage.setItem('snackShackCart',JSON.stringify(cart));renderCart();}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveCart();openCart();const snack=snacks.find(item=>item.id===id);showToast(`${snack.name} added to your bag`)}
function renderCart(){
  const count=cartCount(); $('#cart-count').textContent=count; $('#bag-count-label').textContent=`(${count})`;
  const lines=Object.entries(cart).filter(([,quantity])=>quantity>0).map(([id,quantity])=>{const snack=snacks.find(item=>item.id===id);return `<div class="cart-line"><div class="cart-line-info"><strong>${snack.name}</strong><small>${money(snack.price)} each</small></div><div class="qty-controls"><button type="button" data-change="${id}" data-delta="-1" aria-label="Remove one ${snack.name}">−</button><span>${quantity}</span><button type="button" data-change="${id}" data-delta="1" aria-label="Add one ${snack.name}">+</button></div></div>`}).join('');
  $('#cart-items').innerHTML=lines || '<p class="cart-empty">Your bag is waiting for a good idea.</p><a href="#menu" class="button button-dark" id="empty-shop-link">Browse the menu</a>';
  const total=Object.entries(cart).reduce((sum,[id,quantity])=>sum+snacks.find(item=>item.id===id).price*quantity,0);
  $('#cart-total').textContent=money(total);$('#cart-summary').hidden=!count;
}
function openCart(){$('#cart-drawer').classList.add('open');$('#cart-drawer').setAttribute('aria-hidden','false')}
function closeCart(){$('#cart-drawer').classList.remove('open');$('#cart-drawer').setAttribute('aria-hidden','true')}
function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),2200)}
function openCheckout(){
  $('#checkout-content').innerHTML=`<p class="kicker">Almost snack time</p><h2>Where should we meet?</h2><p>Choose a spot at school for tomorrow. This demo saves your order locally on this device.</p><form class="checkout-form" id="checkout-form"><label for="student-name">Your first name</label><input id="student-name" name="name" required placeholder="e.g. Maya"><label for="drop-spot">Delivery spot</label><select id="drop-spot" name="spot"><option>Room 214</option><option>Library entrance</option><option>Gym lobby</option><option>Front office</option></select><button class="button button-dark" type="submit">Place my snack order →</button></form>`;
  $('#checkout-modal').showModal();
  $('#checkout-form').addEventListener('submit',event=>{event.preventDefault();const name=$('#student-name').value.trim();const spot=$('#drop-spot').value;localStorage.setItem('snackShackLastOrder',JSON.stringify({name,spot,items:cart,date:new Date().toISOString()}));cart={};saveCart();$('#checkout-content').innerHTML=`<p class="kicker">Order confirmed ✦</p><h2>See you tomorrow, ${name}!</h2><p>Your snacks will be waiting at <strong>${spot}</strong>. Ask your Snack Shack captain if you need to change anything before 4 PM.</p><button class="button button-dark" type="button" id="done-button">Back to the menu</button>`;$('#done-button').addEventListener('click',()=>$('#checkout-modal').close());showToast('Order saved on this device')});
}
function openRecipeZine(){
  $('#checkout-content').innerHTML=`<p class="kicker">Snack club secrets</p><h2>Mini recipe zine</h2><p><strong>Berry Crunch Cup</strong><br>Layer yogurt, berries, and granola in a cup. Finish with a little honey and a brave pinch of cinnamon.</p><p><strong>Study-break trail mix</strong><br>Mix pretzels, cereal, dried fruit, and chocolate chips. Pack it up, then share exactly one handful.</p><button class="button button-dark" type="button" id="recipe-done">Keep snacking</button>`;
  $('#checkout-modal').showModal();
  $('#recipe-done').addEventListener('click',()=>$('#checkout-modal').close());
}
document.addEventListener('click',event=>{const add=event.target.closest('[data-add]');if(add)addToCart(add.dataset.add);const change=event.target.closest('[data-change]');if(change){const id=change.dataset.change;cart[id]=Math.max(0,(cart[id]||0)+Number(change.dataset.delta));if(!cart[id])delete cart[id];saveCart()}if(event.target.id==='cart-button')openCart();if(event.target.id==='close-cart'||event.target.id==='drawer-backdrop')closeCart();if(event.target.id==='checkout-button')openCheckout();if(event.target.id==='recipe-button')openRecipeZine();});
document.querySelectorAll('.filter-button').forEach(button=>button.addEventListener('click',()=>{activeFilter=button.dataset.filter;document.querySelectorAll('.filter-button').forEach(item=>item.classList.toggle('active',item===button));renderMenu()}));
$('#menu-search').addEventListener('input',renderMenu);
$('.modal-close').addEventListener('click',()=>$('#checkout-modal').close());
$('#checkout-modal').addEventListener('click',event=>{if(event.target===$('#checkout-modal'))$('#checkout-modal').close()});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();const dialog=$('#checkout-modal');if(dialog.open)dialog.close()}});
renderMenu();renderCart();
