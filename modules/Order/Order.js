import { addContainer } from '../utils/addContainer';

export class Order {
  static instance = null;

  constructor() {
    this.parent = parent;

    if (!Order.instance) {
      Order.instance = this;
      this.element = document.createElement('section');
      this.element.classList.add('order');
      this.containerElement = addContainer(this.element, 'order__container');
      this.isMounted = false;
    }

    return Order.instance;
  }

  mount(parent) {
    if (this.isMounted) {
      return;
    }

    const title = this.getTitle();
    const number = this.getNumber();
    const subtitle = this.getSubtitle();

    this.containerElement.append(title, number, subtitle);
    this.containerElement.insertAdjacentHTML('beforeend', this.getTable());

    parent.append(this.element);
    this.isMounted = true;
  }

  unmount() {
    this.element.remove();
    this.isMounted = false;
  }

  getTitle() {
    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('order__title-wrapper');

    const headling = document.createElement('h2');
    headling.classList.add('order__title');
    headling.textContent = 'Заказ успешно размещен';

    const amount = document.createElement('span');
    amount.classList.add('order__price');
    amount.textContent = '20 000 ₽';

    titleWrapper.append(headling, amount);

    return titleWrapper;
  }

  getNumber() {
    const number = document.createElement('span');
    number.classList.add('order__number');
    number.textContent = '№43435';

    return number;
  }

  getSubtitle() {
    const headling = document.createElement('h3');
    headling.classList.add('order__subtitle');
    headling.textContent = 'Данные доставки';

    return headling;
  }

  getTable() {
    return `
      <table class="order__description-table table">
        <tr class="table__row">
            <td class="table__field">Получатель</td>
            <td class="table__value">Иванов Петр Александрович</td>
        </tr>
        <tr class="table__row">
          <td class="table__field">Телефон</td>
          <td class="table__value">+7 (737) 346 23 00</td>
        </tr>
        <tr class="table__row">
          <td class="table__field">E-mail</td>
          <td class="table__value">Ivanov84@gmail.com</td>
        </tr>
        <tr class="table__row">
          <td class="table__field">Адрес&nbsp;доставки</td>
          <td class="table__value">Москва, ул. Ленина, 21, кв. 33</td>
        </tr>
        <tr class="table__row">
          <td class="table__field">Способ&nbsp;оплаты</td>
          <td class="table__value">Картой при получении</td>
        </tr>
        <tr class="table__row">
          <td class="table__field">Способ&nbsp;получения</td>
          <td class="table__value">Доставка</td>
        </tr>
      </table>

      <button class="order__btn" type="button">На главную</button>
    `;
  }
}
