# Vanilla Commerce Starter Guide

This guide defines the baseline architecture for client storefronts built with
vanilla JavaScript, Cloudflare Pages, Cloudflare Pages Functions, D1, and
Paystack. It is based on the patterns proven in Petal & Bloom, with a few
standards added so each new client build is easier to maintain, secure, test,
and hand over.

The goal is not to make every store look or behave the same. The goal is to
reuse a dependable commerce foundation while keeping each client's brand,
catalog, policies, and operations separate from the framework itself.

---

## 1. Non-negotiable architecture principles

1. **Use browser-native ES modules.** Do not add a frontend framework unless
   the product requirements genuinely need one. Pages should load one small
   application entrypoint and import focused modules.
2. **Use path-based History API routes.** A route must work when opened,
   refreshed, shared, and navigated with Back/Forward controls.
3. **Keep authoritative commerce rules on the server.** Prices, product
   availability, delivery charges, discounts, order status, and payment
   confirmation are never trusted from the browser.
4. **Treat D1 as the order system of record.** Paystack metadata is useful for
   display and reconciliation, but it is not the fulfillment database.
5. **Build a client configuration layer.** Copying a project must not require
   editing framework code to change a logo, product, shipping rule, or policy.
6. **Deploy only a deliberate build directory.** The project root is never the
   production publish directory.
7. **Prefer boring, observable operations.** A payment must be verifiable,
   repeat-safe, auditable, and recoverable when a webhook is delayed.

---

## 2. Recommended project layout

```text
storefront/
├── public/                         # Static files copied unchanged to dist/
│   ├── images/
│   ├── favicon.svg
│   ├── _headers
│   └── .well-known/
├── src/
│   ├── client/
│   │   ├── app.js                  # App bootstrap and dependency wiring only
│   │   ├── router.js               # Route matching, navigation, history
│   │   ├── views/                  # Page-level renderers
│   │   ├── components/             # Reusable DOM components
│   │   ├── state/                  # Cart, wishlist, UI state
│   │   ├── services/               # Browser API calls and storage adapters
│   │   ├── lib/                    # Escaping, currency formatting, DOM helpers
│   │   └── styles/                 # Tokens, base, layout, components
│   ├── shared/
│   │   ├── catalog/                # Trusted product/options data used by both sides
│   │   ├── commerce/               # Pure pricing, promotion, validation helpers
│   │   └── constants.js
│   └── client-config/
│       ├── brand.js                # Name, colors, contact details, social URLs
│       ├── catalog.js              # Client product data and imagery mapping
│       ├── delivery.js             # Delivery zones, dates, fees, windows
│       ├── content.js              # Policies, FAQs, home-page content
│       └── promotions.js           # Campaign rules where appropriate
├── functions/
│   ├── _middleware.js
│   ├── api/
│   │   ├── checkout.js
│   │   ├── webhook.js
│   │   └── orders/
│   │       └── [id].js
│   └── lib/                        # D1, Paystack, security, API helpers
├── migrations/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/                        # Build, validation, and deployment helpers
├── dist/                           # Generated only; deployed to Pages
├── .env.example
├── package.json
├── wrangler.toml
└── PROJECT_GUIDE.md
```

### Separation rules

- `src/client/` must not contain Paystack secret keys, D1 access, or final
  order-price authority.
- `functions/` may import pure data and logic from `src/shared/`, but should
  not import DOM code or page renderers.
- `src/client-config/` is the main client-customization boundary. It contains
  client facts, not generic payment or security implementation.
- `dist/` contains only generated deployable assets. Do not place invoices,
  exports, ZIP files, development notes, or local databases there.

---

## 3. Client setup checklist

Before development, create a client brief that answers these questions:

| Area | Decisions to record |
| --- | --- |
| Ownership | Who owns the Cloudflare account, Paystack account, domain, D1 database, and source repository? |
| Brand | Name, logo, fonts, colors, imagery rights, tone of voice, social/contact information. |
| Catalog | Products, options, stock behavior, images, tax treatment, prices, SKU conventions. |
| Delivery | Service area, blackout dates, cut-off times, delivery windows, fees, same-day policy, pickup policy. |
| Payment | Settlement currency, test/live Paystack keys, supported payment methods, refund owner. |
| Operations | Who receives paid-order notifications, who fulfills orders, escalation path, support hours. |
| Legal | Privacy policy, terms, returns/refunds, delivery disclaimer, applicable data requirements. |

The build should not proceed to live payment setup until ownership is clear.
Client accounts are preferred; agency-owned accounts must have a documented
handover process.

---

## 4. Routing contract

Use canonical, shareable paths. Do not make query-string routes the only public
route format.

```text
/                              Home
/shop                          Catalog
/shop?category=bouquets        Optional catalog filters
/products/:slug                Product detail page
/checkout                      Checkout form
/order-confirmed/:orderId      Payment confirmation state
/faq                           FAQ
/contact                       Contact
/policies/privacy              Privacy policy
/policies/terms                Terms
/policies/delivery             Delivery and returns
```

### Router requirements

- Maintain one route table rather than a growing set of `if` statements.
- Use `history.pushState()` for user-initiated navigations and
  `history.replaceState()` only for non-navigational state changes such as
  filtering the existing shop view.
- Listen for `popstate` and render the current path without adding a new entry.
- Scroll to the top on page navigation; preserve focus intentionally for
  accessibility.
- Render a useful 404 view for unknown product slugs and paths.
- Configure Cloudflare Pages to return the SPA shell for client routes while
  allowing `/api/*` and real static files to reach their own handlers.
- Use route parameters only for non-sensitive identifiers. Never put a receipt
  credential, address, email address, or payment secret in a URL.

### SEO note

Vanilla SPAs can be appropriate for small stores, but product pages should have
stable URLs, accurate titles/descriptions, canonical tags, and product JSON-LD.
If organic search becomes a primary sales channel, evaluate server-side or edge
rendered product metadata rather than relying entirely on client rendering.

---

## 5. Client state and DOM rules

### Storage

- `localStorage` may hold convenience state such as a cart, wishlist, selected
  currency display preference, or recently viewed items.
- `sessionStorage` may hold a short-lived, browser-specific receipt credential.
- Neither storage mechanism is trusted. Reconcile cart items with the current
  trusted catalog before rendering and always validate them again on the server.
- Use a namespaced, versioned key such as `client_slug_cart_v1` so migrations
  are possible without colliding with another site.

### Rendering

- Product and static copy can be rendered from trusted local configuration.
- Escape every value that originated from a form, URL, browser storage, CMS,
  database, or third-party service before placing it in `innerHTML`.
- Prefer `textContent`, element creation, and attribute setters for customer
  content such as names, card notes, addresses, review text, and search terms.
- Do not use inline event handlers; they undermine a strong Content Security
  Policy.
- Each view/component must clean up event listeners, timers, and observers when
  it is replaced. Long-lived module globals should be minimal and explicit.

### Accessibility minimums

- Use real `<button>` elements for actions and real links for navigation.
- Give drawers and modals focus management, Escape handling, and focus return.
- Announce cart and checkout errors through an appropriate live region.
- Ensure keyboard access, visible focus, touch targets, and reduced-motion
  support.
- Test mobile checkout with an actual device before launch.

---

## 6. Catalog, pricing, and promotions

### Catalog contract

Every sellable product needs a stable slug and an internal SKU or product ID.
Every selectable option needs its own stable ID. A minimal product record is:

```js
{
  id: "rose-garden",
  slug: "rose-garden",
  name: "Rose Garden",
  status: "active", // active | hidden | sold_out | archived
  images: { primary: "/images/rose-garden.webp", gallery: [] },
  options: {
    sizes: [{ id: "standard", label: "Standard", priceMinor: 7200 }],
    vessels: [{ id: "wrap", label: "Signature wrap", priceMinor: 0 }]
  }
}
```

Store money in integer minor units. Avoid binary floating-point arithmetic for
authoritative order calculations.

### Pricing rules

- The browser sends only product slug, selected option IDs, and quantity.
- The server re-resolves every line item from the trusted catalog.
- The server calculates merchandise, delivery, tax, promotion, and total.
- Persist a complete pricing snapshot on the order: merchandise subtotal,
  delivery fee, discount, tax, currency, conversion rate when relevant, and
  final `total_minor_units`.
- Use explicit field names. For example, a GHS amount should not be named
  `total_cents`; use `total_minor_units` and `payment_currency`.
- If catalog and settlement currencies differ, record both currencies and the
  conversion-rate source/snapshot. A manually set exchange rate is a business
  decision that needs a documented update owner.

### Promotions

- Client-side promotion previews are for user experience only.
- The server decides eligibility and final discount.
- Promotions need a code, start/end time, qualification criteria, maximum
  discount, scope, and usage policy.
- Add tests for expired, malformed, below-threshold, already-used, and maximum
  discount cases.

---

## 7. Paystack checkout flow

### Browser flow

1. Customer completes the checkout form.
2. The client POSTs product option IDs, quantities, buyer information, delivery
   information, card note, and optional promotion code to `/api/checkout`.
3. The client saves the returned receipt credential to session storage before
   opening Paystack.
4. Paystack opens with the server-created access code or authorization URL.
5. On return, the customer lands on `/order-confirmed/:orderId`.
6. The page polls a deliberately minimal order-status endpoint briefly, then
   explains what happens if confirmation is delayed.

### Server flow

1. Check configuration and rate limits.
2. Enforce a maximum request body size.
3. Validate buyer, delivery, item count, option IDs, quantity limits, and
   promotion code.
4. Recalculate the entire order from trusted data.
5. Create a pending D1 order and a random receipt credential; store only the
   credential hash.
6. Initialize the Paystack transaction using the expected amount, currency,
   callback URL, and internal order ID in metadata.
7. Store Paystack's transaction reference on the pending order.
8. Return only what the browser needs: authorization URL/access code, order ID,
   and one-time receipt credential.

### Webhook rules

- Verify `x-paystack-signature` using HMAC-SHA-512 and the Paystack secret key
  before parsing the event as trusted data.
- For `charge.success`, require an exact match on internal order ID, Paystack
  reference, expected amount, expected currency, and successful payment status.
- Update from `pending` to `paid` with a conditional statement so duplicate
  webhook deliveries are harmless.
- Return a fast 2xx response for valid duplicate or irrelevant events.
- Keep a payment-event audit record with event type, provider reference,
  received timestamp, verification outcome, and internal order ID when known.
- Do not mark an order paid because the customer reached the callback page.

### Delayed-webhook fallback

The order-status endpoint may ask Paystack to verify a pending transaction.
Throttle this by order and client identity. It is a fallback, not a replacement
for the webhook.

---

## 8. D1 schema and migrations

### Order design

An order should include:

- Immutable order ID (UUID or equivalent)
- Explicit order state (`pending`, `paid`, `checkout_failed`, `refunded`, etc.)
- Buyer and delivery snapshots
- Cart line-item snapshot
- Pricing snapshot and payment currency
- Paystack reference, unique when present
- Created, paid, updated, and fulfillment timestamps
- Receipt-token hash

Use database constraints for invariants: positive totals, allowed states,
three-letter currencies, unique Paystack references, and paid timestamps for
paid orders.

### Migration policy

- Never edit an applied migration.
- Name migrations sequentially and descriptively:
  `0008_add_order_event_log.sql`.
- A new environment runs the base schema plus all migrations in order.
- Test each migration against representative legacy data before production.
- Record the exact migration command in the release notes.
- Have a rollback/recovery plan before a destructive table rebuild. D1 data
  migrations should run in transactions whenever possible.

### Environment separation

Use separate D1 databases for local development, preview, and production. A
preview deployment must never share the production database ID. Use client-
specific database names and never copy a previous client's database binding.

---

## 9. Security baseline

### Secrets and configuration

- Use encrypted Cloudflare secrets for `PAYSTACK_SECRET_KEY` and other private
  values.
- Commit `.env.example`, never `.env` or `.dev.vars` with real values.
- Include a long random `RATE_LIMIT_SALT` and rotate it if exposure is
  suspected.
- Do not expose secrets in source code, frontend bundles, error messages,
  screenshots, tickets, or client documentation.

### Headers

Apply equivalent security headers to static Pages responses and Function
responses. The baseline should include:

- A restrictive Content Security Policy
- `Cross-Origin-Opener-Policy: same-origin-allow-popups` when Paystack popup
  checkout requires it
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- A restrictive Permissions Policy
- A sensible Referrer Policy

Add HSTS only after the store has a client-owned custom domain with HTTPS fully
working. Reassess CSP whenever adding analytics, chat widgets, image CDNs, or
payment integrations.

### API protections

- Limit checkout, status, and receipt endpoints independently.
- Hash client identity before persisting a rate-limit key; never store raw IP
  addresses solely for this purpose.
- Keep public status responses minimal; they must not expose email, address,
  items, payment reference, timestamps, or internal notes.
- Require a high-entropy receipt credential for detailed receipt data and store
  only its hash.
- Return safe public error messages; log detailed exceptions server-side.
- Validate request size, type, shape, range, and allowed values.

---

## 10. Cloudflare Pages deployment standard

### `wrangler.toml`

Use an explicit build output directory:

```toml
name = "client-storefront"
compatibility_date = "2026-09-06"
pages_build_output_dir = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "client-store-production"
database_id = "PRODUCTION_DATABASE_ID"
preview_database_id = "PREVIEW_DATABASE_ID"
```

The D1 binding must also be configured in the Cloudflare Pages dashboard for
the correct environment. `wrangler.toml` does not magically create or bind a
production D1 database in an existing Pages project.

### Required environments

| Environment | Database | Paystack key | Purpose |
| --- | --- | --- | --- |
| Local | Local D1 | Test secret | Developer validation |
| Preview | Preview D1 | Test secret | Client QA and review |
| Production | Production D1 | Live secret | Real customer orders |

### Deployment checklist

1. Run unit, integration, and browser tests.
2. Build `dist/` from a clean checkout.
3. Confirm no invoices, exports, secrets, source maps containing secrets, or
   temporary archives are in `dist/`.
4. Deploy preview and test checkout with Paystack test mode.
5. Confirm webhook delivery and duplicate-webhook behavior.
6. Confirm direct deep links and refresh work for every public route.
7. Confirm D1 binding and secrets point to the intended environment.
8. Promote only after client approval and an operational owner is available.

---

## 11. Testing standard

### Required scripts

```json
{
  "type": "module",
  "scripts": {
    "dev": "wrangler pages dev dist",
    "build": "node scripts/build.mjs",
    "test": "node --test tests/unit/**/*.test.mjs",
    "test:integration": "node --test tests/integration/**/*.test.mjs",
    "test:e2e": "playwright test",
    "check": "npm run test && npm run test:integration"
  }
}
```

Adjust commands to match the chosen tooling, but every starter must expose a
single reliable `npm run check` command.

### Minimum test coverage

- Delivery validation: required fields, dates, windows, zones, cut-offs.
- Pricing: options, quantity limits, delivery fees, currency conversion,
  discounts, rounding.
- Payment verification: rejected status, reference mismatch, amount mismatch,
  currency mismatch, metadata mismatch.
- Webhook idempotency and active-verification fallback.
- Receipt token generation, hash comparison, denial of invalid tokens.
- Public endpoint data minimization.
- Rate-limit identity hashing and limit behavior.
- Security header parity between static and Function responses.
- Browser checkout: add item, modify cart, submit form, cancel payment,
  successful sandbox callback, delayed confirmation, and receipt download.
- Mobile, keyboard, and screen-reader smoke tests.

---

## 12. Observability and fulfillment

At launch, decide who is watching paid orders. A payment integration without a
fulfillment process is incomplete.

- Add an `order_events` audit table or equivalent log.
- Notify the operator after a verified paid state change. The notification
  channel can be email, Slack, a dashboard, or an internal queue.
- Make notification retries safe; do not send duplicate fulfillment requests.
- Provide a small protected order-management view or a documented D1 query for
  support staff.
- Record fulfillment state separately from payment state.
- Document refund handling: who initiates it in Paystack, who updates the
  customer, and how the internal order state changes.
- Set up error monitoring for Function failures and alerts for webhook
  verification failures, payment initialization failures, and unusual rate
  limiting.

---

## 13. Client handover checklist

Before declaring the project complete, hand over:

- Cloudflare project access, Pages settings, D1 bindings, custom domain, and
  DNS ownership.
- Paystack account ownership, live/test mode instructions, webhook URL, and
  refund process.
- Source repository access and a plain-language README.
- The list of environment-variable names without revealing secret values.
- Product/content update instructions and image size guidelines.
- The delivery-fee, promotion, and exchange-rate update process.
- The order-fulfillment and customer-support workflow.
- A launch date, support window, maintenance scope, and recovery contact.

The client should be able to change ordinary storefront content without editing
payment logic, and should know exactly whom to contact for changes that do
affect commerce rules.

---

## 14. Petal & Bloom migration notes

Petal & Bloom is a valid reference implementation for the following proven
patterns:

- Browser modules split by feature and a CSS component manifest.
- Server-side product and pricing validation before Paystack initialization.
- Webhook signature verification and strict payment/order matching.
- D1 integrity constraints and incremental migrations.
- Hashed-IP rate limiting.
- Minimal public order status and session-backed receipt access.
- Shared static/Function security-header policy.

When extracting the starter, make these upgrades first:

1. Replace query-only routing with canonical paths and a route table.
2. Move product and commerce data out of `js/` into a neutral shared/client
   configuration boundary.
3. Use a `dist/` build output rather than deploying the project root.
4. Separate preview and production D1 databases.
5. Add package scripts, `type: module`, integration tests, and browser tests.
6. Centralize output escaping and remove unsafe dynamic HTML interpolation for
   customer-controlled values.
7. Add audit/fulfillment notifications and a documented operational workflow.

---

## 15. Definition of done for every new store

A store is ready to launch only when all of the following are true:

- [ ] Client ownership and access are documented.
- [ ] Public paths, deep links, refreshes, and 404 behavior work.
- [ ] Catalog options and prices are correct in the trusted server catalog.
- [ ] Server-side pricing and promotion validation are tested.
- [ ] Preview and production use separate D1 databases and secrets.
- [ ] Paystack test checkout, callback, webhook, and delayed verification pass.
- [ ] The live webhook URL is configured only after the live domain is ready.
- [ ] A paid order reaches the fulfillment owner exactly once.
- [ ] Public endpoints reveal no unnecessary personal or payment data.
- [ ] Security headers, rate limits, request limits, and receipt protection are live.
- [ ] `npm run check` passes from a clean checkout.
- [ ] Mobile, keyboard, and accessibility smoke tests pass.
- [ ] `dist/` has been inspected and contains no accidental private artifacts.
- [ ] Client handover materials and support process are complete.

