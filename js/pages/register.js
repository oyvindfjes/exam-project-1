// js/pages/register.js
import { register } from "../auth.js";
import { isValidEmail, isValidPassword, isValidName, isNoroffEmail } from "../validation.js";
import { renderHeader, renderFooter } from "../ui.js";
import { ROUTES } from "../config.js";

renderHeader();
renderFooter();

const form = document.querySelector("#register-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const nameError = document.querySelector("#name-error");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const formError = document.querySelector("#form-error");
const submitBtn = form.querySelector("button[type=submit]");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  nameError.hidden = true;
  emailError.hidden = true;
  passwordError.hidden = true;
  formError.hidden = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  let hasErrors = false;
  if (!isValidName(name)) {
    nameError.textContent = "Name is required and can only contain letters, numbers and underscores.";
    nameError.hidden = false;
    hasErrors = true;
  }
  if (!isValidEmail(email)) {
    emailError.textContent = "Please use a valid email address.";
    emailError.hidden = false;
    hasErrors = true;
  } else if (!isNoroffEmail(email)) {
    emailError.textContent = "Please use a @stud.noroff.no email.";
    emailError.hidden = false;
    hasErrors = true;
  }
  if (!isValidPassword(password)) {
    passwordError.textContent = "Password needs to be at least 8 characters.";
    passwordError.hidden = false;
    hasErrors = true;
  }
  if (hasErrors) return;

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating account…";

  try {
    await register(name, email, password);

    // Hvis register ikke gir accessToken: send til login med forhåndsutfylt e-post
    window.location.href = `${ROUTES.login}?email=${encodeURIComponent(email)}`;
  } catch (err) {
    formError.textContent = err.message || "Account creation failed.";
    formError.hidden = false;
    submitBtn.disabled = false;
    submitBtn.textContent = "Create account";
  }
});