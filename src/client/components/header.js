import { brandConfig } from "../../client-config/brand.js";
import { cartStore } from "../state/cart.js";
import { wishlistStore } from "../state/wishlist.js";
import { uiStore } from "../state/ui.js";

export function renderHeader() {
  const cartCount = cartStore.getItemCount();
  const wishlistCount = wishlistStore.getCount();

  return `
    <header class="site-header" id="site-header">
      <div class="container header-inner">
        <!-- Left Nav Actions -->
        <div class="header-left">
          <button type="button" class="header-btn" id="btn-toggle-menu" aria-label="Open Navigation Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span>Menu</span>
          </button>

          <button type="button" class="header-btn" id="btn-toggle-search" aria-label="Search Fragrances">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span>Search</span>
          </button>
        </div>

        <!-- Center Brand Logo -->
        <div class="header-center">
          <a href="/" class="brand-logo" id="header-brand-logo">
            ${brandConfig.name}
          </a>
        </div>

        <!-- Right Nav Actions -->
        <div class="header-right">
          <a href="/wishlist" class="header-icon-link" id="header-wishlist-link" aria-label="View Wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span class="badge-count ${wishlistCount > 0 ? 'visible' : ''}" id="header-wishlist-count">
              ${wishlistCount}
            </span>
          </a>

          <button type="button" class="header-icon-link" id="btn-toggle-cart" aria-label="Open Shopping Bag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span class="badge-count ${cartCount > 0 ? 'visible' : ''}" id="header-cart-count">
              ${cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  `;
}

/**
 * Setup header event handlers and store listeners
 */
export function initHeader() {
  const menuBtn = document.getElementById("btn-toggle-menu");
  const searchBtn = document.getElementById("btn-toggle-search");
  const cartBtn = document.getElementById("btn-toggle-cart");
  const cartCountEl = document.getElementById("header-cart-count");
  const wishlistCountEl = document.getElementById("header-wishlist-count");

  if (menuBtn) {
    menuBtn.addEventListener("click", () => uiStore.toggleMenu());
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", () => uiStore.openSearch());
  }

  if (cartBtn) {
    cartBtn.addEventListener("click", () => uiStore.toggleCart());
  }

  // Update badges on store changes
  cartStore.subscribe((summary) => {
    if (!cartCountEl) return;
    const count = summary.itemCount;
    cartCountEl.textContent = count;
    cartCountEl.classList.toggle("visible", count > 0);
  });

  wishlistStore.subscribe((items) => {
    if (!wishlistCountEl) return;
    const count = items.length;
    wishlistCountEl.textContent = count;
    wishlistCountEl.classList.toggle("visible", count > 0);
  });
}
