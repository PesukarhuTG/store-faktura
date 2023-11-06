import { CartButton } from '../../features/CartButton/CartButton.js';
import { LikeButton } from '../../features/LikeButton/LikeButton.js';
import { API_URL } from '../utils/const.js';

export class ProductCard {
  static instance = null;

  constructor() {
    if (!ProductCard.instance) {
      ProductCard.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('product');
      this.containerElement = addContainer(this.element, 'product__container');
      this.isMounted = false;
    }

    return ProductCard.instance;
  }

  mount(parent, data) {
    this.render(data);

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

  render(data) {
    this.containerElement.textContent = '';

    const titleElem = document.createElement('h2');
    titleElem.classList.add('product__title');
    titleElem.textContent = data.name;

    const productPicture = document.createElement('div');
    productPicture.classList.add('product__picture');

    // первый слайдер
    const productSliderMain = document.createElement('div');
    productSliderMain.classList.add('swiper', 'product__slider-main');

    const productMainList = document.createElement('div');
    productMainList.classList.add('swiper-wrapper', 'product__main-list');

    const mainSliderItems = data.images.map((item) => {
      const productSlide = document.createElement('div');
      productSlide.classList.add('swiper-slide', 'product__slide');

      const productImage = document.createElement('img');
      productImage.classList.add('product__image');
      productImage.src = `${API_URL}${item}`;
      productImage.alt = '';

      productSlide.append(productImage);
      return productSlide;
    });

    productMainList.append(...mainSliderItems);
    productSliderMain.append(productMainList);

    if (data.images.length > 1) {
      const productArrowPrev = document.createElement('button');
      productArrowPrev.classList.add('product__arrow', 'product__arrow_prev');
      productArrowPrev.innerHTML = `
        <svg class="icon" width="32" height="32">
          <use xlink:href="/img/sprite.svg#arrow-left"></use>
        </svg>
      `;

      const productArrowNext = document.createElement('button');
      productArrowNext.classList.add('product__arrow', 'product__arrow_next');
      productArrowNext.innerHTML = `
        <svg class="icon" width="32" height="32">
          <use xlink:href="/img/sprite.svg#arrow-right"></use>
        </svg>
      `;

      productSliderMain.append(productArrowPrev, productArrowNext);

      //второй слайдер
      const productSliderThumbnails = document.createElement('div');
      productSliderThumbnails.classList.add(
        'swiper',
        'product__slider-thumbnails'
      );

      const productThumbnailsList = document.createElement('div');
      productMainList.classList.add(
        'swiper-wrapper',
        'product__thumbnails-list'
      );

      const thumbnailsSliderItems = data.images.map((item) => {
        const productSlide = document.createElement('div');
        productSlide.classList.add('swiper-slide', 'product__slide-thumbnail');

        const productImage = document.createElement('img');
        productImage.classList.add('product__img-thumbnail');
        productImage.src = `${API_URL}${item}`;
        productImage.alt = '';

        productSlide.append(productImage);
        return productSlide;
      });

      productThumbnailsList.append(...thumbnailsSliderItems);
      productSliderThumbnails.append(productThumbnailsList);

      // 2 слайдера в обертку
      productPicture.append(productSliderMain, productSliderThumbnails);
    }

    // часть с писанием товара
    const productInfo = document.createElement('div');
    productInfo.classList.add('product__info');

    const productPrice = document.createElement('span');
    productPrice.classList.add('product__price');
    productPrice.innerHTML = `${data.price.toLocaleString()}nbsp;₽`;

    const productArticle = document.createElement('span');
    productArticle.classList.add('product__article');
    productArticle.innerHTML = `арт.&nbsp;${data.article}`;

    const productDescription = document.createElement('div');
    productDescription.classList.add('product__description');

    const descriptionTitle = document.createElement('h3');
    descriptionTitle.classList.add('product__description-title');
    descriptionTitle.textContent = 'Общие характеристики';

    const descriptionTable = document.createElement('table');
    descriptionTable.classList.add('product__description-table', 'table');

    const productDescriptionRows = data.characteristics.map((item) => {
      const itemDescriptionRow = document.createElement('tr');
      itemDescriptionRow.classList.add('table__row');

      const itemDescriptionField = document.createElement('td');
      itemDescriptionField.classList.add('table__field');
      itemDescriptionField.textContent = item[0];

      const itemDescriptionValue = document.createElement('td');
      itemDescriptionValue.classList.add('table__value');
      itemDescriptionValue.textContent = item[1];

      itemDescriptionRow.append(itemDescriptionField, itemDescriptionValue);
      return itemDescriptionRow;
    });

    // блок с кнопками
    const productButtons = document.createElement('div');
    productButtons.classList.add('product__btns');

    const productBtn = new CartButton('product__btn', 'В корзину').create(
      data.id
    );
    const productLike = new LikeButton('product__like').create(data.id);

    productButtons.append(productBtn, productLike);

    descriptionTable.append(...productDescriptionRows);
    productDescription.append(descriptionTitle, descriptionTable);
    productInfo.append(
      productPrice,
      productArticle,
      productDescription,
      productButtons
    );
    this.containerElement.append(titleElem, productPicture, productInfo);
  }
}
