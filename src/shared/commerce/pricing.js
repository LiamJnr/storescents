import { getProductById, getProductSizeOption } from "../catalog/schema.js";
import { promotionsConfig } from "../../client-config/promotions.js";
import { calculateDeliveryFee } from "./delivery.js";

/**
 * Calculate cart merchandise subtotal and re-verify against trusted catalog
 * @param {Array<{productId: string, sizeId: string, quantity: number}>} items 
 * @returns {{ items: Array, subtotalMinor: number, itemCount: number }}
 */
export function calculateCartTotals(items = []) {
  let subtotalMinor = 0;
  let itemCount = 0;

  const resolvedItems = items.map(item => {
    const product = getProductById(item.productId);
    if (!product) {
      return null;
    }
    const size = getProductSizeOption(product, item.sizeId);
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    const lineTotalMinor = size.priceMinor * quantity;

    subtotalMinor += lineTotalMinor;
    itemCount += quantity;

    return {
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      genderLabel: product.genderLabel,
      image: product.images.primary,
      sizeId: size.id,
      sizeLabel: size.label,
      unitPriceMinor: size.priceMinor,
      quantity,
      lineTotalMinor,
      isPreorder: product.isPreorder
    };
  }).filter(Boolean);

  return {
    items: resolvedItems,
    subtotalMinor,
    itemCount
  };
}

/**
 * Validate and calculate promo code discount
 * @param {string} code 
 * @param {number} subtotalMinor 
 * @returns {{ valid: boolean, discountMinor: number, promo: object|null, message: string }}
 */
export function applyPromoCode(code, subtotalMinor) {
  if (!code || !code.trim()) {
    return { valid: false, discountMinor: 0, promo: null, message: "" };
  }

  const cleanCode = code.trim().toUpperCase();
  const promo = promotionsConfig.find(p => p.code.toUpperCase() === cleanCode);

  if (!promo) {
    return { valid: false, discountMinor: 0, promo: null, message: "Invalid promo code" };
  }

  if (subtotalMinor < promo.minOrderMinor) {
    return { 
      valid: false, 
      discountMinor: 0, 
      promo: null, 
      message: `Promo requires minimum subtotal of GH₵ ${(promo.minOrderMinor / 100).toFixed(2)}` 
    };
  }

  let discountMinor = 0;
  if (promo.type === "percentage") {
    discountMinor = Math.round((subtotalMinor * promo.value) / 100);
  } else if (promo.type === "fixed") {
    discountMinor = promo.valueMinor;
  }

  if (promo.maxDiscountMinor && discountMinor > promo.maxDiscountMinor) {
    discountMinor = promo.maxDiscountMinor;
  }

  return {
    valid: true,
    discountMinor,
    promo,
    message: `${promo.label} applied`
  };
}

/**
 * Calculate full order financial breakdown
 * @param {object} params
 * @returns {object}
 */
export function calculateOrderSummary({ items = [], zoneId = null, promoCode = "" } = {}) {
  const cartTotals = calculateCartTotals(items);
  const delivery = calculateDeliveryFee(zoneId, cartTotals.subtotalMinor);
  const promo = applyPromoCode(promoCode, cartTotals.subtotalMinor);

  const discountedSubtotalMinor = Math.max(0, cartTotals.subtotalMinor - promo.discountMinor);
  const totalMinor = discountedSubtotalMinor + delivery.feeMinor;

  return {
    items: cartTotals.items,
    itemCount: cartTotals.itemCount,
    subtotalMinor: cartTotals.subtotalMinor,
    deliveryFeeMinor: delivery.feeMinor,
    isFreeDelivery: delivery.isFree,
    deliveryZone: delivery.zone,
    discountMinor: promo.discountMinor,
    promoCode: promo.valid ? promo.promo.code : null,
    promoLabel: promo.valid ? promo.promo.label : null,
    totalMinor,
    currency: "GHS"
  };
}
