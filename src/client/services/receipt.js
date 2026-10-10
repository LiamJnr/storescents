import { formatMoney, formatDate } from "../lib/formatters.js";
import { brandConfig } from "../../client-config/brand.js";
import { escapeHtml } from "../lib/escape.js";

/**
 * Generate a styled receipt HTML string
 * @param {object} order 
 * @returns {string}
 */
export function generateReceiptHtml(order) {
  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
        <strong>${escapeHtml(item.name)}</strong> (${escapeHtml(item.sizeLabel)})
        ${item.isPreorder ? '<br><span style="color:#b37d00; font-size:12px; font-weight:600;">[PRE-ORDER ITEM]</span>' : ''}
      </td>
      <td style="padding: 10px 0; text-align: center; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #eee;">${formatMoney(item.lineTotalMinor)}</td>
    </tr>
  `).join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${escapeHtml(order.orderId)} - ${brandConfig.name}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 0;
      padding: 40px;
      color: #111;
      background: #fafafa;
    }
    .receipt-card {
      max-width: 600px;
      margin: 0 auto;
      background: #fff;
      padding: 32px;
      border: 1px solid #e5e5e5;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      border-radius: 4px;
    }
    .header {
      text-align: center;
      border-bottom: 2px solid #111;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .logo {
      font-size: 24px;
      letter-spacing: 4px;
      font-weight: 700;
      text-transform: uppercase;
      margin: 0;
    }
    .tagline {
      font-size: 11px;
      letter-spacing: 1px;
      color: #777;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      font-size: 13px;
      margin-bottom: 24px;
    }
    .meta-label {
      color: #888;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-value {
      font-weight: 600;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
      margin-bottom: 24px;
    }
    th {
      text-align: left;
      padding-bottom: 8px;
      border-bottom: 1px solid #111;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 14px;
    }
    .totals-row.grand-total {
      font-size: 18px;
      font-weight: 700;
      border-top: 2px solid #111;
      padding-top: 12px;
      margin-top: 8px;
    }
    .badge-paid {
      display: inline-block;
      padding: 4px 12px;
      background: #e8f5e9;
      color: #2e7d32;
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 1px;
      text-transform: uppercase;
      border-radius: 2px;
      margin-bottom: 16px;
    }
    .footer-note {
      text-align: center;
      font-size: 12px;
      color: #888;
      border-top: 1px dashed #ddd;
      padding-top: 20px;
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="header">
      <h1 class="logo">${brandConfig.name}</h1>
      <div class="tagline">${brandConfig.tagline}</div>
      <div style="font-size: 12px; color: #555; margin-top: 6px;">${brandConfig.location}</div>
    </div>

    <div style="text-align: center;">
      <span class="badge-paid">✓ Paid & Confirmed</span>
    </div>

    <div class="meta-grid">
      <div>
        <div class="meta-label">Order Number</div>
        <div class="meta-value">${escapeHtml(order.orderId)}</div>
      </div>
      <div>
        <div class="meta-label">Order Date</div>
        <div class="meta-value">${formatDate(order.createdAt)}</div>
      </div>
      <div>
        <div class="meta-label">Customer</div>
        <div class="meta-value">${escapeHtml(order.customer?.fullName)}<br>${escapeHtml(order.customer?.phone)}</div>
      </div>
      <div>
        <div class="meta-label">Delivery Zone</div>
        <div class="meta-value">${escapeHtml(order.delivery?.zoneName)}<br>${escapeHtml(order.delivery?.address)}</div>
      </div>
      <div>
        <div class="meta-label">Paystack Reference</div>
        <div class="meta-value">${escapeHtml(order.paystack?.reference || "N/A")}</div>
      </div>
      <div>
        <div class="meta-label">Payment Channel</div>
        <div class="meta-value">${escapeHtml(order.paystack?.channel || "Mobile Money / Card")}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Fragrance Item</th>
          <th style="text-align: center;">Qty</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div style="max-width: 300px; margin-left: auto;">
      <div class="totals-row">
        <span>Merchandise Subtotal:</span>
        <span>${formatMoney(order.financials?.subtotalMinor)}</span>
      </div>
      ${order.financials?.discountMinor > 0 ? `
      <div class="totals-row" style="color: #2e7d32;">
        <span>Discount (${escapeHtml(order.financials.promoCode || 'PROMO')}):</span>
        <span>-${formatMoney(order.financials.discountMinor)}</span>
      </div>` : ''}
      <div class="totals-row">
        <span>Delivery Fee:</span>
        <span>${order.financials?.deliveryFeeMinor === 0 ? 'FREE' : formatMoney(order.financials?.deliveryFeeMinor)}</span>
      </div>
      <div class="totals-row grand-total">
        <span>Total Paid (GHS):</span>
        <span>${formatMoney(order.financials?.totalMinor)}</span>
      </div>
    </div>

    ${order.giftNote ? `
    <div style="margin-top: 24px; padding: 12px; background: #fdfaf6; border: 1px dashed #d4af37; border-radius: 4px; font-size: 13px;">
      <strong>Complimentary Gift Note:</strong>
      <p style="margin: 4px 0 0 0; font-style: italic;">"${escapeHtml(order.giftNote)}"</p>
    </div>` : ''}

    <div class="footer-note">
      <p>Thank you for choosing ${brandConfig.name}. Your fragrance package is being carefully prepared for dispatch.</p>
      <p>Concierge WhatsApp: ${brandConfig.contact.phone} | ${brandConfig.contact.email}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Trigger download of the receipt as an HTML/Printable Blob
 * @param {object} order 
 */
export function downloadReceiptBlob(order) {
  const htmlContent = generateReceiptHtml(order);
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt_${order.orderId}.html`;
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}
