/* Ankit Billa — shared site behaviour (theme, nav, reveal, menu, filters, galleries) */
(function(){
  var root=document.documentElement;
  // JS is running — cancel the inline fallback that would force-reveal everything.
  if(window.__revealFB)clearTimeout(window.__revealFB);

  // Theme
  var saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
  if(saved){root.setAttribute('data-theme',saved)}
  else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme:light)').matches){root.setAttribute('data-theme','light')}
  function setMeta(){var m=document.querySelector('meta[name=theme-color]');
    if(m)m.setAttribute('content',root.getAttribute('data-theme')==='dark'?'#1a1f2b':'#ffffff')}
  setMeta();
  var tt=document.getElementById('theme-toggle');
  if(tt)tt.addEventListener('click',function(){
    root.setAttribute('data-theme',root.getAttribute('data-theme')==='dark'?'light':'dark');
    try{localStorage.setItem('theme',root.getAttribute('data-theme'))}catch(e){}
    setMeta();
  });

  // Sticky nav
  var hdr=document.getElementById('hdr');
  if(hdr){var onScroll=function(){hdr.classList.toggle('scrolled',window.scrollY>10)};onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});}

  // Mobile menu
  var mt=document.getElementById('menu-toggle'),nl=document.getElementById('navlinks');
  if(mt&&nl){mt.addEventListener('click',function(){nl.classList.toggle('open')});
    nl.addEventListener('click',function(e){if(e.target.tagName==='A')nl.classList.remove('open')});}

  // Reveal
  var revealables=document.querySelectorAll('.reveal,.stagger');
  var showAll=function(){revealables.forEach(function(el){el.classList.add('in')})};
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})
    },{threshold:.1,rootMargin:'0px 0px -6% 0px'});
    revealables.forEach(function(el){io.observe(el)});
    document.querySelectorAll('.stagger').forEach(function(g){
      Array.prototype.forEach.call(g.children,function(c,i){c.style.transitionDelay=(i*60)+'ms'})});
    setTimeout(showAll,2500);
  }else{showAll()}

  // Filters (toggles display of [data-cat] items; substring match)
  var filters=document.querySelectorAll('.filter');
  if(filters.length){
    var items=document.querySelectorAll('[data-cat]');
    filters.forEach(function(f){f.addEventListener('click',function(){
      filters.forEach(function(x){x.classList.remove('active')});f.classList.add('active');
      var k=f.getAttribute('data-f');
      items.forEach(function(p){
        var cat=p.getAttribute('data-cat')||'';
        p.style.display=(k==='all'||cat.split(' ').indexOf(k)>-1)?'':'none';
      });
    })});
  }

  // Horizontal galleries — arrow controls + edge state
  document.querySelectorAll('.gallery').forEach(function(g){
    var sec=g.closest('section')||g.parentElement;
    var prev=sec&&sec.querySelector('[data-dir=prev]'),next=sec&&sec.querySelector('[data-dir=next]');
    function step(){var t=g.querySelector('.gtile');var w=t?t.getBoundingClientRect().width+20:320;
      return Math.max(1,Math.floor(g.clientWidth/w))*w}
    function update(){if(!prev||!next)return;
      prev.disabled=g.scrollLeft<8;
      next.disabled=g.scrollLeft+g.clientWidth>=g.scrollWidth-8;}
    if(prev)prev.addEventListener('click',function(){g.scrollBy({left:-step(),behavior:'smooth'})});
    if(next)next.addEventListener('click',function(){g.scrollBy({left:step(),behavior:'smooth'})});
    g.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
  });

  // Scroll-spy for in-page (#anchor) nav links
  var hashLinks={};
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function(a){hashLinks[a.getAttribute('href').slice(1)]=a});
  var ids=Object.keys(hashLinks);
  if(ids.length&&'IntersectionObserver' in window){
    var spy=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){
        ids.forEach(function(k){hashLinks[k].classList.remove('active')});
        if(hashLinks[e.target.id])hashLinks[e.target.id].classList.add('active');
      }})
    },{threshold:.5});
    ids.forEach(function(id){var el=document.getElementById(id);if(el)spy.observe(el)});
  }

  // Fit detail/listing titles & subtitles to one line, scaling the font
  // down to the available width instead of wrapping (no-JS fallback: wrap).
  function fitText(){
    var vw=window.innerWidth;
    document.querySelectorAll('.page-hero h1,.page-hero .sub').forEach(function(el){
      el.style.whiteSpace='nowrap';
      el.style.fontSize='';
      // available width = viewport minus the element's left gutter on both sides
      // (window.innerWidth can't be inflated by the overflowing nowrap text).
      var avail=vw-2*el.getBoundingClientRect().left;
      if(avail<=40)return;
      var natural=el.scrollWidth;
      if(natural>avail){
        var cur=parseFloat(getComputedStyle(el).fontSize)||16;
        el.style.fontSize=Math.max(10,cur*avail/natural*0.98)+'px';
      }
    });
  }
  var rt;
  window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(fitText,150)},{passive:true});
  fitText();

  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();
