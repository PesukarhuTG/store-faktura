export class Pagination {
  static instance = null;

  constructor() {
    if (!Pagination.instance) {
      Pagination.instance = this;
      this.pagination = this.createPagination();
    }

    return Pagination.instance;
  }

  createPagination() {
    const pagination = document.createElement('div');
    pagination.classList.add('pagination');

    this.paginationBar = document.createElement('div');
    this.paginationBar.classList.add('pagination__bar');

    const paginationArrows = document.createElement('div');
    paginationArrows.classList.add('pagination__arrows');

    this.paginationLeft = document.createElement('a');
    this.paginationLeft.classList.add('pagination__btn', 'pagination__left');
    this.paginationLeft.innerHTML = `
      <svg class="icon" width="16" height="16">
        <use xlink:href="/img/sprite.svg#arrow-page-left"></use>
      </svg>
    `;

    this.paginationRight = document.createElement('a');
    this.paginationRight.classList.add('pagination__btn', 'pagination__right');
    this.paginationRight.innerHTML = `
      <svg class="icon" width="16" height="16">
        <use xlink:href="/img/sprite.svg#arrow-page-right"></use>
      </svg>
    `;

    const paginationInfo = document.createElement('p');
    paginationInfo.classList.add('pagination__info');

    this.paginationCurrent = document.createElement('span');
    this.paginationCurrent.classList.add('pagination__current');

    const paginationSeparator = document.createTextNode('из');

    this.paginationTotal = document.createElement('span');
    this.paginationTotal.classList.add('pagination__total');

    paginationInfo.append(
      this.paginationCurrent,
      paginationSeparator,
      this.paginationTotal
    );

    paginationArrows.append(
      this.paginationLeft,
      paginationInfo,
      this.paginationRight
    );

    pagination.append(this.paginationBar, paginationArrows);
    return pagination;
  }

  update({ currentPage, limit, totalPages, totalProducts }) {
    const width = currentPage * limit; // кол-во просмотренных товаров с учетом пагинации

    // обновление полоски-бара пагинации
    this.paginationBar.style.setProperty(
      '--width',
      `calc(${
        width < totalProducts ? width : totalProducts
      } / ${totalProducts} * 100% )`
    );

    // обновление численных данных пагинации
    this.paginationCurrent.textContent =
      totalProducts === limit
        ? totalProducts
        : width < totalProducts
        ? width
        : width - limit + (totalProducts % limit);
    this.paginationTotal.textContent = totalProducts;

    //обновление ссылок пагинации
    const urlLeft = new URL(window.location.href);

    if (currentPage !== 1) {
      urlLeft.searchParams.set('page', currentPage - 1);
      this.paginationLeft.href = urlLeft.pathname + urlLeft.search;
      this.paginationLeft.classList.remove('pagination__btn_disabled');
    } else {
      this.paginationLeft.removeAttribute('href');
      this.paginationLeft.classList.add('pagination__btn_disabled');
    }

    const urlRight = new URL(window.location.href);

    if (currentPage !== totalPages) {
      urlRight.searchParams.set('page', currentPage + 1);
      this.paginationRight.href = urlRight.pathname + urlRight.search;
      this.paginationRight.classList.remove('pagination__btn_disabled');
    } else {
      this.paginationRight.removeAttribute('href');
      this.paginationRight.classList.add('pagination__btn_disabled');
    }

    return this; // на всякий случай для chaining
  }

  mount(parent, position) {
    if (position) {
      parent.insertAdjacentElement(position, this.pagination);
    } else {
      parent.append(this.pagination);
    }

    return this; //чтобы сработал chaining в main.js на 95стр
  }
}
