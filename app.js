const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(returnFocus = false) {
  navigation.classList.remove('is-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.textContent = 'Menu';
  if (returnFocus) toggle.focus();
}
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') !== 'true';
  navigation.classList.toggle('is-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.textContent = open ? 'Close' : 'Menu';
});
navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu(true); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
window.matchMedia('(min-width: 901px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

// Product images are local, unaltered brand photography.
const productViews = [
  {src:'assets/product.jpg',title:'Product overview',alt:'Brainlume headset, handheld controller and connecting cable'},
  {src:'assets/headset.jpg',title:'Headset detail',alt:'Side profile of the Brainlume headset and adjustable frame'},
  {src:'assets/modules.jpg',title:'Light modules',alt:'Close-up of the inner light modules and headset structure'},
  {src:'assets/controller.jpg',title:'Handheld controller',alt:'Brainlume controller with power button, mode button and 40Hz / 10Hz labels'}
];
let currentView = 0;
const productImage = document.querySelector('#product-image');
const imageDialog = document.querySelector('#image-dialog');
const dialogImage = document.querySelector('#dialog-image');
function selectView(index) {
  currentView = (index + productViews.length) % productViews.length;
  const view = productViews[currentView];
  productImage.src = dialogImage.src = view.src;
  productImage.alt = dialogImage.alt = view.alt;
  animateMedia(productImage);
  document.querySelector('#image-dialog-title').textContent = view.title;
  document.querySelector('#dialog-count').textContent = `${currentView + 1} / ${productViews.length}`;
  document.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.view) === currentView)));
}
document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => selectView(Number(button.dataset.view))));
document.querySelectorAll('[data-detail]').forEach(detail => detail.addEventListener('toggle', () => {
  if (!detail.open) return;
  selectView(Number(detail.dataset.detail));
  document.querySelectorAll('[data-detail]').forEach(other => { if (other !== detail) other.open = false; });
}));
document.querySelector('.gallery-main').addEventListener('click', () => imageDialog.showModal());
document.querySelector('.dialog-close').addEventListener('click', () => imageDialog.close());
document.querySelector('.dialog-prev').addEventListener('click', () => selectView(currentView - 1));
document.querySelector('.dialog-next').addEventListener('click', () => selectView(currentView + 1));
imageDialog.addEventListener('click', event => {
  if(event.target !== imageDialog) return;
  const bounds = imageDialog.getBoundingClientRect();
  if(event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) imageDialog.close();
});
imageDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault(); selectView(currentView + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
imageDialog.addEventListener('close', () => document.querySelector('.gallery-main').focus({preventScroll:true}));

let currentMode = 'day';
let currentStep = 0;
const modes = {
  day:{title:'A pause <br>in your day.',description:'Step away from the next task. Choose the Day preset on your controller.',frequency:'40Hz',label:'Day preset',image:'assets/day.jpg',alt:'Daytime scene with Brainlume headset and controller'},
  night:{title:'Space to <br>wind down.',description:'Settle into your evening. Choose the Night preset on your controller.',frequency:'10Hz',label:'Night preset',image:'assets/night.jpg',alt:'Evening scene with the Brainlume headset'}
};
const stepNames = ['Find your fit','Choose a mode','Take 20 minutes'];
function renderRoutine() {
  const mode = modes[currentMode];
  document.querySelector('#mode-title').innerHTML = mode.title;
  document.querySelector('#mode-description').textContent = mode.description;
  document.querySelector('#mode-frequency').textContent = mode.frequency;
  document.querySelector('#mode-label').textContent = mode.label;
  const img = document.querySelector('#routine-image');
  img.src = currentStep === 1 ? 'assets/controller.jpg' : mode.image;
  img.alt = currentStep === 1 ? productViews[3].alt : mode.alt;
  document.querySelector('.mode-switch').classList.toggle('is-night',currentMode === 'night');
  animateMedia(img, currentMode === 'night' ? 1 : -1);
  img.parentElement.classList.toggle('is-controller',currentStep === 1);
  img.parentElement.classList.toggle('night-scene',currentMode === 'night');
  const descriptions = ['Settle somewhere quiet. Adjust the headset for a stable fit.',`Use the mode button to select ${mode.frequency}. The indicator shows your selected preset. No app needed.`,'Start your session on the controller. Stay awake and remove the headset when the 20-minute preset ends.'];
  document.querySelector('#step-description').textContent = descriptions[currentStep];
  document.querySelector('#media-caption').textContent = `0${currentStep + 1} / ${stepNames[currentStep]}`;
  document.querySelectorAll('[data-mode]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.mode === currentMode)));
  document.querySelectorAll('[data-step]').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.step) === currentStep)));
}
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {currentMode = button.dataset.mode; renderRoutine();}));
document.querySelectorAll('[data-step]').forEach(button => button.addEventListener('click', () => {currentStep = Number(button.dataset.step); renderRoutine();}));
document.querySelector('.controller-link').addEventListener('click', () => {
  selectView(3);
  document.querySelector('[data-detail="3"]').open = true;
});
// Show the purchase shortcut only after the hero has left the viewport.
const dock = document.querySelector('.purchase-dock');
let dockTimer;
new IntersectionObserver(entries => {
  clearTimeout(dockTimer);
  if (!entries[0].isIntersecting) {
    dock.hidden = false;
    requestAnimationFrame(() => dock.classList.add('is-visible'));
  } else {
    dock.classList.remove('is-visible');
    dockTimer = setTimeout(() => {dock.hidden = true;}, 600);
  }
}, {threshold:0}).observe(document.querySelector('.hero'));


// Native scrolling is retained; motion only decorates visible content.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function animateMedia(image, direction = 1) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !image.animate) return;
  const requested = image.src;
  image.decode().catch(() => {}).then(() => {
    if (image.src !== requested || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    image.getAnimations().forEach(animation => animation.cancel());
    image.animate([
      {opacity:0.25,transform:`translateX(${direction * 14}px) scale(1.025)`},
      {opacity:1,transform:'translateX(0) scale(1)'}
    ], {duration:550,easing:'cubic-bezier(.22,1,.36,1)'});
  });
}
const revealTargets = [...document.querySelectorAll('.product-heading,.explorer-grid,.facts>div,.routine-heading,.routine-grid,.step-choices,.science-top,.research article,.life .section-heading,.story .section-heading,.wearing-heading,.wearing-grid,.faq>div,.purchase-grid,.footer-main')];
let revealObserver;
function prepareReveals() {
  if (revealObserver) revealObserver.disconnect();
  if (reducedMotion.matches) {
    document.documentElement.classList.remove('motion-ready');
    revealTargets.forEach(element => element.classList.remove('reveal-pending'));
    document.querySelectorAll('img').forEach(image => image.getAnimations().forEach(animation => animation.cancel()));
    return;
  }
  document.documentElement.classList.add('motion-ready');
  revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-revealed');
    entry.target.classList.remove('reveal-pending');
    revealObserver.unobserve(entry.target);
  }), {threshold:0.04,rootMargin:'0px 0px -32px 0px'});
  revealTargets.forEach((element,index) => {
    element.classList.add('reveal-target');
    if (element.classList.contains('is-revealed') || element.getBoundingClientRect().top < innerHeight - 24) return;
    element.style.setProperty('--reveal-delay',`${element.matches('.facts>div,.research article') ? (index % 3) * 65 : 0}ms`);
    element.classList.add('reveal-pending');
    revealObserver.observe(element);
  });
}
prepareReveals();
const heroImage = document.querySelector('.hero-image');
const heroElement = document.querySelector('.hero');
let framePending = false;
function updateHeroMotion() {
  framePending = false;
  if (reducedMotion.matches || innerWidth <= 900) {heroImage.style.transform = '';return;}
  const progress = Math.min(1,Math.max(0,scrollY / heroElement.offsetHeight));
  heroImage.style.transform = `translateY(${progress * 24}px) scale(${1.035 + progress * .035})`;
}
function requestHeroFrame() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(updateHeroMotion);
}
window.addEventListener('scroll',requestHeroFrame,{passive:true});
window.addEventListener('resize',requestHeroFrame,{passive:true});
reducedMotion.addEventListener('change',() => {prepareReveals();requestHeroFrame();});
requestHeroFrame();
// Tab navigation always exposes the focused control, including during reveals.
document.addEventListener('focusin',event => {
  const parent = event.target.closest('.reveal-pending');
  if(parent) {parent.classList.remove('reveal-pending');parent.classList.add('is-revealed');}
});
