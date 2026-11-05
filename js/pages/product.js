// js/pages/product.js

import { getProduct } from "../api.js";
import { readJSON } from "../storage.js";
import { STORAGE_KEYS } from "../config.js";
import { addItem } from "./cart.js";
import {
  renderHeader,
  renderFooter,
  formatPrice,
  showLoading,
  showError,
} from "../ui.js";

renderHeader();
renderFooter();

const statusEl = document.querySelector("#product-status");
const detailEl = document.querySelector("#product-detail");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  showError(statusEl, "Missing product Id");
} else {
  loadProduct(id);
}

async function loadProduct(productId) {
  showLoading(statusEl);
  try {
    const product = await getProduct(productId);
    renderProduct(product);
    statusEl.classList.add("is-hidden");
    detailEl.classList.remove("is-hidden");
  } catch (err) {
    showError(statusEl, err.message);
  }
}

function renderProduct(product) {
  const hasDiscount =
    product.discountedPrice != null && product.discountedPrice < product.price;

  // Image
  const image = document.createElement("img");
  image.src = product.image?.url ?? "";
  image.alt = product.image?.alt || product.title;
  image.className = "product-detail__image";

  // Info
  const info = document.createElement("div");
  info.className = "stack";

  const title = document.createElement("h1");
  title.textContent = product.title;

  // Price
  const priceBlock = document.createElement("div");
  priceBlock.className = "cluster";
  if (hasDiscount) {
    const oldPrice = document.createElement("span");
    oldPrice.className = "product-card__old-price";
    oldPrice.textContent = formatPrice(product.price);

    const newPrice = document.createElement("span");
    newPrice.className = "product-card__price";
    newPrice.textContent = formatPrice(product.discountedPrice);

    priceBlock.append(oldPrice, newPrice);
  } else {
    const price = document.createElement("span");
    price.className = "product-detail__price";
    price.textContent = formatPrice(product.price);
    priceBlock.appendChild(price);
  }

  const description = document.createElement("p");
  description.textContent = product.description;

  // Rating
  const rating = document.createElement("p");
  rating.className = "product-detail__rating";
  rating.textContent =
    product.rating > 0
      ? `Rating: ${product.rating} / 5`
      : "No ratings yet";

  // Tags
  const tags = document.createElement("div");
  tags.className = "cluster";
  (product.tags ?? []).forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = "#"+tag;
    tags.appendChild(badge);
  });

  // Share
  const shareBtn = document.createElement("button");
  shareBtn.type = "button";
  shareBtn.className = "btn btn--ghost";
  shareBtn.textContent = "Share";
  shareBtn.addEventListener("click", shareProduct);

  // Add to Cart – only logged in
  let addBtn = null;
  if (readJSON(STORAGE_KEYS.token)) {
    addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn--primary";
    addBtn.textContent = "Add to cart";
    addBtn.addEventListener("click", () => {
      addItem(product);
      addBtn.textContent = "Added to cart ✓";
    });
  }

  // Reviews
  const reviewsTitle = document.createElement("h2");
  reviewsTitle.textContent = "Reviews";

  const reviewsList = document.createElement("ul");
  reviewsList.className = "stack";
  if (!product.reviews || product.reviews.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No reviews yet.";
    reviewsList.appendChild(empty);
  } else {
    product.reviews.forEach((review) => {
      const li = document.createElement("li");
      li.className = "review";
      li.innerHTML = `
        <strong>${review.username}</strong>
        <span> – ${review.rating} av 5</span>
        <p>${review.description}</p>
      `;
      reviewsList.appendChild(li);
    });
  }

  const children = [title, priceBlock, description, rating, tags, shareBtn];
  if (addBtn) children.push(addBtn);
  children.push(reviewsTitle, reviewsList);
  info.append(...children);

  detailEl.innerHTML = "";
  detailEl.append(image, info);
}

async function shareProduct() {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({ title: document.title, url });
      return;
    } catch {
      return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    alert("Link was copied!");
  } catch {
    alert("Could not copy. Please copy from the URL field.");
  }
}