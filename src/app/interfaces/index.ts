import {
    TechnicianStatus,
    TechnicianVerificationStatus,
} from '../../generated/prisma/enums';

export interface IQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';

    searchTerm?: string;

    phone?: string;
    employeeId?: string;
    skills?: string;

    zoneId?: string;

    status?: TechnicianStatus;
    verificationStatus?: TechnicianVerificationStatus;
}
