import { Card } from '../../features/Card/Card.js';
import { addContainer } from '../utils/addContainer.js';

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

  mount(parent, data, title, emptyText) {
    this.containerElement.textContent = '';
    const titleElem = document.createElement('h2');
    titleElem.textContent = title ? title : 'Список товаров';
    titleElem.className = title
      ? 'goods__title'
      : 'goods__title visually-hidden';

    this.containerElement.append(titleElem);

    if (data && data.length) {
      this.updateListElem(data);
    } else {
      this.containerElement.insertAdjacentHTML(
        'beforeend',
        `
      <h2 class="error__title">${
        emptyText || 'Произошла ошибка, попробуйте снова'
      }</h2>
          <div class="error__img">
            <svg class="icon">
                <use xlink:href="/img/sprite.svg#furniture"></use>
            </svg>
          </div>
      `
      );
    }

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

  updateListElem(data) {
    const listElem = document.createElement('ul');
    listElem.classList.add('goods__list');

    const listItems = data?.map(
      ({ id, images: [image], name: title, price }) => {
        const listItemElem = document.createElement('li');
        listItemElem.classList.add('goods__item');
        listItemElem.append(new Card({ id, image, title, price }).create());
        return listItemElem;
      }
    );

    listElem.append(...listItems);
    this.containerElement.append(listElem);
  }
}
