//js/pages/checkout.js

import { getItems, getTotal, clear } from "../cart.js";
import { isLoggedIn, getProfile } from "../auth.js";
import { ROUTES, STORAGE_KEYS } from "../config.js";
import { writeJSON } from "../storage.js";
import { isValidEmail } from "../validation.js";
import { renderHeader, renderFooter, formatPrice } from "../ui.js";

renderHeader();
renderFooter();

// Cjeck if logged in and create summary
if (!isLoggedIn()) {
  window.location.href = ROUTES.login;
} else if (getItems().length === 0) {
  window.location.href = ROUTES.cart;
} else {
  init();
}

function init() {
  renderOrderSummary();
  prefillFromProfile();

  const form = document.querySelector("#checkout-form");
  form.addEventListener("submit", handleSubmit);
}

function renderOrderSummary() {
  const listEl = document.querySelector("#order-items");
  const totalEl = document.querySelector("#order-total");

  listEl.innerHTML = "";
  getItems().forEach((item) => {
    const li = document.createElement("li");
    const price = item.discountedPrice ?? item.price;
    li.textContent = `${item.quantity} × ${item.title} – ${formatPrice(price * item.quantity)}`;
    listEl.appendChild(li);
  });

  totalEl.textContent = formatPrice(getTotal());
}

function prefillFromProfile() {
  const profile = getProfile();
  if (!profile) return;
  document.querySelector("#name").value = profile.name ?? "";
  document.querySelector("#email").value = profile.email ?? "";
}

function handleSubmit(event) {
  event.preventDefault();

  const data = {
    name: document.querySelector("#name").value.trim(),
    email: document.querySelector("#email").value.trim(),
    address: document.querySelector("#address").value.trim(),
    postalCode: document.querySelector("#postalCode").value.trim(),
    city: document.querySelector("#city").value.trim(),
    payment: document.querySelector('input[name="payment"]:checked').value,
  };

  if (!validate(data)) return;

  const order = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    items: getItems(),
    total: getTotal(),
    shipping: data,
  };

  writeJSON(STORAGE_KEYS.order, order);
  clear();
  window.location.href = ROUTES.success;
}

function validate(data) {
  clearErrors();
  let ok = true;

  if (!data.name) {
    setError("name", "Please enter name");
    ok = false;
  }
  if (!isValidEmail(data.email)) {
    setError("email", "Email is invalid");
    ok = false;
  }
  if (!data.address) {
    setError("address", "Please enter address");
    ok = false;
  }
  if (!/^\d{4}$/.test(data.postalCode)) {
    setError("postalCode", "Postal code must contain 4 digits");
    ok = false;
  }
  if (!data.city) {
    setError("city", "Please enter city");
    ok = false;
  }

  return ok;
}

function setError(fieldName, message) {
  const el = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll("[data-error-for]").forEach((el) => {
    el.textContent = "";
  });
}