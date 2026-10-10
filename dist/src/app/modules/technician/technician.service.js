"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.technicianServices = void 0;
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../lib/prisma");
const http_status_1 = __importDefault(require("http-status"));
const cloudinary_1 = require("../../lib/cloudinary");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../../config"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const redis_1 = require("../../lib/redis");
const nodemailer_1 = require("../../lib/nodemailer");
const enums_1 = require("../../../generated/prisma/enums");
const client_1 = require("../../../generated/prisma/client");
const randomPassword_1 = __importDefault(require("../../utils/randomPassword"));
// ======================================================
// Helper: Upload file to Cloudinary
// ======================================================
const uploadFileToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({
            resource_type: 'auto',
            folder: 'gridcare/technicians',
        }, (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'No result returned from Cloudinary'));
            }
            resolve(result);
        });
        uploadStream.end(file.buffer);
    });
};
// ======================================================
// Apply As Technician
// ======================================================
const applyAsTechnicianIntoDB = async (payload, resume, additionalFiles) => {
    // ==================================================
    // 1. Validate Payload
    // ==================================================
    if (!payload?.user) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'User information is required');
    }
    if (!payload?.technician) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Technician information is required');
    }
    if (!payload.user.name?.trim()) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Name is required');
    }
    if (!payload.user.email?.trim()) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Email is required');
    }
    if (!resume) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Resume is required');
    }
    // ==================================================
    // 2. Validate Resume
    // ==================================================
    const allowedResumeMimeTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const allowedResumeExtensions = ['.pdf', '.doc', '.docx'];
    const resumeExtension = path_1.default.extname(resume.originalname).toLowerCase();
    const isValidResume = allowedResumeMimeTypes.includes(resume.mimetype) ||
        allowedResumeExtensions.includes(resumeExtension);
    if (!isValidResume) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Resume must be a PDF, DOC, or DOCX file');
    }
    // ==================================================
    // 3. Check Existing User
    // ==================================================
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: {
            email: payload.user.email,
        },
    });
    if (existingUser) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'User already exists with this email');
    }
    // ==================================================
    // 4. Check Duplicate Phone
    // ==================================================
    const existingPhone = await prisma_1.prisma.technician.findUnique({
        where: {
            phone: payload.technician.phone,
        },
    });
    if (existingPhone) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Technician already exists with this phone number');
    }
    // ==================================================
    // 5. Check Duplicate Employee ID
    // ==================================================
    const existingEmployeeId = await prisma_1.prisma.technician.findUnique({
        where: {
            employeeId: payload.technician.employeeId,
        },
    });
    if (existingEmployeeId) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Technician already exists with this employee ID');
    }
    // ==================================================
    // 6. Upload Files
    // ==================================================
    let resumeUploadResult = null;
    const additionalFilesUploadResults = [];
    try {
        // ----------------------------------------------
        // Upload Resume
        // ----------------------------------------------
        resumeUploadResult = await uploadFileToCloudinary(resume);
        // ----------------------------------------------
        // Upload Additional Files
        // ----------------------------------------------
        for (const file of additionalFiles) {
            const uploadedFile = await uploadFileToCloudinary(file);
            additionalFilesUploadResults.push(uploadedFile);
        }
    }
    catch (error) {
        console.error('Technician file upload failed:', error);
        // ----------------------------------------------
        // Cleanup Uploaded Files
        // ----------------------------------------------
        const uploadedFiles = [
            ...(resumeUploadResult ? [resumeUploadResult] : []),
            ...additionalFilesUploadResults,
        ];
        await Promise.allSettled(uploadedFiles.map((file) => cloudinary_1.cloudinary.uploader.destroy(file.public_id, {
            resource_type: file.resource_type,
        })));
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to upload technician documents');
    }
    // At this point resume must exist
    if (!resumeUploadResult) {
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Resume upload failed');
    }
    // ==================================================
    // 7. Generate Temporary Password
    // ==================================================
    // const randomTechnicianPassword = crypto.randomBytes(8).toString('hex');
    // const hashedPassword = await bcrypt.hash(
    //     randomTechnicianPassword,
    //     Number(config.bcrypt_salt_rounds),
    // );
    // ==================================================
    // 8. Create User + Technician
    // ==================================================
    let technicianApplication;
    try {
        technicianApplication = await prisma_1.prisma.user.create({
            data: {
                name: payload.user.name.trim(),
                email: payload.user.email.trim().toLowerCase(),
                // password: hashedPassword,
                role: enums_1.UserRole.TECHNICIAN,
                needPasswordChange: true,
                technician: {
                    create: {
                        phone: payload.technician.phone,
                        employeeId: payload.technician.employeeId,
                        skills: payload.technician.skills,
                        experienceYears: payload.technician.experienceYears,
                        technicianFee: payload.technician.technicianFee,
                        zoneId: payload.technician.zoneId,
                        resume: resumeUploadResult.secure_url,
                        resumePublicId: resumeUploadResult.public_id,
                        additionalFiles: additionalFilesUploadResults.map((file) => ({
                            url: file.secure_url,
                            publicId: file.public_id,
                            resourceType: file.resource_type,
                            originalFilename: file.original_filename,
                        })),
                        verificationStatus: enums_1.TechnicianVerificationStatus.PENDING,
                        status: enums_1.TechnicianStatus.AVAILABLE,
                    },
                },
            },
            include: {
                technician: true,
            },
        });
    }
    catch (error) {
        console.error('Technician database creation failed:', error);
        // ----------------------------------------------
        // Cleanup Cloudinary
        // ----------------------------------------------
        const uploadedFiles = [
            resumeUploadResult,
            ...additionalFilesUploadResults,
        ];
        await Promise.allSettled(uploadedFiles.map((file) => cloudinary_1.cloudinary.uploader.destroy(file.public_id, {
            resource_type: file.resource_type,
        })));
        // ----------------------------------------------
        // Handle Prisma Errors
        // ----------------------------------------------
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002') {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Email, phone, or employee ID already exists');
        }
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to create technician application');
    }
    // ==================================================
    // 9. Generate OTP
    // ==================================================
    const expirationSeconds = 60 * 60;
    const otpKey = `technician-application-otp:${payload.user.email
        .trim()
        .toLowerCase()}`;
    const otpValue = crypto_1.default.randomInt(100000, 1000000).toString();
    if (config_1.default.node_env === 'development')
        console.log(`[dev] Doctor application OTP for ${payload.user.email}: ${otpValue}`);
    // ==================================================
    // 10. Save OTP to Redis
    // ==================================================
    try {
        await redis_1.redisClient.set(otpKey, otpValue, {
            expiration: {
                type: 'EX',
                value: expirationSeconds,
            },
        });
    }
    catch (error) {
        console.error('Redis OTP save failed:', error);
        // ----------------------------------------------
        // Rollback Database
        // ----------------------------------------------
        try {
            await prisma_1.prisma.user.delete({
                where: {
                    id: technicianApplication.id,
                },
            });
        }
        catch (deleteError) {
            console.error('User rollback failed:', deleteError);
        }
        // ----------------------------------------------
        // Cleanup Cloudinary
        // ----------------------------------------------
        await Promise.allSettled([resumeUploadResult, ...additionalFilesUploadResults].map((file) => cloudinary_1.cloudinary.uploader.destroy(file.public_id, {
            resource_type: file.resource_type,
        })));
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to generate verification OTP');
    }
    // ==================================================
    // 11. Render Email Template
    // ==================================================
    const templatePath = path_1.default.join(process.cwd(), 'src/app/templates/registration-user-otp.ejs');
    const templateData = {
        name: technicianApplication.name,
        email: technicianApplication.email,
        otp: otpValue,
        expirationMinutes: expirationSeconds / 60,
    };
    let html;
    try {
        html = await ejs_1.default.renderFile(templatePath, templateData);
    }
    catch (error) {
        console.error('Email template rendering failed:', error);
        // ----------------------------------------------
        // Delete OTP
        // ----------------------------------------------
        await redis_1.redisClient.del(otpKey);
        // ----------------------------------------------
        // Delete User + Technician
        // ----------------------------------------------
        try {
            await prisma_1.prisma.user.delete({
                where: {
                    id: technicianApplication.id,
                },
            });
        }
        catch (deleteError) {
            console.error('User rollback failed:', deleteError);
        }
        // ----------------------------------------------
        // Cleanup Cloudinary
        // ----------------------------------------------
        await Promise.allSettled([resumeUploadResult, ...additionalFilesUploadResults].map((file) => cloudinary_1.cloudinary.uploader.destroy(file.public_id, {
            resource_type: file.resource_type,
        })));
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to prepare verification email');
    }
    // ==================================================
    // 12. Send Verification Email
    // ==================================================
    try {
        await nodemailer_1.transporter.sendMail({
            from: config_1.default.email_sender,
            to: technicianApplication.email,
            subject: 'GridCare Technician Application - Email Verification',
            html,
        });
    }
    catch (error) {
        console.error('Technician verification email failed:', error);
        // ----------------------------------------------
        // Delete OTP
        // ----------------------------------------------
        await redis_1.redisClient.del(otpKey);
        // ----------------------------------------------
        // Delete User + Technician
        // ----------------------------------------------
        try {
            await prisma_1.prisma.user.delete({
                where: {
                    id: technicianApplication.id,
                },
            });
        }
        catch (deleteError) {
            console.error('User rollback failed:', deleteError);
        }
        // ----------------------------------------------
        // Cleanup Cloudinary
        // ----------------------------------------------
        await Promise.allSettled([resumeUploadResult, ...additionalFilesUploadResults].map((file) => cloudinary_1.cloudinary.uploader.destroy(file.public_id, {
            resource_type: file.resource_type,
        })));
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to send verification email');
    }
    // ==================================================
    // 13. Return Response
    // ==================================================
    return {
        id: technicianApplication.id,
        name: technicianApplication.name,
        email: technicianApplication.email,
        role: technicianApplication.role,
        technician: technicianApplication.technician,
        // Development only
        // temporaryPassword: randomTechnicianPassword,
    };
};
const verifyTechnicianEmailIntoDB = async (payload) => {
    const otp = payload.otp;
    const email = payload.email.trim().toLowerCase();
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email, role: enums_1.UserRole.TECHNICIAN },
    });
    if (!existingUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Technician Application Not Found. Please Apply Again.');
    }
    if (existingUser.emailVerified) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Email Already Verified');
    }
    const otpKey = `technician-application-otp:${email}`;
    const redisOtp = await redis_1.redisClient.get(otpKey);
    // if (config.node_env === 'development')
    //     console.log(
    //         `[dev] Doctor application OTP for ${payload.user.email}: ${otpValue}`,
    //     );
    if (!redisOtp) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'OTP Expired. Your Application Window Has Closed, Please Apply Again.');
    }
    if (redisOtp !== otp) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'OTP Does Not Match');
    }
    await redis_1.redisClient.del(otpKey);
    const verifiedUser = await prisma_1.prisma.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: true },
        omit: { password: true },
        include: { technician: true },
    });
    return verifiedUser;
};
const approveTechnicianIntoDB = async (payload, reviewer) => {
    const { technicianId, verificationStatus, rejectionReason } = payload;
    // ==========================================================
    // CHECK TECHNICIAN APPLICATION
    // ==========================================================
    const existingTechnician = await prisma_1.prisma.technician.findUnique({
        where: {
            id: technicianId,
        },
        include: {
            user: true,
        },
    });
    if (!existingTechnician) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Technician Application Not Found');
    }
    // ==========================================================
    // CHECK EMAIL VERIFICATION
    // ==========================================================
    if (!existingTechnician.user.emailVerified) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Technician Has Not Verified Their Email Yet. Application Cannot Be Reviewed.');
    }
    // ==========================================================
    // ONLY PENDING APPLICATION CAN BE REVIEWED
    // ==========================================================
    if (existingTechnician.verificationStatus !==
        enums_1.TechnicianVerificationStatus.PENDING) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Technician Application Has Already Been ${existingTechnician.verificationStatus.toLowerCase()}`);
    }
    // ==========================================================
    // REJECTION REASON
    // ==========================================================
    if (verificationStatus === enums_1.TechnicianVerificationStatus.REJECTED &&
        !rejectionReason) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Rejection Reason Is Required When Rejecting A Technician Application');
    }
    // ==========================================================
    // CREATE PASSWORD
    // ==========================================================
    const isApproved = verificationStatus === enums_1.TechnicianVerificationStatus.APPROVED;
    const randomDoctorPassword = isApproved
        ? (0, randomPassword_1.default)()
        : undefined;
    if (config_1.default.node_env === 'development' && randomDoctorPassword) {
        console.log(`[dev] Random Password plain text: ${randomDoctorPassword}`);
    }
    const hashedPassword = randomDoctorPassword
        ? await bcryptjs_1.default.hash(randomDoctorPassword, Number(config_1.default.bcrypt_salt_rounds))
        : undefined;
    // ==========================================================
    // UPDATE APPLICATION
    // ==========================================================
    const updatedTechnician = await prisma_1.prisma.technician.update({
        where: {
            id: technicianId,
        },
        data: {
            verificationStatus,
            rejectionReason: verificationStatus === enums_1.TechnicianVerificationStatus.REJECTED
                ? rejectionReason
                : null,
            ...(hashedPassword
                ? {
                    user: {
                        update: {
                            password: hashedPassword,
                            role: enums_1.UserRole.TECHNICIAN,
                        },
                    },
                }
                : {}),
        },
        include: {
            user: true,
        },
    });
    // ==========================================================
    // SEND EMAIL
    // ==========================================================
    const templatePath = path_1.default.join(process.cwd(), `src/app/templates/${isApproved
        ? 'technician-application-approved.ejs'
        : 'technician-application-rejected.ejs'}`);
    const templateData = {
        name: updatedTechnician.user.name,
        reason: updatedTechnician.rejectionReason,
    };
    const html = await ejs_1.default.renderFile(templatePath, templateData);
    await nodemailer_1.transporter.sendMail({
        from: config_1.default.email_sender,
        to: updatedTechnician.user.email,
        subject: isApproved
            ? 'Your Technician Application Has Been Approved'
            : 'Your Technician Application Has Been Rejected',
        html,
    });
    return updatedTechnician;
};
const getAllTechniciansIntoDB = async (query) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const andConditions = [];
    // Searching
    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    phone: {
                        contains: query.searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    employeeId: {
                        contains: query.searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    skills: {
                        contains: query.searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    user: {
                        name: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    user: {
                        email: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        });
    }
    // Filter by phone
    if (query.phone) {
        andConditions.push({
            phone: {
                contains: query.phone,
                mode: 'insensitive',
            },
        });
    }
    // Filter by employeeId
    if (query.employeeId) {
        andConditions.push({
            employeeId: {
                equals: query.employeeId,
                mode: 'insensitive',
            },
        });
    }
    // Filter by skills
    if (query.skills) {
        andConditions.push({
            skills: {
                contains: query.skills,
                mode: 'insensitive',
            },
        });
    }
    // Filter by verification status
    if (query.verificationStatus) {
        andConditions.push({
            verificationStatus: query.verificationStatus,
        });
    }
    // Filter by technician status
    if (query.status) {
        andConditions.push({
            status: query.status,
        });
    }
    // Only non-deleted technicians
    andConditions.push({
        deletedAt: null,
    });
    const allTechnicians = await prisma_1.prisma.technician.findMany({
        where: {
            AND: andConditions,
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            user: {
                omit: {
                    password: true,
                },
            },
        },
    });
    const totalTechnicianCount = await prisma_1.prisma.technician.count({
        where: {
            AND: andConditions,
        },
    });
    return {
        data: allTechnicians,
        meta: {
            page,
            limit,
            total: totalTechnicianCount,
            totalPages: Math.ceil(totalTechnicianCount / limit),
        },
    };
};
const updateTechnicianProfileIntoDB = async (payload, user) => {
    const existingTechnician = await prisma_1.prisma.technician.findUnique({
        where: { userId: user.id },
    });
    if (!existingTechnician) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Technician Profile Not Found');
    }
    const updatedTechnician = await prisma_1.prisma.technician.update({
        where: { id: existingTechnician.id },
        data: payload,
    });
    return updatedTechnician;
};
const getAvailableTechnicianByTodaysScheduleIntoDB = async (query) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const andConditions = [
        {
            verificationStatus: enums_1.TechnicianVerificationStatus.APPROVED,
        },
        {
            status: enums_1.TechnicianStatus.AVAILABLE,
        },
        {
            deletedAt: null,
        },
    ];
    // Search
    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    phone: {
                        contains: query.searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    employeeId: {
                        contains: query.searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    skills: {
                        contains: query.searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    user: {
                        name: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    user: {
                        email: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        });
    }
    // Filter by skills
    if (query.skills) {
        andConditions.push({
            skills: {
                contains: query.skills,
                mode: 'insensitive',
            },
        });
    }
    // Filter by zone
    if (query.zoneId) {
        andConditions.push({
            zoneId: query.zoneId,
        });
    }
    const availableTechnicians = await prisma_1.prisma.technician.findMany({
        where: {
            AND: andConditions,
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            user: {
                omit: {
                    password: true,
                },
            },
        },
    });
    const totalAvailableTechnicianCount = await prisma_1.prisma.technician.count({
        where: {
            AND: andConditions,
        },
    });
    return {
        data: availableTechnicians,
        meta: {
            page,
            limit,
            total: totalAvailableTechnicianCount,
            totalPages: Math.ceil(totalAvailableTechnicianCount / limit),
        },
    };
};
const getAllTechniciansListPublicIntoDB = async (query) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    // ==================================================
    // Pagination Validation
    // ==================================================
    const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 10;
    const safePage = Number.isInteger(page) && page > 0 ? page : 1;
    const safeSkip = (safePage - 1) * safeLimit;
    // ==================================================
    // Sort Validation
    // ==================================================
    const allowedSortFields = [
        'createdAt',
        'updatedAt',
        'experienceYears',
        'technicianFee',
        'employeeId',
        'phone',
    ];
    const sortBy = allowedSortFields.includes(query.sortBy || '')
        ? query.sortBy
        : 'createdAt';
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
    // ==================================================
    // Conditions
    // ==================================================
    const andConditions = [
        {
            verificationStatus: enums_1.TechnicianVerificationStatus.APPROVED,
        },
        {
            status: enums_1.TechnicianStatus.AVAILABLE,
        },
        {
            deletedAt: null,
        },
    ];
    // ==================================================
    // Search
    // ==================================================
    if (query.searchTerm?.trim()) {
        const searchTerm = query.searchTerm.trim();
        andConditions.push({
            OR: [
                {
                    phone: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    employeeId: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    skills: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    user: {
                        name: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    user: {
                        email: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        });
    }
    // ==================================================
    // Skills Filter
    // ==================================================
    if (query.skills?.trim()) {
        andConditions.push({
            skills: {
                contains: query.skills.trim(),
                mode: 'insensitive',
            },
        });
    }
    // ==================================================
    // Zone Filter
    // ==================================================
    if (query.zoneId?.trim()) {
        andConditions.push({
            zoneId: query.zoneId.trim(),
        });
    }
    // ==================================================
    // Get Technicians
    // ==================================================
    const [allTechnicians, totalTechnicianCount] = await Promise.all([
        prisma_1.prisma.technician.findMany({
            where: {
                AND: andConditions,
            },
            take: safeLimit,
            skip: safeSkip,
            orderBy: {
                [sortBy]: sortOrder,
            },
            select: {
                id: true,
                phone: true,
                employeeId: true,
                skills: true,
                experienceYears: true,
                technicianFee: true,
                status: true,
                verificationStatus: true,
                zoneId: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        imageUrl: true,
                    },
                },
            },
        }),
        prisma_1.prisma.technician.count({
            where: {
                AND: andConditions,
            },
        }),
    ]);
    // ==================================================
    // Return
    // ==================================================
    return {
        data: allTechnicians,
        meta: {
            page: safePage,
            limit: safeLimit,
            total: totalTechnicianCount,
            totalPages: Math.ceil(totalTechnicianCount / safeLimit),
        },
    };
};
const getSingleTechnicianPublicProfileIntoDB = async (technicianId) => {
    if (!technicianId) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Technician ID is required');
    }
    const technician = await prisma_1.prisma.technician.findFirst({
        where: {
            id: technicianId,
            deletedAt: null,
            verificationStatus: enums_1.TechnicianVerificationStatus.APPROVED,
            status: enums_1.TechnicianStatus.AVAILABLE,
        },
        select: {
            id: true,
            phone: true,
            employeeId: true,
            skills: true,
            experienceYears: true,
            technicianFee: true,
            status: true,
            verificationStatus: true,
            zoneId: true,
            createdAt: true,
            user: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true,
                },
            },
        },
    });
    if (!technician) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Technician Not Found');
    }
    return technician;
};
exports.technicianServices = {
    applyAsTechnicianIntoDB,
    verifyTechnicianEmailIntoDB,
    approveTechnicianIntoDB,
    getAllTechniciansIntoDB,
    updateTechnicianProfileIntoDB,
    getAvailableTechnicianByTodaysScheduleIntoDB,
    getAllTechniciansListPublicIntoDB,
    getSingleTechnicianPublicProfileIntoDB,
};
