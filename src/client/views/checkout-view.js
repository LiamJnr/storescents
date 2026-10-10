import { cartStore } from "../state/cart.js";
import { deliveryConfig } from "../../client-config/delivery.js";
import { calculateOrderSummary } from "../../shared/commerce/pricing.js";
import { formatMoney } from "../lib/formatters.js";
import { escapeHtml } from "../lib/escape.js";
import { apiService } from "../services/api.js";
import { showToast } from "../components/toast.js";

export function renderCheckoutView() {
  const summary = cartStore.getSummary();

  if (summary.items.length === 0) {
    return `
      <div class="container" style="padding: 80px 16px; text-align: center;">
        <h1 style="font-size: 24px; font-weight: 500; margin-bottom: 12px;">Your Bag is Empty</h1>
        <p style="color: var(--color-muted); margin-bottom: 24px;">Please add some fragrances to your bag before proceeding to checkout.</p>
        <a href="/shop" class="btn btn-primary">Browse Scents</a>
      </div>
    `;
  }

  const defaultZone = deliveryConfig.zones[0];
  const orderSummary = calculateOrderSummary({
    items: cartStore.items,
    zoneId: defaultZone.id,
    promoCode: ""
  });

  return `
    <div class="checkout-page-view">
      <div class="container">
        
        <div style="margin-top: var(--space-xl); margin-bottom: var(--space-lg);">
          <h1 style="font-size: 26px; font-family: var(--font-serif); font-weight: 500;">Secure Checkout</h1>
          <p style="font-size: 12px; letter-spacing: 1px; text-transform: uppercase; color: var(--color-muted); margin-top: 4px;">
            Ghana Nationwide Delivery • Secured by Paystack
          </p>
        </div>

        <form id="checkout-form" class="checkout-grid">
          <!-- Left Column: Customer & Delivery Details -->
          <div class="checkout-forms-col">
            
            <!-- 1. Customer Contact -->
            <div class="checkout-card">
              <h3 class="checkout-card-title">1. Client Contact Details</h3>
              <div class="form-group">
                <label class="form-label" for="cust-fullname">Full Name *</label>
                <input type="text" id="cust-fullname" name="fullName" class="form-input" placeholder="e.g. Ama Osei Mensah" required>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                <div class="form-group">
                  <label class="form-label" for="cust-phone">Phone Number (For Courier) *</label>
                  <input type="tel" id="cust-phone" name="phone" class="form-input" placeholder="050 123 4567" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="cust-email">Email Address (For Paystack Receipt) *</label>
                  <input type="email" id="cust-email" name="email" class="form-input" placeholder="ama@example.com" required>
                </div>
              </div>
            </div>

            <!-- 2. Delivery Destination in Ghana -->
            <div class="checkout-card">
              <h3 class="checkout-card-title">2. Select Ghana Delivery Region</h3>
              <div class="delivery-zones-group" id="delivery-zones-group">
                ${deliveryConfig.zones.map((zone, idx) => `
                  <label class="zone-option-label ${idx === 0 ? 'active' : ''}">
                    <input type="radio" name="deliveryZone" value="${escapeHtml(zone.id)}" ${idx === 0 ? 'checked' : ''} style="margin-top: 3px;">
                    <div style="flex: 1;">
                      <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 13px;">
                        <span>${escapeHtml(zone.name)}</span>
                        <span>${zone.feeMinor === 0 ? 'FREE' : formatMoney(zone.feeMinor)}</span>
                      </div>
                      <div style="font-size: 12px; color: var(--color-secondary); margin-top: 2px;">
                        ${escapeHtml(zone.description)} • <em>${escapeHtml(zone.estimatedTransit)}</em>
                      </div>
                    </div>
                  </label>
                `).join("")}
              </div>

              <div class="form-group" style="margin-top: var(--space-lg);">
                <label class="form-label" for="cust-address">Delivery Address / Landmark / House Number *</label>
                <textarea id="cust-address" name="address" class="form-textarea" rows="2" placeholder="e.g. House No. 14, Ahodwo Roundabout, near Total Station, Kumasi" required></textarea>
              </div>

              <div class="form-group">
                <label class="form-label" for="cust-notes">Courier Special Instructions (Optional)</label>
                <input type="text" id="cust-notes" name="notes" class="form-input" placeholder="e.g. Call before arrival, leave at gate">
              </div>
            </div>

            <!-- 3. Complimentary Gift Presentation -->
            <div class="checkout-card">
              <h3 class="checkout-card-title">3. Personalized Gift Note (Complimentary)</h3>
              <div class="form-group">
                <label class="form-label" for="cust-giftnote">Handwritten Note Message (Optional)</label>
                <textarea id="cust-giftnote" name="giftNote" class="form-textarea" rows="2" placeholder="Enter a personal message to be handwritten inside the gift box..."></textarea>
              </div>
            </div>

          </div>

          <!-- Right Column: Order Summary & Payment -->
          <div class="checkout-sidebar-col">
            <div class="order-summary-sidebar">
              <h3 style="font-size: 14px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--color-border);">
                Order Summary (${orderSummary.itemCount})
              </h3>

              <div class="checkout-items-preview" style="max-height: 280px; overflow-y: auto; margin-bottom: 16px;">
                ${orderSummary.items.map(item => `
                  <div style="display: flex; align-items: center; gap: 10px; font-size: 13px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed var(--color-border-subtle);">
                    <div style="width: 52px; height: 64px; min-width: 52px; border-radius: 4px; overflow: hidden; background: var(--color-bg-studio);">
                      <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;" loading="lazy">
                    </div>
                    <div style="flex: 1; min-width: 0;">
                      <strong style="display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(item.name)}</strong>
                      <span style="color: var(--color-muted); font-size: 11px;">${escapeHtml(item.sizeLabel)} × ${item.quantity}${item.isPreorder ? ' <span style="color:#b78103; font-weight:600;">[Pre-Order]</span>' : ''}</span>
                    </div>
                    <span style="white-space: nowrap; font-weight: 600;">${formatMoney(item.lineTotalMinor)}</span>
                  </div>
                `).join("")}
              </div>

              <!-- Promo Code Box -->
              <div style="margin-bottom: 16px; padding: 12px; background: #ffffff; border: 1px solid var(--color-border); border-radius: var(--radius-xs);">
                <label class="form-label" style="font-size: 11px;">Have a Promo Code?</label>
                <div style="display: flex; gap: 6px; margin-top: 4px;">
                  <input type="text" id="input-promo-code" class="form-input" placeholder="e.g. WELCOME10" style="text-transform: uppercase; padding: 8px;">
                  <button type="button" class="btn btn-secondary" id="btn-apply-promo" style="padding: 8px 14px; font-size: 11px;">Apply</button>
                </div>
                <div id="promo-message" style="font-size: 11px; margin-top: 6px;"></div>
              </div>

              <!-- Calculation Breakdown -->
              <div style="font-size: 13px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--color-secondary);">Merchandise Subtotal:</span>
                  <span id="summary-subtotal">${formatMoney(orderSummary.subtotalMinor)}</span>
                </div>
                
                <div id="summary-discount-row" style="display: none; justify-content: space-between; color: var(--color-success);">
                  <span>Promo Discount:</span>
                  <span id="summary-discount">-GH₵ 0.00</span>
                </div>

                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--color-secondary);">Estimated Delivery:</span>
                  <span id="summary-delivery">${orderSummary.deliveryFeeMinor === 0 ? 'FREE' : formatMoney(orderSummary.deliveryFeeMinor)}</span>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: 700; border-top: 1px solid var(--color-primary); padding-top: 12px; margin-top: 4px;">
                  <span>Total Amount (GHS):</span>
                  <span id="summary-total">${formatMoney(orderSummary.totalMinor)}</span>
                </div>
              </div>

              <!-- Submit Paystack Action -->
              <button type="submit" class="btn btn-primary btn-block btn-lg" id="btn-submit-order">
                🔒 Pay with Paystack
              </button>

              <div style="font-size: 11px; text-align: center; color: var(--color-muted); margin-top: 12px; line-height: 1.5;">
                Instant Mobile Money (MTN, Telecel, AT) & Card Verification.<br>
                Digital official receipt issued immediately upon confirmation.
              </div>
            </div>
          </div>
        </form>

      </div>
    </div>
  `;
}

export function initCheckoutView() {
  const form = document.getElementById("checkout-form");
  const zoneRadios = document.querySelectorAll("input[name='deliveryZone']");
  const promoInput = document.getElementById("input-promo-code");
  const applyPromoBtn = document.getElementById("btn-apply-promo");
  const promoMessageEl = document.getElementById("promo-message");
  
  const subtotalEl = document.getElementById("summary-subtotal");
  const discountRowEl = document.getElementById("summary-discount-row");
  const discountEl = document.getElementById("summary-discount");
  const deliveryEl = document.getElementById("summary-delivery");
  const totalEl = document.getElementById("summary-total");
  const submitBtn = document.getElementById("btn-submit-order");

  let currentPromoCode = "";

  function getSelectedZoneId() {
    const checked = document.querySelector("input[name='deliveryZone']:checked");
    return checked ? checked.value : deliveryConfig.zones[0].id;
  }

  function recalculate() {
    const zoneId = getSelectedZoneId();
    const orderSummary = calculateOrderSummary({
      items: cartStore.items,
      zoneId,
      promoCode: currentPromoCode
    });

    if (subtotalEl) subtotalEl.textContent = formatMoney(orderSummary.subtotalMinor);
    
    if (orderSummary.discountMinor > 0) {
      if (discountRowEl) discountRowEl.style.display = "flex";
      if (discountEl) discountEl.textContent = `-${formatMoney(orderSummary.discountMinor)}`;
    } else {
      if (discountRowEl) discountRowEl.style.display = "none";
    }

    if (deliveryEl) {
      deliveryEl.textContent = orderSummary.deliveryFeeMinor === 0 ? "FREE" : formatMoney(orderSummary.deliveryFeeMinor);
    }

    if (totalEl) totalEl.textContent = formatMoney(orderSummary.totalMinor);
  }

  zoneRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      document.querySelectorAll(".zone-option-label").forEach(l => l.classList.remove("active"));
      radio.closest(".zone-option-label")?.classList.add("active");
      recalculate();
    });
  });

  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener("click", () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) return;

      const summary = calculateOrderSummary({
        items: cartStore.items,
        zoneId: getSelectedZoneId(),
        promoCode: code
      });

      if (summary.discountMinor > 0) {
        currentPromoCode = code;
        promoMessageEl.style.color = "var(--color-success)";
        promoMessageEl.textContent = `✓ ${summary.promoLabel} applied successfully!`;
        recalculate();
      } else {
        promoMessageEl.style.color = "var(--color-danger)";
        promoMessageEl.textContent = `Invalid promo code or minimum order not met.`;
      }
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Processing via Paystack...";
      }

      const formData = new FormData(form);
      const payload = {
        items: cartStore.items,
        promoCode: currentPromoCode,
        customer: {
          fullName: formData.get("fullName"),
          phone: formData.get("phone"),
          email: formData.get("email")
        },
        delivery: {
          zoneId: getSelectedZoneId(),
          address: formData.get("address"),
          notes: formData.get("notes")
        },
        giftNote: formData.get("giftNote")
      };

      try {
        const response = await apiService.submitCheckout(payload);
        if (response.success) {
          cartStore.clear();
          showToast("Payment confirmed! Redirecting to your receipt...");
          window.location.href = `/order-confirmed/${response.orderId}`;
        }
      } catch (err) {
        console.error("Checkout failed", err);
        showToast("Order submission error. Please try again.");
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = "🔒 Pay with Paystack";
        }
      }
    });
  }
}
