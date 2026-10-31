export function readJSON (key,fallback = null) {
    const raw = localStorage.getItem(key);
    if(raw === null) return fallback;
    try {
        return JSON.parse(raw);
    } catch {
        console.warn(`"${key}" contains corrupt JSON`)
        return fallback;
    }
}

export function writeJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key) {
    localStorage.removeItem(key);
}