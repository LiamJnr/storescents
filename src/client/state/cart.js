import { STORAGE_KEYS } from "../../shared/constants.js";
import { calculateCartTotals } from "../../shared/commerce/pricing.js";

class CartStore {
  constructor() {
    this.items = this.load();
    this.listeners = new Set();
  }

  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error("Failed to load cart from storage", e);
      return [];
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(this.items));
      this.notify();
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const summary = this.getSummary();
    this.listeners.forEach(fn => fn(summary));
  }

  /**
   * Add item to cart
   * @param {string} productId 
   * @param {string} sizeId 
   * @param {number} quantity 
   */
  addItem(productId, sizeId = "50ml", quantity = 1) {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const existingIndex = this.items.findIndex(
      item => item.productId === productId && item.sizeId === sizeId
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += qty;
    } else {
      this.items.push({ productId, sizeId, quantity: qty });
    }

    this.save();
  }

  /**
   * Update quantity of an item
   * @param {string} productId 
   * @param {string} sizeId 
   * @param {number} quantity 
   */
  updateQuantity(productId, sizeId, quantity) {
    const qty = parseInt(quantity, 10);
    const index = this.items.findIndex(
      item => item.productId === productId && item.sizeId === sizeId
    );

    if (index === -1) return;

    if (qty <= 0) {
      this.items.splice(index, 1);
    } else {
      this.items[index].quantity = qty;
    }

    this.save();
  }

  /**
   * Remove item from cart
   * @param {string} productId 
   * @param {string} sizeId 
   */
  removeItem(productId, sizeId) {
    this.items = this.items.filter(
      item => !(item.productId === productId && item.sizeId === sizeId)
    );
    this.save();
  }

  clear() {
    this.items = [];
    this.save();
  }

  getSummary() {
    return calculateCartTotals(this.items);
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }
}

export const cartStore = new CartStore();
