import axios from 'axios';
import { API_URL } from '../modules/utils/const.js';
import { AccessKeyService } from './StorageService.js';

export class APIService {
  #apiUrl = API_URL;

  constructor() {
    this.accessKeyService = new AccessKeyService('accessKey_F');
    this.accessKey = this.accessKeyService.get();
  }

  async getAccessKey() {
    try {
      if (!this.accessKey) {
        const response = await axios.get(`${this.#apiUrl}api/users/accessKey`);
        this.accessKey = response.data.accessKey;
        this.accessKeyService.set(this.accessKey);
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
        this.accessKeyService.delete();
        return this.getData(pathName, params); //перевызов, если токен не подошел
      } else {
        console.log(error);
      }
    }
  }

  async getProducts(params = {}) {
    if (params.list) {
      params.list = params.list.join(',');
    }
    return await this.getData('api/products', params);
  }

  async getProductCategories() {
    return await this.getData('api/productCategories');
  }

  async getProductById(id) {
    return await this.getData(`/api/products/${id}`);
  }
}
