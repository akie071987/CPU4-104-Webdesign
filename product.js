/* ============================================================
   Marginalia — product detail page
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("detail-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const book = getProductById(params.get("id"));

  if (!book) {
    container.innerHTML = `
      <div class="empty-cart">
        <h3>We can't find that book</h3>
        <p>It may have sold out or the link may be off. Browse the full shop instead.</p>
        <a class="btn btn-primary" href="shop.html">Back to shop</a>
      </div>`;
    document.title = "Book not found · Marginalia";
    return;
  }

  document.title = `${book.title} · Marginalia`;
  document.getElementById("breadcrumb-title").textContent = book.title;

  container.innerHTML = `
    <div class="detail-media">
      <img src="${coverSVG(book)}" alt="Cover of ${escapeXML(book.title)} by ${escapeXML(book.author)}">
    </div>
    <div class="detail-info">
      <span class="detail-category">${escapeXML(book.category)}</span>
      <h1>${escapeXML(book.title)}</h1>
      <p class="detail-author">by ${escapeXML(book.author)}</p>
      <p class="detail-price">${formatPrice(book.price)}</p>
      <p class="detail-blurb">${escapeXML(book.blurb)}</p>

      <div class="qty-row">
        <div class="qty-stepper">
          <button type="button" id="qty-minus" aria-label="Decrease quantity">−</button>
          <input type="text" id="qty-input" value="1" inputmode="numeric" aria-label="Quantity">
          <button type="button" id="qty-plus" aria-label="Increase quantity">+</button>
        </div>
        <button class="btn btn-primary" id="detail-add-btn">Add to cart</button>
      </div>
      <a class="btn-ghost" href="shop.html">&larr; Back to all books</a>
    </div>`;

  const qtyInput = document.getElementById("qty-input");
  document.getElementById("qty-minus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.getElementById("qty-plus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) + 1);
  });
  qtyInput.addEventListener("change", () => {
    const val = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    qtyInput.value = val;
  });

  const addBtn = document.getElementById("detail-add-btn");
  addBtn.addEventListener("click", () => {
    addToCart(book.id, Number(qtyInput.value));
    const original = addBtn.textContent;
    addBtn.textContent = "Added to cart ✓";
    setTimeout(() => { addBtn.textContent = original; }, 1300);
  });

  const relatedGrid = document.getElementById("related-grid");
  const related = PRODUCTS.filter(p => p.category === book.category && p.id !== book.id).slice(0, 4);
  if (related.length) {
    relatedGrid.innerHTML = related.map(productCardHTML).join("");
    wireAddToCartButtons(relatedGrid);
  } else {
    document.getElementById("related-section").style.display = "none";
  }
});
