import { Router } from 'express';
import { upload } from '../../lib/multer';
import { technicianControllers } from './technician.controller';
import { UserRole } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { updateTechnicianVerificationValidationSchema } from './technician.validation';

const router = Router();

router.post(
    '/apply-as-technician',
    upload.fields([
        {
            name: 'resume',
            maxCount: 1,
        },
        {
            name: 'additionalFiles',
            maxCount: 5,
        },
    ]),
    technicianControllers.applyAsTechnician,
);

router.post(
    '/apply-as-technician/verify-email',
    technicianControllers.verifyTechnicianEmail,
);

router.post(
    '/approve-technician',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    technicianControllers.approveTechnician,
);

router.get(
    '/all-technician',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    technicianControllers.getAllTechnicians,
);

router.patch(
    '/update-my-profile',
    auth(UserRole.TECHNICIAN),
    validateRequest(updateTechnicianVerificationValidationSchema),
    technicianControllers.updateTechnicianProfile,
);

router.get(
    '/public/available-today',
    technicianControllers.getAvailableTechnicianByTodaysSchedule,
);

router.get(
    '/public/all-technician',
    technicianControllers.getAllTechniciansListPublic,
);

router.get(
    '/public/:technicianId',
    technicianControllers.getSingleTechnicianPublicProfile,
);

export const technicianRoutes = router;
