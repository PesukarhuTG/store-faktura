import axios from 'axios';
import { API_URL } from '../modules/utils/const.js';
import { LStorageService } from './LStorageService.js';

const LS = new LStorageService();

export class APIService {
  #apiUrl = API_URL;

  constructor() {
    this.accessKey = LS.get('accessKey');
  }

  async getAccessKey() {
    try {
      if (!this.accessKey) {
        const response = await axios.get(`${this.#apiUrl}api/users/accessKey`);
        this.accessKey = response.data.accessKey;
        LS.set('accessKey', this.accessKey);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async getData(pathName, params = {}) {
    if (!this.accessKey) {
      await this.getAccessKey();
    }

    try {
      const response = await axios.get(`${this.#apiUrl}${pathName}`, {
        headers: {
          Authorization: `Bearer ${this.accessKey}`,
        },
        params,
      });

      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.accessKey = null;
        LS.delete('accessKey');
        return this.getData(pathName, params); //перевызов, если токен не подошел
      } else {
        console.log(error);
      }
    }
  }

  async getProducts(page = 1, limit = 12, list, category, q) {
    return await this.getData('api/products', {
      page,
      limit,
      list,
      category,
      q,
    });
  }

  async getProductCategories() {
    return await this.getData('api/productCategories');
  }

  async getProductById(id) {
    return await this.getData(`/api/products/${id}`);
  }
}
