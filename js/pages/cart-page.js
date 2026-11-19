//js/pages/cart-page.js

import { getItems, getTotal, removeItem, updateQuantity, clear } from "../cart.js";
import { renderHeader, renderFooter, formatPrice, showEmpty } from "../ui.js";
import { ROUTES } from "../config.js";

renderHeader();
renderFooter();

const listEl = document.querySelector("#cart-list");
const statusEl = document.querySelector("#cart-status");
const summaryEl = document.querySelector("#cart-summary");
const totalEl = document.querySelector("#cart-total");
const clearBtn = document.querySelector("#clear-cart");
const checkoutLink = document.querySelector("#checkout-link");

render();

function render() {
  const items = getItems();
  listEl.innerHTML = "";

  if (items.length === 0) {
    listEl.classList.add("is-hidden");
    summaryEl.classList.add("is-hidden");
    showEmpty(statusEl, "Your cart is empty.");
    return;
  }

  statusEl.innerHTML = "";
  statusEl.classList.remove("is-hidden");
  listEl.classList.remove("is-hidden");
  summaryEl.classList.remove("is-hidden");

  items.forEach((item) => listEl.appendChild(renderCartItem(item)));
  totalEl.textContent = formatPrice(getTotal());
  checkoutLink.href = ROUTES.checkout;
}

function renderCartItem(item) {
    const li = document.createElement("li");
    li.className = "cart-item";
  
    const img = document.createElement("img");
    img.className = "cart-item__image";
    img.src = item.image?.url ?? "";
    img.alt = item.title;
    img.loading = "lazy";
  
    const info = document.createElement("div");
    info.className = "cart-item__info stack";
  
    const title = document.createElement("h2");
    title.className = "cart-item__title";
    title.textContent = item.title;
  
    const unitPrice = item.discountedPrice ?? item.price;
  
    const priceLine = document.createElement("p");
    priceLine.className = "cart-item__price";
    priceLine.textContent = `${formatPrice(unitPrice)} each`;
  
    info.append(title, priceLine);
  
    const qtyWrap = document.createElement("label");
    qtyWrap.className = "cart-item__qty";
  
    const qtyLabel = document.createElement("span");
    qtyLabel.textContent = "Quantity: ";
  
    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "1";
    qtyInput.value = String(item.quantity);
    qtyInput.addEventListener("change", () => {
      updateQuantity(item.id, qtyInput.value);
      render();
    });
  
    qtyWrap.append(qtyLabel, qtyInput);
  
    const lineTotal = document.createElement("p");
    lineTotal.className = "cart-item__price";
    lineTotal.textContent = formatPrice(unitPrice * item.quantity);
  
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn--ghost";
    removeBtn.textContent = "Remove";
    removeBtn.addEventListener("click", () => {
      removeItem(item.id);
      render();
    });
  
    li.append(img, info, qtyWrap, lineTotal, removeBtn);
    return li;
  }

clearBtn.addEventListener("click", () => {
    if (!confirm("Would you like to clear all products from the cart?")) return;
    clear();
    render();
  });