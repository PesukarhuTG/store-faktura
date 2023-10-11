import axios from 'axios';
import { API_URL } from '../modules/utils/const';

export class APIService {
  #apiUrl = API_URL;

  constructor() {
    this.accessKey = localStorage.getItem('accessKey');
    console.log(this.accessKey);
  }

  async getAccessKey() {
    try {
      if (!this.accessKey) {
        const response = await axios.get(`${this.#apiUrl}api/users/accessKey`);
        this.accessKey = response.data.accessKey;
        localStorage.setItem('accessKey', this.accessKey);
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
        localStorage.removeItem('accessKey');
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
}