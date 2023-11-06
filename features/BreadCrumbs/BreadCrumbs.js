import { router } from '../../main.js';
import { addContainer } from '../../modules/utils/addContainer.js';

export class BreadCrumbs {
  static instance = null;

  constructor() {
    if (!BreadCrumbs.instance) {
      BreadCrumbs.instance = this;
      this.element = document.createElement('div');
      this.element.classList.add('bread-crumbs');
      this.containerElement = addContainer(this.element);
    }

    return BreadCrumbs.instance;
  }

  mount(parent, data) {
    this.render(data);
    parent.append(this.element);
    router.updatePageLinks();
  }

  unmount() {
    this.element.remove();
  }

  render(list) {
    this.containerElement.textContent = '';

    const listElem = document.createElement('ul');
    listElem.classList.add('bread-crumbs__list');

    const breadCrumbsList = [{ text: 'Главная', href: '/' }, ...list];

    const listItems = breadCrumbsList.map((item) => {
      const listItemElem = document.createElement('li');
      listItemElem.classList.add('bread-crumbs__item');

      const link = document.createElement('a');
      link.classList.add('bread-crumbs__link');
      link.textContent = item.text;

      if (item.href) {
        link.href = item.href;
      }

      const separator = document.createElement('span');
      separator.classList.add('bread-crumbs__separator');
      separator.innerHTML = '&gt;';

      listItemElem.append(link, separator);

      return listItemElem;
    });

    listElem.append(...listItems);
    this.containerElement.append(listElem);
  }
}
