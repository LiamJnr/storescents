import { brandConfig } from "../../client-config/brand.js";
import { uiStore } from "../state/ui.js";

export function renderMenuDrawer() {
  return `
    <div class="drawer-backdrop" id="menu-drawer-backdrop"></div>
    <div class="drawer menu-drawer" id="menu-drawer" role="dialog" aria-modal="true" aria-label="Main Navigation">
      <div class="drawer-header">
        <h3 class="drawer-title">${brandConfig.name}</h3>
        <button type="button" class="drawer-close-btn" id="btn-close-menu" aria-label="Close Menu">
          ✕
        </button>
      </div>

      <div class="drawer-body">
        <nav style="display: flex; flex-direction: column; gap: 20px; font-size: 16px; font-weight: 500;">
          <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--color-muted); margin-bottom: -8px;">Fragrance Collections</div>
          <a href="/shop" class="menu-link" data-action="close-menu">All Perfumes</a>
          <a href="/shop?category=women" class="menu-link" data-action="close-menu">For Women</a>
          <a href="/shop?category=men" class="menu-link" data-action="close-menu">For Men</a>
          <a href="/shop?category=unisex" class="menu-link" data-action="close-menu">Unisex Collection</a>
          
          <hr style="border: 0; border-top: 1px solid var(--color-border); margin: 8px 0;">
          
          <div style="font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--color-muted); margin-bottom: -8px;">Client Concierge</div>
          <a href="/wishlist" class="menu-link" data-action="close-menu">Wishlist</a>
          <a href="/about" class="menu-link" data-action="close-menu">About Our Atelier</a>
          <a href="/policies/delivery" class="menu-link" data-action="close-menu">Ghana Delivery & Pre-Orders</a>
          <a href="/faq" class="menu-link" data-action="close-menu">FAQ</a>
          <a href="/contact" class="menu-link" data-action="close-menu">Contact Concierge</a>
        </nav>
      </div>

      <div class="drawer-footer" style="font-size: 12px; color: var(--color-secondary);">
        <div style="margin-bottom: 8px;"><strong>Kumasi Atelier & Dispatch</strong></div>
        <div>WhatsApp: <a href="${brandConfig.social.whatsapp}" target="_blank" rel="noopener" style="color:var(--color-primary); font-weight:600;">${brandConfig.contact.phone}</a></div>
      </div>
    </div>
  `;
}

export function initMenuDrawer() {
  const backdrop = document.getElementById("menu-drawer-backdrop");
  const drawer = document.getElementById("menu-drawer");
  const closeBtn = document.getElementById("btn-close-menu");

  const syncState = (state) => {
    if (!backdrop || !drawer) return;
    if (state.isMenuOpen) {
      backdrop.classList.add("active");
      drawer.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      backdrop.classList.remove("active");
      drawer.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  uiStore.subscribe(syncState);

  if (backdrop) backdrop.addEventListener("click", () => uiStore.closeMenu());
  if (closeBtn) closeBtn.addEventListener("click", () => uiStore.closeMenu());

  document.querySelectorAll("[data-action='close-menu']").forEach(el => {
    el.addEventListener("click", () => uiStore.closeMenu());
  });
}
