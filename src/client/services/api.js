import { calculateOrderSummary } from "../../shared/commerce/pricing.js";
import { STORAGE_KEYS, ORDER_STATUS } from "../../shared/constants.js";

/**
 * Service to handle checkout & order endpoints.
 * Operates seamlessly with mock fallback now, and connects to Cloudflare Pages Functions (`/api/*`) later.
 */
class ApiService {
  /**
   * Submit an order for checkout
   * @param {object} orderPayload 
   * @returns {Promise<object>}
   */
  async submitCheckout(orderPayload) {
    // In production with Cloudflare Functions, this calls:
    // const res = await fetch('/api/checkout', { method: 'POST', body: JSON.stringify(orderPayload) });
    // return res.json();

    // Frontend Mock implementation conforming 100% to PROJECT_GUIDE API contract:
    return new Promise((resolve) => {
      setTimeout(() => {
        const orderSummary = calculateOrderSummary({
          items: orderPayload.items || [],
          zoneId: orderPayload.delivery?.zoneId,
          promoCode: orderPayload.promoCode || ""
        });

        const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
        const receiptCredential = "rcpt_" + Math.random().toString(36).substring(2) + Date.now();

        const orderRecord = {
          orderId,
          status: ORDER_STATUS.PAID,
          createdAt: new Date().toISOString(),
          customer: {
            fullName: orderPayload.customer?.fullName || "Valued Customer",
            email: orderPayload.customer?.email || "",
            phone: orderPayload.customer?.phone || ""
          },
          delivery: {
            zoneId: orderPayload.delivery?.zoneId,
            zoneName: orderSummary.deliveryZone?.name || "Ghana Regional Delivery",
            address: orderPayload.delivery?.address || "",
            city: orderPayload.delivery?.city || "Kumasi",
            region: orderPayload.delivery?.region || "Ashanti Region",
            notes: orderPayload.delivery?.notes || ""
          },
          giftNote: orderPayload.giftNote || "",
          financials: {
            subtotalMinor: orderSummary.subtotalMinor,
            deliveryFeeMinor: orderSummary.deliveryFeeMinor,
            discountMinor: orderSummary.discountMinor,
            totalMinor: orderSummary.totalMinor,
            currency: "GHS",
            promoCode: orderSummary.promoCode
          },
          items: orderSummary.items,
          paystack: {
            reference: "PSTK_" + Math.random().toString(36).substring(2, 10).toUpperCase(),
            channel: "Mobile Money / Card",
            paidAt: new Date().toISOString()
          },
          receiptCredential
        };

        // Cache order record in sessionStorage for local preview & receipt rendering
        try {
          sessionStorage.setItem(`${STORAGE_KEYS.RECEIPT}_${orderId}`, JSON.stringify(orderRecord));
        } catch (e) {
          console.error("Failed to store receipt in session", e);
        }

        resolve({
          success: true,
          orderId,
          authorizationUrl: null, // When live, Paystack popup or redirect URL
          accessCode: "mock_access_code",
          receiptCredential,
          order: orderRecord
        });
      }, 700);
    });
  }

  /**
   * Fetch order status and receipt details
   * @param {string} orderId 
   * @returns {Promise<object|null>}
   */
  async getOrder(orderId) {
    try {
      const data = sessionStorage.getItem(`${STORAGE_KEYS.RECEIPT}_${orderId}`);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Failed to retrieve order session", e);
    }
    return null;
  }
}

export const apiService = new ApiService();
