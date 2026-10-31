import { getProducts } from "../api.js";
import { renderHeader, renderFooter, renderProductCard, showLoading, showError } from "../ui.js";

renderHeader();
renderFooter();

const grid = document.querySelector("#product-grid");
showLoading(grid);

try {
  const products = await getProducts();
  grid.innerHTML = "";
  products.slice(0, 12).forEach((p) => grid.appendChild(renderProductCard(p)));
} catch (err) {
  showError(grid, err.message);
}