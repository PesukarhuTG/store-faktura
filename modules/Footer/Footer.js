import { addContainer } from '../utils/addContainer';
import logoImage from '/img/faktura-logo.svg';

export class Footer {
  static instance = null;

  constructor() {
    if (!Footer.instance) {
      Footer.instance = this;
      this.element = document.createElement('footer');
      this.element.classList.add('footer');
      this.containerElement = addContainer(this.element, 'footer__container');
      this.isMounted = false;
    }

    return Footer.instance;
  }

  mount() {
    if (this.isMounted) {
      return;
    }

    const logo = this.getLogo();

    this.containerElement.append(logo);
    this.containerElement.insertAdjacentHTML('beforeend', this.getHTML());

    document.body.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  getLogo() {
    const logo = document.createElement('a');
    logo.classList.add('footer__link-logo');
    logo.href = '/';

    const imgLogo = document.createElement('img');
    imgLogo.classList.add('footer__logo');
    imgLogo.src = logoImage;
    imgLogo.alt = 'Логотип мебельного магазина Фактура';

    logo.append(imgLogo);

    return logo;
  }

  getHTML() {
    return `
      <div class="footer__contacts contacts">
      <a class="contacts__phone contacts__link" href="tel:+79398391297">
        <svg class="icon" width="16" height="16">
          <use xlink:href="/img/sprite.svg#icon-phone"></use>
        </svg>
        <span>+7 (939) 839 12 97</span>
      </a>

      <ul class="contacts__list">
        <li class="contacts__item">
          <a class="contacts__link" href="#">
            <svg class="icon" width="16" height="16">
              <use xlink:href="/img/sprite.svg#icon-vk"></use>
            </svg>
          </a>
        </li>

        <li class="contacts__item">
          <a class="contacts__link" href="#">
            <svg class="icon" width="16" height="16">
              <use xlink:href="/img/sprite.svg#icon-youtube"></use>
            </svg>
          </a>
        </li>

        <li class="contacts__item">
          <a class="contacts__link" href="#">
            <svg class="icon" width="16" height="16">
              <use xlink:href="/img/sprite.svg#icon-tg"></use>
            </svg>
          </a>
        </li>
      </ul>
    </div>

    <ul class="footer__developer-list">
      <li class="footer__developer-item">
        Дизайн:
        <a class="footer__developer-link" href="https://t.me/Mrshmallowww"
          target="_blank">Anastasia Ilina</a>
      </li>
      <li class="footer__developer-item">
        Разработка:
        <a class="footer__developer-link"
          href="https://github.com/PesukarhuTG" target="_blank">Tatiana
          Fox</a>
      </li>
    </ul>

    <p class="footer__copyright">&copy; Фактура, 2023</p>
    `;
  }
}
