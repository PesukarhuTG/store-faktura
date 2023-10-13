import logoImg from '/img/faktura-logo.svg';

export class Logo {
  constructor(parentClass) {
    this.parentClass = parentClass;
  }

  create() {
    const logo = document.createElement('a');
    logo.classList.add(`${this.parentClass}__link-logo`);
    logo.href = '/';

    const imgLogo = document.createElement('img');
    imgLogo.classList.add(`${this.parentClass}__logo`);
    imgLogo.src = logoImg;
    imgLogo.alt = 'Логотип мебельного магазина Фактура';

    logo.append(imgLogo);

    return logo;
  }
}
