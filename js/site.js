/* Ankit Billa — shared site behaviour (theme, nav, reveal, menu, filters) */
(function(){
  var root=document.documentElement;
  document.body.classList.remove('no-js');

  // Theme
  var saved=null;try{saved=localStorage.getItem('theme')}catch(e){}
  if(saved){root.setAttribute('data-theme',saved)}
  else if(window.matchMedia&&window.matchMedia('(prefers-color-scheme:light)').matches){root.setAttribute('data-theme','light')}
  var tt=document.getElementById('theme-toggle');
  if(tt)tt.addEventListener('click',function(){
    var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('theme',next)}catch(e){}
    var m=document.querySelector('meta[name=theme-color]');if(m)m.setAttribute('content',next==='dark'?'#0a0b0e':'#f6f7fb');
  });

  // Sticky nav
  var hdr=document.getElementById('hdr');
  if(hdr){var onScroll=function(){hdr.classList.toggle('scrolled',window.scrollY>24)};onScroll();
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

  // Filters (listing pages)
  var filters=document.querySelectorAll('.filter');
  if(filters.length){
    var items=document.querySelectorAll('[data-cat]');
    filters.forEach(function(f){f.addEventListener('click',function(){
      filters.forEach(function(x){x.classList.remove('active')});f.classList.add('active');
      var k=f.getAttribute('data-f');
      items.forEach(function(p){p.style.display=(k==='all'||p.getAttribute('data-cat').indexOf(k)>-1)?'':'none'});
    })});
  }

  var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
})();
