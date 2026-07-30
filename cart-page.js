/* ============================================================
   Marginalia — cart page (render, quantity, remove, totals,
   checkout form validation)
   ============================================================ */
function cartRowHTML(line) {
  return `
    <tr class="cart-row" data-id="${line.id}">
      <td>
        <div class="cell-product">
          <img src="${coverSVG(line)}" alt="Cover of ${escapeXML(line.title)}">
          <div>
            <div class="prod-title">${escapeXML(line.title)}</div>
            <div class="prod-cat">${escapeXML(line.category)}</div>
          </div>
        </div>
      </td>
      <td>${formatPrice(line.price)}</td>
      <td>
        <div class="qty-stepper">
          <button type="button" class="qty-dec" aria-label="Decrease quantity">−</button>
          <input type="text" class="qty-value" value="${line.qty}" inputmode="numeric" aria-label="Quantity">
          <button type="button" class="qty-inc" aria-label="Increase quantity">+</button>
        </div>
      </td>
      <td class="line-total">${formatPrice(line.lineTotal)}</td>
      <td><button class="remove-btn" type="button">Remove</button></td>
    </tr>`;
}

function renderCartPage() {
  const wrap = document.getElementById("cart-wrap");
  const summaryWrap = document.getElementById("summary-wrap");
  if (!wrap) return;

  const lines = getCartLines();

  if (lines.length === 0) {
    wrap.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any books yet.</p>
        <a class="btn btn-primary" href="shop.html">Browse the shop</a>
      </div>`;
    summaryWrap.style.display = "none";
    return;
  }

  summaryWrap.style.display = "block";
  wrap.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Book</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th><span class="visually-hidden">Remove</span></th>
        </tr>
      </thead>
      <tbody>
        ${lines.map(cartRowHTML).join("")}
      </tbody>
    </table>`;

  wrap.querySelectorAll(".cart-row").forEach(row => {
    const id = row.getAttribute("data-id");
    const input = row.querySelector(".qty-value");

    row.querySelector(".qty-dec").addEventListener("click", () => {
      setQuantity(id, Math.max(0, Number(input.value) - 1));
      renderCartPage();
    });
    row.querySelector(".qty-inc").addEventListener("click", () => {
      setQuantity(id, Number(input.value) + 1);
      renderCartPage();
    });
    input.addEventListener("change", () => {
      const val = Math.max(0, parseInt(input.value, 10) || 0);
      setQuantity(id, val);
      renderCartPage();
    });
    row.querySelector(".remove-btn").addEventListener("click", () => {
      removeFromCart(id);
      renderCartPage();
    });
  });

  renderSummary();
}

function renderSummary() {
  document.getElementById("summary-subtotal").textContent = formatPrice(getCartSubtotal());
  const shipping = getShippingCost();
  document.getElementById("summary-shipping").textContent = shipping === 0 ? "Free" : formatPrice(shipping);
  document.getElementById("summary-total").textContent = formatPrice(getCartTotal());
}

/* ---------------- Checkout form validation ---------------- */
function validateField(input, testFn, message) {
  const field = input.closest(".form-field");
  const errorEl = field.querySelector(".field-error");
  const valid = testFn(input.value.trim());
  field.classList.toggle("has-error", !valid);
  if (errorEl) errorEl.textContent = message;
  return valid;
}

function wireCheckoutForm() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  const successBox = document.getElementById("checkout-success");

  form.addEventListener("submit", e => {
    e.preventDefault();

    if (getCartCount() === 0) return;

    const name = form.querySelector("#co-name");
    const email = form.querySelector("#co-email");
    const address = form.querySelector("#co-address");

    const nameOk = validateField(name, v => v.length >= 2, "Please enter your full name.");
    const emailOk = validateField(email, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Please enter a valid email address.");
    const addressOk = validateField(address, v => v.length >= 8, "Please enter a delivery address.");

    if (nameOk && emailOk && addressOk) {
      successBox.classList.add("show");
      successBox.textContent = `Thanks, ${name.value.trim()} — your order has been placed. A confirmation will be sent to ${email.value.trim()}.`;
      form.reset();
      clearCart();
      renderCartPage();
      form.querySelectorAll(".form-field").forEach(f => f.classList.remove("has-error"));
    } else {
      successBox.classList.remove("show");
    }
  });

  [form.querySelector("#co-name"), form.querySelector("#co-email"), form.querySelector("#co-address")]
    .forEach(input => {
      input.addEventListener("input", () => {
        if (input.closest(".form-field").classList.contains("has-error")) {
          input.closest(".form-field").classList.remove("has-error");
        }
      });
    });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartPage();
  wireCheckoutForm();
});
