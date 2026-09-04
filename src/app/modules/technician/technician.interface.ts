import {
    TechnicianStatus,
    TechnicianVerificationStatus,
} from '../../../generated/prisma/enums';

// ======================================================
// Apply As Technician
// ======================================================

export interface IApplyAsTechnicianPayload {
    user: {
        name: string;
        email: string;
    };

    technician: {
        phone: string;
        employeeId: string;
        skills?: string;
        experienceYears: number;
        technicianFee?: number;
        zoneId?: string;
    };
}

// ======================================================
// Verify Technician Email
// ======================================================

export interface IVerifyTechnicianEmailPayload {
    email: string;
    otp: string;
}

// ======================================================
// Approve Technician
// ======================================================

export interface IApproveTechnicianPayload {
    technicianId: string;
    verificationStatus: TechnicianVerificationStatus;
    rejectionReason?: string;
}

// ======================================================
// Update Technician
// ======================================================

export interface IUpdateTechnicianPayload {
    phone?: string;
    employeeId?: string;
    skills?: string;
    experienceYears?: number;
    technicianFee?: number;
    zoneId?: string;
}

// ======================================================
// Update Technician Status
// ======================================================

export interface IUpdateTechnicianStatusPayload {
    status: TechnicianStatus;
}

// ======================================================
// Update Technician Verification
// ======================================================

export interface IUpdateTechnicianVerificationPayload {
    verificationStatus: TechnicianVerificationStatus;
    rejectionReason?: string;
}

// ======================================================
// Reject Technician
// ======================================================

export interface IRejectTechnicianPayload {
    rejectionReason: string;
}

// ======================================================
// Update Technician Profile
// ======================================================

export interface IUpdateTechnicianProfilePayload {
    phone?: string;
}
