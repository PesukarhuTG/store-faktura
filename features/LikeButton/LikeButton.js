import { FavoriteService } from '../../services/StorageService.js';

export class LikeButton {
  constructor(className) {
    this.className = className;
    this.favoriteService = new FavoriteService();
  }

  create(id) {
    const button = document.createElement('button');
    button.classList.add(this.className);
    button.dataset.id = id;
    button.type = 'button';
    button.innerHTML = `
      <svg class="icon" width="16" height="16">
        <use xlink:href="/img/sprite.svg#icon-heart"></use>
      </svg>
    `;

    if (this.favoriteService.check(id)) {
      button.classList.add(`${this.className}_active`);
    }

    button.addEventListener('click', () => {
      if (this.favoriteService.check(id)) {
        this.favoriteService.remove(id);
        button.classList.remove(`${this.className}_active`);
      } else {
        this.favoriteService.add(id);
        button.classList.add(`${this.className}_active`);
      }
    });

    return button;
  }
}
