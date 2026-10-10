import { STORAGE_KEYS } from "../../shared/constants.js";
import { getProductById } from "../../shared/catalog/schema.js";

class WishlistStore {
  constructor() {
    this.productIds = this.load();
    this.listeners = new Set();
  }

  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to load wishlist from storage", e);
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(this.productIds));
      this.notify();
    } catch (e) {
      console.error("Failed to save wishlist to storage", e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const list = this.getProducts();
    this.listeners.forEach(fn => fn(list));
  }

  has(productId) {
    return this.productIds.includes(productId);
  }

  toggle(productId) {
    if (this.has(productId)) {
      this.productIds = this.productIds.filter(id => id !== productId);
    } else {
      this.productIds.push(productId);
    }
    this.save();
    return this.has(productId);
  }

  remove(productId) {
    this.productIds = this.productIds.filter(id => id !== productId);
    this.save();
  }

  getProducts() {
    return this.productIds
      .map(id => getProductById(id))
      .filter(Boolean);
  }

  getCount() {
    return this.productIds.length;
  }
}

export const wishlistStore = new WishlistStore();
