import { addContainer } from '../utils/addContainer';
import { API_URL } from '../utils/const';

export class ProductList {
  static instance = null;

  constructor() {
    if (!ProductList.instance) {
      ProductList.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('goods');
      this.containerElement = addContainer(this.element, 'goods__container');
      this.isMounted = false;

      this.addEvents();
    }

    return ProductList.instance;
  }

  mount(parent, data, title) {
    this.containerElement.textContent = '';
    const titleElem = document.createElement('h2');
    titleElem.textContent = title ? title : 'Список товаров';
    titleElem.className = title
      ? 'goods__title'
      : 'goods__title visually-hidden';

    this.containerElement.append(titleElem);
    this.updateListElem(data);
    if (this.isMounted) {
      return;
    }

    parent.append(this.element);

    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  addEvents() {}

  updateListElem(data = ['001', '002', '003']) {
    const listElem = document.createElement('ul');
    listElem.classList.add('goods__list');

    const listItems = data?.map((item) => {
      const listItemElem = document.createElement('li');
      listItemElem.classList.add('goods__item');
      listItemElem.innerHTML = this.getHTMLTemplateListItem(item);
      return listItemElem;
    });

    listElem.append(...listItems);
    this.containerElement.append(listElem);
  }

  getHTMLTemplateListItem({ id, images: [image], name: title, price }) {
    return `
      <article class="goods__card card">
        <a class="card__link card__link_img" href="/product/${id}">
          <img class="card__image" src="${API_URL}${image}" alt="${title}">
        </a>

        <div class="card__info">
          <h3 class="card__title">
            <a class="card__link" tabindex="-1" href="/product/${id}">${title}</a>
          </h3>
          <span class="card__price">${price.toLocaleString()}&nbsp;₽</span>
        </div>

        <button class="card__btn" data-id="${id}" type="button">В корзину</button>

        <button class="card__favourite" data-id="${id}" type="button">
          <svg class="icon" width="16" height="16">
            <use xlink:href="/img/sprite.svg#icon-heart"></use>
          </svg>
        </button>
      </article>
  `;
  }
}
