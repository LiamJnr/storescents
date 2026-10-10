import { brandConfig } from "../../client-config/brand.js";

/**
 * Format minor units into Ghana Cedis string
 * e.g., 20000 -> "GH₵ 200.00" or "₵200.00"
 * @param {number} minorUnits 
 * @param {boolean} showDecimals
 * @returns {string}
 */
export function formatMoney(minorUnits = 0, showDecimals = true) {
  const value = (minorUnits / 100).toFixed(showDecimals ? 2 : 0);
  return `${brandConfig.currency.symbol} ${Number(value).toLocaleString('en-GH', { minimumFractionDigits: showDecimals ? 2 : 0, maximumFractionDigits: 2 })}`;
}

/**
 * Format short price e.g. "GH₵ 200"
 * @param {number} minorUnits 
 * @returns {string}
 */
export function formatMoneyShort(minorUnits = 0) {
  const amount = minorUnits / 100;
  if (amount % 1 === 0) {
    return `${brandConfig.currency.symbol} ${amount}`;
  }
  return formatMoney(minorUnits, true);
}

/**
 * Format date nicely for receipts and orders
 * @param {Date|string|number} date 
 * @returns {string}
 */
export function formatDate(date) {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
