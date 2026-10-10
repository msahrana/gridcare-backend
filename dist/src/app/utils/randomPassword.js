"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateRandomPassword;
const crypto_1 = __importDefault(require("crypto"));
function generateRandomPassword(length = 10) {
    if (length < 8) {
        throw new Error('Length must be at least 4');
    }
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits = '0123456789';
    const specials = '!@#$%^&*_-?+=';
    const all = lower + upper + digits + specials;
    const pick = (chars) => chars[crypto_1.default.randomInt(chars.length)];
    const chars = [pick(lower), pick(upper), pick(digits), pick(specials)];
    for (let i = chars.length; i < length; i++) {
        chars.push(pick(all));
    }
    for (let i = chars.length - 1; i > 0; i--) {
        const j = crypto_1.default.randomInt(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
}
