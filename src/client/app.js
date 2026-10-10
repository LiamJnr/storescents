import { renderHeader, initHeader } from "./components/header.js";
import { renderFooter } from "./components/footer.js";
import { renderCartDrawer, initCartDrawer } from "./components/cart-drawer.js";
import { renderMenuDrawer, initMenuDrawer } from "./components/menu-drawer.js";
import { renderSearchModal, initSearchModal } from "./components/search-modal.js";
import { showToast } from "./components/toast.js";
import { cartStore } from "./state/cart.js";
import { wishlistStore } from "./state/wishlist.js";
import { uiStore } from "./state/ui.js";
import { Router } from "./router.js";
import { getProductById } from "../shared/catalog/schema.js";

function bootstrap() {
  const appRoot = document.getElementById("app");
  if (!appRoot) return;

  appRoot.innerHTML = `
    ${renderHeader()}
    <main id="app-main"></main>
    <div id="site-footer-root">${renderFooter()}</div>
    
    <div id="cart-drawer-root">${renderCartDrawer()}</div>
    <div id="menu-drawer-root">${renderMenuDrawer()}</div>
    <div id="search-modal-root">${renderSearchModal()}</div>
    <div id="toast-container" class="toast-container"></div>
  `;

  // Initialize interactive components
  initHeader();
  initCartDrawer();
  initMenuDrawer();
  initSearchModal();

  // Initialize router on main outlet
  const mainOutlet = document.getElementById("app-main");
  const router = new Router(mainOutlet);

  // Global event delegation for product card actions (quick-add, wishlist toggle)
  document.addEventListener("click", (e) => {
    // Quick Add from Product Card
    const quickAddBtn = e.target.closest("[data-action='quick-add']");
    if (quickAddBtn) {
      e.preventDefault();
      const productId = quickAddBtn.getAttribute("data-product-id");
      const sizeId = quickAddBtn.getAttribute("data-size-id") || "50ml";
      const product = getProductById(productId);

      cartStore.addItem(productId, sizeId, 1);
      showToast(`${product ? product.name : 'Fragrance'} added to your bag`);
      return;
    }

    // Toggle Wishlist from Product Card
    const wishlistBtn = e.target.closest("[data-action='toggle-wishlist']");
    if (wishlistBtn) {
      e.preventDefault();
      const productId = wishlistBtn.getAttribute("data-product-id");
      const added = wishlistStore.toggle(productId);
      wishlistBtn.classList.toggle("active", added);
      showToast(added ? "Saved to your wishlist" : "Removed from wishlist");
      return;
    }
  });

  // Global escape key listener to close active drawers/modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      uiStore.closeAllDrawers();
    }
  });
}

document.addEventListener("DOMContentLoaded", bootstrap);
