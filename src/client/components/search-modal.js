import { uiStore } from "../state/ui.js";
import { filterProducts } from "../../shared/catalog/schema.js";
import { renderProductCard } from "./product-card.js";

export function renderSearchModal() {
  return `
    <div class="drawer-backdrop" id="search-modal-backdrop"></div>
    <div class="search-modal-wrap" id="search-modal" role="dialog" aria-modal="true" style="position: fixed; top: 0; left: 0; right: 0; background: #ffffff; z-index: var(--z-drawer); padding: 24px; border-bottom: 1px solid var(--color-border); display: none; transform: translateY(-100%); transition: transform var(--transition-smooth);">
      <div class="container" style="max-width: 800px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <h3 style="font-size: 13px; letter-spacing: 1px; text-transform: uppercase; font-weight: 600;">Search Fragrances</h3>
          <button type="button" id="btn-close-search" style="font-size: 18px; padding: 4px;">✕</button>
        </div>
        
        <div style="position: relative; margin-bottom: 24px;">
          <input type="search" id="search-input" placeholder="Search by name, notes (e.g. Oud, Rose, Ginger), or olfactory family..." class="form-input" style="padding: 16px 20px; font-size: 16px; border-radius: var(--radius-xs);" autofocus>
        </div>

        <div id="search-results-container" style="max-height: 60vh; overflow-y: auto;">
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--color-muted); margin-bottom: 12px;">Suggested Olfactory Searches</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="filter-pill search-quick-tag" data-tag="Oud">Oud Wood</button>
            <button type="button" class="filter-pill search-quick-tag" data-tag="Rose">Rose de Mai</button>
            <button type="button" class="filter-pill search-quick-tag" data-tag="Iris">Iris</button>
            <button type="button" class="filter-pill search-quick-tag" data-tag="Mandarin">Mandarin Citrus</button>
            <button type="button" class="filter-pill search-quick-tag" data-tag="Ginger">Ginger Zest</button>
            <button type="button" class="filter-pill search-quick-tag" data-tag="Amber">Amber</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initSearchModal() {
  const backdrop = document.getElementById("search-modal-backdrop");
  const modal = document.getElementById("search-modal");
  const closeBtn = document.getElementById("btn-close-search");
  const searchInput = document.getElementById("search-input");
  const resultsContainer = document.getElementById("search-results-container");

  const syncState = (state) => {
    if (!backdrop || !modal) return;
    if (state.isSearchOpen) {
      backdrop.classList.add("active");
      modal.style.display = "block";
      setTimeout(() => {
        modal.style.transform = "translateY(0)";
        if (searchInput) searchInput.focus();
      }, 10);
      document.body.style.overflow = "hidden";
    } else {
      backdrop.classList.remove("active");
      modal.style.transform = "translateY(-100%)";
      setTimeout(() => {
        modal.style.display = "none";
      }, 250);
      document.body.style.overflow = "";
    }
  };

  uiStore.subscribe(syncState);

  if (backdrop) backdrop.addEventListener("click", () => uiStore.closeSearch());
  if (closeBtn) closeBtn.addEventListener("click", () => uiStore.closeSearch());

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      if (!query) {
        resultsContainer.innerHTML = `
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--color-muted); margin-bottom: 12px;">Suggested Olfactory Searches</div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="filter-pill search-quick-tag" data-tag="Oud">Oud Wood</button>
            <button type="button" class="filter-pill search-quick-tag" data-tag="Rose">Rose de Mai</button>
            <button type="button" class="filter-pill search-quick-tag" data-tag="Iris">Iris</button>
            <button type="button" class="filter-pill search-quick-tag" data-tag="Mandarin">Mandarin Citrus</button>
            <button type="button" class="filter-pill search-quick-tag" data-tag="Ginger">Ginger Zest</button>
            <button type="button" class="filter-pill search-quick-tag" data-tag="Amber">Amber</button>
          </div>
        `;
        return;
      }

      const matches = filterProducts({ search: query });
      if (matches.length === 0) {
        resultsContainer.innerHTML = `
          <div style="text-align: center; padding: 32px; color: var(--color-muted);">
            <p style="font-size: 14px; margin-bottom: 4px; color: var(--color-primary);">No fragrances matched "${escapeHtml(query)}"</p>
            <p style="font-size: 12px;">Try searching for floral, woody, bergamot, or amber.</p>
          </div>
        `;
      } else {
        resultsContainer.innerHTML = `
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: var(--color-muted); margin-bottom: 16px;">
            ${matches.length} Perfume${matches.length > 1 ? 's' : ''} Found
          </div>
          <div class="product-grid" style="grid-template-columns: repeat(3, 1fr);">
            ${matches.map(p => renderProductCard(p, { showAddToCart: false })).join("")}
          </div>
        `;
      }
    });
  }

  document.addEventListener("click", (e) => {
    const quickTag = e.target.closest(".search-quick-tag");
    if (quickTag && searchInput) {
      const tag = quickTag.getAttribute("data-tag");
      searchInput.value = tag;
      searchInput.dispatchEvent(new Event("input"));
    }
  });
}
