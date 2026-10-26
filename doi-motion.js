(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('[data-doi-motion]').forEach(scene => {
    const control = scene.querySelector('.doi-motion-control');
    const progress = scene.querySelector('.doi-motion-progress i');
    const replay = scene.querySelector('.doi-motion-replay');
    let elapsed = 0, last = 0, frame = 0, visible = false, paused = false;
    const duration = 12000;
    function render() {
      const stage = reduced.matches ? 3 : elapsed < 2600 ? 0 : elapsed < 4600 ? 1 : elapsed < 6500 ? 2 : 3;
      scene.dataset.stage = stage;
      progress.style.transform = `scaleX(${reduced.matches ? 1 : elapsed / duration})`;
    }
    function tick(now) {
      frame = 0;
      if (!visible || paused || document.hidden || reduced.matches) { last = 0; return; }
      if (last) elapsed = (elapsed + Math.min(now - last, 100)) % duration;
      last = now; render(); frame = requestAnimationFrame(tick);
    }
    function start() { if (!frame && visible && !paused && !document.hidden && !reduced.matches) frame = requestAnimationFrame(tick); }
    control.addEventListener('click', () => {
      paused = !paused; control.setAttribute('aria-pressed', String(paused));
      control.textContent = paused ? '▶' : 'Ⅱ';
      control.setAttribute('aria-label', document.documentElement.lang === 'bn' ? (paused ? 'অ্যানিমেশন চালান' : 'অ্যানিমেশন থামান') : (paused ? 'Play animation' : 'Pause animation'));
      last = 0; start();
    });
    replay.addEventListener('click', () => { elapsed = 0; last = 0; render(); start(); });
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; last = 0; start(); }, {threshold: 0.15}).observe(scene);
    document.addEventListener('visibilitychange', () => { last = 0; start(); });
    reduced.addEventListener('change', () => { render(); start(); });
    render();
  });
})();
