document.documentElement.classList.add('js'); document.body.classList.add('js'); var _jw=document.getElementById('jswarn'); if(_jw) _jw.remove();
  const reduce=false; // client wants animations on every device, incl. Windows with animation effects off

  (function(){ const pre=document.getElementById('pre'), pct=document.getElementById('pct'); if(!pre) return;
    if(reduce){ pre.style.display='none'; return; }
    let n=0; const iv=setInterval(()=>{ n+=Math.floor(Math.random()*12)+4; if(n>=100){n=100;clearInterval(iv);
      setTimeout(()=>{ pre.classList.add('done'); setTimeout(()=>pre.remove(),1000); },240); } if(pct) pct.textContent=n; }, 90); })();

  let lenis=null;

  // liquid-glass nav indicator
  const navlinks=document.getElementById('navlinks'), navInd=document.getElementById('navInd');
  if(navlinks && navInd){ const as=[...navlinks.querySelectorAll('a')];
    as.forEach(a=> a.addEventListener('mouseenter', ()=>{ navInd.style.opacity='1'; navInd.style.width=a.offsetWidth+'px'; navInd.style.transform='translateX('+a.offsetLeft+'px)'; }));
    navlinks.addEventListener('mouseleave', ()=> navInd.style.opacity='0'); }

  // manifesto words
  const mtext=document.getElementById('mtext'); let mwords=[];
  if(mtext){ const keys=(mtext.dataset.keys||'').toLowerCase().split(' ').filter(Boolean);
    const words=mtext.textContent.trim().split(/\s+/); mtext.textContent='';
    words.forEach((w,i)=>{ const s=document.createElement('span'); s.className='w';
      if(keys.some(k=> w.toLowerCase().replace(/[^a-z]/g,'')===k)) s.classList.add('key');
      s.textContent=w; mtext.appendChild(s); if(i<words.length-1) mtext.appendChild(document.createTextNode(' ')); });
    mwords=[...mtext.querySelectorAll('.w')]; }

  // build word-cascade headings
  document.querySelectorAll('.cascade').forEach(el=>{ const words=el.textContent.trim().split(/\s+/); el.textContent='';
    words.forEach((w,i)=>{ const s=document.createElement('span'); s.textContent=w; s.style.transitionDelay=(i*0.06)+'s'; el.appendChild(s);
      if(i<words.length-1) el.appendChild(document.createTextNode(' ')); }); });

  const io=new IntersectionObserver((es)=>{ es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in');
    if(e.target.classList.contains('count')) countUp(e.target); io.unobserve(e.target); } }); }, { threshold:.16, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('[data-rev], .lines, .count, .cascade, .pe, .ugrow').forEach(el=> io.observe(el));

  function countUp(el){ if(reduce){ el.textContent=el.dataset.to; return; }
    const to=+el.dataset.to, dur=1400, t0=performance.now();
    (function step(now){ const p=Math.min(1,(now-t0)/dur), e=1-Math.pow(1-p,3);
      el.textContent=Math.round(to*e).toLocaleString('en-IN'); if(p<1) requestAnimationFrame(step); })(t0); }

  // dock
  const hdr=document.getElementById('hdr'), brkImg=document.getElementById('brkImg');
  const scWrap=document.getElementById('harvest'); const prods=scWrap?[...scWrap.querySelectorAll('.sc-prod')]:[];
  const scLabels=scWrap?[...scWrap.querySelectorAll('.sc-label')]:[]; const scStage=document.getElementById('scStage');
  const Np=prods.length; const easeOut=t=>1-Math.pow(1-t,3); const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  const ENTER_Y=0.60,HOLD_Y=-0.06,ENTER_S=0.60,HOLD_S=1.06;
  function slotFor(i){ const sp=Np<=3?0.30:(Np<=5?0.185:0.15), s=Np<=3?0.48:(Np<=5?0.4:0.32); return {x:(i-(Np-1)/2)*sp,y:0.16,s:s}; }
  function updateDock(){ if(!scWrap||!scStage) return;
    const r=scWrap.getBoundingClientRect(); const total=scWrap.offsetHeight-innerHeight; let p=clamp((-r.top)/(total||1),0,1); if(reduce)p=1;
    const W=scStage.clientWidth,H=scStage.clientHeight;
    prods.forEach((el,i)=>{ const tE=(i-1)/Np,tH=i/Np,tD=(i+1)/Np,s=Object.assign({},slotFor(i)); const ow=el.offsetWidth||1; s.s=Math.min(s.s,(Np<=5?0.185:0.15)*W*0.92/ow); if(innerWidth<=640) s.y=0.12; let x=0,y=0,sc=1,op=1,docked=false;
      if(p<tE){ y=ENTER_Y*H; sc=ENTER_S; op=0; }
      else if(p<tH){ const k=easeOut(clamp((p-tE)/(tH-tE),0,1)); y=(ENTER_Y+(HOLD_Y-ENTER_Y)*k)*H; sc=ENTER_S+(HOLD_S-ENTER_S)*k; op=Math.min(1,k*1.5); }
      else if(p<tD){ const k=easeOut(clamp((p-tH)/(tD-tH),0,1)); x=k*s.x*W; y=(HOLD_Y+(s.y-HOLD_Y)*k)*H; sc=HOLD_S-(HOLD_S-s.s)*k; if(k>0.85)docked=true; }
      else { x=s.x*W; y=s.y*H; sc=s.s; docked=true; }
      el.style.opacity=op; el.style.transform=`translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${sc})`;
      if(scLabels[i]){ scLabels[i].style.left=(50+s.x*100)+'%'; scLabels[i].style.opacity=docked?1:0; } });
  }
  // horizontal pin
  const hpin=document.getElementById('hpin'), hptrack=document.getElementById('hptrack');
  function updateHpin(){ if(!hpin||!hptrack) return;
    const r=hpin.getBoundingClientRect(); const total=hpin.offsetHeight-innerHeight;
    const p=clamp((-r.top)/(total||1),0,1); const dist=hptrack.scrollWidth-innerWidth;
    hptrack.style.transform='translateX('+(-p*Math.max(0,dist))+'px)'; }

  let ticking=false;
  function frame(){ const y=scrollY; hdr.classList.toggle('solid', y>20);
    if(!reduce && brkImg){ const r=brkImg.parentElement.getBoundingClientRect(); brkImg.style.transform='translateY('+((innerHeight-r.top)*0.05-28)+'px)'; }
    if(mwords.length){ const vh=innerHeight; mwords.forEach(w=>{ const r=w.getBoundingClientRect(); w.classList.toggle('lit', r.top<vh*0.72); }); }
    updateDock(); updateHpin(); ticking=false; }
  function onScroll(){ if(!ticking){ requestAnimationFrame(frame); ticking=true; } }
  if(lenis) lenis.on('scroll', onScroll); addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', ()=>{ updateDock(); updateHpin(); }); frame(); updateDock(); updateHpin();

  // magnetic buttons
  if(matchMedia('(pointer:fine)').matches && !reduce){
    document.querySelectorAll('.magnet').forEach(m=>{ const el=m.firstElementChild;
      m.addEventListener('mousemove', e=>{ const r=m.getBoundingClientRect(); el.style.transform='translate('+((e.clientX-r.left-r.width/2)*.3)+'px,'+((e.clientY-r.top-r.height/2)*.4)+'px)'; });
      m.addEventListener('mouseleave', ()=> el.style.transform=''); });
  }

  // footer smoke — soft white/gold on black
  (function(){
    const footer=document.getElementById('contact'); const cv=document.getElementById('smoke'); if(!footer||!cv||reduce) return;
    const ctx=cv.getContext('2d'); let W=0,H=0; const dpr=Math.min(2,window.devicePixelRatio||1);
    function size(){ const r=footer.getBoundingClientRect(); W=cv.width=Math.max(1,r.width*dpr); H=cv.height=Math.max(1,r.height*dpr); cv.style.width=r.width+'px'; cv.style.height=r.height+'px'; }
    size(); addEventListener('resize', size);
    const parts=[];
    function spawn(cx,cy){ for(let i=0;i<2;i++) parts.push({ x:cx+(Math.random()-.5)*22*dpr, y:cy, r:(16+Math.random()*22)*dpr,
      vx:(Math.random()-.5)*.35*dpr, vy:-(.28+Math.random()*.55)*dpr, life:1, decay:.004+Math.random()*.004 });
      if(parts.length>170) parts.splice(0, parts.length-170); }
    footer.addEventListener('mousemove', e=>{ const r=footer.getBoundingClientRect(); spawn((e.clientX-r.left)*dpr,(e.clientY-r.top)*dpr); });
    footer.addEventListener('touchmove', e=>{ const t=e.touches[0]; if(!t) return; const r=footer.getBoundingClientRect(); spawn((t.clientX-r.left)*dpr,(t.clientY-r.top)*dpr); }, {passive:true});
    (function loop(){ ctx.clearRect(0,0,W,H);
      for(let i=parts.length-1;i>=0;i--){ const p=parts[i]; p.x+=p.vx; p.y+=p.vy; p.r+=0.35*dpr; p.life-=p.decay;
        if(p.life<=0){ parts.splice(i,1); continue; }
        const a=p.life*0.26; const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);
        g.addColorStop(0,'rgba(240,238,233,'+a+')'); g.addColorStop(.55,'rgba(196,163,106,'+(a*.45)+')'); g.addColorStop(1,'rgba(196,163,106,0)');
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,6.2832); ctx.fill(); }
      requestAnimationFrame(loop); })();
  })();

  document.querySelectorAll('[data-copy]').forEach(b=> b.addEventListener('click', async()=>{
    const t=document.getElementById(b.dataset.copy).textContent;
    try{ await navigator.clipboard.writeText(t); b.textContent='Copied'; }
    catch{ const r=document.createRange(); r.selectNode(document.getElementById(b.dataset.copy)); getSelection().removeAllRanges(); getSelection().addRange(r); b.textContent='Select'; }
    setTimeout(()=>b.textContent='Copy',1500); }));

  // ===== CART =====
  const catalog={}; document.querySelectorAll('.citem[data-name]').forEach(c=>{ const im=c.querySelector('.cim img'); catalog[c.dataset.name]={price:+c.dataset.price, img:im?im.src:''}; });
  document.querySelectorAll('.pcard[data-name]').forEach(c=>{ catalog[c.dataset.name]={price:+c.dataset.price, img:c.querySelector('.pim img').src}; });
  const cart=[]; const $=id=>document.getElementById(id);
  const drawer=$('drawer'), scrim=$('scrim'), cartCount=$('cartCount'), cartBtn=$('cartBtn'), toast=$('toast');
  const inr=n=>'₹'+n.toLocaleString('en-IN');
  function render(){ const n=cart.reduce((s,i)=>s+i.q,0); cartCount.textContent=n; cartCount.classList.toggle('on',n>0);
    const box=$('dItems');
    if(!cart.length){ box.innerHTML='<div class="empty">Your basket is empty.<br><a class="btn fill" href="/#shop" data-closecart>Shop now <span class="ar">→</span></a></div>'; }
    else box.innerHTML=cart.map((i,k)=>`<div class="ditem">${i.img?`<img src="${i.img}" alt="">`:'<img alt="">'}<div><b>${i.name}</b><small>from ${inr(i.price)}</small><br><span class="qty"><button data-q="${k}" data-d="-1" aria-label="Less">−</button><span>${i.q}</span><button data-q="${k}" data-d="1" aria-label="More">+</button></span></div><button class="rm" data-rm="${k}">Remove</button></div>`).join('');
    $('dTotal').textContent=inr(cart.reduce((s,i)=>s+i.q*i.price,0)); }
  function add(name){ const p=catalog[name]; if(!p) return; const ex=cart.find(i=>i.name===name); if(ex) ex.q++; else cart.push({name,price:p.price,img:p.img,q:1});
    render(); cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump');
    $('toastTxt').textContent=name+' added to basket'; toast.classList.add('on'); clearTimeout(add.t); add.t=setTimeout(()=>toast.classList.remove('on'),2600); }
  function openCart(){ drawer.classList.add('on'); scrim.classList.add('on'); drawer.setAttribute('aria-hidden','false'); toast.classList.remove('on'); if(lenis) lenis.stop(); }
  function closeCart(){ drawer.classList.remove('on'); scrim.classList.remove('on'); drawer.setAttribute('aria-hidden','true'); if(lenis) lenis.start(); }
  document.addEventListener('click', e=>{ const t=e.target.closest('button,a'); if(!t) return;
    if(t.dataset.add){ e.preventDefault(); add(t.dataset.add); }
    else if(t.dataset.buy){ e.preventDefault(); add(t.dataset.buy); toast.classList.remove('on'); openCart(); }
    else if(t.hasAttribute('data-opencart')){ openCart(); }
    else if(t.hasAttribute('data-closecart')){ closeCart(); }
    else if(t.dataset.q!==undefined){ const i=cart[+t.dataset.q]; i.q+=(+t.dataset.d); if(i.q<=0) cart.splice(+t.dataset.q,1); render(); }
    else if(t.dataset.rm!==undefined){ cart.splice(+t.dataset.rm,1); render(); } });
  cartBtn.addEventListener('click', openCart); scrim.addEventListener('click', closeCart); $('dClose').addEventListener('click', closeCart);
  addEventListener('keydown', e=>{ if(e.key==='Escape') closeCart(); });
  $('checkout').addEventListener('click', ()=>{ if(!cart.length) return;
    const lines=cart.map((i,k)=>(k+1)+'. '+i.name+' × '+i.q+' (from '+inr(i.price)+')');
    const msg='Hello Subhadra Organic, I would like to order:\n\n'+lines.join('\n')+'\n\nEstimated total: '+inr(cart.reduce((s,i)=>s+i.q*i.price,0))+'\nPlease confirm pack sizes, final price and delivery.';
    window.open('https://wa.me/919928540432?text='+encodeURIComponent(msg),'_blank','noopener'); });
  render();
  // filters
  document.querySelectorAll('#filters button').forEach(f=> f.addEventListener('click', ()=>{
    document.querySelectorAll('#filters button').forEach(x=>x.classList.toggle('on',x===f));
    document.querySelectorAll('.pcard[data-cat]').forEach(c=> c.classList.toggle('hide', f.dataset.f!=='all' && c.dataset.cat!==f.dataset.f)); }));
  // full catalog: tabs, search, show more
  (function(){ const grid=document.getElementById('cgrid'); if(!grid) return;
    const items=[...grid.querySelectorAll('.citem')], more=document.getElementById('cmore'), q=document.getElementById('cq'), empty=document.getElementById('cempty');
    let cat='all', limit=16;
    function apply(){ const t=(q.value||'').trim().toLowerCase(); let shown=0, match=0;
      items.forEach(it=>{ const ok=(cat==='all'||it.dataset.c===cat)&&(!t||it.dataset.name.toLowerCase().includes(t));
        if(ok) match++; const vis=ok && (t||cat!=='all'||shown<limit); if(vis) shown++; it.classList.toggle('hide',!vis); });
      more.parentElement.style.display=(cat==='all'&&!t&&match>shown)?'':'none'; empty.style.display=match?'none':'block'; }
    document.querySelectorAll('#ctabs button').forEach(bt=> bt.addEventListener('click',()=>{ cat=bt.dataset.c;
      document.querySelectorAll('#ctabs button').forEach(x=>x.classList.toggle('on',x===bt)); apply(); }));
    q.addEventListener('input',apply); more.addEventListener('click',()=>{ limit=999; apply(); });
    window.openCatalog=k=>{ const bt=document.querySelector('#ctabs button[data-c="'+k+'"]'); if(bt) bt.click();
      const s=document.getElementById('catalog'); if(lenis) lenis.scrollTo(s,{offset:-80}); else s.scrollIntoView({behavior:'smooth'}); };
    apply(); })();
  const catMap={'Ghee & Oils':'oils','Millets & Flours':'millets','Pulses & Daal':'pulses','Spices':'spices','Sweeteners':'sweet','Pickles':'pickles','Dry Fruits':'dry','Rice & Bhaat':'rice','Grains':'grains','Murabba & More':'murabba'};
  document.querySelectorAll('.cat').forEach(c=> c.addEventListener('click', ()=> openCatalog(catMap[c.querySelector('b').textContent.trim()]||'all')));
  // horizontal pin recalculates after images load
  addEventListener('load', ()=>{ updateHpin(); updateDock(); });

  document.querySelectorAll('a[href^="#"]').forEach(a=> a.addEventListener('click', ev=>{
    const id=a.getAttribute('href'); if(id.length<=1) return; const t=document.querySelector(id); if(!t) return;
    ev.preventDefault(); if(a.hasAttribute('data-closecart')) closeCart(); if(lenis) lenis.scrollTo(t,{offset:-80}); else t.scrollIntoView({behavior:'smooth'}); }));

  // mobile menu
  (function(){ const m=document.getElementById('mnav'), btn=document.getElementById('menuBtn'); if(!m||!btn) return;
    const open=()=>{ m.classList.add('on'); m.setAttribute('aria-hidden','false'); btn.setAttribute('aria-expanded','true'); if(lenis) lenis.stop(); document.body.style.overflow='hidden'; };
    const close=()=>{ m.classList.remove('on'); m.setAttribute('aria-hidden','true'); btn.setAttribute('aria-expanded','false'); if(lenis) lenis.start(); document.body.style.overflow=''; };
    btn.addEventListener('click',open); document.getElementById('mClose').addEventListener('click',close);
    m.querySelectorAll('a').forEach(a=>a.addEventListener('click',close)); addEventListener('keydown',e=>{ if(e.key==='Escape') close(); }); })();
  // back to top
  (function(){ const t=document.getElementById('toTop'); if(!t) return;
    addEventListener('scroll',()=>t.classList.toggle('on',scrollY>innerHeight*1.2),{passive:true});
    t.addEventListener('click',()=>{ if(lenis) lenis.scrollTo(0); else scrollTo({top:0,behavior:'smooth'}); }); })();
  // footer category links -> catalog tab
  document.querySelectorAll('footer a[data-cat]').forEach(a=>a.addEventListener('click',e=>{ e.preventDefault(); e.stopImmediatePropagation(); if(window.openCatalog) openCatalog(a.dataset.cat); }, true));

  (function(){ var els=[].slice.call(document.querySelectorAll('.stagger')); if(!els.length) return;
    els.forEach(function(el){ var step=+(el.dataset.step||30), n=0;
      if(!el.hasAttribute('aria-label')) el.setAttribute('aria-label',el.textContent.replace(/\s+/g,' ').trim());
      (function walk(node){ [].slice.call(node.childNodes).forEach(function(c){
        if(c.nodeType===3){ var f=document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(function(part){
            if(!part) return; if(/^\s+$/.test(part)){ f.appendChild(document.createTextNode(' ')); return; }
            var wd=document.createElement('span'); wd.className='wd'; wd.setAttribute('aria-hidden','true');
            for(var i=0;i<part.length;i++){ var ch=document.createElement('span'); ch.className='ch'; ch.textContent=part[i]; ch.style.setProperty('--d',(n++*step)+'ms'); wd.appendChild(ch); }
            f.appendChild(wd); }); node.replaceChild(f,c); }
        else if(c.nodeType===1 && c.tagName!=='BR') walk(c); }); })(el); el._dur=n*step; });
    function whenReady(cb){ var pre=document.getElementById('pre'); if(!pre){ setTimeout(cb,250); return; }
      var iv=setInterval(function(){ if(!document.body.contains(pre)||pre.classList.contains('done')){ clearInterval(iv); setTimeout(cb, pre.classList.contains('done')?650:150); } },60); }
    function play(){ els.forEach(function(el){ el.classList.remove('go'); void el.offsetWidth; var a=el.dataset.after?document.querySelector(el.dataset.after):null;
      setTimeout(function(){ el.classList.add('go'); }, (a&&a._dur?a._dur*0.6:0)); }); }
    whenReady(function(){ play();
      if('IntersectionObserver' in window){ var hero=els[0].closest('section'), seen=true;
        new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting && !seen){ seen=true; play(); } else if(!e.isIntersecting){ seen=false; } }); },{threshold:.35}).observe(hero); } }); })();

/* ---- gallery lightbox ---- */
(function(){
  var figs = Array.prototype.slice.call(document.querySelectorAll('.galmasonry figure'));
  if (!figs.length) return;
  var box = document.getElementById('lbox');
  if (!box) return;
  var img = box.querySelector('img'),
      cap = box.querySelector('.lcap'),
      cnt = box.querySelector('.lcount'),
      i = 0, lastFocus = null;

  function show(n){
    i = (n + figs.length) % figs.length;
    var f = figs[i], t = f.querySelector('img');
    img.src = f.getAttribute('data-full');
    img.alt = t ? t.alt : '';
    cap.textContent = f.querySelector('figcaption').textContent;
    cnt.textContent = (i + 1) + ' of ' + figs.length;
  }
  function open(n){
    lastFocus = document.activeElement;
    show(n);
    box.classList.add('on');
    document.body.style.overflow = 'hidden';
    box.querySelector('.lclose').focus();
  }
  function close(){
    box.classList.remove('on');
    img.removeAttribute('src');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  figs.forEach(function(f, n){
    f.setAttribute('tabindex', '0');
    f.setAttribute('role', 'button');
    f.addEventListener('click', function(){ open(n); });
    f.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(n); }
    });
  });
  box.querySelector('.lclose').addEventListener('click', close);
  box.querySelector('.lprev').addEventListener('click', function(){ show(i - 1); });
  box.querySelector('.lnext').addEventListener('click', function(){ show(i + 1); });
  box.addEventListener('click', function(e){ if (e.target === box) close(); });
  document.addEventListener('keydown', function(e){
    if (!box.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(i - 1);
    else if (e.key === 'ArrowRight') show(i + 1);
  });
})();
