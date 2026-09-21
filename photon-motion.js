(() => {
  const illustration = document.querySelector('.optical');
  const toggle = document.querySelector('.photon-toggle');
  if (!illustration || !toggle) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false;
  let visible = false;
  function update() {
    const reduced = preference.matches;
    illustration.classList.toggle('is-playing', visible && !paused && !reduced && !document.hidden);
    toggle.disabled = reduced;
    toggle.setAttribute('aria-pressed', String(paused || reduced));
    toggle.setAttribute('aria-label', reduced ? 'Animation disabled by reduced motion preference' : paused ? 'Play photon animation' : 'Pause photon animation');
    toggle.querySelector('.photon-toggle-label').textContent = reduced ? 'Motion reduced' : paused ? 'Play motion' : 'Pause motion';
  }
  toggle.addEventListener('click', () => { paused = !paused; update(); });
  preference.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { threshold: 0.15 });
    observer.observe(illustration);
  } else { visible = true; }
  update();
})();
