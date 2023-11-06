import 'normalize.css';
import './style.scss';
import Navigo from 'navigo';
import { Header } from './modules/Header/Header.js';
import { Main } from './modules/Main/Main.js';
import { Footer } from './modules/Footer/Footer.js';
import { Order } from './modules/Order/Order.js';
import { ProductList } from './modules/ProductList/ProductList.js';
import { APIService } from './services/APIService.js';
import { Catalog } from './modules/Catalog/Catalog.js';
import { FavoriteService } from './services/StorageService.js';
import { Pagination } from './modules/Pagination/Pagination.js';
import { BreadCrumbs } from './features/BreadCrumbs/BreadCrumbs.js';

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

export const router = new Navigo('/', { linksSelector: 'a[href^="/"]' });

const init = async () => {
  const api = new APIService();

  new Header().mount();
  new Main().mount();
  new Footer().mount();

  /*api.getProductCategories().then((data) => {
    new Catalog().mount(new Main().element, data);
    router.updatePageLinks();
  }); переписано ниже через await */

  /*try {
    const data = await api.getProductCategories();
    new Catalog().mount(new Main().element, data);
    router.updatePageLinks();
  } catch (error) {
    console.log(error);
  }*/

  productSlider();

  router
    .on(
      '/',
      async () => {
        new Catalog().mount(new Main().element);

        const products = await api.getProducts();
        new ProductList().mount(new Main().element, products);

        // тк роутер с ссылками отработает раньше чем отрисуются товары,
        //после отрисовки товаров просим его обновить все ссылки
        router.updatePageLinks();
      },
      {
        leave(done) {
          new ProductList().unmount();
          new Catalog().unmount();
          done();
        },
        already() {
          console.log('already');
        },
      }
    )
    .on(
      '/category',
      async ({ params: { slug, page = 1 } }) => {
        new Catalog().mount(new Main().element);

        const { data: products, pagination } = await api.getProducts({
          category: slug,
          page: page,
        });

        new BreadCrumbs().mount(new Main().element, [{ text: slug }]);
        new ProductList().mount(new Main().element, products, slug);
        new Pagination()
          .mount(new ProductList().containerElement)
          .update(pagination);
        router.updatePageLinks();
      },
      {
        leave(done) {
          new BreadCrumbs().unmount();
          new ProductList().unmount();
          new Catalog().unmount();
          done();
        },
        already(match) {
          // если удалили товар из избранного и снова зашли на страницу то товара уже не д.б,
          // => нужно снова запустить фцию async, переданную вторым параметром выше
          match.route.handler(match);
        },
      }
    )
    .on(
      '/favourite',
      async ({ params }) => {
        new Catalog().mount(new Main().element);

        const favorite = new FavoriteService().get();
        const { data: products, pagination } = await api.getProducts({
          list: favorite,
          page: params?.page || 1,
        });

        new BreadCrumbs().mount(new Main().element, [{ text: 'Избранное' }]);
        new ProductList().mount(
          new Main().element,
          products,
          'Избранное',
          'Вы ничего не добавили в «Избранное»'
        );
        new Pagination()
          .mount(new ProductList().containerElement)
          .update(pagination);
        router.updatePageLinks();
      },
      {
        leave(done) {
          new BreadCrumbs().unmount();
          new ProductList().unmount();
          new Catalog().unmount();
          done();
        },
        already(match) {
          match.route.handler(match);
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
