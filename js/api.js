// js/api.js

import { API_BASE_URL, API_KEY, STORAGE_KEYS } from "./config.js";
import { readJSON } from "./storage.js";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  if (auth) {
    const token = readJSON(STORAGE_KEYS.token);
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(API_BASE_URL + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Network error, please check your connection.", 0);
  }

  if (!response.ok) {

    let message = response.statusText || `Request failed (${response.status})`;
    try {
      const data = await response.json();
      message = data.errors?.[0]?.message ?? message;
    } catch {

    }
    throw new ApiError(message, response.status);
  }

  return response.json();
}

export async function getProducts() {
  const response = await request("/online-shop");
  return response.data;
}

export async function getProduct(id) {
  const response = await request(`/online-shop/${id}`);
  return response.data;
}

export async function login(body) {
  const response = await request("/auth/login", { method: "POST", body });
  return response.data;
}

export async function register(body) {
  const response = await request("/auth/register", { method: "POST", body });
  return response.data;
}