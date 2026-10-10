import { catalogConfig } from "../../client-config/catalog.js";

/**
 * Find a product by its unique slug
 * @param {string} slug 
 * @returns {object|null}
 */
export function getProductBySlug(slug) {
  if (!slug) return null;
  return catalogConfig.products.find(p => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

/**
 * Find a product by its ID
 * @param {string} id 
 * @returns {object|null}
 */
export function getProductById(id) {
  if (!id) return null;
  return catalogConfig.products.find(p => p.id === id) || null;
}

/**
 * Get the selected size option for a product
 * @param {object} product 
 * @param {string} sizeId 
 * @returns {object}
 */
export function getProductSizeOption(product, sizeId) {
  if (!product || !product.options || !product.options.sizes) {
    return { id: "standard", label: "Standard", priceMinor: product ? product.priceMinor : 0 };
  }
  const size = product.options.sizes.find(s => s.id === sizeId);
  return size || product.options.sizes[0];
}

/**
 * Filter catalog products by category, search term, olfactory family, or gender
 * @param {object} params
 * @returns {Array}
 */
export function filterProducts({ category, search, family, status, featured } = {}) {
  let list = [...catalogConfig.products];

  if (category && category !== "all") {
    list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (family && family !== "all") {
    list = list.filter(p => p.olfactoryFamily.toLowerCase() === family.toLowerCase());
  }

  if (status) {
    list = list.filter(p => p.status === status);
  }

  if (featured) {
    list = list.filter(p => p.isFeatured === true);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.olfactoryFamily.toLowerCase().includes(q) ||
      p.genderLabel.toLowerCase().includes(q) ||
      (p.pyramid && (
        p.pyramid.top.some(n => n.toLowerCase().includes(q)) ||
        p.pyramid.heart.some(n => n.toLowerCase().includes(q)) ||
        p.pyramid.base.some(n => n.toLowerCase().includes(q))
      ))
    );
  }

  return list;
}
