import { likeSvg } from '../likeSVG/likeSVG.js';

export class LikeButton {
  constructor(className) {
    this.className = className;
  }

  create(id) {
    const button = document.createElement('button');
    button.classList.add(this.className);
    button.dataset.id = id;
    button.type = 'button';
    button.innerHTML = likeSvg();

    button.addEventListener('click', () => {
      console.log('add to favourite');
    });

    return button;
  }
}
