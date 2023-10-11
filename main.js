import 'normalize.css';
import './style.scss';
import Navigo from 'navigo';
import { Header } from './modules/Header/Header';
import { Main } from './modules/Main/Main';
import { Footer } from './modules/Footer/Footer';
import { Order } from './modules/Order/Order';
import { ProductList } from './modules/ProductList/ProductList';
import { APIService } from './services/APIService';
import { Catalog } from './modules/Catalog/Catalog';

const productSlider = () => {
  Promise.all([
    import('swiper/modules'),
    import('swiper'),
    import('swiper/css'),
  ]).then(([{ Navigation, Thumbs }, Swiper]) => {
    const swiperThumbnails = new Swiper.default('.product__slider-thumbnails', {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    new Swiper.default('.product__slider-main', {
      spaceBetween: 10,
      navigation: {
        nextEl: '.product__arrow_next',
        prevEl: '.product__arrow_prev',
      },
      thumbs: {
        swiper: swiperThumbnails,
      },
      modules: [Navigation, Thumbs],
    });
  });
};

const init = () => {
  const api = new APIService();
  const router = new Navigo('/', { linksSelector: 'a[href^="/"]' });

  new Header().mount();
  new Main().mount();
  new Footer().mount();

  api.getProductCategories().then((data) => {
    new Catalog().mount(new Main().element, data);
    router.updatePageLinks();
  });

  productSlider();

  router
    .on(
      '/',
      async () => {
        const products = await api.getProducts();
        new ProductList().mount(new Main().element, products);

        // тк роутер с ссылками отработает раньше чем отрисуются товары,
        //после отрисовки товаров просим его обновить все ссылки
        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          done();
        },
        already() {
          console.log('already');
        },
      }
    )
    .on(
      '/category',
      async ({ params: { slug } }) => {
        const products = await api.getProducts();
        new ProductList().mount(new Main().element, products, slug);
        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          done();
        },
      }
    )
    .on(
      '/favourite',
      async () => {
        const products = await api.getProducts();
        new ProductList().mount(new Main().element, products, 'Избранное');
        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          done();
        },
      }
    )
    .on('/cart', () => {
      console.log('корзина');
    })
    .on('/search', () => {
      console.log('поиск');
    })
    .on('/product/:id', (obj) => {
      console.log('продукт', obj);
    })
    .on('/order', () => {
      new Order().mount(new Main().element);
      console.log('заказ');
    })
    .notFound(
      () => {
        new Main().element.innerHTML = `
          <h2 class="error__title">Ууупс, страница не&nbsp;найдена</h2>
          <div class="error__img">
            <svg class="icon error-animate">
                <use xlink:href="/img/sprite.svg#error"></use>
            </svg>
          </div>
          <p class="error__description">Через 5&nbsp;сек. вы будете перенаправлены на&nbsp;<a class="error__link" href="/">Главную страницу</a></p>
        `;

        setTimeout(() => {
          router.navigate('/');
        }, 5000);
      },
      {
        leave(done) {
          new Main().element.innerHTML = '';
          done();
        },
      }
    );

  router.resolve();
};

init();
