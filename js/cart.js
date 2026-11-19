// js/cart.js

import { STORAGE_KEYS } from "./config.js";
import { readJSON, writeJSON } from "./storage.js";

export function getItems() {
  return readJSON(STORAGE_KEYS.cart, []);
}
export function getCount() {
  const items = getItems();
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
}

export function addItem(product) {
  const items = getItems();
  const existing = items.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({
      id: product.id,
      title: product.title,
      price: product.price,
      discountedPrice: product.discountedPrice,
      image: product.image,
      quantity: 1,
    });
  }

  writeJSON(STORAGE_KEYS.cart, items);
}

export function removeItem(productId) {
  const items = getItems().filter((item) => item.id !== productId);
  writeJSON(STORAGE_KEYS.cart, items);
}

export function updateQuantity(productId, quantity) {
  const items = getItems();
  const item = items.find((i) => i.id === productId);
  if (!item) return;

  const qty = Math.max(1, Math.floor(Number(quantity)));
  if (!Number.isFinite(qty)) return;

  item.quantity = qty;
  writeJSON(STORAGE_KEYS.cart, items);
}

export function clear() {
  writeJSON(STORAGE_KEYS.cart, []);
}

export function getTotal() {
  return getItems().reduce((sum, item) => {
    const price = item.discountedPrice ?? item.price;
    return sum + price * item.quantity;
  }, 0);
}