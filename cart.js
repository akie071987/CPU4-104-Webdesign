/* ============================================================
   Marginalia — cart logic (shared by every page)
   Cart shape in storage: [{ id, qty }, ...]
   ============================================================ */

const CART_KEY = "marginalia_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(id, qty) {
  qty = Math.max(1, Number(qty) || 1);
  const cart = getCart();
  const existing = cart.find(item => item.id === Number(id));
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: Number(id), qty });
  }
  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== Number(id));
  saveCart(cart);
}

function setQuantity(id, qty) {
  qty = Number(qty);
  let cart = getCart();
  if (qty < 1) {
    cart = cart.filter(item => item.id !== Number(id));
  } else {
    const existing = cart.find(item => item.id === Number(id));
    if (existing) existing.qty = qty;
  }
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartLines() {
  return getCart()
    .map(item => {
      const product = getProductById(item.id);
      if (!product) return null;
      return { ...product, qty: item.qty, lineTotal: product.price * item.qty };
    })
    .filter(Boolean);
}

function getCartSubtotal() {
  return getCartLines().reduce((sum, line) => sum + line.lineTotal, 0);
}

const SHIPPING_FLAT = 3.5;
const FREE_SHIPPING_THRESHOLD = 40;

function getShippingCost() {
  const subtotal = getCartSubtotal();
  if (subtotal === 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}

function getCartTotal() {
  return getCartSubtotal() + getShippingCost();
}

/* Updates the little count badge on the cart icon, on every page */
function updateCartBadge() {
  document.querySelectorAll("[data-cart-badge]").forEach(el => {
    const count = getCartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "inline-flex" : "none";
  });
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
