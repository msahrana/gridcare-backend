import express from 'express';
import { outageReportControllers } from './outageReport.controller';
import { OutageReportValidation } from './outageReport.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { auth } from '../../middleware/checkAuth';

const router = express.Router();

router.post(
    '/',
    auth(),
    validateRequest(OutageReportValidation.createOutageReportSchema),
    outageReportControllers.createOutageReport,
);

router.get('/outage/:outageId', outageReportControllers.getReportsByOutage);

router.get('/area/:areaId', outageReportControllers.getReportsByArea);

router.get('/', outageReportControllers.getAllOutageReports);

router.get('/:id', outageReportControllers.getSingleOutageReport);

router.patch(
    '/:id',
    auth(),
    validateRequest(OutageReportValidation.updateOutageReportSchema),
    outageReportControllers.updateOutageReport,
);

router.delete('/:id', auth(), outageReportControllers.deleteOutageReport);

export const outageReportRoutes = router;
