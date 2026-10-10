export const STORAGE_KEYS = {
  CART: "store_scents_cart_v1",
  WISHLIST: "store_scents_wishlist_v1",
  RECEIPT: "store_scents_receipt_v1",
  RECENT: "store_scents_recent_v1"
};

export const ROUTES = {
  HOME: "/",
  SHOP: "/shop",
  PRODUCT: "/products/:slug",
  WISHLIST: "/wishlist",
  CHECKOUT: "/checkout",
  CONFIRMATION: "/order-confirmed/:orderId",
  ABOUT: "/about",
  FAQ: "/faq",
  CONTACT: "/contact",
  PRIVACY: "/policies/privacy",
  TERMS: "/policies/terms",
  DELIVERY_RETURNS: "/policies/delivery"
};

export const ORDER_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  PROCESSING: "processing",
  DISPATCHED: "dispatched",
  DELIVERED: "delivered",
  FAILED: "failed"
};
