import { getProducts } from "../api.js";
import {
  renderHeader,
  renderFooter,
  renderCarouselSlide,
  renderProductCard,
  showLoading,
  showError,
} from "../ui.js";

renderHeader();
renderFooter();

const grid = document.querySelector("#product-grid");
showLoading(grid);

try {
  const products = await getProducts();

  // Grid
  grid.innerHTML = "";
  products.slice(0, 12).forEach((p) => grid.appendChild(renderProductCard(p)));

  // Carousel
  const carouselProducts = products.slice(0, 3);
  const track = document.querySelector("#carousel-track");
  const prevBtn = document.querySelector(".carousel__prev");
  const nextBtn = document.querySelector(".carousel__next");

  if (carouselProducts.length >= 3) {
    carouselProducts.forEach((p) => track.appendChild(renderCarouselSlide(p)));

    let currentIndex = 0;
    const total = carouselProducts.length;

    function goTo(index) {
      if (index >= total) index = 0;
      if (index < 0) index = total - 1;
      currentIndex = index;
      track.style.transform = `translateX(${-index * 100}%)`;
    }

    prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
    nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

    goTo(0);
  } else {
    document.querySelector(".carousel")?.classList.add("is-hidden");
  }
} catch (err) {
  showError(grid, err.message);
}