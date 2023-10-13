import logoImg from '/img/faktura-logo.svg';

export const getLogo = (parentClass) => {
  const logo = document.createElement('a');
  logo.classList.add(`${parentClass}__link-logo`);
  logo.href = '/';

  const imgLogo = document.createElement('img');
  imgLogo.classList.add(`${parentClass}__logo`);
  imgLogo.src = logoImg;
  imgLogo.alt = 'Логотип мебельного магазина Фактура';

  logo.append(imgLogo);

  return logo;
};
