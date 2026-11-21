// js/pages/login.js

import { login } from "../auth.js";
import { isValidEmail, isValidPassword } from "../validation.js";
import { renderHeader, renderFooter } from "../ui.js";
import { ROUTES } from "../config.js";

renderHeader();
renderFooter();

const form = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const emailError = document.querySelector("#email-error");
const passwordError = document.querySelector("#password-error");
const formError = document.querySelector("#form-error");
const submitBtn = form.querySelector("button[type=submit]");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    emailError.hidden = true;
    passwordError.hidden = true;
    formError.hidden = true;
  
    const email = emailInput.value.trim();
    const password = passwordInput.value;
  
    let hasErrors = false;
    if (!isValidEmail(email)) {
      emailError.textContent = "Please use a valid email address, ending with stud.noroff.no";
      emailError.hidden = false;
      hasErrors = true;
    }
    if (!isValidPassword(password)) {
      passwordError.textContent = "Password must be at least 8 characters.";
      passwordError.hidden = false;
      hasErrors = true;
    }
    if (hasErrors) return;
  
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in…";
  
    try {
      await login(email, password);
  
      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");
      window.location.href = redirect || ROUTES.index;
    } catch (err) {
      formError.textContent = err.message || "Login failed.";
      formError.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in";
    }
  });