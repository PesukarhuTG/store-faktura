import 'normalize.css';
import './style.scss';
import Navigo from 'navigo';
import { Header } from './modules/Header/Header';
import { Main } from './modules/Main/Main';
import { Footer } from './modules/Footer/Footer';
import { Order } from './modules/Order/Order';
import { ProductList } from './modules/ProductList/ProductList';
import { APIService } from './services/APIService';

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

  new Header().mount();
  new Main().mount();
  new Footer().mount();

  productSlider();

  const router = new Navigo('/', { linksSelector: 'a[href^="/"]' });
  router
    .on(
      '/',
      async () => {
        const products = await api.getProducts();

        new ProductList().mount(new Main().element, products);
        console.log('на главной');
      },
      {
        leave(done) {
          console.log('leave');
          done();
        },
        already() {
          console.log('already');
        },
      }
    )
    .on(
      '/category',
      () => {
        new ProductList().mount(
          new Main().element,
          [1, 2, 3, 4, 5, 6, 7],
          'Kaтегория'
        );
        console.log('категории');
      },
      {
        leave(done) {
          console.log('leave');
          done();
        },
      }
    )
    .on(
      '/favourite',
      () => {
        new ProductList().mount(new Main().element, [1, 2, 3], 'Избранное');
        console.log('избранное');
      },
      {
        leave(done) {
          console.log('leave');
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
