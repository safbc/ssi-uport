import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  /**
   * Gets the value from localstorage if the key is provided.
   * @param key storage key
   */
  get(key: string): any {

    if (this.has(key)) {
      console.log(`%cGetting from localstorage ${key}`, 'color: green');
      return localStorage.getItem(key);
    }
  }

  /**
   * Sets the value with key in localstorage
   * @param key storage key
   * @param value storage value
   */
  set(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  /**
   * Checks if the a key exists in localstorage
   * @param key storage key
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null ? true : false;
  }

  /**
   * Removes key stored in localstorage
   * @param key storage key
   */
  delete(key: string) {
    console.log(`%cClearing key from localstorage ${key}`, 'color: green');
    localStorage.removeItem(key);
  }
}
