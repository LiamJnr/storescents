import { cartStore } from "../state/cart.js";
import { uiStore } from "../state/ui.js";
import { formatMoney } from "../lib/formatters.js";
import { escapeHtml } from "../lib/escape.js";
import { deliveryConfig } from "../../client-config/delivery.js";

export function renderCartDrawerInner() {
  const summary = cartStore.getSummary();
  const thresholdMinor = deliveryConfig.freeDeliveryThresholdMinor;
  const remainingForFreeDeliveryMinor = Math.max(0, thresholdMinor - summary.subtotalMinor);
  const progressPercent = Math.min(100, Math.round((summary.subtotalMinor / thresholdMinor) * 100));

  return `
    <div class="drawer-header cart-drawer-header">
      <div class="drawer-header-top">
        <h3 class="drawer-title">Shopping Bag (${summary.itemCount})</h3>
        <button type="button" class="drawer-close-btn" id="btn-close-cart" aria-label="Close Bag">
          ✕
        </button>
      </div>

      <!-- Free Shipping Meter in Header -->
      <div class="shipping-progress-bar-wrap">
        <div class="shipping-progress-text">
          ${remainingForFreeDeliveryMinor === 0 ? `
            <strong style="color: var(--color-success);">✨ You've unlocked Complimentary Nationwide Delivery!</strong>
          ` : `
            Add <strong>${formatMoney(remainingForFreeDeliveryMinor)}</strong> more for <strong>Free Delivery across Ghana</strong>
          `}
        </div>
        <div class="shipping-progress-bar">
          <div class="shipping-progress-fill" style="width: ${progressPercent}%;"></div>
        </div>
      </div>
    </div>

    <div class="drawer-body">
      <!-- Cart Items -->
      <div class="cart-items-list" id="cart-items-list">
        ${summary.items.length === 0 ? `
          <div style="text-align: center; padding: 48px 16px; color: var(--color-muted);">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" style="margin: 0 auto 16px; display: block; opacity: 0.5;">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <p style="font-size: 14px; font-weight: 500; color: var(--color-primary); margin-bottom: 6px;">Your shopping bag is empty</p>
            <p style="font-size: 12px; margin-bottom: 24px;">Discover our artisanal collection of signature scents.</p>
            <a href="/shop" class="btn btn-secondary btn-block" data-action="close-cart-and-shop">Explore Perfumes</a>
          </div>
        ` : summary.items.map(item => `
          <div class="cart-item" data-product-id="${escapeHtml(item.productId)}" data-size-id="${escapeHtml(item.sizeId)}">
            <div class="cart-item-img-box">
              <img
                src="${escapeHtml(item.image)}"
                alt="${escapeHtml(item.name)}"
                style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;"
                loading="lazy"
              >
            </div>
            <div class="cart-item-info">
              <div class="cart-item-title-row">
                <h4 class="cart-item-name" title="${escapeHtml(item.name)}">${escapeHtml(item.name)}</h4>
                <button type="button" class="cart-item-remove" data-action="remove-item" data-product-id="${escapeHtml(item.productId)}" data-size-id="${escapeHtml(item.sizeId)}" title="Remove item" aria-label="Remove item">✕</button>
              </div>
              <div class="cart-item-meta-row">
                <span class="cart-item-size">${escapeHtml(item.sizeLabel)}${item.isPreorder ? ' <span style="color:#b78103; font-weight:600;">(Pre-order)</span>' : ''}</span>
                <span class="cart-item-unit-price">${formatMoney(item.unitPriceMinor)}</span>
              </div>
              <div class="cart-item-actions-row">
                <div class="qty-control">
                  <button type="button" class="qty-btn" data-action="qty-decrease" data-product-id="${escapeHtml(item.productId)}" data-size-id="${escapeHtml(item.sizeId)}" aria-label="Decrease quantity">−</button>
                  <span class="qty-display">${item.quantity}</span>
                  <button type="button" class="qty-btn" data-action="qty-increase" data-product-id="${escapeHtml(item.productId)}" data-size-id="${escapeHtml(item.sizeId)}" aria-label="Increase quantity">+</button>
                </div>
                <div class="cart-item-total-price">${formatMoney(item.lineTotalMinor || item.unitPriceMinor * item.quantity)}</div>
              </div>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    ${summary.items.length > 0 ? `
      <div class="drawer-footer cart-drawer-footer">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px;">
          <span style="font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; color: var(--color-secondary);">Subtotal</span>
          <span style="font-size: 16px; font-weight: 700; color: var(--color-primary);">${formatMoney(summary.subtotalMinor)}</span>
        </div>
        <div style="font-size: 11px; color: var(--color-muted); margin-bottom: 10px;">
          Shipping and delivery calculated during checkout.
        </div>
        <a href="/checkout" class="btn btn-primary btn-block" id="btn-checkout-drawer" style="text-align: center; padding: 11px 20px;">
          Proceed to Checkout
        </a>
      </div>
    ` : ''}
  `;
}

export function renderCartDrawer() {
  return `
    <div class="drawer-backdrop" id="cart-drawer-backdrop"></div>
    <div class="drawer cart-drawer" id="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
      ${renderCartDrawerInner()}
    </div>
  `;
}

// Module-level flag — event listeners are registered only once
let _listenersAttached = false;

export function initCartDrawer() {
  const backdrop = document.getElementById("cart-drawer-backdrop");
  const drawer = document.getElementById("cart-drawer");

  // ── Sync open/close CSS classes whenever uiStore changes ──────────────────
  uiStore.subscribe((state) => {
    const bd = document.getElementById("cart-drawer-backdrop");
    const dr = document.getElementById("cart-drawer");
    if (!bd || !dr) return;
    if (state.isCartOpen) {
      bd.classList.add("active");
      dr.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      bd.classList.remove("active");
      dr.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // ── Re-render drawer contents whenever cart items change ─────────────────
  cartStore.subscribe(() => {
    refreshCartDrawerDom();
  });

  if (_listenersAttached) return; // don't add duplicate listeners
  _listenersAttached = true;

  // ── Backdrop / close button (delegated, only once) ────────────────────────
  document.addEventListener("click", (e) => {
    if (e.target.id === "cart-drawer-backdrop") {
      uiStore.closeCart();
      return;
    }
    if (e.target.id === "btn-close-cart" || e.target.closest("#btn-close-cart")) {
      uiStore.closeCart();
      return;
    }

    // ── Cart item actions ────────────────────────────────────────────────────
    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.getAttribute("data-action");
    const productId = actionEl.getAttribute("data-product-id");
    const sizeId = actionEl.getAttribute("data-size-id");

    if (action === "close-cart-and-shop") {
      uiStore.closeCart();
    } else if (action === "qty-increase") {
      const summary = cartStore.getSummary();
      const current = summary.items.find(i => i.productId === productId && i.sizeId === sizeId);
      if (current) cartStore.updateQuantity(productId, sizeId, current.quantity + 1);
    } else if (action === "qty-decrease") {
      const summary = cartStore.getSummary();
      const current = summary.items.find(i => i.productId === productId && i.sizeId === sizeId);
      if (current) cartStore.updateQuantity(productId, sizeId, current.quantity - 1);
    } else if (action === "remove-item") {
      cartStore.removeItem(productId, sizeId);
    }
  });
}

export function refreshCartDrawerDom() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) {
    drawer.innerHTML = renderCartDrawerInner();
    return;
  }

  const container = document.getElementById("cart-drawer-root");
  if (container) {
    container.innerHTML = renderCartDrawer();
  }
}
