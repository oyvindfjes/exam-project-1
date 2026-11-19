// js/pages/success.js

import { STORAGE_KEYS } from "../config.js";
import { readJSON, remove } from "../storage.js";
import { renderHeader, renderFooter, formatPrice } from "../ui.js";

renderHeader();
renderFooter();

const order = readJSON(STORAGE_KEYS.order);

if (order) {
  showOrder(order);
  remove(STORAGE_KEYS.order);   // vis én gang, så rydder vi
}

function showOrder(order) {
  const summaryEl = document.querySelector("#order-summary");
  document.querySelector("#order-id").textContent = order.id;
  document.querySelector("#order-date").textContent =
    new Date(order.date).toLocaleString("nb-NO");

  const listEl = document.querySelector("#order-items");
  listEl.innerHTML = "";
  order.items.forEach((item) => {
    const li = document.createElement("li");
    const price = item.discountedPrice ?? item.price;
    li.textContent = `${item.quantity} × ${item.title} – ${formatPrice(price * item.quantity)}`;
    listEl.appendChild(li);
  });

  document.querySelector("#order-total").textContent = formatPrice(order.total);
  summaryEl.classList.remove("is-hidden");
}