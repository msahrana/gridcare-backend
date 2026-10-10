"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSheddingScheduleRoutes = void 0;
const express_1 = require("express");
const checkAuth_1 = require("../../middleware/checkAuth");
const validateRequest_1 = require("../../middleware/validateRequest");
const enums_1 = require("../../../generated/prisma/enums");
const loadSheddingSchedule_controller_1 = require("./loadSheddingSchedule.controller");
const loadSheddingSchedule_validation_1 = require("./loadSheddingSchedule.validation");
const router = (0, express_1.Router)();
// Upcoming schedules
router.get('/upcoming', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR, enums_1.UserRole.CUSTOMER), loadSheddingSchedule_controller_1.loadSheddingScheduleControllers.getUpcomingLoadSheddingSchedules);
// Create
router.post('/', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), (0, validateRequest_1.validateRequest)(loadSheddingSchedule_validation_1.LoadSheddingScheduleValidation.createLoadSheddingScheduleValidationSchema), loadSheddingSchedule_controller_1.loadSheddingScheduleControllers.createLoadSheddingSchedule);
// Get all
router.get('/', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), loadSheddingSchedule_controller_1.loadSheddingScheduleControllers.getAllLoadSheddingSchedules);
// Get single
router.get('/:id', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), loadSheddingSchedule_controller_1.loadSheddingScheduleControllers.getSingleLoadSheddingSchedule);
// Update
router.patch('/:id', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), (0, validateRequest_1.validateRequest)(loadSheddingSchedule_validation_1.LoadSheddingScheduleValidation.updateLoadSheddingScheduleValidationSchema), loadSheddingSchedule_controller_1.loadSheddingScheduleControllers.updateLoadSheddingSchedule);
// Publish
router.patch('/:id/publish', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), loadSheddingSchedule_controller_1.loadSheddingScheduleControllers.publishLoadSheddingSchedule);
// Activate
router.patch('/:id/activate', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), loadSheddingSchedule_controller_1.loadSheddingScheduleControllers.activateLoadSheddingSchedule);
// Complete
router.patch('/:id/complete', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), loadSheddingSchedule_controller_1.loadSheddingScheduleControllers.completeLoadSheddingSchedule);
// Cancel
router.patch('/:id/cancel', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), loadSheddingSchedule_controller_1.loadSheddingScheduleControllers.cancelLoadSheddingSchedule);
// Delete
router.delete('/:id', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN), loadSheddingSchedule_controller_1.loadSheddingScheduleControllers.deleteLoadSheddingSchedule);
exports.loadSheddingScheduleRoutes = router;
