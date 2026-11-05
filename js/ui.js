import { ROUTES, STORAGE_KEYS } from "./config.js";
import { readJSON } from "./storage.js"; //temporary

const priceFormatter = new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
});

export function formatPrice(amount) {
    if (amount == null) return "";
    return priceFormatter.format(amount);
}

export function showLoading(container, message = "Loading…") {
    if (!container) return;
    container.innerHTML = `<p class="spinner" role="status">${message}</p>`;
    container.classList.remove("is-hidden");
  }
  
  export function showError(container, message) {
    if (!container) return;
    container.innerHTML = `<p class="error-text" role="alert">${message}</p>`;
    container.classList.remove("is-hidden");
  }
  
  export function showEmpty(container, message) {
    if (!container) return;
    container.innerHTML = `<p class="empty-state">${message}</p>`;
    container.classList.remove("visually-hidden");
  }

  export function renderProductCard(product) {
    const li = document.createElement("li");
    li.className = "product-card";
  
    const link = document.createElement("a");
    link.className = "product-card__link";
    link.href = `${ROUTES.product}?id=${encodeURIComponent(product.id)}`;
  
    const img = document.createElement("img");
    img.className = "product-card__image";
    img.src = product.image?.url ?? "";
    img.alt = product.image?.alt ?? product.title;
    img.loading = "lazy";
  
    const title = document.createElement("h3");
    title.className = "product-card__title";
    title.textContent = product.title;
  
    const priceEl = document.createElement("div");
    priceEl.className = "product-card__price";
  
    const hasDiscount =
      product.discountedPrice != null && product.discountedPrice < product.price;
  
    if (hasDiscount) {
      const old = document.createElement("span");
      old.className = "product-card__old-price";
      old.textContent = "Before: "+formatPrice(product.price);
  
      const discounted = document.createElement("span");
      discounted.className = "product-card__discounted-price";
      discounted.textContent = "Now only: "+formatPrice(product.discountedPrice);
  
      priceEl.append(old, discounted);
    } else {
      priceEl.textContent = formatPrice(product.price);
    }
  
    link.append(img, title, priceEl);
    li.appendChild(link);
    return li;
  }

  export function renderCarouselSlide(product) {
    const li = document.createElement("li");
    li.className = "carousel__slide";
    li.appendChild(renderProductCard(product));
    return li;
  }

  // HUSK: flytt til auth.js når den finnes!!
function isLoggedIn() {
    return Boolean(readJSON(STORAGE_KEYS.token));
  }
  
  // HUSK: flytt til cart.js når den finnes!!
  function getCartCount() {
    const items = readJSON(STORAGE_KEYS.cart, []);
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  }
  
  export function renderHeader() {
    const header = document.querySelector("header");
    if (!header) return;
  
    const loggedIn = isLoggedIn();
    const cartCount = getCartCount();
  
    header.innerHTML = `
      <div class="header__container">
        <a href="${ROUTES.index}" class="header__logo">Shop</a>
        <nav class="header__nav cluster" aria-label="Main menu">
          <a href="${ROUTES.index}">Products</a>
          <a href="${ROUTES.cart}" class="header__cart-link">
            Cart
            <span class="header__cart-count">${cartCount}</span>
          </a>
          ${
            loggedIn
              ? `<button type="button" class="btn btn--ghost" data-action="logout">Logg out</button>`
              : `<a href="${ROUTES.login}" class="btn btn--ghost">Sign in</a>`
          }
        </nav>
      </div>
    `;
  
    const logoutBtn = header.querySelector('[data-action="logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        // HUSK: bytt til logout() fra auth.js når den finnes !!
        localStorage.removeItem(STORAGE_KEYS.token);
        localStorage.removeItem(STORAGE_KEYS.profile);
        window.location.href = ROUTES.index;
      });
    }
  }

  export function renderFooter() {
    const footer = document.querySelector("footer");
    if (!footer) return;
  
    footer.innerHTML = `
      <div class="footer container">
        <p>© ${new Date().getFullYear()} Shop</p>
      </div>
    `;
  }