import { deliveryConfig } from "../../client-config/delivery.js";

/**
 * Calculate delivery fee based on selected zone and subtotal
 * @param {string} zoneId 
 * @param {number} subtotalMinor 
 * @returns {{ feeMinor: number, isFree: boolean, zone: object|null }}
 */
export function calculateDeliveryFee(zoneId, subtotalMinor = 0) {
  const defaultZone = deliveryConfig.zones[0];
  const zone = deliveryConfig.zones.find(z => z.id === zoneId) || defaultZone;

  if (zone.id === "kumasi-pickup" || zone.feeMinor === 0) {
    return { feeMinor: 0, isFree: true, zone };
  }

  if (subtotalMinor >= deliveryConfig.freeDeliveryThresholdMinor) {
    return { feeMinor: 0, isFree: true, zone };
  }

  return {
    feeMinor: zone.feeMinor,
    isFree: false,
    zone
  };
}
