/* ============================================================
   Marginalia — home page (hero shelf + featured grid)
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const shelf = document.getElementById("hero-shelf");
  if (shelf) {
    const picks = PRODUCTS.filter(p => p.featured).slice(0, 5);
    const rotations = [-6, -2, 3, -4, 5];
    shelf.innerHTML = picks.map((book, i) =>
      `<img src="${coverSVG(book)}" alt="Cover of ${escapeXML(book.title)}" style="--r:${rotations[i] || 0}deg">`
    ).join("");
  }

  const grid = document.getElementById("featured-grid");
  if (grid) {
    const featured = PRODUCTS.filter(p => p.featured);
    grid.innerHTML = featured.map(productCardHTML).join("");
    wireAddToCartButtons(grid);
  }
});
