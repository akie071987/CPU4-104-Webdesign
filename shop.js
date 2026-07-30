/* ============================================================
   Marginalia — shop page (grid + category filters)
   ============================================================ */
function productCardHTML(book) {
  return `
    <article class="card" data-id="${book.id}">
      <div class="card-media">
        <a href="product.html?id=${book.id}" aria-label="View ${escapeXML(book.title)}">
          <img src="${coverSVG(book)}" alt="Cover of ${escapeXML(book.title)} by ${escapeXML(book.author)}" loading="lazy">
        </a>
      </div>
      <div class="card-body">
        <span class="card-category">${escapeXML(book.category)}</span>
        <h3 class="card-title"><a href="product.html?id=${book.id}">${escapeXML(book.title)}</a></h3>
        <p class="card-author">${escapeXML(book.author)}</p>
        <div class="card-footer">
          <span class="card-price">${formatPrice(book.price)}</span>
          <button class="card-add" data-add-to-cart="${book.id}">Add to cart</button>
        </div>
      </div>
    </article>`;
}

function wireAddToCartButtons(scope) {
  scope.querySelectorAll("[data-add-to-cart]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-add-to-cart");
      addToCart(id, 1);
      const original = btn.textContent;
      btn.textContent = "Added ✓";
      btn.classList.add("added");
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove("added");
        btn.disabled = false;
      }, 1100);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("product-grid");
  const filterBar = document.getElementById("filter-bar");
  const resultCount = document.getElementById("result-count");
  if (!grid) return;

  const categories = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];
  let activeCategory = "All";

  function render() {
    const items = activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === activeCategory);

    grid.innerHTML = items.map(productCardHTML).join("");
    wireAddToCartButtons(grid);
    resultCount.textContent = `Showing ${items.length} of ${PRODUCTS.length} books`;
  }

  filterBar.innerHTML = categories.map(cat =>
    `<button class="filter-chip ${cat === activeCategory ? "active" : ""}" data-cat="${escapeXML(cat)}">${escapeXML(cat)}</button>`
  ).join("");

  filterBar.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      activeCategory = chip.getAttribute("data-cat");
      filterBar.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      render();
    });
  });

  render();
});
