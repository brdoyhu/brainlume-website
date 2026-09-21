(() => {
  const illustration = document.querySelector('.optical');
  const toggle = document.querySelector('.photon-toggle');
  if (!illustration || !toggle) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const particles = [];
  const field = document.createElement('div');
  field.className = 'photon-field';
  field.setAttribute('aria-hidden', 'true');
  illustration.querySelector('.orbits').append(field);
  const colors = ['#abaaff', '#bb91ef', '#e48ac6', '#8ea8ff', '#f0b5e1'];
  // Smooth, looping random walks are decorative, not physical trajectories.
  for (let index = 0; index < 32; index++) {
    const speck = document.createElement('span');
    speck.className = 'photon-speck';
    speck.style.setProperty('--speck-size', `${1.6 + Math.random() * 1.8}px`);
    speck.style.setProperty('--speck-color', colors[index % colors.length]);
    field.append(speck);
    const points = [];
    let x = (Math.random() - .5) * 72;
    let y = (Math.random() - .5) * 72;
    for (let step = 0; step < 8; step++) {
      x = Math.max(-42, Math.min(42, x + (Math.random() - .5) * 30));
      y = Math.max(-42, Math.min(42, y + (Math.random() - .5) * 30));
      points.push({ transform: `translate(${x}%, ${y}%)`, opacity: .2 + Math.random() * .6 });
    }
    points.push({ ...points[0] });
    const animation = speck.animate(points, {
      duration: 12000 + Math.random() * 15000,
      delay: -Math.random() * 24000,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
    animation.pause();
    particles.push(animation);
  }
  let paused = false;
  let visible = false;
  function update() {
    const reduced = preference.matches;
    const playing = visible && !paused && !reduced && !document.hidden;
    illustration.classList.toggle('is-playing', playing);
    particles.forEach(animation => playing ? animation.play() : animation.pause());
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
