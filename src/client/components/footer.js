import { brandConfig } from "../../client-config/brand.js";
import { escapeHtml } from "../lib/escape.js";

export function renderFooter() {
  const currentYear = new Date().getFullYear();

  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Info -->
          <div class="footer-brand">
            <h3>${brandConfig.name}</h3>
            <p>${brandConfig.description}</p>
            <div style="font-size: 13px; color: #b5b5b8; line-height: 1.6;">
              <strong>Concierge Hub:</strong><br>
              ${brandConfig.location}<br>
              WhatsApp: <a href="${brandConfig.social.whatsapp}" target="_blank" rel="noopener" style="color:#ffffff; text-decoration:underline;">${brandConfig.contact.phone}</a>
            </div>
          </div>

          <!-- Explore -->
          <div class="footer-col">
            <h4>Collections</h4>
            <ul class="footer-links">
              <li><a href="/shop">All Perfumes</a></li>
              <li><a href="/shop?category=women">For Women</a></li>
              <li><a href="/shop?category=men">For Men</a></li>
              <li><a href="/shop?category=unisex">Unisex Fragrances</a></li>
              <li><a href="/wishlist">Saved Scents</a></li>
            </ul>
          </div>

          <!-- Customer Care -->
          <div class="footer-col">
            <h4>Client Care</h4>
            <ul class="footer-links">
              <li><a href="/policies/delivery">Ghana Delivery Zones</a></li>
              <li><a href="/policies/delivery#returns">Returns & Exchanges</a></li>
              <li><a href="/faq">Pre-Order FAQ</a></li>
              <li><a href="/contact">Concierge Support</a></li>
            </ul>
          </div>

          <!-- Legal & Trust -->
          <div class="footer-col">
            <h4>Legal & Security</h4>
            <ul class="footer-links">
              <li><a href="/policies/privacy">Privacy Policy</a></li>
              <li><a href="/policies/terms">Terms of Service</a></li>
            </ul>
            <div style="margin-top: 20px; font-size: 11px; color: #88888e; line-height: 1.5; border-top: 1px solid #222226; padding-top: 12px;">
              <span style="color: #c8a86b; font-weight: 600;">Secured by Paystack</span><br>
              MTN Mobile Money • Telecel Cash • AT Money • Visa • Mastercard
            </div>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div>
            © ${currentYear} ${escapeHtml(brandConfig.name)}. All rights reserved. (Ghana Delivery Only).
          </div>
          <div style="display: flex; gap: 16px;">
            <a href="/policies/privacy">Privacy</a>
            <a href="/policies/terms">Terms</a>
            <a href="/policies/delivery">Delivery & Returns</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
