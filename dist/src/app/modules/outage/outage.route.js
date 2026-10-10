"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const outage_controller_1 = require("./outage.controller");
const outage_validation_1 = require("./outage.validation");
const validateRequest_1 = require("../../middleware/validateRequest");
const checkAuth_1 = require("../../middleware/checkAuth");
const enums_1 = require("../../../generated/prisma/enums");
const router = express_1.default.Router();
// ============================================================
// CREATE
// ============================================================
router.post('/', (0, checkAuth_1.auth)(enums_1.UserRole.TECHNICIAN, enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), (0, validateRequest_1.validateRequest)(outage_validation_1.OutageValidation.createOutageSchema), outage_controller_1.outageControllers.createOutage);
// ============================================================
// SEARCH
// ============================================================
router.get('/search', outage_controller_1.outageControllers.searchOutages);
// ============================================================
// ACTIVE OUTAGES
// ============================================================
router.get('/active', outage_controller_1.outageControllers.getActiveOutages);
// ============================================================
// OUTAGES BY AREA
// ============================================================
router.get('/area/:areaId', outage_controller_1.outageControllers.getOutagesByArea);
// ============================================================
// GET ALL
// ============================================================
router.get('/', (0, checkAuth_1.auth)(enums_1.UserRole.TECHNICIAN, enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), outage_controller_1.outageControllers.getAllOutages);
// ============================================================
// GET SINGLE
// IMPORTANT: Keep this AFTER all named routes
// ============================================================
router.get('/:id', (0, checkAuth_1.auth)(enums_1.UserRole.TECHNICIAN, enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), outage_controller_1.outageControllers.getSingleOutage);
// ============================================================
// UPDATE
// ============================================================
router.patch('/:id', (0, checkAuth_1.auth)(enums_1.UserRole.TECHNICIAN, enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), (0, validateRequest_1.validateRequest)(outage_validation_1.OutageValidation.updateOutageSchema), outage_controller_1.outageControllers.updateOutage);
// ============================================================
// DELETE
// ============================================================
router.delete('/:id', (0, checkAuth_1.auth)(enums_1.UserRole.TECHNICIAN, enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), outage_controller_1.outageControllers.deleteOutage);
// ============================================================
// EXPORT
// ============================================================
exports.outageRoutes = router;
