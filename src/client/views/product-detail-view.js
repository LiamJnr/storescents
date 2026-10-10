import { getProductBySlug } from "../../shared/catalog/schema.js";
import { formatMoney } from "../lib/formatters.js";
import { escapeHtml } from "../lib/escape.js";
import { wishlistStore } from "../state/wishlist.js";
import { cartStore } from "../state/cart.js";
import { uiStore } from "../state/ui.js";
import { showToast } from "../components/toast.js";
import { renderProductCard } from "../components/product-card.js";
import { catalogConfig } from "../../client-config/catalog.js";

export function renderProductDetailView({ params = {} } = {}) {
  const product = getProductBySlug(params.slug);

  if (!product) {
    return `
      <div class="container" style="padding: 80px 16px; text-align: center;">
        <h1 style="font-size: 24px; font-weight: 500; margin-bottom: 12px;">Fragrance Not Found</h1>
        <p style="color: var(--color-muted); margin-bottom: 24px;">The requested scent does not exist or has been archived.</p>
        <a href="/shop" class="btn btn-primary">Return to Collection</a>
      </div>
    `;
  }

  const isWishlisted = wishlistStore.has(product.id);
  const defaultSize = product.options.sizes[0];
  const relatedProducts = catalogConfig.products.filter(p => p.id !== product.id && (p.category === product.category || p.olfactoryFamily === product.olfactoryFamily)).slice(0, 4);

  return `
    <div class="pdp-page-view" data-product-id="${escapeHtml(product.id)}">
      <div class="container">
        
        <!-- Breadcrumbs -->
        <nav style="font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--color-muted); margin-top: var(--space-lg); margin-bottom: var(--space-md);">
          <a href="/">Home</a> / <a href="/shop">Shop</a> / <a href="/shop?category=${escapeHtml(product.category)}">${escapeHtml(product.genderLabel)}</a> / <span style="color: var(--color-primary);">${escapeHtml(product.name)}</span>
        </nav>

        <div class="pdp-container">
          <!-- Left: Gallery Media -->
          <div class="pdp-gallery">
            <img src="${escapeHtml(product.images.primary)}" alt="${escapeHtml(product.name)}" class="pdp-main-img" loading="eager">
          </div>

          <!-- Right: Details & Order Controls -->
          <div class="pdp-details">
            <div class="pdp-meta-top">
              <span class="pdp-category-badge">${escapeHtml(product.genderLabel)} • ${escapeHtml(product.concentration)}</span>
              ${product.badge ? `<span class="product-badge ${product.isPreorder ? 'preorder' : ''}">${escapeHtml(product.badge)}</span>` : ''}
            </div>

            <h1 class="pdp-title">${escapeHtml(product.name)}</h1>
            <p class="pdp-subtitle">${escapeHtml(product.subtitle)}</p>

            <div class="pdp-price-wrap">
              <span id="pdp-current-price">${formatMoney(defaultSize.priceMinor)}</span>
              ${product.compareAtPriceMinor ? `<span class="pdp-compare-price">${formatMoney(product.compareAtPriceMinor)}</span>` : ''}
            </div>

            ${product.isPreorder ? `
              <div class="preorder-alert-box">
                <strong>⏳ Pre-Order Fragrance:</strong><br>
                ${escapeHtml(product.preorderNote || 'Artisanal batch shipping within 7–10 business days.')}
              </div>
            ` : ''}

            <!-- Size Selector -->
            <div class="size-selector-wrap">
              <label class="form-label">Select Bottle Size:</label>
              <div class="size-pills" id="pdp-size-pills">
                ${product.options.sizes.map((size, idx) => `
                  <button type="button" class="size-pill ${idx === 0 ? 'active' : ''}" data-size-id="${escapeHtml(size.id)}" data-price-minor="${size.priceMinor}">
                    ${escapeHtml(size.label)} (${formatMoney(size.priceMinor)})
                  </button>
                `).join("")}
              </div>
            </div>

            <!-- Action CTA Row -->
            <div class="pdp-actions-row">
              <button type="button" class="btn btn-primary btn-lg" id="btn-pdp-add-cart" style="flex: 1;" data-product-id="${escapeHtml(product.id)}" data-size-id="${escapeHtml(defaultSize.id)}">
                ${product.isPreorder ? 'Pre-Order Now' : 'Add To Bag'}
              </button>
              
              <button type="button" class="pdp-wishlist-toggle ${isWishlisted ? 'active' : ''}" id="btn-pdp-toggle-wishlist" data-product-id="${escapeHtml(product.id)}" title="Save to Wishlist" aria-label="Save to Wishlist">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <!-- Description -->
            <div style="border-top: 1px solid var(--color-border); padding-top: var(--space-md); margin-top: var(--space-sm);">
              <p style="font-size: 14px; line-height: 1.7; color: var(--color-secondary);">
                ${escapeHtml(product.description)}
              </p>
            </div>

            <!-- Fragrance Pyramid Component -->
            ${product.pyramid ? `
              <div class="scent-pyramid-container">
                <div style="font-size: 12px; letter-spacing: 1px; text-transform: uppercase; font-weight: 700; color: var(--color-primary); margin-bottom: 4px;">
                  Olfactory Pyramid
                </div>
                
                <div class="pyramid-tier">
                  <div class="pyramid-tier-label">Top Notes (First 15–30 mins)</div>
                  <div class="pyramid-notes-list">${escapeHtml(product.pyramid.top.join(" • "))}</div>
                </div>

                <div class="pyramid-tier">
                  <div class="pyramid-tier-label">Heart Notes (Core Character)</div>
                  <div class="pyramid-notes-list">${escapeHtml(product.pyramid.heart.join(" • "))}</div>
                </div>

                <div class="pyramid-tier">
                  <div class="pyramid-tier-label">Base Notes (Lingering Aura)</div>
                  <div class="pyramid-notes-list">${escapeHtml(product.pyramid.base.join(" • "))}</div>
                </div>
              </div>
            ` : ''}

            <!-- Performance Metrics -->
            ${product.metrics ? `
              <div class="pdp-metrics-grid">
                <div class="metric-item">
                  <div class="metric-item-label">Longevity</div>
                  <div class="metric-item-val">${escapeHtml(product.metrics.longevity)}</div>
                </div>
                <div class="metric-item">
                  <div class="metric-item-label">Sillage</div>
                  <div class="metric-item-val">${escapeHtml(product.metrics.sillage)}</div>
                </div>
                <div class="metric-item">
                  <div class="metric-item-label">Best Suited</div>
                  <div class="metric-item-val">${escapeHtml(product.metrics.season)}</div>
                </div>
              </div>
            ` : ''}

            <!-- Dispatch & Authenticity Info -->
            <div style="font-size: 12px; color: var(--color-muted); line-height: 1.6; border-top: 1px solid var(--color-border); padding-top: var(--space-md);">
              ✓ Guaranteed 100% genuine fragrance oils • Hand-packaged in Kumasi<br>
              ✓ Free delivery across Ghana on qualifying orders GH₵ 600+<br>
              ✓ Questions? WhatsApp our scent concierge directly for pairing advice.
            </div>

          </div>
        </div>

        <!-- Related Fragrances -->
        ${relatedProducts.length > 0 ? `
          <div style="margin-top: var(--space-4xl); border-top: 1px solid var(--color-border); padding-top: var(--space-3xl);">
            <h3 style="font-size: 20px; font-weight: 500; margin-bottom: var(--space-xl);">You May Also Admire</h3>
            <div class="product-grid" style="grid-template-columns: repeat(4, 1fr);">
              ${relatedProducts.map(p => renderProductCard(p, { showAddToCart: true, showCategoryTag: false })).join("")}
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}

export function initProductDetailView() {
  const sizePills = document.querySelectorAll("#pdp-size-pills .size-pill");
  const priceEl = document.getElementById("pdp-current-price");
  const addCartBtn = document.getElementById("btn-pdp-add-cart");
  const wishlistBtn = document.getElementById("btn-pdp-toggle-wishlist");

  let selectedSizeId = "50ml";

  sizePills.forEach(pill => {
    pill.addEventListener("click", () => {
      sizePills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      selectedSizeId = pill.getAttribute("data-size-id");
      const priceMinor = parseInt(pill.getAttribute("data-price-minor"), 10);
      
      if (priceEl) priceEl.textContent = formatMoney(priceMinor);
      if (addCartBtn) addCartBtn.setAttribute("data-size-id", selectedSizeId);
    });
  });

  if (addCartBtn) {
    addCartBtn.addEventListener("click", () => {
      const productId = addCartBtn.getAttribute("data-product-id");
      cartStore.addItem(productId, selectedSizeId, 1);
      showToast("Fragrance added to your bag");
    });
  }

  if (wishlistBtn) {
    wishlistBtn.addEventListener("click", () => {
      const productId = wishlistBtn.getAttribute("data-product-id");
      const added = wishlistStore.toggle(productId);
      wishlistBtn.classList.toggle("active", added);
      showToast(added ? "Saved to your wishlist" : "Removed from wishlist");
    });
  }
}
