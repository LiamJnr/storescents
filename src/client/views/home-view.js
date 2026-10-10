import { catalogConfig } from "../../client-config/catalog.js";
import { contentConfig } from "../../client-config/content.js";
import { renderProductCard } from "../components/product-card.js";
import { escapeHtml } from "../lib/escape.js";

export function renderHomeView() {
  const topCategories = [
    { label: "Women", category: "women", image: "/images/products/category-women.webp" },
    { label: "Men", category: "men", image: "/images/products/category-men.webp" },
    { label: "Unisex", category: "unisex", image: "/images/products/category-unisex.webp" },
    { label: "Unisex", category: "unisex", image: "/images/products/ombre-nomade-1.webp" },
    { label: "Unisex", category: "unisex", image: "/images/products/les-sables-roses-1.webp" },
    { label: "Unisex", category: "unisex", image: "/images/products/symphony-1.webp" }
  ];

  const allProducts = catalogConfig.products;

  return `
    <div class="home-page-view">
      <div class="container" style="padding-top: var(--space-xl);">
        
        <!-- Top Section Header with Scroll Arrows -->
        <div class="section-header category-strip-header" style="margin-top: 0; margin-bottom: var(--space-md); display: flex; justify-content: space-between; align-items: center;">
          <h2 class="section-title">All Perfumes</h2>
          <div class="carousel-nav-arrows">
            <button type="button" class="carousel-arrow-btn" id="category-strip-prev" aria-label="Scroll Categories Left">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button type="button" class="carousel-arrow-btn" id="category-strip-next" aria-label="Scroll Categories Right">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Top Category Mini Grid (Matching Design Top Strip) -->
        <div class="category-strip" id="category-strip-rail">
          ${topCategories.map(cat => `
            <a href="/shop?category=${escapeHtml(cat.category)}" class="product-card" style="text-decoration: none;">
              <div class="product-media-wrapper" style="aspect-ratio: 4 / 5; margin-bottom: 8px;">
                <img src="${escapeHtml(cat.image)}" alt="${escapeHtml(cat.label)}" class="product-img" onerror="this.style.opacity='0';">
              </div>
              <div class="product-gender-tag" style="font-size: 13px; font-weight: 500; color: var(--color-primary);">${escapeHtml(cat.label)}</div>
            </a>
          `).join("")}
        </div>

        <!-- Editorial Feature Banner (Matching Middle Banner in Design) -->
        <section class="editorial-banner" style="background: linear-gradient(135deg, #df9baf 0%, #c4768d 40%, #9e4b64 100%);">
          <div class="editorial-content-box">
            <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; margin-bottom: 8px; opacity: 0.9;">
              ${escapeHtml(contentConfig.editorialBanner.badge)}
            </div>
            <h2 class="editorial-title" style="font-family: var(--font-serif); font-size: 30px; font-weight: 600;">
              ${escapeHtml(contentConfig.editorialBanner.badge)}
            </h2>
            <p class="editorial-desc">
              ${escapeHtml(contentConfig.editorialBanner.description)}
            </p>
            <a href="${escapeHtml(contentConfig.editorialBanner.cta.href)}" class="btn editorial-btn">
              ${escapeHtml(contentConfig.editorialBanner.cta.label)}
            </a>
          </div>
        </section>

        <!-- Main Curated Perfumes Grid (Matching Design Bottom Section) -->
        <section style="margin-top: var(--space-4xl);">
          <div class="section-header" style="display: flex; justify-content: space-between; align-items: baseline;">
            <h2 class="section-title">All Perfumes</h2>
            <a href="/shop" style="font-size: 13px; font-weight: 500; text-decoration: underline;">View All (15)</a>
          </div>

          <div class="product-grid">
            ${allProducts.slice(0, 12).map(product => renderProductCard(product, { showAddToCart: true, showCategoryTag: false })).join("")}
          </div>
        </section>

      </div>
    </div>
  `;
}

export function initHomeView() {
  const strip = document.getElementById("category-strip-rail");
  const prevBtn = document.getElementById("category-strip-prev");
  const nextBtn = document.getElementById("category-strip-next");

  if (strip && prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      strip.scrollBy({ left: -220, behavior: "smooth" });
    });
    nextBtn.addEventListener("click", () => {
      strip.scrollBy({ left: 220, behavior: "smooth" });
    });
  }
}
