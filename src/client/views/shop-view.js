import { catalogConfig } from "../../client-config/catalog.js";
import { filterProducts } from "../../shared/catalog/schema.js";
import { renderProductCard } from "../components/product-card.js";
import { escapeHtml } from "../lib/escape.js";

export function renderShopView({ queryParams = {} } = {}) {
  const selectedCategory = queryParams.category || "all";
  const selectedFamily = queryParams.family || "all";
  const searchQuery = queryParams.q || "";

  const filteredProducts = filterProducts({
    category: selectedCategory,
    family: selectedFamily,
    search: searchQuery
  });

  return `
    <div class="shop-page-view">
      <div class="container" style="padding-top: var(--space-xl);">
        
        <div style="margin-bottom: var(--space-xl);">
          <h1 style="font-size: 28px; font-family: var(--font-serif); font-weight: 500; margin-bottom: 6px;">
            ${selectedCategory === "all" ? "All Fragrances" : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + " Fragrances"}
          </h1>
          <p style="font-size: 13px; color: var(--color-secondary);">
            Explore our curated collection of artisanal extraits and signature eau de parfums.
          </p>
        </div>

        <!-- Filter Pills Bar -->
        <div class="shop-filter-bar">
          <div class="filter-pills">
            <a href="/shop" class="filter-pill ${selectedCategory === 'all' && selectedFamily === 'all' ? 'active' : ''}">All</a>
            <a href="/shop?category=women" class="filter-pill ${selectedCategory === 'women' ? 'active' : ''}">For Women</a>
            <a href="/shop?category=men" class="filter-pill ${selectedCategory === 'men' ? 'active' : ''}">For Men</a>
            <a href="/shop?category=unisex" class="filter-pill ${selectedCategory === 'unisex' ? 'active' : ''}">Unisex</a>
          </div>

          <!-- Olfactory Family Dropdown / Pills -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--color-muted); font-weight: 600;">Scent Family:</span>
            <select id="select-olfactory-family" class="form-select" style="padding: 6px 12px; font-size: 12px; width: auto;" onchange="window.location.href = '/shop?category=${escapeHtml(selectedCategory)}&family=' + encodeURIComponent(this.value)">
              <option value="all" ${selectedFamily === 'all' ? 'selected' : ''}>All Olfactory Notes</option>
              ${catalogConfig.olfactoryFamilies.map(fam => `
                <option value="${escapeHtml(fam)}" ${selectedFamily.toLowerCase() === fam.toLowerCase() ? 'selected' : ''}>${escapeHtml(fam)}</option>
              `).join("")}
            </select>
          </div>
        </div>

        <!-- Product Grid -->
        ${filteredProducts.length === 0 ? `
          <div style="text-align: center; padding: 64px 16px; background: var(--color-bg-surface); border-radius: var(--radius-xs);">
            <p style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">No fragrances found in this category.</p>
            <p style="font-size: 13px; color: var(--color-muted); margin-bottom: 24px;">Try clearing filters or view our entire collection.</p>
            <a href="/shop" class="btn btn-primary">Reset Filters</a>
          </div>
        ` : `
          <div class="product-grid">
            ${filteredProducts.map(p => renderProductCard(p, { showAddToCart: true, showCategoryTag: true })).join("")}
          </div>
        `}

      </div>
    </div>
  `;
}
