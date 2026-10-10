"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../errors/AppError");
const validateRequest = (zodSchema) => {
    return (req, res, next) => {
        const result = zodSchema.safeParse(req.body ?? {});
        if (!result.success) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, result.error.issues[0]?.message ?? 'Validation failed');
        }
        req.body = result.data;
        next();
    };
};
exports.validateRequest = validateRequest;
