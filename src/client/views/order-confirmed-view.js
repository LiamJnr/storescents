import { apiService } from "../services/api.js";
import { formatMoney, formatDate } from "../lib/formatters.js";
import { escapeHtml } from "../lib/escape.js";
import { downloadReceiptBlob } from "../services/receipt.js";
import { brandConfig } from "../../client-config/brand.js";

export function renderOrderConfirmedView({ params = {} } = {}) {
  const orderId = params.orderId;

  return `
    <div class="confirmation-page-view">
      <div class="container">
        
        <div class="confirmation-card" id="confirmation-card-content">
          <div class="confirmation-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--color-success); font-weight: 700; margin-bottom: 4px;">
            Payment Authorized & Confirmed
          </div>

          <h1 style="font-size: 26px; font-family: var(--font-serif); margin-bottom: 8px;">
            Thank You For Your Order
          </h1>

          <p style="font-size: 13px; color: var(--color-secondary); margin-bottom: 24px;">
            Order Reference: <strong style="color: var(--color-primary);">${escapeHtml(orderId)}</strong>
          </p>

          <div id="order-details-loading" style="padding: 24px; color: var(--color-muted); font-size: 13px;">
            Generating verified receipt slip...
          </div>

          <div id="order-details-container" style="display: none; text-align: left; background: var(--color-bg-surface); padding: 20px; border-radius: var(--radius-xs); border: 1px solid var(--color-border); margin-bottom: 24px;">
            <!-- Dynamically populated via init -->
          </div>

          <!-- Actions -->
          <div class="confirmation-actions">
            <button type="button" class="btn btn-primary btn-lg" id="btn-download-receipt-blob">
              📥 Download Official Receipt
            </button>
            <button type="button" class="btn btn-secondary btn-lg" id="btn-print-receipt">
              🖨️ Print Slip
            </button>
          </div>

          <div style="margin-top: 24px; font-size: 12px; color: var(--color-muted); line-height: 1.6;">
            A confirmation receipt has also been dispatched by Paystack to your email.<br>
            Need urgent courier updates? Message our Kumasi concierge via 
            <a href="${brandConfig.social.whatsapp}" target="_blank" rel="noopener" style="color: var(--color-primary); font-weight: 600; text-decoration: underline;">WhatsApp Support</a>.
          </div>

        </div>

      </div>
    </div>
  `;
}

export function initOrderConfirmedView({ params = {} } = {}) {
  const orderId = params.orderId;
  const loadingEl = document.getElementById("order-details-loading");
  const containerEl = document.getElementById("order-details-container");
  const downloadBtn = document.getElementById("btn-download-receipt-blob");
  const printBtn = document.getElementById("btn-print-receipt");

  let currentOrder = null;

  apiService.getOrder(orderId).then(order => {
    if (!order) {
      if (loadingEl) {
        loadingEl.innerHTML = `<p>Order details retrieved from Paystack webhook. Check your email for full receipt slip.</p>`;
      }
      return;
    }

    currentOrder = order;

    if (loadingEl) loadingEl.style.display = "none";
    if (containerEl) {
      containerEl.style.display = "block";
      containerEl.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--color-border);">
          <div>
            <span style="color: var(--color-muted); font-size: 11px; text-transform: uppercase;">Customer:</span><br>
            <strong>${escapeHtml(order.customer?.fullName)}</strong><br>
            ${escapeHtml(order.customer?.phone)}
          </div>
          <div>
            <span style="color: var(--color-muted); font-size: 11px; text-transform: uppercase;">Delivery Zone:</span><br>
            <strong>${escapeHtml(order.delivery?.zoneName)}</strong><br>
            ${escapeHtml(order.delivery?.address)}
          </div>
        </div>

        <div style="font-size: 13px; margin-bottom: 12px;">
          <strong style="text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; color: var(--color-muted);">Fragrances in Parcel:</strong>
          <ul style="list-style: none; margin-top: 6px; padding: 0;">
            ${(order.items || []).map(item => `
              <li style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span>${escapeHtml(item.name)} (${escapeHtml(item.sizeLabel)}) × ${item.quantity} ${item.isPreorder ? '<span style="color:#b78103; font-weight:600;">[Pre-Order]</span>' : ''}</span>
                <span>${formatMoney(item.lineTotalMinor)}</span>
              </li>
            `).join("")}
          </ul>
        </div>

        <div style="border-top: 1px dashed var(--color-border); padding-top: 8px; font-size: 13px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Subtotal:</span>
            <span>${formatMoney(order.financials?.subtotalMinor)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>Delivery:</span>
            <span>${order.financials?.deliveryFeeMinor === 0 ? 'FREE' : formatMoney(order.financials?.deliveryFeeMinor)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; margin-top: 6px; border-top: 1px solid var(--color-primary); padding-top: 6px;">
            <span>Total Paid (GHS):</span>
            <span>${formatMoney(order.financials?.totalMinor)}</span>
          </div>
        </div>
      `;
    }
  });

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      if (currentOrder) {
        downloadReceiptBlob(currentOrder);
      }
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }
}
