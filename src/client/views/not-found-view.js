export function renderNotFoundView() {
  return `
    <div class="container" style="padding: 100px 16px; text-align: center;">
      <h1 style="font-size: 64px; font-family: var(--font-serif); margin-bottom: 12px; color: var(--color-muted);">404</h1>
      <h2 style="font-size: 20px; font-weight: 500; margin-bottom: 8px;">Fragrance Not Found</h2>
      <p style="font-size: 14px; color: var(--color-secondary); margin-bottom: 24px;">The page or scent profile you are looking for does not exist.</p>
      <a href="/shop" class="btn btn-primary">Return to Collection</a>
    </div>
  `;
}
