"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.technicianRoutes = void 0;
const express_1 = require("express");
const multer_1 = require("../../lib/multer");
const technician_controller_1 = require("./technician.controller");
const enums_1 = require("../../../generated/prisma/enums");
const checkAuth_1 = require("../../middleware/checkAuth");
const validateRequest_1 = require("../../middleware/validateRequest");
const technician_validation_1 = require("./technician.validation");
const router = (0, express_1.Router)();
router.post('/apply-as-technician', multer_1.upload.fields([
    {
        name: 'resume',
        maxCount: 1,
    },
    {
        name: 'additionalFiles',
        maxCount: 5,
    },
]), technician_controller_1.technicianControllers.applyAsTechnician);
router.post('/apply-as-technician/verify-email', technician_controller_1.technicianControllers.verifyTechnicianEmail);
router.post('/approve-technician', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), technician_controller_1.technicianControllers.approveTechnician);
router.get('/all-technician', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), technician_controller_1.technicianControllers.getAllTechnicians);
router.patch('/update-my-profile', (0, checkAuth_1.auth)(enums_1.UserRole.TECHNICIAN), (0, validateRequest_1.validateRequest)(technician_validation_1.updateTechnicianVerificationValidationSchema), technician_controller_1.technicianControllers.updateTechnicianProfile);
router.get('/public/available-today', technician_controller_1.technicianControllers.getAvailableTechnicianByTodaysSchedule);
router.get('/public/all-technician', technician_controller_1.technicianControllers.getAllTechniciansListPublic);
router.get('/public/:technicianId', technician_controller_1.technicianControllers.getSingleTechnicianPublicProfile);
exports.technicianRoutes = router;
