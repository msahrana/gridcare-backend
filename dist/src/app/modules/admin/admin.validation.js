"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRoleValidationSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../../generated/prisma/enums");
exports.updateUserRoleValidationSchema = zod_1.z.object({
    role: zod_1.z.enum(enums_1.UserRole),
});
