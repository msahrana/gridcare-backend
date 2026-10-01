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

    const files =
        (req.files as {
            [fieldname: string]: Express.Multer.File[];
        }) || {};

    const resume = files.resume?.[0] ?? null;

    const additionalFiles = files.additionalFiles ?? [];

    // ==============================================
    // Check Request Body
    // ==============================================

    if (!req.body) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Request body is required');
    }

    // ==============================================
    // Get Application Data
    // ==============================================

    const { data } = req.body;

    if (!data) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Technician application data is required',
        );
    }

    if (typeof data !== 'string') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Technician application data must be a valid JSON string',
        );
    }

    // ==============================================
    // Parse JSON
    // ==============================================

    let parsedData: unknown;

    try {
        parsedData = JSON.parse(data);
    } catch {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Invalid technician application JSON data',
        );
    }

    // ==============================================
    // Validate Application Data
    // ==============================================

    const validationResult =
        applyTechnicianValidationSchema.safeParse(parsedData);

    if (!validationResult.success) {
        const firstIssue = validationResult.error.issues[0];

        const errorMessage =
            firstIssue?.message || 'Invalid technician application data';

        throw new AppError(httpStatus.BAD_REQUEST, errorMessage);
    }

    // ==============================================
    // Validated Payload
    // ==============================================

    const payload = validationResult.data;

    // ==============================================
    // Resume Validation
    // ==============================================

    if (!resume) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Resume is required');
    }

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
        message:
            'Applied as technician successfully, Now verification account by OTP',
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
        const { technicianId } = req.params;

        if (!technicianId) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Technician ID is required',
            );
        }

        const result =
            await technicianServices.getSingleTechnicianPublicProfileIntoDB(
                technicianId as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Technician public profile retrieved successfully',
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
