// js/cart.js

import { STORAGE_KEYS } from "../config.js";
import { readJSON, writeJSON } from "../storage.js";

export function getItems() {
  return readJSON(STORAGE_KEYS.cart, []);
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