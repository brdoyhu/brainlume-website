// Separate viewer preserves the product gallery's selection and focus behavior.
const wearingCards = [...document.querySelectorAll('[data-wearing]')];
const wearingDialog = document.querySelector('#wearing-dialog');
const wearingImage = document.querySelector('#wearing-full-image');
let wearingIndex = 0;
let wearingTrigger;
function showWearing(index) {
  wearingIndex = (index + wearingCards.length) % wearingCards.length;
  const card = wearingCards[wearingIndex];
  const source = card.querySelector('img');
  wearingImage.src = source.src;
  wearingImage.alt = source.alt;
  document.querySelector('#wearing-dialog-title').textContent = card.querySelector('strong').textContent;
  document.querySelector('#wearing-count').textContent = `${wearingIndex + 1} / ${wearingCards.length}`;
}
wearingCards.forEach((card,index) => card.addEventListener('click', () => {
  wearingTrigger = card;
  showWearing(index);
  wearingDialog.showModal();
}));
document.querySelector('.wearing-close').addEventListener('click', () => wearingDialog.close());
document.querySelector('.wearing-prev').addEventListener('click', () => showWearing(wearingIndex - 1));
document.querySelector('.wearing-next').addEventListener('click', () => showWearing(wearingIndex + 1));
wearingDialog.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    showWearing(wearingIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
wearingDialog.addEventListener('click', event => {
  if (event.target !== wearingDialog) return;
  const box = wearingDialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) wearingDialog.close();
});
wearingDialog.addEventListener('close', () => wearingTrigger?.focus({preventScroll:true}));
