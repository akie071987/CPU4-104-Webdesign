/* ============================================================
   Marginalia — contact page form validation
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const successBox = document.getElementById("contact-success");

  function validate(input, testFn, message) {
    const field = input.closest(".form-field");
    const errorEl = field.querySelector(".field-error");
    const valid = testFn(input.value.trim());
    field.classList.toggle("has-error", !valid);
    if (errorEl) errorEl.textContent = message;
    return valid;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const name = form.querySelector("#ct-name");
    const email = form.querySelector("#ct-email");
    const message = form.querySelector("#ct-message");

    const nameOk = validate(name, v => v.length >= 2, "Please enter your name.");
    const emailOk = validate(email, v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Please enter a valid email address.");
    const messageOk = validate(message, v => v.length >= 10, "Message should be at least 10 characters.");

    if (nameOk && emailOk && messageOk) {
      successBox.classList.add("show");
      successBox.textContent = `Thanks, ${name.value.trim()} — we've received your message and will reply to ${email.value.trim()} soon.`;
      form.reset();
    } else {
      successBox.classList.remove("show");
    }
  });

  form.querySelectorAll("input, textarea").forEach(input => {
    input.addEventListener("input", () => {
      input.closest(".form-field").classList.remove("has-error");
    });
  });
});
