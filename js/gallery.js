import images from './gallery-items.js';

const pageGalleryEl = document.querySelector('ul.js-gallery');
const lightBoxEl = document.querySelector('.js-lightbox');
const lightBoxCloseEl = document.querySelector(
  'button[data-action="close-lightbox"]',
);
const fullScreenImageEl = document.querySelector('img.lightbox__image');
const fullScreenOverlayEl = document.querySelector('div.lightbox__overlay');

const fixScroll = enable => {
  if (enable) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'initial';
  }
};

const imageCardFabric = ({ preview, original, description }) => {
  const liTagObj = document.createElement('li');
  liTagObj.classList.add('gallery__item');

  const aTagObj = document.createElement('a');
  aTagObj.classList.add('gallery__link');
  aTagObj.href = original;

  const imgTagObj = document.createElement('img');
  imgTagObj.classList.add('gallery__image');
  [imgTagObj.src, imgTagObj.alt] = [preview, description];
  imgTagObj.setAttribute('data-source', original);

  aTagObj.appendChild(imgTagObj);
  liTagObj.appendChild(aTagObj);
  return liTagObj;
};

const imageObjCarousel = (current, forward = 1) => {
  const carousel = (current, length, sign) => {
    return current + sign >= 0
      ? (current + sign) % length
      : length + (current + sign);
  };
  const imagesOriginalList = images.map(({ original }) => {
    return original;
  });

  const currentIndex = imagesOriginalList.indexOf(current);
  const newIndex = carousel(currentIndex, imagesOriginalList.length, forward);
  return images[newIndex];
};


pageGalleryEl.append(...images.map(imageCardFabric));

const direction = {
  ArrowLeft: -1,
  ArrowRight: +1,
};

[lightBoxCloseEl, fullScreenOverlayEl].forEach(elm =>
  elm.addEventListener('click', closeLightBoxHandler),
);

pageGalleryEl.addEventListener('click', openLightBoxHandler);

function onKeyEventHandler(event) {
  switch (event.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      const { original, description } = imageObjCarousel(
        fullScreenImageEl.src,
        direction[event.key],
      );
      [fullScreenImageEl.src, fullScreenImageEl.alt] = [original, description];
      break;
    case 'Escape':
      closeLightBoxHandler(event);
      break;
  }
}

function closeLightBoxHandler(event) {
  event.preventDefault();
  lightBoxEl.classList.remove('is-open');
  fullScreenImageEl.src = fullScreenImageEl.alt = '';
  window.removeEventListener('keydown', onKeyEventHandler);
  fixScroll(false);
}

function openLightBoxHandler(event) {
  const targetEl = event.target;
  if (targetEl.nodeName === "IMG") {
    event.preventDefault();
    fixScroll(true);
    lightBoxEl.classList.add('is-open');
    [fullScreenImageEl.src, fullScreenImageEl.alt] = [
      targetEl.dataset.source,
      targetEl.alt,
    ];
    window.addEventListener('keydown', onKeyEventHandler);
  }
}