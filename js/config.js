export const API_BASE_URL = "https://v2.api.noroff.dev";
export const API_KEY = "ead5250d-4c99-4b1a-a7b4-10e55d8cb52d";

const PREFIX = "shop:";

export const STORAGE_KEYS = Object.freeze({
    token: `${PREFIX}token`,
    profile: `${PREFIX}profile`,
    cart: `${PREFIX}cart`,
    order: `${PREFIX}order`,
});

export const ROUTES = Object.freeze({
    index: "/index.html",
    product: "/product/index.html",
    login: "/account/login.html",
    register: "/account/register.html",
    cart: "/cart/index.html",
    checkout: "/checkout/index.html",
    success: "/success/index.html",
});