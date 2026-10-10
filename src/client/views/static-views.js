import { contentConfig } from "../../client-config/content.js";
import { brandConfig } from "../../client-config/brand.js";
import { escapeHtml } from "../lib/escape.js";

export function renderAboutView() {
  const { about } = contentConfig;
  return `
    <div class="static-page-view">
      <div class="container prose-container">
        <div class="prose-header">
          <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--color-gold); font-weight: 700; margin-bottom: 8px;">Our Heritage</div>
          <h1>${escapeHtml(about.title)}</h1>
          <p style="font-size: 14px; color: var(--color-secondary); max-width: 600px; margin: 0 auto;">${escapeHtml(about.intro)}</p>
        </div>

        <div class="prose-content">
          <section>
            <p>${escapeHtml(about.story)}</p>
          </section>

          <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-lg); margin-top: var(--space-2xl);">
            ${about.pillars.map(pillar => `
              <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border); padding: 24px; border-radius: var(--radius-xs);">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">${escapeHtml(pillar.title)}</h3>
                <p style="font-size: 13px; color: var(--color-secondary); line-height: 1.6; margin: 0;">${escapeHtml(pillar.description)}</p>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderFaqView() {
  const { faqs } = contentConfig;
  return `
    <div class="static-page-view">
      <div class="container prose-container">
        <div class="prose-header">
          <h1>Frequently Asked Questions</h1>
          <p style="font-size: 14px; color: var(--color-secondary);">Answers regarding our fragrance concentrations, pre-orders, and nationwide delivery.</p>
        </div>

        <div class="prose-content" style="display: flex; flex-direction: column; gap: 16px;">
          ${faqs.map(faq => `
            <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border); padding: 20px; border-radius: var(--radius-xs);">
              <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 8px; color: var(--color-primary);">${escapeHtml(faq.q)}</h3>
              <p style="font-size: 13px; color: var(--color-secondary); line-height: 1.6; margin: 0;">${escapeHtml(faq.a)}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

export function renderContactView() {
  return `
    <div class="static-page-view">
      <div class="container prose-container">
        <div class="prose-header">
          <h1>Client Concierge</h1>
          <p style="font-size: 14px; color: var(--color-secondary);">We are here to assist with olfactory recommendations, delivery inquiries, and gift consultations.</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); margin-top: var(--space-xl);">
          <div style="background: var(--color-bg-surface); border: 1px solid var(--color-border); padding: 28px; border-radius: var(--radius-xs);">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Direct Concierge Desk</h3>
            <p style="font-size: 13px; color: var(--color-secondary); line-height: 1.7; margin-bottom: 16px;">
              <strong>Atelier Location:</strong><br>${escapeHtml(brandConfig.location)}<br><br>
              <strong>Support Hours:</strong><br>${escapeHtml(brandConfig.contact.supportHours)}<br><br>
              <strong>Email Inquiries:</strong><br>${escapeHtml(brandConfig.contact.email)}
            </p>
            <a href="${brandConfig.social.whatsapp}" target="_blank" rel="noopener" class="btn btn-primary btn-block">
              💬 Message on WhatsApp
            </a>
          </div>

          <div style="background: #ffffff; border: 1px solid var(--color-border); padding: 28px; border-radius: var(--radius-xs);">
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Quick Inquiry</h3>
            <form onsubmit="event.preventDefault(); alert('Thank you! Our concierge will respond shortly.');">
              <div class="form-group">
                <label class="form-label">Your Name</label>
                <input type="text" class="form-input" required placeholder="Ama Mensah">
              </div>
              <div class="form-group">
                <label class="form-label">Phone or Email</label>
                <input type="text" class="form-input" required placeholder="050 123 4567">
              </div>
              <div class="form-group">
                <label class="form-label">Message</label>
                <textarea class="form-textarea" rows="3" required placeholder="Tell us what scent profile or inquiry you have..."></textarea>
              </div>
              <button type="submit" class="btn btn-secondary btn-block">Send Note</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderPolicyView(policyKey) {
  const policy = contentConfig.policies[policyKey];
  if (!policy) return `<div class="container" style="padding:48px 16px;">Policy not found.</div>`;

  return `
    <div class="static-page-view">
      <div class="container prose-container">
        <div class="prose-header">
          <h1>${escapeHtml(policy.title)}</h1>
          <div style="font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: var(--color-muted);">Last Updated: ${escapeHtml(policy.lastUpdated)}</div>
        </div>

        <div class="prose-content">
          ${policy.sections.map(section => `
            <section>
              <h2>${escapeHtml(section.heading)}</h2>
              <p>${escapeHtml(section.content)}</p>
            </section>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}
