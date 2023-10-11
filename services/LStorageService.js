export class LStorageService {
  get(param) {
    return localStorage.getItem(param);
  }

  set(param, value) {
    localStorage.setItem(param, value);
  }

  delete(param) {
    localStorage.removeItem(param);
  }
}
