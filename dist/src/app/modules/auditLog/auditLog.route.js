"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogRoutes = void 0;
const express_1 = require("express");
const enums_1 = require("../../../generated/prisma/enums");
const checkAuth_1 = require("../../middleware/checkAuth");
const validateRequest_1 = require("../../middleware/validateRequest");
const auditLog_controller_1 = require("./auditLog.controller");
const auditLog_validation_1 = require("./auditLog.validation");
const router = (0, express_1.Router)();
// ======================================================
// CREATE
// ======================================================
router.post('/', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), (0, validateRequest_1.validateRequest)(auditLog_validation_1.AuditLogValidation.createAuditLogValidationSchema), auditLog_controller_1.auditLogControllers.createAuditLog);
// ======================================================
// GET ALL
// ======================================================
router.get('/', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), auditLog_controller_1.auditLogControllers.getAllAuditLogs);
// ======================================================
// GET BY ENTITY
// ======================================================
router.get('/entity/:entityId', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), auditLog_controller_1.auditLogControllers.getAuditLogsByEntity);
// ======================================================
// GET SINGLE
// ======================================================
router.get('/:id', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), auditLog_controller_1.auditLogControllers.getSingleAuditLog);
// ======================================================
// DELETE
// ======================================================
router.delete('/:id', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN), auditLog_controller_1.auditLogControllers.deleteAuditLog);
exports.auditLogRoutes = router;
