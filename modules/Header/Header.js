import { addContainer } from '../utils/addContainer';
import logoImage from '/img/faktura-logo.svg';

export class Header {
  static instance = null;

  constructor() {
    if (!Header.instance) {
      Header.instance = this;
      this.element = document.createElement('header');
      this.element.classList.add('header');
      this.containerElement = addContainer(this.element, 'header__container');
      this.isMounted = false;
    }

    return Header.instance;
  }

  mount() {
    if (this.isMounted) {
      return;
    }

    const logo = this.getLogo();
    const searchForm = this.getSearchForm();
    const navigation = this.getNavigation();

    this.containerElement.append(logo, searchForm, navigation);

    document.body.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  getLogo() {
    const logo = document.createElement('a');
    logo.classList.add('header__link-logo');
    logo.href = '/';

    const imgLogo = document.createElement('img');
    imgLogo.classList.add('header__logo');
    imgLogo.src = logoImage;
    imgLogo.alt = 'Логотип мебельного магазина Фактура';

    logo.append(imgLogo);

    return logo;
  }

  getSearchForm() {
    const searchForm = document.createElement('form');
    searchForm.classList.add('header__search');
    searchForm.method = 'GET';

    const inputSearch = document.createElement('input');
    inputSearch.classList.add('header__input');
    inputSearch.type = 'search';
    inputSearch.name = 'search';
    inputSearch.placeholder = 'Поиск';

    const btn = document.createElement('button');
    btn.classList.add('header__btn');
    btn.type = 'submit';
    btn.innerHTML = `
      <svg class="icon" width="16" height="16">
        <use xlink:href="/img/sprite.svg#icon-search"></use>
      </svg>
    `;

    searchForm.append(inputSearch, btn);
    return searchForm;
  }

  getNavigation() {
    const navigation = document.createElement('nav');
    navigation.classList.add('header__control');

    const favLink = document.createElement('a');
    favLink.classList.add('header__link');
    favLink.href = '/favourite';
    favLink.innerHTML = `
      <span class="header__link-text">Избранное</span>
      <svg class="icon" width="16" height="16">
        <use xlink:href="/img/sprite.svg#icon-heart"></use>
      </svg>
    `;

    const cartLink = document.createElement('a');
    cartLink.classList.add('header__link');
    cartLink.href = '/cart';

    const linkText = document.createElement('span');
    linkText.classList.add('header__link-text');
    linkText.textContent = 'Корзина';

    const countElement = document.createElement('span');
    countElement.classList.add('header__count');
    countElement.textContent = '(0)';

    cartLink.append(linkText, countElement);

    cartLink.insertAdjacentHTML(
      'beforeend',
      `<svg class="icon" width="16" height="16">
        <use xlink:href="/img/sprite.svg#icon-cart"></use>
      </svg>`
    );

    navigation.append(favLink, cartLink);

    this.countElement = countElement;
    return navigation;
  }

  changeCount(n) {
    this.countElement.textContent = `(${n})`;
  }
}
