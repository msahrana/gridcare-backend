import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { applyTechnicianValidationSchema } from './technician.validation';
import { AppError } from '../../errors/AppError';
import httpStatus from 'http-status';
import { technicianServices } from './technician.service';
import { sendResponse } from '../../utils/sendResponse';

const applyAsTechnician = catchAsync(async (req: Request, res: Response) => {
    // ==============================================
    // Get Uploaded Files
    // ==============================================

    const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
    };

    const resume = files?.['resume']?.[0] || null;

    const additionalFiles = files?.['additionalFiles'] || [];

    // ==============================================
    // Check Data
    // ==============================================

    if (!req.body.data) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Technician application data is required',
        );
    }

    // ==============================================
    // Parse JSON
    // ==============================================

    let parsedData: unknown;

    try {
        parsedData = JSON.parse(req.body.data);
    } catch (error) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid JSON data');
    }

    // ==============================================
    // Zod Validation
    // ==============================================

    const zodValidationResult =
        applyTechnicianValidationSchema.safeParse(parsedData);

    if (!zodValidationResult.success) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            zodValidationResult.error.issues[0].message,
        );
    }

    // ==============================================
    // Payload
    // ==============================================

    const payload = zodValidationResult.data;

    // ==============================================
    // Apply As Technician
    // ==============================================

    const result = await technicianServices.applyAsTechnicianIntoDB(
        payload,
        resume,
        additionalFiles,
    );

    // ==============================================
    // Response
    // ==============================================

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Applied As Technician Successful!!',
        data: result,
    });
});

const verifyTechnicianEmail = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;

        const result =
            await technicianServices.verifyTechnicianEmailIntoDB(payload);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Technician Email Verified Successfully!!',
            data: result,
        });
    },
);

const approveTechnician = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.user!;

    const result = await technicianServices.approveTechnicianIntoDB(
        payload,
        user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Technician Email Approved Successfully!!',
        data: result,
    });
});

const getAllTechnicians = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const { data, meta } =
        await technicianServices.getAllTechniciansIntoDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Technicians Retrieved Successfully!!',
        data: data,
        meta: meta,
    });
});

const updateTechnicianProfile = catchAsync(
    async (req: Request, res: Response) => {
        const payload = req.body;
        const user = req.user!;

        const result = await technicianServices.updateTechnicianProfileIntoDB(
            payload,
            user,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Technician Profile Updated Successfully!!',
            data: result,
        });
    },
);

const getAvailableTechnicianByTodaysSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const query = req.query;

        const { data, meta } =
            await technicianServices.getAvailableTechnicianByTodaysScheduleIntoDB(
                query,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Today's Available Technician Retrieved Successfully!",
            data,
            meta,
        });
    },
);

const getAllTechniciansListPublic = catchAsync(
    async (req: Request, res: Response) => {
        const query = req.query;

        const { data, meta } =
            await technicianServices.getAllTechniciansListPublicIntoDB(query);

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Technician Retrieved Successfully!!',
            data,
            meta,
        });
    },
);

const getSingleTechnicianPublicProfile = catchAsync(
    async (req: Request, res: Response) => {
        const technicianId = req.params.doctorId as string;

        const result =
            await technicianServices.getSingleTechnicianPublicProfileIntoDB(
                technicianId,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Technician Profile Retrieved Successfully!',
            data: result,
        });
    },
);

export const technicianControllers = {
    applyAsTechnician,
    verifyTechnicianEmail,
    approveTechnician,
    getAllTechnicians,
    updateTechnicianProfile,
    getAvailableTechnicianByTodaysSchedule,
    getAllTechniciansListPublic,
    getSingleTechnicianPublicProfile,
};
