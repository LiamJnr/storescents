import { formatMoneyShort } from "../lib/formatters.js";
import { escapeHtml } from "../lib/escape.js";
import { wishlistStore } from "../state/wishlist.js";

/**
 * Render a single product card
 * @param {object} product 
 * @param {object} options
 * @returns {string} HTML string
 */
export function renderProductCard(product, { showAddToCart = true, showCategoryTag = false } = {}) {
  const isWishlisted = wishlistStore.has(product.id);
  const primarySize = product.options?.sizes?.[0] || { id: "50ml", priceMinor: product.priceMinor };
  const formattedPrice = formatMoneyShort(primarySize.priceMinor);
  const imgUrl = product.images?.primary || `/images/products/${product.slug}-1.webp`;

  return `
    <div class="product-card" data-product-id="${escapeHtml(product.id)}" data-product-slug="${escapeHtml(product.slug)}">
      <div class="product-media-wrapper">
        ${product.badge ? `<span class="product-badge ${product.isPreorder ? 'preorder' : ''}">${escapeHtml(product.badge)}</span>` : ''}
        
        <button type="button" class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" data-action="toggle-wishlist" data-product-id="${escapeHtml(product.id)}" title="Save to Wishlist" aria-label="Save to Wishlist">
          <svg viewBox="0 0 24 24" fill="${isWishlisted ? '#e53935' : 'none'}" stroke="${isWishlisted ? '#e53935' : 'currentColor'}" stroke-width="1.6">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>

        <a href="/products/${escapeHtml(product.slug)}" class="product-link" aria-label="${escapeHtml(product.name)}">
          <img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(product.name)}" class="product-img" loading="lazy">
        </a>
      </div>

      <div class="product-info-wrap">
        <div class="product-text-details">
          <a href="/products/${escapeHtml(product.slug)}" class="product-title" title="${escapeHtml(product.name)}">
            ${escapeHtml(product.name)}
          </a>
          <div class="product-price">${formattedPrice}</div>
          ${showCategoryTag && product.genderLabel ? `
            <div class="product-gender-tag">${escapeHtml(product.genderLabel)}</div>
          ` : ''}
        </div>

        ${showAddToCart ? `
          <button type="button" class="product-add-btn" data-action="quick-add" data-product-id="${escapeHtml(product.id)}" data-size-id="${escapeHtml(primarySize.id)}">
            ${product.isPreorder ? 'Pre-Order' : 'Add To Cart'}
          </button>
        ` : ''}
      </div>
    </div>
  `;
}
