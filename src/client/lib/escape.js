/**
 * Safely escape HTML string to prevent XSS
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitize text input values
 * @param {string} str 
 * @returns {string}
 */
export function sanitizeText(str) {
  if (!str) return "";
  return String(str).trim();
}
