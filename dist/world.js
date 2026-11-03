(() => {
  const body = document.body;
  const terrain = body.dataset.terrain || 'atlas';
  const sound = document.querySelector('[data-sound]');
  const tones = { cabin:'🏠', pine:'🌲', peak:'🏔️', coral:'🪸', fish:'🐠', reef:'🐚', oasis:'💧', adobe:'🏜️', cactus:'🌵', palm:'🌴', hut:'🛖', lagoon:'🐬', tower:'🏢', park:'🌳', transit:'🚈' };
  let selected = document.querySelector('.item-button.selected')?.dataset.item || '';
  let resources = Number(localStorage.getItem(`terra-${terrain}-resources`) || 24);
  let items = JSON.parse(localStorage.getItem(`terra-${terrain}-items`) || '[]');
  let audioOn = true;
  const grid = document.querySelector('[data-world-grid]');
  const resourceNode = document.querySelector('[data-resource-count]');
  const populationNode = document.querySelector('[data-population]');
  const selectedNode = document.querySelector('[data-selected-label]');
  function beep(freq=420){ if(!audioOn) return; try{const a=new AudioContext(),o=a.createOscillator(),g=a.createGain();o.type='square';o.frequency.value=freq;g.gain.value=.035;o.connect(g);g.connect(a.destination);o.start();g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.08);o.stop(a.currentTime+.09)}catch{}}
  function save(){localStorage.setItem(`terra-${terrain}-resources`,resources);localStorage.setItem(`terra-${terrain}-items`,JSON.stringify(items))}
  function update(){if(resourceNode) resourceNode.textContent=resources;if(populationNode) populationNode.textContent=items.length;if(selectedNode) selectedNode.textContent=selected?selected.toUpperCase():'NONE'}
  function render(){if(!grid)return;grid.querySelectorAll('.placed-item').forEach(n=>n.remove());items.forEach((item,i)=>{const el=document.createElement('button');el.className='placed-item';el.dataset.icon=tones[item.type]||'✦';el.title=`Remove ${item.type}`;el.setAttribute('aria-label',`Remove ${item.type}`);el.style.gridColumn=String(item.x||((i%9)+1));el.style.gridRow=String(item.y||((i%3)+4));el.addEventListener('click',()=>{items.splice(i,1);resources+=1;save();render();update();beep(220)});grid.append(el)})}
  function toast(message){let n=document.querySelector('.toast');if(!n){n=document.createElement('div');n.className='toast';n.setAttribute('role','status');body.append(n)}n.textContent=message;n.classList.add('show');setTimeout(()=>n.classList.remove('show'),1500)}
  function add(type,x,y){if(!type)return toast('SELECT A CREATION FIRST');if(resources<2)return toast('NOT ENOUGH RESOURCES');items.push({type,x:x||1+Math.floor(Math.random()*9),y:y||4+Math.floor(Math.random()*3)});resources-=2;save();render();update();toast(`${type.toUpperCase()} CREATED!`);beep(620)}
  document.querySelectorAll('.item-button').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.item-button').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false')});btn.classList.add('selected');btn.setAttribute('aria-pressed','true');selected=btn.dataset.item;update();beep()}));
  document.querySelectorAll('.build-button').forEach(btn=>btn.addEventListener('click',()=>add(btn.dataset.item||selected)));
  grid?.addEventListener('click',e=>{if(e.target.closest('.placed-item'))return;const rect=grid.getBoundingClientRect();const x=Math.max(1,Math.min(10,Math.ceil((e.clientX-rect.left)/rect.width*10)));const y=Math.max(1,Math.min(6,Math.ceil((e.clientY-rect.top)/rect.height*6)));add(selected,x,y)});
  document.querySelectorAll('[data-action="reset"]').forEach(btn=>btn.addEventListener('click',()=>{items=[];resources=24;save();render();update();toast('WORLD RESET');beep(180)}));
  sound?.addEventListener('click',()=>{audioOn=!audioOn;sound.textContent=audioOn?'♫ ON':'♫ OFF';sound.setAttribute('aria-pressed',String(audioOn));beep()});
  document.addEventListener('keydown',e=>{if(body.classList.contains('home')&&'12345'.includes(e.key)){document.querySelector(`[data-key="${e.key}"]`)?.focus()}if(e.key==='Enter'&&document.activeElement?.dataset.key)document.activeElement.click()});
  render();update();
})();
