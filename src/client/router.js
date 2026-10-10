import { renderHomeView, initHomeView } from "./views/home-view.js";
import { renderShopView } from "./views/shop-view.js";
import { renderProductDetailView, initProductDetailView } from "./views/product-detail-view.js";
import { renderWishlistView } from "./views/wishlist-view.js";
import { renderCheckoutView, initCheckoutView } from "./views/checkout-view.js";
import { renderOrderConfirmedView, initOrderConfirmedView } from "./views/order-confirmed-view.js";
import { renderAboutView, renderFaqView, renderContactView, renderPolicyView } from "./views/static-views.js";
import { renderNotFoundView } from "./views/not-found-view.js";
import { uiStore } from "./state/ui.js";
import { brandConfig } from "../client-config/brand.js";

const routes = [
  {
    path: /^\/$/,
    title: `${brandConfig.name} | Curated Haute Parfumerie & Luxury Scents`,
    render: () => ({
      html: renderHomeView(),
      init: () => initHomeView()
    })
  },
  {
    path: /^\/shop$/,
    title: `All Perfumes | ${brandConfig.name}`,
    render: (params, queryParams) => ({ html: renderShopView({ queryParams }) })
  },
  {
    path: /^\/products\/([^/]+)$/,
    title: (params) => `${params.slug.replace(/-/g, ' ')} | ${brandConfig.name}`,
    paramNames: ["slug"],
    render: (params) => ({
      html: renderProductDetailView({ params }),
      init: () => initProductDetailView()
    })
  },
  {
    path: /^\/wishlist$/,
    title: `Saved Fragrances | ${brandConfig.name}`,
    render: () => ({ html: renderWishlistView() })
  },
  {
    path: /^\/checkout$/,
    title: `Checkout | ${brandConfig.name}`,
    render: () => ({
      html: renderCheckoutView(),
      init: () => initCheckoutView()
    })
  },
  {
    path: /^\/order-confirmed\/([^/]+)$/,
    title: `Order Confirmed | ${brandConfig.name}`,
    paramNames: ["orderId"],
    render: (params) => ({
      html: renderOrderConfirmedView({ params }),
      init: () => initOrderConfirmedView({ params })
    })
  },
  {
    path: /^\/about$/,
    title: `About Our Atelier | ${brandConfig.name}`,
    render: () => ({ html: renderAboutView() })
  },
  {
    path: /^\/faq$/,
    title: `FAQ & Pre-Orders | ${brandConfig.name}`,
    render: () => ({ html: renderFaqView() })
  },
  {
    path: /^\/contact$/,
    title: `Client Concierge | ${brandConfig.name}`,
    render: () => ({ html: renderContactView() })
  },
  {
    path: /^\/policies\/privacy$/,
    title: `Privacy Policy | ${brandConfig.name}`,
    render: () => ({ html: renderPolicyView("privacy") })
  },
  {
    path: /^\/policies\/terms$/,
    title: `Terms of Service | ${brandConfig.name}`,
    render: () => ({ html: renderPolicyView("terms") })
  },
  {
    path: /^\/policies\/delivery$/,
    title: `Delivery & Returns Policy | ${brandConfig.name}`,
    render: () => ({ html: renderPolicyView("deliveryAndReturns") })
  }
];

export class Router {
  constructor(outletElement) {
    this.outlet = outletElement;
    this.init();
  }

  init() {
    window.addEventListener("popstate", () => this.handleRoute());

    // Intercept navigation on <a> links
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // Ignore external or non-http links
      if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#") || link.target === "_blank") {
        return;
      }

      e.preventDefault();
      this.navigate(href);
    });

    this.handleRoute();
  }

  navigate(url) {
    uiStore.closeAllDrawers();
    window.history.pushState({}, "", url);
    this.handleRoute();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  handleRoute() {
    const fullPath = window.location.pathname;
    const search = window.location.search;
    const urlParams = new URLSearchParams(search);
    const queryParams = Object.fromEntries(urlParams.entries());

    let match = null;
    let matchedRoute = null;
    let params = {};

    for (const route of routes) {
      match = fullPath.match(route.path);
      if (match) {
        matchedRoute = route;
        if (route.paramNames) {
          route.paramNames.forEach((name, idx) => {
            params[name] = match[idx + 1];
          });
        }
        break;
      }
    }

    if (matchedRoute) {
      // Set Document Title
      if (typeof matchedRoute.title === "function") {
        document.title = matchedRoute.title(params);
      } else if (matchedRoute.title) {
        document.title = matchedRoute.title;
      }

      const viewOutput = matchedRoute.render(params, queryParams);
      this.outlet.innerHTML = viewOutput.html;
      if (viewOutput.init) {
        viewOutput.init();
      }
    } else {
      document.title = `404 Not Found | ${brandConfig.name}`;
      this.outlet.innerHTML = renderNotFoundView();
    }
  }
}
