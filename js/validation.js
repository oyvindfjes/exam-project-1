// js/validation.js

export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isNoroffEmail(email) {
    return /@(stud\.)?noroff\.no$/i.test(email);
}

export function isValidPassword(password) {
    return typeof password === "string" && password.length >= 8;
}

// Kun bokstaver (inkl. æøå og andre unicode-bokstaver), tall, mellomrom og underscore.
// Avviser punktum, komma, bindestrek og andre tegnsettingssymboler.
export function isValidName(name) {
    return /^[\p{L}\p{N}_ ]+$/u.test(name);
}