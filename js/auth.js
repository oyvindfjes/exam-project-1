// js/auth.js

import { STORAGE_KEYS } from "./config.js";
import { readJSON, writeJSON, remove } from "./storage.js";
import { login as apiLogin, register as apiRegister } from "./api.js";

export async function login(email, password) {
  const data = await apiLogin({ email, password });
  writeJSON(STORAGE_KEYS.token, data.accessToken);
  writeJSON(STORAGE_KEYS.profile, {
    name: data.name,
    email: data.email,
    avatar: data.avatar,
  });
  return data;
}

export async function register(name, email, password) {
  return apiRegister({ name, email, password });
}

export function isLoggedIn() {
  return Boolean(readJSON(STORAGE_KEYS.token));
}

export function getProfile() {
  return readJSON(STORAGE_KEYS.profile);
}

export function logout() {
  remove(STORAGE_KEYS.token);
  remove(STORAGE_KEYS.profile);
}