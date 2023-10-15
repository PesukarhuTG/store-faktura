export class LikeButton {
  constructor(className) {
    this.className = className;
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

    button.addEventListener('click', () => {
      console.log('add to favourite');
    });

    return button;
  }
}
