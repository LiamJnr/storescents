import { wishlistStore } from "../state/wishlist.js";
import { renderProductCard } from "../components/product-card.js";

export function renderWishlistView() {
  const products = wishlistStore.getProducts();

  return `
    <div class="wishlist-page-view">
      <div class="container" style="padding-top: var(--space-xl);">
        
        <div style="margin-bottom: var(--space-2xl);">
          <h1 style="font-size: 28px; font-family: var(--font-serif); font-weight: 500; margin-bottom: 6px;">
            Saved Fragrances
          </h1>
          <p style="font-size: 13px; color: var(--color-secondary);">
            Your personal curation of cherished perfume profiles and olfactory desires.
          </p>
        </div>

        ${products.length === 0 ? `
          <div style="text-align: center; padding: 64px 16px; background: var(--color-bg-surface); border-radius: var(--radius-xs);">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" style="margin: 0 auto 16px; display: block; opacity: 0.4;">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <p style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">Your wishlist is currently empty.</p>
            <p style="font-size: 13px; color: var(--color-muted); margin-bottom: 24px;">Explore our artisanal creations and save your favorites.</p>
            <a href="/shop" class="btn btn-primary">Discover Fragrances</a>
          </div>
        ` : `
          <div class="product-grid">
            ${products.map(p => renderProductCard(p, { showAddToCart: true, showCategoryTag: true })).join("")}
          </div>
        `}

      </div>
    </div>
  `;
}
