"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearBlacklist = exports.isTokenBlacklisted = exports.addTokenToBlacklist = void 0;
// tokenBlacklist.ts
const tokenBlacklist = new Set();
const addTokenToBlacklist = (token) => {
    tokenBlacklist.add(token);
};
exports.addTokenToBlacklist = addTokenToBlacklist;
const isTokenBlacklisted = (token) => {
    return tokenBlacklist.has(token);
};
exports.isTokenBlacklisted = isTokenBlacklisted;
const clearBlacklist = () => {
    tokenBlacklist.clear();
};
exports.clearBlacklist = clearBlacklist;
