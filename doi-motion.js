(() => {
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('[data-doi-motion]').forEach(scene => {
  const control=scene.querySelector('.doi-motion-control'), progress=scene.querySelector('.doi-motion-progress i'), replay=scene.querySelector('.doi-motion-replay'), typed=scene.querySelector('.typed-doi'), panel=scene.querySelector('.crossmark-demo-panel'), trigger=scene.querySelector('.crossmark-trigger'), status=scene.querySelector('.machine-status'), step=scene.querySelector('.machine-step');
  const bn=document.documentElement.lang==='bn', doi='10.0000/blcr.2026.001', duration=21000;
  let elapsed=0,last=0,frame=0,visible=false,paused=false,manual=false,closed=false;
  const labels=bn?['প্রকাশিত প্রবন্ধ','DOI নম্বর সংযুক্ত হচ্ছে','DOI যাচাই সম্পন্ন','Crossmark যুক্ত হচ্ছে','নথির স্ট্যাটাস যাচাই']:['Published article','Assigning the DOI','DOI confirmed','Adding Crossmark','Checking document status'];
  function render(){
   const t=reduced.matches?18000:elapsed;
   const phase=t<1700?'article':t<2400?'focus-doi':t<5500?'typing':t<6400?'verify-doi':t<8000?'verified':t<9200?'crossmark':t<10900?'focus-crossmark':t<12900?'dialog-check':'dialog-current';
   scene.dataset.phase=phase;
   scene.dataset.zoom=t>=1700&&t<8000?'doi':t>=9200&&t<10900?'crossmark':'page';
   scene.dataset.verified=String(t>=6400);scene.dataset.crossmark=String(t>=8000);
   typed.textContent=doi.slice(0,Math.max(0,Math.min(doi.length,Math.floor((t-2400)/120))));
   trigger.disabled=t<8000; trigger.tabIndex=t<8000?-1:0;
   const open=manual||(!closed&&t>=10900);panel.hidden=!open;scene.classList.toggle('status-open',open);scene.dataset.current=String(manual||t>=12900);
   const index=t<1700?0:t<6400?1:t<8000?2:t<10900?3:4;
   status.textContent=t>=12900?(bn?'নথির স্ট্যাটাস নিশ্চিত':'Document status confirmed'):labels[index];step.textContent=`0${index+1} / 05`;progress.style.transform=`scaleX(${reduced.matches?1:t/duration})`;
  }
  function tick(now){frame=0;if(!visible||paused||manual||document.hidden||reduced.matches){last=0;return}if(last){elapsed+=Math.min(now-last,150);if(elapsed>=duration){elapsed=0;closed=false}}last=now;render();frame=requestAnimationFrame(tick)}
  function start(){if(!frame&&visible&&!paused&&!manual&&!document.hidden&&!reduced.matches)frame=requestAnimationFrame(tick)}
  function setPaused(value){paused=value;control.setAttribute('aria-pressed',String(paused));control.textContent=paused?'▶':'Ⅱ';control.setAttribute('aria-label',bn?(paused?'অ্যানিমেশন চালান':'অ্যানিমেশন থামান'):(paused?'Play animation':'Pause animation'));last=0;start()}
  control.addEventListener('click',()=>setPaused(!paused));
  replay.addEventListener('click',()=>{manual=false;closed=false;elapsed=0;last=0;render();setPaused(false)});
  trigger.addEventListener('click',()=>{manual=true;closed=false;render();scene.querySelector('.crossmark-close').focus()});
  function close(){manual=false;closed=true;render();if(document.activeElement===scene.querySelector('.crossmark-close'))trigger.focus();last=0;start()}
  scene.querySelector('.crossmark-close').addEventListener('click',close);
  scene.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden)close()});
  new IntersectionObserver(a=>{visible=a[0].isIntersecting;last=0;start()},{threshold:.15}).observe(scene);
  document.addEventListener('visibilitychange',()=>{last=0;start()});reduced.addEventListener('change',()=>{render();start()});render();
 });
})();
