import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { outageAssignmentServices } from './outageAssignment.service';
import { sendResponse } from '../../utils/sendResponse';

const createOutageAssignment = catchAsync(async (req, res) => {
    const assignedById = req.user?.id;

    const result = await outageAssignmentServices.createOutageAssignmentIntoDB(
        assignedById as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Outage Assigned to Technician Successfully!',
        data: result,
    });
});

const getAllOutageAssignments = catchAsync(async (req, res) => {
    const result =
        await outageAssignmentServices.getAllOutageAssignmentsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Outage Assignments Retrieved Successfully!',
        data: result,
    });
});

const getSingleOutageAssignment = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result =
        await outageAssignmentServices.getSingleOutageAssignmentFromDB(
            id as string,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Outage Assignment Retrieved Successfully!',
        data: result,
    });
});

const updateOutageAssignment = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await outageAssignmentServices.updateOutageAssignmentIntoDB(
        id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Outage Assignment Updated Successfully!',
        data: result,
    });
});

const deleteOutageAssignment = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await outageAssignmentServices.deleteOutageAssignmentFromDB(
        id as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Outage Assignment Deleted Successfully!',
        data: result,
    });
});

const getAssignmentsByOutage = catchAsync(async (req, res) => {
    const { outageId } = req.params;

    const result = await outageAssignmentServices.getAssignmentsByOutageFromDB(
        outageId as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Outage Assignments Retrieved Successfully!',
        data: result,
    });
});

const getAssignmentsByTechnician = catchAsync(async (req, res) => {
    const { technicianId } = req.params;

    const result =
        await outageAssignmentServices.getAssignmentsByTechnicianFromDB(
            technicianId as string,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Technician Assignments Retrieved Successfully!',
        data: result,
    });
});

const getMyAssignments = catchAsync(async (req, res) => {
    const userId = req.user?.id;

    const result = await outageAssignmentServices.getMyAssignmentsFromDB(
        userId as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My Outage Assignments Retrieved Successfully!',
        data: result,
    });
});

export const outageAssignmentControllers = {
    createOutageAssignment,
    getAllOutageAssignments,
    getSingleOutageAssignment,
    updateOutageAssignment,
    deleteOutageAssignment,
    getAssignmentsByOutage,
    getAssignmentsByTechnician,
    getMyAssignments,
};
