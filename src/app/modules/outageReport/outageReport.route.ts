import express from 'express';
import { outageReportControllers } from './outageReport.controller';
import { OutageReportValidation } from './outageReport.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { auth } from '../../middleware/checkAuth';
import { UserRole } from '../../../generated/prisma/enums';

const router = express.Router();

router.post(
    '/',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(OutageReportValidation.createOutageReportSchema),
    outageReportControllers.createOutageReport,
);

router.get('/outage/:outageId', outageReportControllers.getReportsByOutage);

router.get('/area/:areaId', outageReportControllers.getReportsByArea);

router.get('/', outageReportControllers.getAllOutageReports);

router.get('/:id', outageReportControllers.getSingleOutageReport);

router.patch(
    '/:id',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(OutageReportValidation.updateOutageReportSchema),
    outageReportControllers.updateOutageReport,
);

router.delete(
    '/:id',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    outageReportControllers.deleteOutageReport,
);

export const outageReportRoutes = router;
