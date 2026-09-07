
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
    
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_express21 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);

// src/app/config/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);
import_dotenv.default.config({
  path: import_path.default.join(process.cwd(), ".env")
});
var config_default = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  backend_url: process.env.BACKEND_URL,
  frontend_url: process.env.FRONTEND_URL,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  admin_name: process.env.ADMIN_NAME,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  operator_name: process.env.OPERATOR_NAME,
  operator_email: process.env.OPERATOR_EMAIL,
  operator_password: process.env.OPERATOR_PASSWORD,
  technician_name: process.env.TECHNICIAN_NAME,
  technician_email: process.env.TECHNICIAN_EMAIL,
  technician_password: process.env.TECHNICIAN_PASSWORD,
  redis_user: process.env.REDIS_USER,
  redis_password: process.env.REDIS_PASSWORD,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  email_sender: process.env.EMAIL_SENDER,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  bkash_base_url: process.env.BKASH_BASE_URL,
  bkash_username: process.env.BKASH_USERNAME,
  bkash_password: process.env.BKASH_PASSWORD,
  bkash_app_key: process.env.BKASH_APP_KEY,
  bkash_app_secret: process.env.BKASH_APP_SECRET,
  bkash_callback_url: process.env.BKASH_CALLBACK_URL
};

// src/app/routes/index.ts
var import_express20 = require("express");

// src/app/modules/auth/auth.route.ts
var import_express = require("express");

// src/app/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
var catchAsync_default = catchAsync;

// src/app/errors/AppError.ts
var AppError = class extends Error {
  statusCode;
  isOperational;
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
};

// src/app/lib/prisma.ts
var import_config = require("dotenv/config");
var import_adapter_pg = require("@prisma/adapter-pg");

// src/generated/prisma/client.ts
var path2 = __toESM(require("path"), 1);
var import_node_url = require("url");

// src/generated/prisma/internal/class.ts
var runtime = __toESM(require("@prisma/client/runtime/client"), 1);
var config = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Area {\n  id           String    @id @default(uuid())\n  name         String\n  code         String    @unique\n  zoneId       String\n  substationId String?\n  feederId     String?\n  address      String?\n  latitude     Float?\n  longitude    Float?\n  isActive     Boolean   @default(true)\n  deletedAt    DateTime?\n\n  zone       Zone        @relation(fields: [zoneId], references: [id])\n  substation Substation? @relation(fields: [substationId], references: [id])\n  feeder     Feeder?     @relation(fields: [feederId], references: [id])\n\n  loadSheddingSchedules LoadSheddingSchedule[]\n  outages               Outage[]\n  reports               OutageReport[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([zoneId])\n  @@index([substationId])\n  @@index([feederId])\n  @@index([name])\n  @@map("areas")\n}\n\nmodel AuditLog {\n  id String @id @default(uuid())\n\n  actorId String\n  action  String\n\n  entity   String\n  entityId String\n\n  oldValue Json?\n  newValue Json?\n\n  ipAddress String?\n\n  actor User @relation("AuditActor", fields: [actorId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  @@index([actorId])\n  @@index([entity, entityId])\n  @@index([createdAt])\n  @@map("audit_logs")\n}\n\nenum UserRole {\n  CUSTOMER\n  TECHNICIAN\n  OPERATOR\n  ADMIN\n}\n\nenum UserStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum ScheduleStatus {\n  DRAFT\n  PUBLISHED\n  ACTIVE\n  COMPLETED\n  CANCELLED\n}\n\nenum OutageType {\n  PLANNED\n  UNEXPECTED\n}\n\nenum OutageStatus {\n  REPORTED\n  VERIFIED\n  ASSIGNED\n  IN_PROGRESS\n  RESTORED\n  CLOSED\n  CANCELLED\n}\n\nenum Priority {\n  LOW\n  MEDIUM\n  HIGH\n  CRITICAL\n}\n\nenum TechnicianStatus {\n  AVAILABLE\n  BUSY\n  OFFLINE\n}\n\nenum TechnicianVerificationStatus {\n  PENDING\n  APPROVED\n  REJECTED\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n  REFUNDED\n}\n\nenum PaymentGateway {\n  BKASH\n  STRIPE\n  SSLCOMMERZ\n}\n\nenum AuthProvider {\n  GOOGLE\n  CREDENTIAL\n}\n\nenum AssignmentStatus {\n  ASSIGNED\n  ACCEPTED\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nenum SubscriptionPlanStatus {\n  ACTIVE\n  INACTIVE\n}\n\nenum SubscriptionStatus {\n  PENDING\n  ACTIVE\n  EXPIRED\n  CANCELLED\n}\n\nenum RestorationStatus {\n  IN_PROGRESS\n  COMPLETED\n  CANCELLED\n}\n\nmodel Feeder {\n  id           String    @id @default(uuid())\n  name         String\n  code         String    @unique\n  substationId String\n  status       String?\n  deletedAt    DateTime?\n\n  substation Substation @relation(fields: [substationId], references: [id])\n  areas      Area[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([substationId])\n  @@map("feeders")\n}\n\nmodel LoadSheddingSchedule {\n  id String @id @default(uuid())\n\n  areaId String\n  title  String\n\n  description String?\n\n  startTime DateTime\n  endTime   DateTime\n\n  status ScheduleStatus @default(DRAFT)\n\n  createdById String\n\n  area Area @relation(fields: [areaId], references: [id])\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  deletedAt DateTime?\n\n  @@index([areaId])\n  @@index([startTime])\n  @@index([status])\n  @@index([createdById])\n  @@map("load_shedding_schedules")\n}\n\nmodel Notification {\n  id     String @id @default(uuid())\n  userId String\n\n  title   String\n  message String\n  isRead  Boolean @default(false)\n\n  user User @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  @@index([userId, isRead])\n  @@map("notifications")\n}\n\nmodel Outage {\n  id          String  @id @default(uuid())\n  areaId      String\n  title       String\n  description String?\n\n  type     OutageType\n  priority Priority     @default(MEDIUM)\n  status   OutageStatus @default(REPORTED)\n\n  startedAt  DateTime?\n  restoredAt DateTime?\n\n  area Area @relation(fields: [areaId], references: [id])\n\n  reports     OutageReport[]\n  assignments OutageAssignment[]\n  restoration Restoration?\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  deletedAt DateTime?\n\n  @@index([areaId])\n  @@index([status])\n  @@index([priority])\n  @@index([type])\n  @@map("outages")\n}\n\nmodel OutageAssignment {\n  id           String @id @default(uuid())\n  outageId     String\n  technicianId String\n  assignedById String\n\n  status AssignmentStatus @default(ASSIGNED)\n\n  assignedAt  DateTime  @default(now())\n  acceptedAt  DateTime?\n  startedAt   DateTime?\n  completedAt DateTime?\n\n  outage     Outage     @relation(fields: [outageId], references: [id])\n  technician Technician @relation(fields: [technicianId], references: [id])\n  assignedBy User       @relation("AssignmentCreator", fields: [assignedById], references: [id])\n\n  @@unique([outageId, technicianId])\n  @@index([outageId])\n  @@index([technicianId])\n  @@index([assignedById])\n  @@index([status])\n  @@map("outage_assignments")\n}\n\nmodel OutageReport {\n  id String @id @default(uuid())\n\n  outageId   String?\n  reporterId String\n  areaId     String\n\n  description String\n  latitude    Float?\n  longitude   Float?\n\n  outage   Outage? @relation(fields: [outageId], references: [id])\n  reporter User    @relation(fields: [reporterId], references: [id])\n  area     Area    @relation(fields: [areaId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([reporterId])\n  @@index([areaId])\n  @@index([outageId])\n  @@map("outage_reports")\n}\n\nmodel Profile {\n  id        String  @id @default(uuid())\n  userId    String  @unique\n  phone     String?\n  address   String?\n  avatarUrl String?\n\n  user User @relation(fields: [userId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("profiles")\n}\n\nmodel Restoration {\n  id           String  @id @default(uuid())\n  outageId     String  @unique\n  technicianId String?\n\n  startedAt   DateTime?\n  completedAt DateTime?\n  duration    Int? // duration in minutes\n\n  status  RestorationStatus @default(IN_PROGRESS)\n  remarks String?\n\n  outage     Outage      @relation(fields: [outageId], references: [id])\n  technician Technician? @relation(fields: [technicianId], references: [id])\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([technicianId])\n  @@index([status])\n  @@map("restorations")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Subscription {\n  id String @id @default(uuid())\n\n  // =========================\n  // Customer\n  // =========================\n\n  userId String\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // =========================\n  // Subscription Plan\n  // =========================\n\n  planId String\n\n  plan SubscriptionPlan @relation(fields: [planId], references: [id], onDelete: Restrict)\n\n  // =========================\n  // Subscription Period\n  // =========================\n\n  startDate DateTime?\n  endDate   DateTime?\n\n  // =========================\n  // Status\n  // =========================\n\n  status SubscriptionStatus @default(PENDING)\n\n  // =========================\n  // Payments\n  // =========================\n\n  payments SubscriptionPayment[]\n\n  // =========================\n  // Timestamps\n  // =========================\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n  @@index([planId])\n  @@index([status])\n  @@index([startDate])\n  @@index([endDate])\n  @@map("subscriptions")\n}\n\nmodel SubscriptionPayment {\n  id String @id @default(uuid())\n\n  // =========================\n  // User / Customer\n  // =========================\n\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  // =========================\n  // Related Subscription\n  // =========================\n\n  subscriptionId String\n  subscription   Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Restrict)\n\n  // =========================\n  // Payment Information\n  // =========================\n\n  status         PaymentStatus  @default(PENDING)\n  amount         Decimal        @db.Decimal(10, 2)\n  currency       String         @default("BDT")\n  paymentGateway PaymentGateway @default(BKASH)\n\n  // =========================\n  // Merchant Information\n  // =========================\n\n  merchantInvoiceNumber String @unique\n\n  // =========================\n  // bKash Information\n  // =========================\n\n  bkashPaymentId String? @unique\n  bkashTrxId     String? @unique\n  payerReference String?\n\n  // =========================\n  // Gateway Response\n  // =========================\n\n  gatewayResponse Json?\n\n  // =========================\n  // Payment Information\n  // =========================\n\n  paidAt DateTime?\n\n  // =========================\n  // Refund Information\n  // =========================\n\n  refundTrxId  String?\n  refundReason String?\n  refundedAt   DateTime?\n  refundAmount Decimal?  @db.Decimal(10, 2)\n\n  // =========================\n  // Stripe Information\n  // Future Support\n  // =========================\n\n  stripeSessionId       String? @unique\n  stripePaymentIntentId String? @unique\n  stripeCustomerId      String?\n\n  // =========================\n  // Timestamps\n  // =========================\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  // =========================\n  // Indexes\n  // =========================\n\n  @@index([userId])\n  @@index([subscriptionId])\n  @@index([status])\n  @@index([paymentGateway])\n  @@index([createdAt])\n  @@map("subscription_payments")\n}\n\nmodel SubscriptionPlan {\n  id String @id @default(uuid())\n\n  name        String\n  description String?\n\n  price Decimal @db.Decimal(10, 2)\n\n  durationDays Int\n\n  status SubscriptionPlanStatus @default(ACTIVE)\n\n  subscriptions Subscription[]\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  deletedAt DateTime?\n\n  @@index([status])\n  @@index([price])\n  @@map("subscription_plans")\n}\n\nmodel Substation {\n  id        String    @id @default(uuid())\n  name      String\n  code      String    @unique\n  zoneId    String\n  capacity  Float?\n  isActive  Boolean   @default(true)\n  deletedAt DateTime?\n\n  zone    Zone     @relation(fields: [zoneId], references: [id])\n  feeders Feeder[]\n  areas   Area[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([zoneId])\n  @@map("substations")\n}\n\nmodel Technician {\n  id String @id @default(uuid())\n\n  userId     String @unique\n  phone      String @unique\n  employeeId String @unique\n\n  skills          String?\n  experienceYears Int     @default(0)\n\n  resume         String?\n  resumePublicId String?\n\n  additionalFiles Json?\n\n  status             TechnicianStatus             @default(AVAILABLE)\n  verificationStatus TechnicianVerificationStatus @default(PENDING)\n\n  rejectionReason String?\n\n  zoneId    String?\n  deletedAt DateTime?\n\n  user         User               @relation(fields: [userId], references: [id])\n  assignments  OutageAssignment[]\n  restorations Restoration[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([status])\n  @@index([zoneId])\n  @@index([verificationStatus])\n  @@map("technicians")\n}\n\nmodel User {\n  id       String     @id @default(uuid())\n  name     String\n  email    String     @unique\n  password String?\n  role     UserRole   @default(CUSTOMER)\n  status   UserStatus @default(ACTIVE)\n\n  emailVerified      Boolean @default(false)\n  isDeleted          Boolean @default(false)\n  needPasswordChange Boolean @default(false)\n\n  googleId     String?      @unique\n  authProvider AuthProvider @default(CREDENTIAL)\n\n  imageUrl      String @default("")\n  imagePublicId String @default("")\n\n  // =========================\n  // User Relations\n  // =========================\n\n  profile Profile?\n\n  subscriptions        Subscription[]\n  subscriptionPayments SubscriptionPayment[]\n\n  reports       OutageReport[]\n  assignments   OutageAssignment[] @relation("AssignmentCreator")\n  notifications Notification[]\n  auditLogs     AuditLog[]         @relation("AuditActor")\n\n  technician Technician?\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  deletedAt DateTime?\n\n  @@index([email])\n  @@index([role])\n  @@index([status])\n  @@map("users")\n}\n\nmodel Zone {\n  id          String    @id @default(uuid())\n  name        String\n  code        String    @unique\n  description String?\n  isActive    Boolean   @default(true)\n  deletedAt   DateTime?\n\n  substations Substation[]\n  areas       Area[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([name])\n  @@map("zone")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Area":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"zoneId","kind":"scalar","type":"String"},{"name":"substationId","kind":"scalar","type":"String"},{"name":"feederId","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"latitude","kind":"scalar","type":"Float"},{"name":"longitude","kind":"scalar","type":"Float"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"zone","kind":"object","type":"Zone","relationName":"AreaToZone"},{"name":"substation","kind":"object","type":"Substation","relationName":"AreaToSubstation"},{"name":"feeder","kind":"object","type":"Feeder","relationName":"AreaToFeeder"},{"name":"loadSheddingSchedules","kind":"object","type":"LoadSheddingSchedule","relationName":"AreaToLoadSheddingSchedule"},{"name":"outages","kind":"object","type":"Outage","relationName":"AreaToOutage"},{"name":"reports","kind":"object","type":"OutageReport","relationName":"AreaToOutageReport"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"areas","schema":null},"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"actorId","kind":"scalar","type":"String"},{"name":"action","kind":"scalar","type":"String"},{"name":"entity","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"oldValue","kind":"scalar","type":"Json"},{"name":"newValue","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"actor","kind":"object","type":"User","relationName":"AuditActor"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"audit_logs","schema":null},"Feeder":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"substationId","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"substation","kind":"object","type":"Substation","relationName":"FeederToSubstation"},{"name":"areas","kind":"object","type":"Area","relationName":"AreaToFeeder"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"feeders","schema":null},"LoadSheddingSchedule":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"areaId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"ScheduleStatus"},{"name":"createdById","kind":"scalar","type":"String"},{"name":"area","kind":"object","type":"Area","relationName":"AreaToLoadSheddingSchedule"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":"load_shedding_schedules","schema":null},"Notification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"message","kind":"scalar","type":"String"},{"name":"isRead","kind":"scalar","type":"Boolean"},{"name":"user","kind":"object","type":"User","relationName":"NotificationToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":"notifications","schema":null},"Outage":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"areaId","kind":"scalar","type":"String"},{"name":"title","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"type","kind":"enum","type":"OutageType"},{"name":"priority","kind":"enum","type":"Priority"},{"name":"status","kind":"enum","type":"OutageStatus"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"restoredAt","kind":"scalar","type":"DateTime"},{"name":"area","kind":"object","type":"Area","relationName":"AreaToOutage"},{"name":"reports","kind":"object","type":"OutageReport","relationName":"OutageToOutageReport"},{"name":"assignments","kind":"object","type":"OutageAssignment","relationName":"OutageToOutageAssignment"},{"name":"restoration","kind":"object","type":"Restoration","relationName":"OutageToRestoration"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":"outages","schema":null},"OutageAssignment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"outageId","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"assignedById","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"AssignmentStatus"},{"name":"assignedAt","kind":"scalar","type":"DateTime"},{"name":"acceptedAt","kind":"scalar","type":"DateTime"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"outage","kind":"object","type":"Outage","relationName":"OutageToOutageAssignment"},{"name":"technician","kind":"object","type":"Technician","relationName":"OutageAssignmentToTechnician"},{"name":"assignedBy","kind":"object","type":"User","relationName":"AssignmentCreator"}],"dbName":"outage_assignments","schema":null},"OutageReport":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"outageId","kind":"scalar","type":"String"},{"name":"reporterId","kind":"scalar","type":"String"},{"name":"areaId","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"latitude","kind":"scalar","type":"Float"},{"name":"longitude","kind":"scalar","type":"Float"},{"name":"outage","kind":"object","type":"Outage","relationName":"OutageToOutageReport"},{"name":"reporter","kind":"object","type":"User","relationName":"OutageReportToUser"},{"name":"area","kind":"object","type":"Area","relationName":"AreaToOutageReport"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"outage_reports","schema":null},"Profile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"avatarUrl","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ProfileToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"profiles","schema":null},"Restoration":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"outageId","kind":"scalar","type":"String"},{"name":"technicianId","kind":"scalar","type":"String"},{"name":"startedAt","kind":"scalar","type":"DateTime"},{"name":"completedAt","kind":"scalar","type":"DateTime"},{"name":"duration","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"RestorationStatus"},{"name":"remarks","kind":"scalar","type":"String"},{"name":"outage","kind":"object","type":"Outage","relationName":"OutageToRestoration"},{"name":"technician","kind":"object","type":"Technician","relationName":"RestorationToTechnician"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"restorations","schema":null},"Subscription":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SubscriptionToUser"},{"name":"planId","kind":"scalar","type":"String"},{"name":"plan","kind":"object","type":"SubscriptionPlan","relationName":"SubscriptionToSubscriptionPlan"},{"name":"startDate","kind":"scalar","type":"DateTime"},{"name":"endDate","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"SubscriptionStatus"},{"name":"payments","kind":"object","type":"SubscriptionPayment","relationName":"SubscriptionToSubscriptionPayment"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"subscriptions","schema":null},"SubscriptionPayment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SubscriptionPaymentToUser"},{"name":"subscriptionId","kind":"scalar","type":"String"},{"name":"subscription","kind":"object","type":"Subscription","relationName":"SubscriptionToSubscriptionPayment"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"paymentGateway","kind":"enum","type":"PaymentGateway"},{"name":"merchantInvoiceNumber","kind":"scalar","type":"String"},{"name":"bkashPaymentId","kind":"scalar","type":"String"},{"name":"bkashTrxId","kind":"scalar","type":"String"},{"name":"payerReference","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"refundTrxId","kind":"scalar","type":"String"},{"name":"refundReason","kind":"scalar","type":"String"},{"name":"refundedAt","kind":"scalar","type":"DateTime"},{"name":"refundAmount","kind":"scalar","type":"Decimal"},{"name":"stripeSessionId","kind":"scalar","type":"String"},{"name":"stripePaymentIntentId","kind":"scalar","type":"String"},{"name":"stripeCustomerId","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"subscription_payments","schema":null},"SubscriptionPlan":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Decimal"},{"name":"durationDays","kind":"scalar","type":"Int"},{"name":"status","kind":"enum","type":"SubscriptionPlanStatus"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"SubscriptionToSubscriptionPlan"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":"subscription_plans","schema":null},"Substation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"zoneId","kind":"scalar","type":"String"},{"name":"capacity","kind":"scalar","type":"Float"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"zone","kind":"object","type":"Zone","relationName":"SubstationToZone"},{"name":"feeders","kind":"object","type":"Feeder","relationName":"FeederToSubstation"},{"name":"areas","kind":"object","type":"Area","relationName":"AreaToSubstation"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"substations","schema":null},"Technician":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"employeeId","kind":"scalar","type":"String"},{"name":"skills","kind":"scalar","type":"String"},{"name":"experienceYears","kind":"scalar","type":"Int"},{"name":"resume","kind":"scalar","type":"String"},{"name":"resumePublicId","kind":"scalar","type":"String"},{"name":"additionalFiles","kind":"scalar","type":"Json"},{"name":"status","kind":"enum","type":"TechnicianStatus"},{"name":"verificationStatus","kind":"enum","type":"TechnicianVerificationStatus"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"zoneId","kind":"scalar","type":"String"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TechnicianToUser"},{"name":"assignments","kind":"object","type":"OutageAssignment","relationName":"OutageAssignmentToTechnician"},{"name":"restorations","kind":"object","type":"Restoration","relationName":"RestorationToTechnician"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"technicians","schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"UserRole"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"authProvider","kind":"enum","type":"AuthProvider"},{"name":"imageUrl","kind":"scalar","type":"String"},{"name":"imagePublicId","kind":"scalar","type":"String"},{"name":"profile","kind":"object","type":"Profile","relationName":"ProfileToUser"},{"name":"subscriptions","kind":"object","type":"Subscription","relationName":"SubscriptionToUser"},{"name":"subscriptionPayments","kind":"object","type":"SubscriptionPayment","relationName":"SubscriptionPaymentToUser"},{"name":"reports","kind":"object","type":"OutageReport","relationName":"OutageReportToUser"},{"name":"assignments","kind":"object","type":"OutageAssignment","relationName":"AssignmentCreator"},{"name":"notifications","kind":"object","type":"Notification","relationName":"NotificationToUser"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditActor"},{"name":"technician","kind":"object","type":"Technician","relationName":"TechnicianToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"}],"dbName":"users","schema":null},"Zone":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"code","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"substations","kind":"object","type":"Substation","relationName":"SubstationToZone"},{"name":"areas","kind":"object","type":"Area","relationName":"AreaToZone"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"zone","schema":null}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","zone","substation","areas","_count","feeders","substations","feeder","area","loadSheddingSchedules","outage","user","profile","subscriptions","plan","subscription","payments","subscriptionPayments","reports","assignments","technician","restorations","assignedBy","notifications","actor","auditLogs","reporter","restoration","outages","Area.findUnique","Area.findUniqueOrThrow","Area.findFirst","Area.findFirstOrThrow","Area.findMany","data","Area.createOne","Area.createMany","Area.createManyAndReturn","Area.updateOne","Area.updateMany","Area.updateManyAndReturn","create","update","Area.upsertOne","Area.deleteOne","Area.deleteMany","having","_avg","_sum","_min","_max","Area.groupBy","Area.aggregate","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","AuditLog.groupBy","AuditLog.aggregate","Feeder.findUnique","Feeder.findUniqueOrThrow","Feeder.findFirst","Feeder.findFirstOrThrow","Feeder.findMany","Feeder.createOne","Feeder.createMany","Feeder.createManyAndReturn","Feeder.updateOne","Feeder.updateMany","Feeder.updateManyAndReturn","Feeder.upsertOne","Feeder.deleteOne","Feeder.deleteMany","Feeder.groupBy","Feeder.aggregate","LoadSheddingSchedule.findUnique","LoadSheddingSchedule.findUniqueOrThrow","LoadSheddingSchedule.findFirst","LoadSheddingSchedule.findFirstOrThrow","LoadSheddingSchedule.findMany","LoadSheddingSchedule.createOne","LoadSheddingSchedule.createMany","LoadSheddingSchedule.createManyAndReturn","LoadSheddingSchedule.updateOne","LoadSheddingSchedule.updateMany","LoadSheddingSchedule.updateManyAndReturn","LoadSheddingSchedule.upsertOne","LoadSheddingSchedule.deleteOne","LoadSheddingSchedule.deleteMany","LoadSheddingSchedule.groupBy","LoadSheddingSchedule.aggregate","Notification.findUnique","Notification.findUniqueOrThrow","Notification.findFirst","Notification.findFirstOrThrow","Notification.findMany","Notification.createOne","Notification.createMany","Notification.createManyAndReturn","Notification.updateOne","Notification.updateMany","Notification.updateManyAndReturn","Notification.upsertOne","Notification.deleteOne","Notification.deleteMany","Notification.groupBy","Notification.aggregate","Outage.findUnique","Outage.findUniqueOrThrow","Outage.findFirst","Outage.findFirstOrThrow","Outage.findMany","Outage.createOne","Outage.createMany","Outage.createManyAndReturn","Outage.updateOne","Outage.updateMany","Outage.updateManyAndReturn","Outage.upsertOne","Outage.deleteOne","Outage.deleteMany","Outage.groupBy","Outage.aggregate","OutageAssignment.findUnique","OutageAssignment.findUniqueOrThrow","OutageAssignment.findFirst","OutageAssignment.findFirstOrThrow","OutageAssignment.findMany","OutageAssignment.createOne","OutageAssignment.createMany","OutageAssignment.createManyAndReturn","OutageAssignment.updateOne","OutageAssignment.updateMany","OutageAssignment.updateManyAndReturn","OutageAssignment.upsertOne","OutageAssignment.deleteOne","OutageAssignment.deleteMany","OutageAssignment.groupBy","OutageAssignment.aggregate","OutageReport.findUnique","OutageReport.findUniqueOrThrow","OutageReport.findFirst","OutageReport.findFirstOrThrow","OutageReport.findMany","OutageReport.createOne","OutageReport.createMany","OutageReport.createManyAndReturn","OutageReport.updateOne","OutageReport.updateMany","OutageReport.updateManyAndReturn","OutageReport.upsertOne","OutageReport.deleteOne","OutageReport.deleteMany","OutageReport.groupBy","OutageReport.aggregate","Profile.findUnique","Profile.findUniqueOrThrow","Profile.findFirst","Profile.findFirstOrThrow","Profile.findMany","Profile.createOne","Profile.createMany","Profile.createManyAndReturn","Profile.updateOne","Profile.updateMany","Profile.updateManyAndReturn","Profile.upsertOne","Profile.deleteOne","Profile.deleteMany","Profile.groupBy","Profile.aggregate","Restoration.findUnique","Restoration.findUniqueOrThrow","Restoration.findFirst","Restoration.findFirstOrThrow","Restoration.findMany","Restoration.createOne","Restoration.createMany","Restoration.createManyAndReturn","Restoration.updateOne","Restoration.updateMany","Restoration.updateManyAndReturn","Restoration.upsertOne","Restoration.deleteOne","Restoration.deleteMany","Restoration.groupBy","Restoration.aggregate","Subscription.findUnique","Subscription.findUniqueOrThrow","Subscription.findFirst","Subscription.findFirstOrThrow","Subscription.findMany","Subscription.createOne","Subscription.createMany","Subscription.createManyAndReturn","Subscription.updateOne","Subscription.updateMany","Subscription.updateManyAndReturn","Subscription.upsertOne","Subscription.deleteOne","Subscription.deleteMany","Subscription.groupBy","Subscription.aggregate","SubscriptionPayment.findUnique","SubscriptionPayment.findUniqueOrThrow","SubscriptionPayment.findFirst","SubscriptionPayment.findFirstOrThrow","SubscriptionPayment.findMany","SubscriptionPayment.createOne","SubscriptionPayment.createMany","SubscriptionPayment.createManyAndReturn","SubscriptionPayment.updateOne","SubscriptionPayment.updateMany","SubscriptionPayment.updateManyAndReturn","SubscriptionPayment.upsertOne","SubscriptionPayment.deleteOne","SubscriptionPayment.deleteMany","SubscriptionPayment.groupBy","SubscriptionPayment.aggregate","SubscriptionPlan.findUnique","SubscriptionPlan.findUniqueOrThrow","SubscriptionPlan.findFirst","SubscriptionPlan.findFirstOrThrow","SubscriptionPlan.findMany","SubscriptionPlan.createOne","SubscriptionPlan.createMany","SubscriptionPlan.createManyAndReturn","SubscriptionPlan.updateOne","SubscriptionPlan.updateMany","SubscriptionPlan.updateManyAndReturn","SubscriptionPlan.upsertOne","SubscriptionPlan.deleteOne","SubscriptionPlan.deleteMany","SubscriptionPlan.groupBy","SubscriptionPlan.aggregate","Substation.findUnique","Substation.findUniqueOrThrow","Substation.findFirst","Substation.findFirstOrThrow","Substation.findMany","Substation.createOne","Substation.createMany","Substation.createManyAndReturn","Substation.updateOne","Substation.updateMany","Substation.updateManyAndReturn","Substation.upsertOne","Substation.deleteOne","Substation.deleteMany","Substation.groupBy","Substation.aggregate","Technician.findUnique","Technician.findUniqueOrThrow","Technician.findFirst","Technician.findFirstOrThrow","Technician.findMany","Technician.createOne","Technician.createMany","Technician.createManyAndReturn","Technician.updateOne","Technician.updateMany","Technician.updateManyAndReturn","Technician.upsertOne","Technician.deleteOne","Technician.deleteMany","Technician.groupBy","Technician.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Zone.findUnique","Zone.findUniqueOrThrow","Zone.findFirst","Zone.findFirstOrThrow","Zone.findMany","Zone.createOne","Zone.createMany","Zone.createManyAndReturn","Zone.updateOne","Zone.updateMany","Zone.updateManyAndReturn","Zone.upsertOne","Zone.deleteOne","Zone.deleteMany","Zone.groupBy","Zone.aggregate","AND","OR","NOT","id","name","code","description","isActive","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","email","password","UserRole","role","UserStatus","status","emailVerified","isDeleted","needPasswordChange","googleId","AuthProvider","authProvider","imageUrl","imagePublicId","userId","phone","employeeId","skills","experienceYears","resume","resumePublicId","additionalFiles","TechnicianStatus","TechnicianVerificationStatus","verificationStatus","rejectionReason","zoneId","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","capacity","price","durationDays","SubscriptionPlanStatus","subscriptionId","PaymentStatus","amount","currency","PaymentGateway","paymentGateway","merchantInvoiceNumber","bkashPaymentId","bkashTrxId","payerReference","gatewayResponse","paidAt","refundTrxId","refundReason","refundedAt","refundAmount","stripeSessionId","stripePaymentIntentId","stripeCustomerId","planId","startDate","endDate","SubscriptionStatus","outageId","technicianId","startedAt","completedAt","duration","RestorationStatus","remarks","address","avatarUrl","reporterId","areaId","latitude","longitude","assignedById","AssignmentStatus","assignedAt","acceptedAt","title","OutageType","type","Priority","priority","OutageStatus","restoredAt","message","isRead","startTime","endTime","ScheduleStatus","createdById","substationId","actorId","action","entity","entityId","oldValue","newValue","ipAddress","feederId","outageId_technicianId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "wQmgAZACFgMAAP0EACAEAAD-BAAgCQAA_wQAIAsAAIAFACAUAACMBAAgHgAAgQUAILcCAAD8BAAwuAIAAAsAELkCAAD8BAAwugIBAAAAAbsCAQD0AwAhvAIBAAAAAb4CIAD2AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh6gIBAPQDACGTAwEA9QMAIZcDCADyBAAhmAMIAPIEACGqAwEA9QMAIbIDAQD1AwAhAQAAAAEAIA8DAAD9BAAgBQAA-gMAIAcAAIUFACC3AgAAhAUAMLgCAAADABC5AgAAhAUAMLoCAQD0AwAhuwIBAPQDACG8AgEA9AMAIb4CIAD2AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh6gIBAPQDACHxAggA8gQAIQUDAAC1CAAgBQAAtAYAIAcAALoIACC_AgAAhgUAIPECAACGBQAgDwMAAP0EACAFAAD6AwAgBwAAhQUAILcCAACEBQAwuAIAAAMAELkCAACEBQAwugIBAAAAAbsCAQD0AwAhvAIBAAAAAb4CIAD2AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh6gIBAPQDACHxAggA8gQAIQMAAAADACABAAAEADACAAAFACANBAAAgwUAIAUAAPoDACC3AgAAggUAMLgCAAAHABC5AgAAggUAMLoCAQD0AwAhuwIBAPQDACG8AgEA9AMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIdUCAQD1AwAhqgMBAPQDACEEBAAAtggAIAUAALQGACC_AgAAhgUAINUCAACGBQAgDQQAAIMFACAFAAD6AwAgtwIAAIIFADC4AgAABwAQuQIAAIIFADC6AgEAAAABuwIBAPQDACG8AgEAAAABvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIBAPUDACGqAwEA9AMAIQMAAAAHACABAAAIADACAAAJACAWAwAA_QQAIAQAAP4EACAJAAD_BAAgCwAAgAUAIBQAAIwEACAeAACBBQAgtwIAAPwEADC4AgAACwAQuQIAAPwEADC6AgEA9AMAIbsCAQD0AwAhvAIBAPQDACG-AiAA9gMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIeoCAQD0AwAhkwMBAPUDACGXAwgA8gQAIZgDCADyBAAhqgMBAPUDACGyAwEA9QMAIQwDAAC1CAAgBAAAtggAIAkAALcIACALAAC4CAAgFAAA0AcAIB4AALkIACC_AgAAhgUAIJMDAACGBQAglwMAAIYFACCYAwAAhgUAIKoDAACGBQAgsgMAAIYFACADAAAACwAgAQAADAAwAgAAAQAgAQAAAAsAIAMAAAALACABAAAMADACAAABACABAAAABwAgAQAAAAsAIAMAAAALACABAAAMADACAAABACABAAAAAwAgAQAAAAsAIAEAAAADACABAAAABwAgDwoAAPQEACC3AgAA-gQAMLgCAAAXABC5AgAA-gQAMLoCAQD0AwAhvQIBAPUDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAA-wSpAyKWAwEA9AMAIZ0DAQD0AwAhpgNAAPgDACGnA0AA-AMAIakDAQD0AwAhAwoAALMIACC9AgAAhgUAIL8CAACGBQAgDwoAAPQEACC3AgAA-gQAMLgCAAAXABC5AgAA-gQAMLoCAQAAAAG9AgEA9QMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIdUCAAD7BKkDIpYDAQD0AwAhnQMBAPQDACGmA0AA-AMAIacDQAD4AwAhqQMBAPQDACEDAAAAFwAgAQAAGAAwAgAAGQAgEwoAAPQEACAUAACMBAAgFQAAjQQAIB0AAPkEACC3AgAA9QQAMLgCAAAbABC5AgAA9QQAMLoCAQD0AwAhvQIBAPUDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAA-ASjAyKOA0AA9wMAIZYDAQD0AwAhnQMBAPQDACGfAwAA9gSfAyKhAwAA9wShAyKjA0AA9wMAIQgKAACzCAAgFAAA0AcAIBUAANEHACAdAAC0CAAgvQIAAIYFACC_AgAAhgUAII4DAACGBQAgowMAAIYFACATCgAA9AQAIBQAAIwEACAVAACNBAAgHQAA-QQAILcCAAD1BAAwuAIAABsAELkCAAD1BAAwugIBAAAAAb0CAQD1AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIAAPgEowMijgNAAPcDACGWAwEA9AMAIZ0DAQD0AwAhnwMAAPYEnwMioQMAAPcEoQMiowNAAPcDACEDAAAAGwAgAQAAHAAwAgAAHQAgDwoAAPQEACAMAADzBAAgHAAAogQAILcCAADxBAAwuAIAAB8AELkCAADxBAAwugIBAPQDACG9AgEA9AMAIcACQAD4AwAhwQJAAPgDACGMAwEA9QMAIZUDAQD0AwAhlgMBAPQDACGXAwgA8gQAIZgDCADyBAAhBgoAALMIACAMAACwCAAgHAAA3AcAIIwDAACGBQAglwMAAIYFACCYAwAAhgUAIA8KAAD0BAAgDAAA8wQAIBwAAKIEACC3AgAA8QQAMLgCAAAfABC5AgAA8QQAMLoCAQAAAAG9AgEA9AMAIcACQAD4AwAhwQJAAPgDACGMAwEA9QMAIZUDAQD0AwAhlgMBAPQDACGXAwgA8gQAIZgDCADyBAAhAwAAAB8AIAEAACAAMAIAACEAIAEAAAAbACALDQAAogQAILcCAADHBAAwuAIAACQAELkCAADHBAAwugIBAPQDACHAAkAA-AMAIcECQAD4AwAh3gIBAPQDACHfAgEA9QMAIZMDAQD1AwAhlAMBAPUDACEBAAAAJAAgDg0AAKIEACAQAADwBAAgEgAAiwQAILcCAADuBAAwuAIAACYAELkCAADuBAAwugIBAPQDACHAAkAA-AMAIcECQAD4AwAh1QIAAO8EjAMi3gIBAPQDACGIAwEA9AMAIYkDQAD3AwAhigNAAPcDACEFDQAA3AcAIBAAALIIACASAADPBwAgiQMAAIYFACCKAwAAhgUAIA4NAACiBAAgEAAA8AQAIBIAAIsEACC3AgAA7gQAMLgCAAAmABC5AgAA7gQAMLoCAQAAAAHAAkAA-AMAIcECQAD4AwAh1QIAAO8EjAMi3gIBAPQDACGIAwEA9AMAIYkDQAD3AwAhigNAAPcDACEDAAAAJgAgAQAAJwAwAgAAKAAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAmACAbDQAAogQAIBEAAO0EACC3AgAA6QQAMLgCAAAsABC5AgAA6QQAMLoCAQD0AwAhwAJAAPgDACHBAkAA-AMAIdUCAADqBPcCIt4CAQD0AwAh9QIBAPQDACH3AhAAsAQAIfgCAQD0AwAh-gIAAOsE-gIi-wIBAPQDACH8AgEA9QMAIf0CAQD1AwAh_gIBAPUDACH_AgAAnwQAIIADQAD3AwAhgQMBAPUDACGCAwEA9QMAIYMDQAD3AwAhhAMQAOwEACGFAwEA9QMAIYYDAQD1AwAhhwMBAPUDACEODQAA3AcAIBEAALEIACD8AgAAhgUAIP0CAACGBQAg_gIAAIYFACD_AgAAhgUAIIADAACGBQAggQMAAIYFACCCAwAAhgUAIIMDAACGBQAghAMAAIYFACCFAwAAhgUAIIYDAACGBQAghwMAAIYFACAbDQAAogQAIBEAAO0EACC3AgAA6QQAMLgCAAAsABC5AgAA6QQAMLoCAQAAAAHAAkAA-AMAIcECQAD4AwAh1QIAAOoE9wIi3gIBAPQDACH1AgEA9AMAIfcCEACwBAAh-AIBAPQDACH6AgAA6wT6AiL7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AgEA9QMAIf8CAACfBAAggANAAPcDACGBAwEA9QMAIYIDAQD1AwAhgwNAAPcDACGEAxAA7AQAIYUDAQAAAAGGAwEAAAABhwMBAPUDACEDAAAALAAgAQAALQAwAgAALgAgAQAAACwAIAMAAAAsACABAAAtADACAAAuACADAAAAHwAgAQAAIAAwAgAAIQAgDwwAAOQEACAWAADoBAAgGAAAogQAILcCAADmBAAwuAIAADMAELkCAADmBAAwugIBAPQDACHVAgAA5wSbAyKMAwEA9AMAIY0DAQD0AwAhjgNAAPcDACGPA0AA9wMAIZkDAQD0AwAhmwNAAPgDACGcA0AA9wMAIQYMAACwCAAgFgAA1AcAIBgAANwHACCOAwAAhgUAII8DAACGBQAgnAMAAIYFACAQDAAA5AQAIBYAAOgEACAYAACiBAAgtwIAAOYEADC4AgAAMwAQuQIAAOYEADC6AgEAAAAB1QIAAOcEmwMijAMBAPQDACGNAwEA9AMAIY4DQAD3AwAhjwNAAPcDACGZAwEA9AMAIZsDQAD4AwAhnANAAPcDACGzAwAA5QQAIAMAAAAzACABAAA0ADACAAA1ACADAAAAMwAgAQAANAAwAgAANQAgDwwAAOQEACAWAACQBAAgtwIAAOEEADC4AgAAOAAQuQIAAOEEADC6AgEA9AMAIcACQAD4AwAhwQJAAPgDACHVAgAA4wSSAyKMAwEA9AMAIY0DAQD1AwAhjgNAAPcDACGPA0AA9wMAIZADAgDiBAAhkgMBAPUDACEHDAAAsAgAIBYAANQHACCNAwAAhgUAII4DAACGBQAgjwMAAIYFACCQAwAAhgUAIJIDAACGBQAgDwwAAOQEACAWAACQBAAgtwIAAOEEADC4AgAAOAAQuQIAAOEEADC6AgEAAAABwAJAAPgDACHBAkAA-AMAIdUCAADjBJIDIowDAQAAAAGNAwEA9QMAIY4DQAD3AwAhjwNAAPcDACGQAwIA4gQAIZIDAQD1AwAhAwAAADgAIAEAADkAMAIAADoAIBYNAACiBAAgFQAAjQQAIBcAAKMEACC3AgAAnQQAMLgCAAA8ABC5AgAAnQQAMLoCAQD0AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIAAKAE5wIi3gIBAPQDACHfAgEA9AMAIeACAQD0AwAh4QIBAPUDACHiAgIAngQAIeMCAQD1AwAh5AIBAPUDACHlAgAAnwQAIOgCAAChBOgCIukCAQD1AwAh6gIBAPUDACEBAAAAPAAgAQAAADMAIAEAAAA4ACAKDQAAogQAILcCAADgBAAwuAIAAEAAELkCAADgBAAwugIBAPQDACHAAkAA-AMAId4CAQD0AwAhnQMBAPQDACGkAwEA9AMAIaUDIAD2AwAhAQ0AANwHACAKDQAAogQAILcCAADgBAAwuAIAAEAAELkCAADgBAAwugIBAAAAAcACQAD4AwAh3gIBAPQDACGdAwEA9AMAIaQDAQD0AwAhpQMgAPYDACEDAAAAQAAgAQAAQQAwAgAAQgAgDRoAAKIEACC3AgAA3wQAMLgCAABEABC5AgAA3wQAMLoCAQD0AwAhwAJAAPgDACGrAwEA9AMAIawDAQD0AwAhrQMBAPQDACGuAwEA9AMAIa8DAACfBAAgsAMAAJ8EACCxAwEA9QMAIQQaAADcBwAgrwMAAIYFACCwAwAAhgUAILEDAACGBQAgDRoAAKIEACC3AgAA3wQAMLgCAABEABC5AgAA3wQAMLoCAQAAAAHAAkAA-AMAIasDAQD0AwAhrAMBAPQDACGtAwEA9AMAIa4DAQD0AwAhrwMAAJ8EACCwAwAAnwQAILEDAQD1AwAhAwAAAEQAIAEAAEUAMAIAAEYAIAEAAAA8ACABAAAAJgAgAQAAACwAIAEAAAAfACABAAAAMwAgAQAAAEAAIAEAAABEACADAAAAMwAgAQAANAAwAgAANQAgAQAAADgAIAEAAAAfACABAAAAMwAgAwAAAB8AIAEAACAAMAIAACEAIAEAAAAXACABAAAAGwAgAQAAAB8AIAEAAAABACADAAAACwAgAQAADAAwAgAAAQAgAwAAAAsAIAEAAAwAMAIAAAEAIAMAAAALACABAAAMADACAAABACATAwAAlgYAIAQAAPoFACAJAAD7BQAgCwAA_AUAIBQAAP4FACAeAAD9BQAgugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAeoCAQAAAAGTAwEAAAABlwMIAAAAAZgDCAAAAAGqAwEAAAABsgMBAAAAAQEkAABbACANugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAeoCAQAAAAGTAwEAAAABlwMIAAAAAZgDCAAAAAGqAwEAAAABsgMBAAAAAQEkAABdADABJAAAXQAwAQAAAAMAIAEAAAAHACATAwAAlAYAIAQAAJ0FACAJAACeBQAgCwAAnwUAIBQAAKEFACAeAACgBQAgugIBAIoFACG7AgEAigUAIbwCAQCKBQAhvgIgAIwFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHqAgEAigUAIZMDAQCLBQAhlwMIAJsFACGYAwgAmwUAIaoDAQCLBQAhsgMBAIsFACECAAAAAQAgJAAAYgAgDboCAQCKBQAhuwIBAIoFACG8AgEAigUAIb4CIACMBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh6gIBAIoFACGTAwEAiwUAIZcDCACbBQAhmAMIAJsFACGqAwEAiwUAIbIDAQCLBQAhAgAAAAsAICQAAGQAIAIAAAALACAkAABkACABAAAAAwAgAQAAAAcAIAMAAAABACArAABbACAsAABiACABAAAAAQAgAQAAAAsAIAsGAACrCAAgMQAArAgAIDIAAK8IACAzAACuCAAgNAAArQgAIL8CAACGBQAgkwMAAIYFACCXAwAAhgUAIJgDAACGBQAgqgMAAIYFACCyAwAAhgUAIBC3AgAA3gQAMLgCAABtABC5AgAA3gQAMLoCAQDiAwAhuwIBAOIDACG8AgEA4gMAIb4CIADkAwAhvwJAAOUDACHAAkAA5gMAIcECQADmAwAh6gIBAOIDACGTAwEA4wMAIZcDCAClBAAhmAMIAKUEACGqAwEA4wMAIbIDAQDjAwAhAwAAAAsAIAEAAGwAMDAAAG0AIAMAAAALACABAAAMADACAAABACABAAAARgAgAQAAAEYAIAMAAABEACABAABFADACAABGACADAAAARAAgAQAARQAwAgAARgAgAwAAAEQAIAEAAEUAMAIAAEYAIAoaAACqCAAgugIBAAAAAcACQAAAAAGrAwEAAAABrAMBAAAAAa0DAQAAAAGuAwEAAAABrwOAAAAAAbADgAAAAAGxAwEAAAABASQAAHUAIAm6AgEAAAABwAJAAAAAAasDAQAAAAGsAwEAAAABrQMBAAAAAa4DAQAAAAGvA4AAAAABsAOAAAAAAbEDAQAAAAEBJAAAdwAwASQAAHcAMAoaAACpCAAgugIBAIoFACHAAkAAjgUAIasDAQCKBQAhrAMBAIoFACGtAwEAigUAIa4DAQCKBQAhrwOAAAAAAbADgAAAAAGxAwEAiwUAIQIAAABGACAkAAB6ACAJugIBAIoFACHAAkAAjgUAIasDAQCKBQAhrAMBAIoFACGtAwEAigUAIa4DAQCKBQAhrwOAAAAAAbADgAAAAAGxAwEAiwUAIQIAAABEACAkAAB8ACACAAAARAAgJAAAfAAgAwAAAEYAICsAAHUAICwAAHoAIAEAAABGACABAAAARAAgBgYAAKYIACAzAACoCAAgNAAApwgAIK8DAACGBQAgsAMAAIYFACCxAwAAhgUAIAy3AgAA3QQAMLgCAACDAQAQuQIAAN0EADC6AgEA4gMAIcACQADmAwAhqwMBAOIDACGsAwEA4gMAIa0DAQDiAwAhrgMBAOIDACGvAwAAkwQAILADAACTBAAgsQMBAOMDACEDAAAARAAgAQAAggEAMDAAAIMBACADAAAARAAgAQAARQAwAgAARgAgAQAAAAkAIAEAAAAJACADAAAABwAgAQAACAAwAgAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACAKBAAApQgAIAUAAK0GACC6AgEAAAABuwIBAAAAAbwCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgEAAAABqgMBAAAAAQEkAACLAQAgCLoCAQAAAAG7AgEAAAABvAIBAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAdUCAQAAAAGqAwEAAAABASQAAI0BADABJAAAjQEAMAoEAACkCAAgBQAAogYAILoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdUCAQCLBQAhqgMBAIoFACECAAAACQAgJAAAkAEAIAi6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgEAiwUAIaoDAQCKBQAhAgAAAAcAICQAAJIBACACAAAABwAgJAAAkgEAIAMAAAAJACArAACLAQAgLAAAkAEAIAEAAAAJACABAAAABwAgBQYAAKEIACAzAACjCAAgNAAAoggAIL8CAACGBQAg1QIAAIYFACALtwIAANwEADC4AgAAmQEAELkCAADcBAAwugIBAOIDACG7AgEA4gMAIbwCAQDiAwAhvwJAAOUDACHAAkAA5gMAIcECQADmAwAh1QIBAOMDACGqAwEA4gMAIQMAAAAHACABAACYAQAwMAAAmQEAIAMAAAAHACABAAAIADACAAAJACABAAAAGQAgAQAAABkAIAMAAAAXACABAAAYADACAAAZACADAAAAFwAgAQAAGAAwAgAAGQAgAwAAABcAIAEAABgAMAIAABkAIAwKAACgCAAgugIBAAAAAb0CAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAKkDApYDAQAAAAGdAwEAAAABpgNAAAAAAacDQAAAAAGpAwEAAAABASQAAKEBACALugIBAAAAAb0CAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAKkDApYDAQAAAAGdAwEAAAABpgNAAAAAAacDQAAAAAGpAwEAAAABASQAAKMBADABJAAAowEAMAwKAACfCAAgugIBAIoFACG9AgEAiwUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdUCAAD2BakDIpYDAQCKBQAhnQMBAIoFACGmA0AAjgUAIacDQACOBQAhqQMBAIoFACECAAAAGQAgJAAApgEAIAu6AgEAigUAIb0CAQCLBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh1QIAAPYFqQMilgMBAIoFACGdAwEAigUAIaYDQACOBQAhpwNAAI4FACGpAwEAigUAIQIAAAAXACAkAACoAQAgAgAAABcAICQAAKgBACADAAAAGQAgKwAAoQEAICwAAKYBACABAAAAGQAgAQAAABcAIAUGAACcCAAgMwAAnggAIDQAAJ0IACC9AgAAhgUAIL8CAACGBQAgDrcCAADYBAAwuAIAAK8BABC5AgAA2AQAMLoCAQDiAwAhvQIBAOMDACG_AkAA5QMAIcACQADmAwAhwQJAAOYDACHVAgAA2QSpAyKWAwEA4gMAIZ0DAQDiAwAhpgNAAOYDACGnA0AA5gMAIakDAQDiAwAhAwAAABcAIAEAAK4BADAwAACvAQAgAwAAABcAIAEAABgAMAIAABkAIAEAAABCACABAAAAQgAgAwAAAEAAIAEAAEEAMAIAAEIAIAMAAABAACABAABBADACAABCACADAAAAQAAgAQAAQQAwAgAAQgAgBw0AAJsIACC6AgEAAAABwAJAAAAAAd4CAQAAAAGdAwEAAAABpAMBAAAAAaUDIAAAAAEBJAAAtwEAIAa6AgEAAAABwAJAAAAAAd4CAQAAAAGdAwEAAAABpAMBAAAAAaUDIAAAAAEBJAAAuQEAMAEkAAC5AQAwBw0AAJoIACC6AgEAigUAIcACQACOBQAh3gIBAIoFACGdAwEAigUAIaQDAQCKBQAhpQMgAIwFACECAAAAQgAgJAAAvAEAIAa6AgEAigUAIcACQACOBQAh3gIBAIoFACGdAwEAigUAIaQDAQCKBQAhpQMgAIwFACECAAAAQAAgJAAAvgEAIAIAAABAACAkAAC-AQAgAwAAAEIAICsAALcBACAsAAC8AQAgAQAAAEIAIAEAAABAACADBgAAlwgAIDMAAJkIACA0AACYCAAgCbcCAADXBAAwuAIAAMUBABC5AgAA1wQAMLoCAQDiAwAhwAJAAOYDACHeAgEA4gMAIZ0DAQDiAwAhpAMBAOIDACGlAyAA5AMAIQMAAABAACABAADEAQAwMAAAxQEAIAMAAABAACABAABBADACAABCACABAAAAHQAgAQAAAB0AIAMAAAAbACABAAAcADACAAAdACADAAAAGwAgAQAAHAAwAgAAHQAgAwAAABsAIAEAABwAMAIAAB0AIBAKAACWCAAgFAAA6QUAIBUAAOoFACAdAADrBQAgugIBAAAAAb0CAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAKMDAo4DQAAAAAGWAwEAAAABnQMBAAAAAZ8DAAAAnwMCoQMAAAChAwKjA0AAAAABASQAAM0BACAMugIBAAAAAb0CAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAKMDAo4DQAAAAAGWAwEAAAABnQMBAAAAAZ8DAAAAnwMCoQMAAAChAwKjA0AAAAABASQAAM8BADABJAAAzwEAMBAKAACVCAAgFAAAwAUAIBUAAMEFACAdAADCBQAgugIBAIoFACG9AgEAiwUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdUCAAC-BaMDIo4DQACNBQAhlgMBAIoFACGdAwEAigUAIZ8DAAC8BZ8DIqEDAAC9BaEDIqMDQACNBQAhAgAAAB0AICQAANIBACAMugIBAIoFACG9AgEAiwUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdUCAAC-BaMDIo4DQACNBQAhlgMBAIoFACGdAwEAigUAIZ8DAAC8BZ8DIqEDAAC9BaEDIqMDQACNBQAhAgAAABsAICQAANQBACACAAAAGwAgJAAA1AEAIAMAAAAdACArAADNAQAgLAAA0gEAIAEAAAAdACABAAAAGwAgBwYAAJIIACAzAACUCAAgNAAAkwgAIL0CAACGBQAgvwIAAIYFACCOAwAAhgUAIKMDAACGBQAgD7cCAADNBAAwuAIAANsBABC5AgAAzQQAMLoCAQDiAwAhvQIBAOMDACG_AkAA5QMAIcACQADmAwAhwQJAAOYDACHVAgAA0ASjAyKOA0AA5QMAIZYDAQDiAwAhnQMBAOIDACGfAwAAzgSfAyKhAwAAzwShAyKjA0AA5QMAIQMAAAAbACABAADaAQAwMAAA2wEAIAMAAAAbACABAAAcADACAAAdACABAAAANQAgAQAAADUAIAMAAAAzACABAAA0ADACAAA1ACADAAAAMwAgAQAANAAwAgAANQAgAwAAADMAIAEAADQAMAIAADUAIAwMAADlBgAgFgAA2wUAIBgAANwFACC6AgEAAAAB1QIAAACbAwKMAwEAAAABjQMBAAAAAY4DQAAAAAGPA0AAAAABmQMBAAAAAZsDQAAAAAGcA0AAAAABASQAAOMBACAJugIBAAAAAdUCAAAAmwMCjAMBAAAAAY0DAQAAAAGOA0AAAAABjwNAAAAAAZkDAQAAAAGbA0AAAAABnANAAAAAAQEkAADlAQAwASQAAOUBADAMDAAA4wYAIBYAANgFACAYAADZBQAgugIBAIoFACHVAgAA1gWbAyKMAwEAigUAIY0DAQCKBQAhjgNAAI0FACGPA0AAjQUAIZkDAQCKBQAhmwNAAI4FACGcA0AAjQUAIQIAAAA1ACAkAADoAQAgCboCAQCKBQAh1QIAANYFmwMijAMBAIoFACGNAwEAigUAIY4DQACNBQAhjwNAAI0FACGZAwEAigUAIZsDQACOBQAhnANAAI0FACECAAAAMwAgJAAA6gEAIAIAAAAzACAkAADqAQAgAwAAADUAICsAAOMBACAsAADoAQAgAQAAADUAIAEAAAAzACAGBgAAjwgAIDMAAJEIACA0AACQCAAgjgMAAIYFACCPAwAAhgUAIJwDAACGBQAgDLcCAADJBAAwuAIAAPEBABC5AgAAyQQAMLoCAQDiAwAh1QIAAMoEmwMijAMBAOIDACGNAwEA4gMAIY4DQADlAwAhjwNAAOUDACGZAwEA4gMAIZsDQADmAwAhnANAAOUDACEDAAAAMwAgAQAA8AEAMDAAAPEBACADAAAAMwAgAQAANAAwAgAANQAgAQAAACEAIAEAAAAhACADAAAAHwAgAQAAIAAwAgAAIQAgAwAAAB8AIAEAACAAMAIAACEAIAMAAAAfACABAAAgADACAAAhACAMCgAA5wUAIAwAALAFACAcAACxBQAgugIBAAAAAb0CAQAAAAHAAkAAAAABwQJAAAAAAYwDAQAAAAGVAwEAAAABlgMBAAAAAZcDCAAAAAGYAwgAAAABASQAAPkBACAJugIBAAAAAb0CAQAAAAHAAkAAAAABwQJAAAAAAYwDAQAAAAGVAwEAAAABlgMBAAAAAZcDCAAAAAGYAwgAAAABASQAAPsBADABJAAA-wEAMAEAAAAbACAMCgAA5QUAIAwAAK0FACAcAACuBQAgugIBAIoFACG9AgEAigUAIcACQACOBQAhwQJAAI4FACGMAwEAiwUAIZUDAQCKBQAhlgMBAIoFACGXAwgAmwUAIZgDCACbBQAhAgAAACEAICQAAP8BACAJugIBAIoFACG9AgEAigUAIcACQACOBQAhwQJAAI4FACGMAwEAiwUAIZUDAQCKBQAhlgMBAIoFACGXAwgAmwUAIZgDCACbBQAhAgAAAB8AICQAAIECACACAAAAHwAgJAAAgQIAIAEAAAAbACADAAAAIQAgKwAA-QEAICwAAP8BACABAAAAIQAgAQAAAB8AIAgGAACKCAAgMQAAiwgAIDIAAI4IACAzAACNCAAgNAAAjAgAIIwDAACGBQAglwMAAIYFACCYAwAAhgUAIAy3AgAAyAQAMLgCAACJAgAQuQIAAMgEADC6AgEA4gMAIb0CAQDiAwAhwAJAAOYDACHBAkAA5gMAIYwDAQDjAwAhlQMBAOIDACGWAwEA4gMAIZcDCAClBAAhmAMIAKUEACEDAAAAHwAgAQAAiAIAMDAAAIkCACADAAAAHwAgAQAAIAAwAgAAIQAgCw0AAKIEACC3AgAAxwQAMLgCAAAkABC5AgAAxwQAMLoCAQAAAAHAAkAA-AMAIcECQAD4AwAh3gIBAAAAAd8CAQD1AwAhkwMBAPUDACGUAwEA9QMAIQEAAACMAgAgAQAAAIwCACAEDQAA3AcAIN8CAACGBQAgkwMAAIYFACCUAwAAhgUAIAMAAAAkACABAACPAgAwAgAAjAIAIAMAAAAkACABAACPAgAwAgAAjAIAIAMAAAAkACABAACPAgAwAgAAjAIAIAgNAACJCAAgugIBAAAAAcACQAAAAAHBAkAAAAAB3gIBAAAAAd8CAQAAAAGTAwEAAAABlAMBAAAAAQEkAACTAgAgB7oCAQAAAAHAAkAAAAABwQJAAAAAAd4CAQAAAAHfAgEAAAABkwMBAAAAAZQDAQAAAAEBJAAAlQIAMAEkAACVAgAwCA0AAIgIACC6AgEAigUAIcACQACOBQAhwQJAAI4FACHeAgEAigUAId8CAQCLBQAhkwMBAIsFACGUAwEAiwUAIQIAAACMAgAgJAAAmAIAIAe6AgEAigUAIcACQACOBQAhwQJAAI4FACHeAgEAigUAId8CAQCLBQAhkwMBAIsFACGUAwEAiwUAIQIAAAAkACAkAACaAgAgAgAAACQAICQAAJoCACADAAAAjAIAICsAAJMCACAsAACYAgAgAQAAAIwCACABAAAAJAAgBgYAAIUIACAzAACHCAAgNAAAhggAIN8CAACGBQAgkwMAAIYFACCUAwAAhgUAIAq3AgAAxgQAMLgCAAChAgAQuQIAAMYEADC6AgEA4gMAIcACQADmAwAhwQJAAOYDACHeAgEA4gMAId8CAQDjAwAhkwMBAOMDACGUAwEA4wMAIQMAAAAkACABAACgAgAwMAAAoQIAIAMAAAAkACABAACPAgAwAgAAjAIAIAEAAAA6ACABAAAAOgAgAwAAADgAIAEAADkAMAIAADoAIAMAAAA4ACABAAA5ADACAAA6ACADAAAAOAAgAQAAOQAwAgAAOgAgDAwAANoGACAWAADLBQAgugIBAAAAAcACQAAAAAHBAkAAAAAB1QIAAACSAwKMAwEAAAABjQMBAAAAAY4DQAAAAAGPA0AAAAABkAMCAAAAAZIDAQAAAAEBJAAAqQIAIAq6AgEAAAABwAJAAAAAAcECQAAAAAHVAgAAAJIDAowDAQAAAAGNAwEAAAABjgNAAAAAAY8DQAAAAAGQAwIAAAABkgMBAAAAAQEkAACrAgAwASQAAKsCADABAAAAPAAgDAwAANgGACAWAADKBQAgugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAMkFkgMijAMBAIoFACGNAwEAiwUAIY4DQACNBQAhjwNAAI0FACGQAwIAyAUAIZIDAQCLBQAhAgAAADoAICQAAK8CACAKugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAMkFkgMijAMBAIoFACGNAwEAiwUAIY4DQACNBQAhjwNAAI0FACGQAwIAyAUAIZIDAQCLBQAhAgAAADgAICQAALECACACAAAAOAAgJAAAsQIAIAEAAAA8ACADAAAAOgAgKwAAqQIAICwAAK8CACABAAAAOgAgAQAAADgAIAoGAACACAAgMQAAgQgAIDIAAIQIACAzAACDCAAgNAAAgggAII0DAACGBQAgjgMAAIYFACCPAwAAhgUAIJADAACGBQAgkgMAAIYFACANtwIAAMAEADC4AgAAuQIAELkCAADABAAwugIBAOIDACHAAkAA5gMAIcECQADmAwAh1QIAAMIEkgMijAMBAOIDACGNAwEA4wMAIY4DQADlAwAhjwNAAOUDACGQAwIAwQQAIZIDAQDjAwAhAwAAADgAIAEAALgCADAwAAC5AgAgAwAAADgAIAEAADkAMAIAADoAIAEAAAAoACABAAAAKAAgAwAAACYAIAEAACcAMAIAACgAIAMAAAAmACABAAAnADACAAAoACADAAAAJgAgAQAAJwAwAgAAKAAgCw0AAPYHACAQAAC-BwAgEgAAvwcAILoCAQAAAAHAAkAAAAABwQJAAAAAAdUCAAAAjAMC3gIBAAAAAYgDAQAAAAGJA0AAAAABigNAAAAAAQEkAADBAgAgCLoCAQAAAAHAAkAAAAABwQJAAAAAAdUCAAAAjAMC3gIBAAAAAYgDAQAAAAGJA0AAAAABigNAAAAAAQEkAADDAgAwASQAAMMCADALDQAA9AcAIBAAALAHACASAACxBwAgugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAK4HjAMi3gIBAIoFACGIAwEAigUAIYkDQACNBQAhigNAAI0FACECAAAAKAAgJAAAxgIAIAi6AgEAigUAIcACQACOBQAhwQJAAI4FACHVAgAArgeMAyLeAgEAigUAIYgDAQCKBQAhiQNAAI0FACGKA0AAjQUAIQIAAAAmACAkAADIAgAgAgAAACYAICQAAMgCACADAAAAKAAgKwAAwQIAICwAAMYCACABAAAAKAAgAQAAACYAIAUGAAD9BwAgMwAA_wcAIDQAAP4HACCJAwAAhgUAIIoDAACGBQAgC7cCAAC8BAAwuAIAAM8CABC5AgAAvAQAMLoCAQDiAwAhwAJAAOYDACHBAkAA5gMAIdUCAAC9BIwDIt4CAQDiAwAhiAMBAOIDACGJA0AA5QMAIYoDQADlAwAhAwAAACYAIAEAAM4CADAwAADPAgAgAwAAACYAIAEAACcAMAIAACgAIAEAAAAuACABAAAALgAgAwAAACwAIAEAAC0AMAIAAC4AIAMAAAAsACABAAAtADACAAAuACADAAAALAAgAQAALQAwAgAALgAgGA0AALwHACARAACjBwAgugIBAAAAAcACQAAAAAHBAkAAAAAB1QIAAAD3AgLeAgEAAAAB9QIBAAAAAfcCEAAAAAH4AgEAAAAB-gIAAAD6AgL7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wKAAAAAAYADQAAAAAGBAwEAAAABggMBAAAAAYMDQAAAAAGEAxAAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABASQAANcCACAWugIBAAAAAcACQAAAAAHBAkAAAAAB1QIAAAD3AgLeAgEAAAAB9QIBAAAAAfcCEAAAAAH4AgEAAAAB-gIAAAD6AgL7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wKAAAAAAYADQAAAAAGBAwEAAAABggMBAAAAAYMDQAAAAAGEAxAAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABASQAANkCADABJAAA2QIAMBgNAAC6BwAgEQAAoQcAILoCAQCKBQAhwAJAAI4FACHBAkAAjgUAIdUCAACcB_cCIt4CAQCKBQAh9QIBAIoFACH3AhAAnQcAIfgCAQCKBQAh-gIAAJ4H-gIi-wIBAIoFACH8AgEAiwUAIf0CAQCLBQAh_gIBAIsFACH_AoAAAAABgANAAI0FACGBAwEAiwUAIYIDAQCLBQAhgwNAAI0FACGEAxAAnwcAIYUDAQCLBQAhhgMBAIsFACGHAwEAiwUAIQIAAAAuACAkAADcAgAgFroCAQCKBQAhwAJAAI4FACHBAkAAjgUAIdUCAACcB_cCIt4CAQCKBQAh9QIBAIoFACH3AhAAnQcAIfgCAQCKBQAh-gIAAJ4H-gIi-wIBAIoFACH8AgEAiwUAIf0CAQCLBQAh_gIBAIsFACH_AoAAAAABgANAAI0FACGBAwEAiwUAIYIDAQCLBQAhgwNAAI0FACGEAxAAnwcAIYUDAQCLBQAhhgMBAIsFACGHAwEAiwUAIQIAAAAsACAkAADeAgAgAgAAACwAICQAAN4CACADAAAALgAgKwAA1wIAICwAANwCACABAAAALgAgAQAAACwAIBEGAAD4BwAgMQAA-QcAIDIAAPwHACAzAAD7BwAgNAAA-gcAIPwCAACGBQAg_QIAAIYFACD-AgAAhgUAIP8CAACGBQAggAMAAIYFACCBAwAAhgUAIIIDAACGBQAggwMAAIYFACCEAwAAhgUAIIUDAACGBQAghgMAAIYFACCHAwAAhgUAIBm3AgAAsgQAMLgCAADlAgAQuQIAALIEADC6AgEA4gMAIcACQADmAwAhwQJAAOYDACHVAgAAswT3AiLeAgEA4gMAIfUCAQDiAwAh9wIQAKkEACH4AgEA4gMAIfoCAAC0BPoCIvsCAQDiAwAh_AIBAOMDACH9AgEA4wMAIf4CAQDjAwAh_wIAAJMEACCAA0AA5QMAIYEDAQDjAwAhggMBAOMDACGDA0AA5QMAIYQDEAC1BAAhhQMBAOMDACGGAwEA4wMAIYcDAQDjAwAhAwAAACwAIAEAAOQCADAwAADlAgAgAwAAACwAIAEAAC0AMAIAAC4AIA0PAACKBAAgtwIAAK8EADC4AgAA6wIAELkCAACvBAAwugIBAAAAAbsCAQD0AwAhvQIBAPUDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAAsQT1AiLyAhAAsAQAIfMCAgCeBAAhAQAAAOgCACABAAAA6AIAIA0PAACKBAAgtwIAAK8EADC4AgAA6wIAELkCAACvBAAwugIBAPQDACG7AgEA9AMAIb0CAQD1AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIAALEE9QIi8gIQALAEACHzAgIAngQAIQMPAADOBwAgvQIAAIYFACC_AgAAhgUAIAMAAADrAgAgAQAA7AIAMAIAAOgCACADAAAA6wIAIAEAAOwCADACAADoAgAgAwAAAOsCACABAADsAgAwAgAA6AIAIAoPAAD3BwAgugIBAAAAAbsCAQAAAAG9AgEAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB1QIAAAD1AgLyAhAAAAAB8wICAAAAAQEkAADwAgAgCboCAQAAAAG7AgEAAAABvQIBAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAdUCAAAA9QIC8gIQAAAAAfMCAgAAAAEBJAAA8gIAMAEkAADyAgAwCg8AAOsHACC6AgEAigUAIbsCAQCKBQAhvQIBAIsFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgAA6gf1AiLyAhAAnQcAIfMCAgDIBgAhAgAAAOgCACAkAAD1AgAgCboCAQCKBQAhuwIBAIoFACG9AgEAiwUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdUCAADqB_UCIvICEACdBwAh8wICAMgGACECAAAA6wIAICQAAPcCACACAAAA6wIAICQAAPcCACADAAAA6AIAICsAAPACACAsAAD1AgAgAQAAAOgCACABAAAA6wIAIAcGAADlBwAgMQAA5gcAIDIAAOkHACAzAADoBwAgNAAA5wcAIL0CAACGBQAgvwIAAIYFACAMtwIAAKgEADC4AgAA_gIAELkCAACoBAAwugIBAOIDACG7AgEA4gMAIb0CAQDjAwAhvwJAAOUDACHAAkAA5gMAIcECQADmAwAh1QIAAKoE9QIi8gIQAKkEACHzAgIAkgQAIQMAAADrAgAgAQAA_QIAMDAAAP4CACADAAAA6wIAIAEAAOwCADACAADoAgAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAMAwAA5AcAIAUAALAGACAHAACvBgAgugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAeoCAQAAAAHxAggAAAABASQAAIYDACAJugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAeoCAQAAAAHxAggAAAABASQAAIgDADABJAAAiAMAMAwDAADjBwAgBQAAiwYAIAcAAIoGACC6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG-AiAAjAUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIeoCAQCKBQAh8QIIAJsFACECAAAABQAgJAAAiwMAIAm6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG-AiAAjAUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIeoCAQCKBQAh8QIIAJsFACECAAAAAwAgJAAAjQMAIAIAAAADACAkAACNAwAgAwAAAAUAICsAAIYDACAsAACLAwAgAQAAAAUAIAEAAAADACAHBgAA3gcAIDEAAN8HACAyAADiBwAgMwAA4QcAIDQAAOAHACC_AgAAhgUAIPECAACGBQAgDLcCAACkBAAwuAIAAJQDABC5AgAApAQAMLoCAQDiAwAhuwIBAOIDACG8AgEA4gMAIb4CIADkAwAhvwJAAOUDACHAAkAA5gMAIcECQADmAwAh6gIBAOIDACHxAggApQQAIQMAAAADACABAACTAwAwMAAAlAMAIAMAAAADACABAAAEADACAAAFACAWDQAAogQAIBUAAI0EACAXAACjBAAgtwIAAJ0EADC4AgAAPAAQuQIAAJ0EADC6AgEAAAABvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIAAKAE5wIi3gIBAAAAAd8CAQAAAAHgAgEAAAAB4QIBAPUDACHiAgIAngQAIeMCAQD1AwAh5AIBAPUDACHlAgAAnwQAIOgCAAChBOgCIukCAQD1AwAh6gIBAPUDACEBAAAAlwMAIAEAAACXAwAgCg0AANwHACAVAADRBwAgFwAA3QcAIL8CAACGBQAg4QIAAIYFACDjAgAAhgUAIOQCAACGBQAg5QIAAIYFACDpAgAAhgUAIOoCAACGBQAgAwAAADwAIAEAAJoDADACAACXAwAgAwAAADwAIAEAAJoDADACAACXAwAgAwAAADwAIAEAAJoDADACAACXAwAgEw0AANsHACAVAADmBgAgFwAA5wYAILoCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAOcCAt4CAQAAAAHfAgEAAAAB4AIBAAAAAeECAQAAAAHiAgIAAAAB4wIBAAAAAeQCAQAAAAHlAoAAAAAB6AIAAADoAgLpAgEAAAAB6gIBAAAAAQEkAACeAwAgELoCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAOcCAt4CAQAAAAHfAgEAAAAB4AIBAAAAAeECAQAAAAHiAgIAAAAB4wIBAAAAAeQCAQAAAAHlAoAAAAAB6AIAAADoAgLpAgEAAAAB6gIBAAAAAQEkAACgAwAwASQAAKADADATDQAA2gcAIBUAAMsGACAXAADMBgAgugIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgAAyQbnAiLeAgEAigUAId8CAQCKBQAh4AIBAIoFACHhAgEAiwUAIeICAgDIBgAh4wIBAIsFACHkAgEAiwUAIeUCgAAAAAHoAgAAygboAiLpAgEAiwUAIeoCAQCLBQAhAgAAAJcDACAkAACjAwAgELoCAQCKBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh1QIAAMkG5wIi3gIBAIoFACHfAgEAigUAIeACAQCKBQAh4QIBAIsFACHiAgIAyAYAIeMCAQCLBQAh5AIBAIsFACHlAoAAAAAB6AIAAMoG6AIi6QIBAIsFACHqAgEAiwUAIQIAAAA8ACAkAAClAwAgAgAAADwAICQAAKUDACADAAAAlwMAICsAAJ4DACAsAACjAwAgAQAAAJcDACABAAAAPAAgDAYAANUHACAxAADWBwAgMgAA2QcAIDMAANgHACA0AADXBwAgvwIAAIYFACDhAgAAhgUAIOMCAACGBQAg5AIAAIYFACDlAgAAhgUAIOkCAACGBQAg6gIAAIYFACATtwIAAJEEADC4AgAArAMAELkCAACRBAAwugIBAOIDACG_AkAA5QMAIcACQADmAwAhwQJAAOYDACHVAgAAlATnAiLeAgEA4gMAId8CAQDiAwAh4AIBAOIDACHhAgEA4wMAIeICAgCSBAAh4wIBAOMDACHkAgEA4wMAIeUCAACTBAAg6AIAAJUE6AIi6QIBAOMDACHqAgEA4wMAIQMAAAA8ACABAACrAwAwMAAArAMAIAMAAAA8ACABAACaAwAwAgAAlwMAIBsOAACJBAAgDwAAigQAIBMAAIsEACAUAACMBAAgFQAAjQQAIBYAAJAEACAZAACOBAAgGwAAjwQAILcCAACFBAAwuAIAALIDABC5AgAAhQQAMLoCAQAAAAG7AgEA9AMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIdACAQAAAAHRAgEA9QMAIdMCAACGBNMCItUCAACHBNUCItYCIAD2AwAh1wIgAPYDACHYAiAA9gMAIdkCAQAAAAHbAgAAiATbAiLcAgEA9AMAId0CAQD0AwAhAQAAAK8DACABAAAArwMAIBsOAACJBAAgDwAAigQAIBMAAIsEACAUAACMBAAgFQAAjQQAIBYAAJAEACAZAACOBAAgGwAAjwQAILcCAACFBAAwuAIAALIDABC5AgAAhQQAMLoCAQD0AwAhuwIBAPQDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHQAgEA9AMAIdECAQD1AwAh0wIAAIYE0wIi1QIAAIcE1QIi1gIgAPYDACHXAiAA9gMAIdgCIAD2AwAh2QIBAPUDACHbAgAAiATbAiLcAgEA9AMAId0CAQD0AwAhCw4AAM0HACAPAADOBwAgEwAAzwcAIBQAANAHACAVAADRBwAgFgAA1AcAIBkAANIHACAbAADTBwAgvwIAAIYFACDRAgAAhgUAINkCAACGBQAgAwAAALIDACABAACzAwAwAgAArwMAIAMAAACyAwAgAQAAswMAMAIAAK8DACADAAAAsgMAIAEAALMDADACAACvAwAgGA4AAMUHACAPAADGBwAgEwAAxwcAIBQAAMgHACAVAADJBwAgFgAAzAcAIBkAAMoHACAbAADLBwAgugIBAAAAAbsCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHQAgEAAAAB0QIBAAAAAdMCAAAA0wIC1QIAAADVAgLWAiAAAAAB1wIgAAAAAdgCIAAAAAHZAgEAAAAB2wIAAADbAgLcAgEAAAAB3QIBAAAAAQEkAAC3AwAgELoCAQAAAAG7AgEAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB0AIBAAAAAdECAQAAAAHTAgAAANMCAtUCAAAA1QIC1gIgAAAAAdcCIAAAAAHYAiAAAAAB2QIBAAAAAdsCAAAA2wIC3AIBAAAAAd0CAQAAAAEBJAAAuQMAMAEkAAC5AwAwGA4AALsGACAPAAC8BgAgEwAAvQYAIBQAAL4GACAVAAC_BgAgFgAAwgYAIBkAAMAGACAbAADBBgAgugIBAIoFACG7AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdACAQCKBQAh0QIBAIsFACHTAgAAuAbTAiLVAgAAuQbVAiLWAiAAjAUAIdcCIACMBQAh2AIgAIwFACHZAgEAiwUAIdsCAAC6BtsCItwCAQCKBQAh3QIBAIoFACECAAAArwMAICQAALwDACAQugIBAIoFACG7AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdACAQCKBQAh0QIBAIsFACHTAgAAuAbTAiLVAgAAuQbVAiLWAiAAjAUAIdcCIACMBQAh2AIgAIwFACHZAgEAiwUAIdsCAAC6BtsCItwCAQCKBQAh3QIBAIoFACECAAAAsgMAICQAAL4DACACAAAAsgMAICQAAL4DACADAAAArwMAICsAALcDACAsAAC8AwAgAQAAAK8DACABAAAAsgMAIAYGAAC1BgAgMwAAtwYAIDQAALYGACC_AgAAhgUAINECAACGBQAg2QIAAIYFACATtwIAAPsDADC4AgAAxQMAELkCAAD7AwAwugIBAOIDACG7AgEA4gMAIb8CQADlAwAhwAJAAOYDACHBAkAA5gMAIdACAQDiAwAh0QIBAOMDACHTAgAA_APTAiLVAgAA_QPVAiLWAiAA5AMAIdcCIADkAwAh2AIgAOQDACHZAgEA4wMAIdsCAAD-A9sCItwCAQDiAwAh3QIBAOIDACEDAAAAsgMAIAEAAMQDADAwAADFAwAgAwAAALIDACABAACzAwAwAgAArwMAIA0FAAD6AwAgCAAA-QMAILcCAADzAwAwuAIAAMsDABC5AgAA8wMAMLoCAQAAAAG7AgEA9AMAIbwCAQAAAAG9AgEA9QMAIb4CIAD2AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAhAQAAAMgDACABAAAAyAMAIA0FAAD6AwAgCAAA-QMAILcCAADzAwAwuAIAAMsDABC5AgAA8wMAMLoCAQD0AwAhuwIBAPQDACG8AgEA9AMAIb0CAQD1AwAhvgIgAPYDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACEEBQAAtAYAIAgAALMGACC9AgAAhgUAIL8CAACGBQAgAwAAAMsDACABAADMAwAwAgAAyAMAIAMAAADLAwAgAQAAzAMAMAIAAMgDACADAAAAywMAIAEAAMwDADACAADIAwAgCgUAALIGACAIAACxBgAgugIBAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb4CIAAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAEBJAAA0AMAIAi6AgEAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAQEkAADSAwAwASQAANIDADAKBQAAkAUAIAgAAI8FACC6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG9AgEAiwUAIb4CIACMBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAhAgAAAMgDACAkAADVAwAgCLoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb0CAQCLBQAhvgIgAIwFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACECAAAAywMAICQAANcDACACAAAAywMAICQAANcDACADAAAAyAMAICsAANADACAsAADVAwAgAQAAAMgDACABAAAAywMAIAUGAACHBQAgMwAAiQUAIDQAAIgFACC9AgAAhgUAIL8CAACGBQAgC7cCAADhAwAwuAIAAN4DABC5AgAA4QMAMLoCAQDiAwAhuwIBAOIDACG8AgEA4gMAIb0CAQDjAwAhvgIgAOQDACG_AkAA5QMAIcACQADmAwAhwQJAAOYDACEDAAAAywMAIAEAAN0DADAwAADeAwAgAwAAAMsDACABAADMAwAwAgAAyAMAIAu3AgAA4QMAMLgCAADeAwAQuQIAAOEDADC6AgEA4gMAIbsCAQDiAwAhvAIBAOIDACG9AgEA4wMAIb4CIADkAwAhvwJAAOUDACHAAkAA5gMAIcECQADmAwAhDgYAAOgDACAzAADyAwAgNAAA8gMAIMICAQAAAAHDAgEAAAAExAIBAAAABMUCAQAAAAHGAgEAAAABxwIBAAAAAcgCAQAAAAHJAgEA8QMAIcoCAQAAAAHLAgEAAAABzAIBAAAAAQ4GAADrAwAgMwAA8AMAIDQAAPADACDCAgEAAAABwwIBAAAABcQCAQAAAAXFAgEAAAABxgIBAAAAAccCAQAAAAHIAgEAAAAByQIBAO8DACHKAgEAAAABywIBAAAAAcwCAQAAAAEFBgAA6AMAIDMAAO4DACA0AADuAwAgwgIgAAAAAckCIADtAwAhCwYAAOsDACAzAADsAwAgNAAA7AMAIMICQAAAAAHDAkAAAAAFxAJAAAAABcUCQAAAAAHGAkAAAAABxwJAAAAAAcgCQAAAAAHJAkAA6gMAIQsGAADoAwAgMwAA6QMAIDQAAOkDACDCAkAAAAABwwJAAAAABMQCQAAAAATFAkAAAAABxgJAAAAAAccCQAAAAAHIAkAAAAAByQJAAOcDACELBgAA6AMAIDMAAOkDACA0AADpAwAgwgJAAAAAAcMCQAAAAATEAkAAAAAExQJAAAAAAcYCQAAAAAHHAkAAAAAByAJAAAAAAckCQADnAwAhCMICAgAAAAHDAgIAAAAExAICAAAABMUCAgAAAAHGAgIAAAABxwICAAAAAcgCAgAAAAHJAgIA6AMAIQjCAkAAAAABwwJAAAAABMQCQAAAAATFAkAAAAABxgJAAAAAAccCQAAAAAHIAkAAAAAByQJAAOkDACELBgAA6wMAIDMAAOwDACA0AADsAwAgwgJAAAAAAcMCQAAAAAXEAkAAAAAFxQJAAAAAAcYCQAAAAAHHAkAAAAAByAJAAAAAAckCQADqAwAhCMICAgAAAAHDAgIAAAAFxAICAAAABcUCAgAAAAHGAgIAAAABxwICAAAAAcgCAgAAAAHJAgIA6wMAIQjCAkAAAAABwwJAAAAABcQCQAAAAAXFAkAAAAABxgJAAAAAAccCQAAAAAHIAkAAAAAByQJAAOwDACEFBgAA6AMAIDMAAO4DACA0AADuAwAgwgIgAAAAAckCIADtAwAhAsICIAAAAAHJAiAA7gMAIQ4GAADrAwAgMwAA8AMAIDQAAPADACDCAgEAAAABwwIBAAAABcQCAQAAAAXFAgEAAAABxgIBAAAAAccCAQAAAAHIAgEAAAAByQIBAO8DACHKAgEAAAABywIBAAAAAcwCAQAAAAELwgIBAAAAAcMCAQAAAAXEAgEAAAAFxQIBAAAAAcYCAQAAAAHHAgEAAAAByAIBAAAAAckCAQDwAwAhygIBAAAAAcsCAQAAAAHMAgEAAAABDgYAAOgDACAzAADyAwAgNAAA8gMAIMICAQAAAAHDAgEAAAAExAIBAAAABMUCAQAAAAHGAgEAAAABxwIBAAAAAcgCAQAAAAHJAgEA8QMAIcoCAQAAAAHLAgEAAAABzAIBAAAAAQvCAgEAAAABwwIBAAAABMQCAQAAAATFAgEAAAABxgIBAAAAAccCAQAAAAHIAgEAAAAByQIBAPIDACHKAgEAAAABywIBAAAAAcwCAQAAAAENBQAA-gMAIAgAAPkDACC3AgAA8wMAMLgCAADLAwAQuQIAAPMDADC6AgEA9AMAIbsCAQD0AwAhvAIBAPQDACG9AgEA9QMAIb4CIAD2AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAhC8ICAQAAAAHDAgEAAAAExAIBAAAABMUCAQAAAAHGAgEAAAABxwIBAAAAAcgCAQAAAAHJAgEA8gMAIcoCAQAAAAHLAgEAAAABzAIBAAAAAQvCAgEAAAABwwIBAAAABcQCAQAAAAXFAgEAAAABxgIBAAAAAccCAQAAAAHIAgEAAAAByQIBAPADACHKAgEAAAABywIBAAAAAcwCAQAAAAECwgIgAAAAAckCIADuAwAhCMICQAAAAAHDAkAAAAAFxAJAAAAABcUCQAAAAAHGAkAAAAABxwJAAAAAAcgCQAAAAAHJAkAA7AMAIQjCAkAAAAABwwJAAAAABMQCQAAAAATFAkAAAAABxgJAAAAAAccCQAAAAAHIAkAAAAAByQJAAOkDACEDzQIAAAMAIM4CAAADACDPAgAAAwAgA80CAAALACDOAgAACwAgzwIAAAsAIBO3AgAA-wMAMLgCAADFAwAQuQIAAPsDADC6AgEA4gMAIbsCAQDiAwAhvwJAAOUDACHAAkAA5gMAIcECQADmAwAh0AIBAOIDACHRAgEA4wMAIdMCAAD8A9MCItUCAAD9A9UCItYCIADkAwAh1wIgAOQDACHYAiAA5AMAIdkCAQDjAwAh2wIAAP4D2wIi3AIBAOIDACHdAgEA4gMAIQcGAADoAwAgMwAAhAQAIDQAAIQEACDCAgAAANMCAsMCAAAA0wIIxAIAAADTAgjJAgAAgwTTAiIHBgAA6AMAIDMAAIIEACA0AACCBAAgwgIAAADVAgLDAgAAANUCCMQCAAAA1QIIyQIAAIEE1QIiBwYAAOgDACAzAACABAAgNAAAgAQAIMICAAAA2wICwwIAAADbAgjEAgAAANsCCMkCAAD_A9sCIgcGAADoAwAgMwAAgAQAIDQAAIAEACDCAgAAANsCAsMCAAAA2wIIxAIAAADbAgjJAgAA_wPbAiIEwgIAAADbAgLDAgAAANsCCMQCAAAA2wIIyQIAAIAE2wIiBwYAAOgDACAzAACCBAAgNAAAggQAIMICAAAA1QICwwIAAADVAgjEAgAAANUCCMkCAACBBNUCIgTCAgAAANUCAsMCAAAA1QIIxAIAAADVAgjJAgAAggTVAiIHBgAA6AMAIDMAAIQEACA0AACEBAAgwgIAAADTAgLDAgAAANMCCMQCAAAA0wIIyQIAAIME0wIiBMICAAAA0wICwwIAAADTAgjEAgAAANMCCMkCAACEBNMCIhsOAACJBAAgDwAAigQAIBMAAIsEACAUAACMBAAgFQAAjQQAIBYAAJAEACAZAACOBAAgGwAAjwQAILcCAACFBAAwuAIAALIDABC5AgAAhQQAMLoCAQD0AwAhuwIBAPQDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHQAgEA9AMAIdECAQD1AwAh0wIAAIYE0wIi1QIAAIcE1QIi1gIgAPYDACHXAiAA9gMAIdgCIAD2AwAh2QIBAPUDACHbAgAAiATbAiLcAgEA9AMAId0CAQD0AwAhBMICAAAA0wICwwIAAADTAgjEAgAAANMCCMkCAACEBNMCIgTCAgAAANUCAsMCAAAA1QIIxAIAAADVAgjJAgAAggTVAiIEwgIAAADbAgLDAgAAANsCCMQCAAAA2wIIyQIAAIAE2wIiDQ0AAKIEACC3AgAAxwQAMLgCAAAkABC5AgAAxwQAMLoCAQD0AwAhwAJAAPgDACHBAkAA-AMAId4CAQD0AwAh3wIBAPUDACGTAwEA9QMAIZQDAQD1AwAhtAMAACQAILUDAAAkACADzQIAACYAIM4CAAAmACDPAgAAJgAgA80CAAAsACDOAgAALAAgzwIAACwAIAPNAgAAHwAgzgIAAB8AIM8CAAAfACADzQIAADMAIM4CAAAzACDPAgAAMwAgA80CAABAACDOAgAAQAAgzwIAAEAAIAPNAgAARAAgzgIAAEQAIM8CAABEACAYDQAAogQAIBUAAI0EACAXAACjBAAgtwIAAJ0EADC4AgAAPAAQuQIAAJ0EADC6AgEA9AMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIdUCAACgBOcCIt4CAQD0AwAh3wIBAPQDACHgAgEA9AMAIeECAQD1AwAh4gICAJ4EACHjAgEA9QMAIeQCAQD1AwAh5QIAAJ8EACDoAgAAoQToAiLpAgEA9QMAIeoCAQD1AwAhtAMAADwAILUDAAA8ACATtwIAAJEEADC4AgAArAMAELkCAACRBAAwugIBAOIDACG_AkAA5QMAIcACQADmAwAhwQJAAOYDACHVAgAAlATnAiLeAgEA4gMAId8CAQDiAwAh4AIBAOIDACHhAgEA4wMAIeICAgCSBAAh4wIBAOMDACHkAgEA4wMAIeUCAACTBAAg6AIAAJUE6AIi6QIBAOMDACHqAgEA4wMAIQ0GAADoAwAgMQAAnAQAIDIAAOgDACAzAADoAwAgNAAA6AMAIMICAgAAAAHDAgIAAAAExAICAAAABMUCAgAAAAHGAgIAAAABxwICAAAAAcgCAgAAAAHJAgIAmwQAIQ8GAADrAwAgMwAAmgQAIDQAAJoEACDCAoAAAAABxQKAAAAAAcYCgAAAAAHHAoAAAAAByAKAAAAAAckCgAAAAAHrAgEAAAAB7AIBAAAAAe0CAQAAAAHuAoAAAAAB7wKAAAAAAfACgAAAAAEHBgAA6AMAIDMAAJkEACA0AACZBAAgwgIAAADnAgLDAgAAAOcCCMQCAAAA5wIIyQIAAJgE5wIiBwYAAOgDACAzAACXBAAgNAAAlwQAIMICAAAA6AICwwIAAADoAgjEAgAAAOgCCMkCAACWBOgCIgcGAADoAwAgMwAAlwQAIDQAAJcEACDCAgAAAOgCAsMCAAAA6AIIxAIAAADoAgjJAgAAlgToAiIEwgIAAADoAgLDAgAAAOgCCMQCAAAA6AIIyQIAAJcE6AIiBwYAAOgDACAzAACZBAAgNAAAmQQAIMICAAAA5wICwwIAAADnAgjEAgAAAOcCCMkCAACYBOcCIgTCAgAAAOcCAsMCAAAA5wIIxAIAAADnAgjJAgAAmQTnAiIMwgKAAAAAAcUCgAAAAAHGAoAAAAABxwKAAAAAAcgCgAAAAAHJAoAAAAAB6wIBAAAAAewCAQAAAAHtAgEAAAAB7gKAAAAAAe8CgAAAAAHwAoAAAAABDQYAAOgDACAxAACcBAAgMgAA6AMAIDMAAOgDACA0AADoAwAgwgICAAAAAcMCAgAAAATEAgIAAAAExQICAAAAAcYCAgAAAAHHAgIAAAAByAICAAAAAckCAgCbBAAhCMICCAAAAAHDAggAAAAExAIIAAAABMUCCAAAAAHGAggAAAABxwIIAAAAAcgCCAAAAAHJAggAnAQAIRYNAACiBAAgFQAAjQQAIBcAAKMEACC3AgAAnQQAMLgCAAA8ABC5AgAAnQQAMLoCAQD0AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIAAKAE5wIi3gIBAPQDACHfAgEA9AMAIeACAQD0AwAh4QIBAPUDACHiAgIAngQAIeMCAQD1AwAh5AIBAPUDACHlAgAAnwQAIOgCAAChBOgCIukCAQD1AwAh6gIBAPUDACEIwgICAAAAAcMCAgAAAATEAgIAAAAExQICAAAAAcYCAgAAAAHHAgIAAAAByAICAAAAAckCAgDoAwAhDMICgAAAAAHFAoAAAAABxgKAAAAAAccCgAAAAAHIAoAAAAAByQKAAAAAAesCAQAAAAHsAgEAAAAB7QIBAAAAAe4CgAAAAAHvAoAAAAAB8AKAAAAAAQTCAgAAAOcCAsMCAAAA5wIIxAIAAADnAgjJAgAAmQTnAiIEwgIAAADoAgLDAgAAAOgCCMQCAAAA6AIIyQIAAJcE6AIiHQ4AAIkEACAPAACKBAAgEwAAiwQAIBQAAIwEACAVAACNBAAgFgAAkAQAIBkAAI4EACAbAACPBAAgtwIAAIUEADC4AgAAsgMAELkCAACFBAAwugIBAPQDACG7AgEA9AMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIdACAQD0AwAh0QIBAPUDACHTAgAAhgTTAiLVAgAAhwTVAiLWAiAA9gMAIdcCIAD2AwAh2AIgAPYDACHZAgEA9QMAIdsCAACIBNsCItwCAQD0AwAh3QIBAPQDACG0AwAAsgMAILUDAACyAwAgA80CAAA4ACDOAgAAOAAgzwIAADgAIAy3AgAApAQAMLgCAACUAwAQuQIAAKQEADC6AgEA4gMAIbsCAQDiAwAhvAIBAOIDACG-AiAA5AMAIb8CQADlAwAhwAJAAOYDACHBAkAA5gMAIeoCAQDiAwAh8QIIAKUEACENBgAA6wMAIDEAAKcEACAyAACnBAAgMwAApwQAIDQAAKcEACDCAggAAAABwwIIAAAABcQCCAAAAAXFAggAAAABxgIIAAAAAccCCAAAAAHIAggAAAAByQIIAKYEACENBgAA6wMAIDEAAKcEACAyAACnBAAgMwAApwQAIDQAAKcEACDCAggAAAABwwIIAAAABcQCCAAAAAXFAggAAAABxgIIAAAAAccCCAAAAAHIAggAAAAByQIIAKYEACEIwgIIAAAAAcMCCAAAAAXEAggAAAAFxQIIAAAAAcYCCAAAAAHHAggAAAAByAIIAAAAAckCCACnBAAhDLcCAACoBAAwuAIAAP4CABC5AgAAqAQAMLoCAQDiAwAhuwIBAOIDACG9AgEA4wMAIb8CQADlAwAhwAJAAOYDACHBAkAA5gMAIdUCAACqBPUCIvICEACpBAAh8wICAJIEACENBgAA6AMAIDEAAK4EACAyAACuBAAgMwAArgQAIDQAAK4EACDCAhAAAAABwwIQAAAABMQCEAAAAATFAhAAAAABxgIQAAAAAccCEAAAAAHIAhAAAAAByQIQAK0EACEHBgAA6AMAIDMAAKwEACA0AACsBAAgwgIAAAD1AgLDAgAAAPUCCMQCAAAA9QIIyQIAAKsE9QIiBwYAAOgDACAzAACsBAAgNAAArAQAIMICAAAA9QICwwIAAAD1AgjEAgAAAPUCCMkCAACrBPUCIgTCAgAAAPUCAsMCAAAA9QIIxAIAAAD1AgjJAgAArAT1AiINBgAA6AMAIDEAAK4EACAyAACuBAAgMwAArgQAIDQAAK4EACDCAhAAAAABwwIQAAAABMQCEAAAAATFAhAAAAABxgIQAAAAAccCEAAAAAHIAhAAAAAByQIQAK0EACEIwgIQAAAAAcMCEAAAAATEAhAAAAAExQIQAAAAAcYCEAAAAAHHAhAAAAAByAIQAAAAAckCEACuBAAhDQ8AAIoEACC3AgAArwQAMLgCAADrAgAQuQIAAK8EADC6AgEA9AMAIbsCAQD0AwAhvQIBAPUDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAAsQT1AiLyAhAAsAQAIfMCAgCeBAAhCMICEAAAAAHDAhAAAAAExAIQAAAABMUCEAAAAAHGAhAAAAABxwIQAAAAAcgCEAAAAAHJAhAArgQAIQTCAgAAAPUCAsMCAAAA9QIIxAIAAAD1AgjJAgAArAT1AiIZtwIAALIEADC4AgAA5QIAELkCAACyBAAwugIBAOIDACHAAkAA5gMAIcECQADmAwAh1QIAALME9wIi3gIBAOIDACH1AgEA4gMAIfcCEACpBAAh-AIBAOIDACH6AgAAtAT6AiL7AgEA4gMAIfwCAQDjAwAh_QIBAOMDACH-AgEA4wMAIf8CAACTBAAggANAAOUDACGBAwEA4wMAIYIDAQDjAwAhgwNAAOUDACGEAxAAtQQAIYUDAQDjAwAhhgMBAOMDACGHAwEA4wMAIQcGAADoAwAgMwAAuwQAIDQAALsEACDCAgAAAPcCAsMCAAAA9wIIxAIAAAD3AgjJAgAAugT3AiIHBgAA6AMAIDMAALkEACA0AAC5BAAgwgIAAAD6AgLDAgAAAPoCCMQCAAAA-gIIyQIAALgE-gIiDQYAAOsDACAxAAC3BAAgMgAAtwQAIDMAALcEACA0AAC3BAAgwgIQAAAAAcMCEAAAAAXEAhAAAAAFxQIQAAAAAcYCEAAAAAHHAhAAAAAByAIQAAAAAckCEAC2BAAhDQYAAOsDACAxAAC3BAAgMgAAtwQAIDMAALcEACA0AAC3BAAgwgIQAAAAAcMCEAAAAAXEAhAAAAAFxQIQAAAAAcYCEAAAAAHHAhAAAAAByAIQAAAAAckCEAC2BAAhCMICEAAAAAHDAhAAAAAFxAIQAAAABcUCEAAAAAHGAhAAAAABxwIQAAAAAcgCEAAAAAHJAhAAtwQAIQcGAADoAwAgMwAAuQQAIDQAALkEACDCAgAAAPoCAsMCAAAA-gIIxAIAAAD6AgjJAgAAuAT6AiIEwgIAAAD6AgLDAgAAAPoCCMQCAAAA-gIIyQIAALkE-gIiBwYAAOgDACAzAAC7BAAgNAAAuwQAIMICAAAA9wICwwIAAAD3AgjEAgAAAPcCCMkCAAC6BPcCIgTCAgAAAPcCAsMCAAAA9wIIxAIAAAD3AgjJAgAAuwT3AiILtwIAALwEADC4AgAAzwIAELkCAAC8BAAwugIBAOIDACHAAkAA5gMAIcECQADmAwAh1QIAAL0EjAMi3gIBAOIDACGIAwEA4gMAIYkDQADlAwAhigNAAOUDACEHBgAA6AMAIDMAAL8EACA0AAC_BAAgwgIAAACMAwLDAgAAAIwDCMQCAAAAjAMIyQIAAL4EjAMiBwYAAOgDACAzAAC_BAAgNAAAvwQAIMICAAAAjAMCwwIAAACMAwjEAgAAAIwDCMkCAAC-BIwDIgTCAgAAAIwDAsMCAAAAjAMIxAIAAACMAwjJAgAAvwSMAyINtwIAAMAEADC4AgAAuQIAELkCAADABAAwugIBAOIDACHAAkAA5gMAIcECQADmAwAh1QIAAMIEkgMijAMBAOIDACGNAwEA4wMAIY4DQADlAwAhjwNAAOUDACGQAwIAwQQAIZIDAQDjAwAhDQYAAOsDACAxAACnBAAgMgAA6wMAIDMAAOsDACA0AADrAwAgwgICAAAAAcMCAgAAAAXEAgIAAAAFxQICAAAAAcYCAgAAAAHHAgIAAAAByAICAAAAAckCAgDFBAAhBwYAAOgDACAzAADEBAAgNAAAxAQAIMICAAAAkgMCwwIAAACSAwjEAgAAAJIDCMkCAADDBJIDIgcGAADoAwAgMwAAxAQAIDQAAMQEACDCAgAAAJIDAsMCAAAAkgMIxAIAAACSAwjJAgAAwwSSAyIEwgIAAACSAwLDAgAAAJIDCMQCAAAAkgMIyQIAAMQEkgMiDQYAAOsDACAxAACnBAAgMgAA6wMAIDMAAOsDACA0AADrAwAgwgICAAAAAcMCAgAAAAXEAgIAAAAFxQICAAAAAcYCAgAAAAHHAgIAAAAByAICAAAAAckCAgDFBAAhCrcCAADGBAAwuAIAAKECABC5AgAAxgQAMLoCAQDiAwAhwAJAAOYDACHBAkAA5gMAId4CAQDiAwAh3wIBAOMDACGTAwEA4wMAIZQDAQDjAwAhCw0AAKIEACC3AgAAxwQAMLgCAAAkABC5AgAAxwQAMLoCAQD0AwAhwAJAAPgDACHBAkAA-AMAId4CAQD0AwAh3wIBAPUDACGTAwEA9QMAIZQDAQD1AwAhDLcCAADIBAAwuAIAAIkCABC5AgAAyAQAMLoCAQDiAwAhvQIBAOIDACHAAkAA5gMAIcECQADmAwAhjAMBAOMDACGVAwEA4gMAIZYDAQDiAwAhlwMIAKUEACGYAwgApQQAIQy3AgAAyQQAMLgCAADxAQAQuQIAAMkEADC6AgEA4gMAIdUCAADKBJsDIowDAQDiAwAhjQMBAOIDACGOA0AA5QMAIY8DQADlAwAhmQMBAOIDACGbA0AA5gMAIZwDQADlAwAhBwYAAOgDACAzAADMBAAgNAAAzAQAIMICAAAAmwMCwwIAAACbAwjEAgAAAJsDCMkCAADLBJsDIgcGAADoAwAgMwAAzAQAIDQAAMwEACDCAgAAAJsDAsMCAAAAmwMIxAIAAACbAwjJAgAAywSbAyIEwgIAAACbAwLDAgAAAJsDCMQCAAAAmwMIyQIAAMwEmwMiD7cCAADNBAAwuAIAANsBABC5AgAAzQQAMLoCAQDiAwAhvQIBAOMDACG_AkAA5QMAIcACQADmAwAhwQJAAOYDACHVAgAA0ASjAyKOA0AA5QMAIZYDAQDiAwAhnQMBAOIDACGfAwAAzgSfAyKhAwAAzwShAyKjA0AA5QMAIQcGAADoAwAgMwAA1gQAIDQAANYEACDCAgAAAJ8DAsMCAAAAnwMIxAIAAACfAwjJAgAA1QSfAyIHBgAA6AMAIDMAANQEACA0AADUBAAgwgIAAAChAwLDAgAAAKEDCMQCAAAAoQMIyQIAANMEoQMiBwYAAOgDACAzAADSBAAgNAAA0gQAIMICAAAAowMCwwIAAACjAwjEAgAAAKMDCMkCAADRBKMDIgcGAADoAwAgMwAA0gQAIDQAANIEACDCAgAAAKMDAsMCAAAAowMIxAIAAACjAwjJAgAA0QSjAyIEwgIAAACjAwLDAgAAAKMDCMQCAAAAowMIyQIAANIEowMiBwYAAOgDACAzAADUBAAgNAAA1AQAIMICAAAAoQMCwwIAAAChAwjEAgAAAKEDCMkCAADTBKEDIgTCAgAAAKEDAsMCAAAAoQMIxAIAAAChAwjJAgAA1AShAyIHBgAA6AMAIDMAANYEACA0AADWBAAgwgIAAACfAwLDAgAAAJ8DCMQCAAAAnwMIyQIAANUEnwMiBMICAAAAnwMCwwIAAACfAwjEAgAAAJ8DCMkCAADWBJ8DIgm3AgAA1wQAMLgCAADFAQAQuQIAANcEADC6AgEA4gMAIcACQADmAwAh3gIBAOIDACGdAwEA4gMAIaQDAQDiAwAhpQMgAOQDACEOtwIAANgEADC4AgAArwEAELkCAADYBAAwugIBAOIDACG9AgEA4wMAIb8CQADlAwAhwAJAAOYDACHBAkAA5gMAIdUCAADZBKkDIpYDAQDiAwAhnQMBAOIDACGmA0AA5gMAIacDQADmAwAhqQMBAOIDACEHBgAA6AMAIDMAANsEACA0AADbBAAgwgIAAACpAwLDAgAAAKkDCMQCAAAAqQMIyQIAANoEqQMiBwYAAOgDACAzAADbBAAgNAAA2wQAIMICAAAAqQMCwwIAAACpAwjEAgAAAKkDCMkCAADaBKkDIgTCAgAAAKkDAsMCAAAAqQMIxAIAAACpAwjJAgAA2wSpAyILtwIAANwEADC4AgAAmQEAELkCAADcBAAwugIBAOIDACG7AgEA4gMAIbwCAQDiAwAhvwJAAOUDACHAAkAA5gMAIcECQADmAwAh1QIBAOMDACGqAwEA4gMAIQy3AgAA3QQAMLgCAACDAQAQuQIAAN0EADC6AgEA4gMAIcACQADmAwAhqwMBAOIDACGsAwEA4gMAIa0DAQDiAwAhrgMBAOIDACGvAwAAkwQAILADAACTBAAgsQMBAOMDACEQtwIAAN4EADC4AgAAbQAQuQIAAN4EADC6AgEA4gMAIbsCAQDiAwAhvAIBAOIDACG-AiAA5AMAIb8CQADlAwAhwAJAAOYDACHBAkAA5gMAIeoCAQDiAwAhkwMBAOMDACGXAwgApQQAIZgDCAClBAAhqgMBAOMDACGyAwEA4wMAIQ0aAACiBAAgtwIAAN8EADC4AgAARAAQuQIAAN8EADC6AgEA9AMAIcACQAD4AwAhqwMBAPQDACGsAwEA9AMAIa0DAQD0AwAhrgMBAPQDACGvAwAAnwQAILADAACfBAAgsQMBAPUDACEKDQAAogQAILcCAADgBAAwuAIAAEAAELkCAADgBAAwugIBAPQDACHAAkAA-AMAId4CAQD0AwAhnQMBAPQDACGkAwEA9AMAIaUDIAD2AwAhDwwAAOQEACAWAACQBAAgtwIAAOEEADC4AgAAOAAQuQIAAOEEADC6AgEA9AMAIcACQAD4AwAhwQJAAPgDACHVAgAA4wSSAyKMAwEA9AMAIY0DAQD1AwAhjgNAAPcDACGPA0AA9wMAIZADAgDiBAAhkgMBAPUDACEIwgICAAAAAcMCAgAAAAXEAgIAAAAFxQICAAAAAcYCAgAAAAHHAgIAAAAByAICAAAAAckCAgDrAwAhBMICAAAAkgMCwwIAAACSAwjEAgAAAJIDCMkCAADEBJIDIhUKAAD0BAAgFAAAjAQAIBUAAI0EACAdAAD5BAAgtwIAAPUEADC4AgAAGwAQuQIAAPUEADC6AgEA9AMAIb0CAQD1AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIAAPgEowMijgNAAPcDACGWAwEA9AMAIZ0DAQD0AwAhnwMAAPYEnwMioQMAAPcEoQMiowNAAPcDACG0AwAAGwAgtQMAABsAIAKMAwEAAAABjQMBAAAAAQ8MAADkBAAgFgAA6AQAIBgAAKIEACC3AgAA5gQAMLgCAAAzABC5AgAA5gQAMLoCAQD0AwAh1QIAAOcEmwMijAMBAPQDACGNAwEA9AMAIY4DQAD3AwAhjwNAAPcDACGZAwEA9AMAIZsDQAD4AwAhnANAAPcDACEEwgIAAACbAwLDAgAAAJsDCMQCAAAAmwMIyQIAAMwEmwMiGA0AAKIEACAVAACNBAAgFwAAowQAILcCAACdBAAwuAIAADwAELkCAACdBAAwugIBAPQDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAAoATnAiLeAgEA9AMAId8CAQD0AwAh4AIBAPQDACHhAgEA9QMAIeICAgCeBAAh4wIBAPUDACHkAgEA9QMAIeUCAACfBAAg6AIAAKEE6AIi6QIBAPUDACHqAgEA9QMAIbQDAAA8ACC1AwAAPAAgGw0AAKIEACARAADtBAAgtwIAAOkEADC4AgAALAAQuQIAAOkEADC6AgEA9AMAIcACQAD4AwAhwQJAAPgDACHVAgAA6gT3AiLeAgEA9AMAIfUCAQD0AwAh9wIQALAEACH4AgEA9AMAIfoCAADrBPoCIvsCAQD0AwAh_AIBAPUDACH9AgEA9QMAIf4CAQD1AwAh_wIAAJ8EACCAA0AA9wMAIYEDAQD1AwAhggMBAPUDACGDA0AA9wMAIYQDEADsBAAhhQMBAPUDACGGAwEA9QMAIYcDAQD1AwAhBMICAAAA9wICwwIAAAD3AgjEAgAAAPcCCMkCAAC7BPcCIgTCAgAAAPoCAsMCAAAA-gIIxAIAAAD6AgjJAgAAuQT6AiIIwgIQAAAAAcMCEAAAAAXEAhAAAAAFxQIQAAAAAcYCEAAAAAHHAhAAAAAByAIQAAAAAckCEAC3BAAhEA0AAKIEACAQAADwBAAgEgAAiwQAILcCAADuBAAwuAIAACYAELkCAADuBAAwugIBAPQDACHAAkAA-AMAIcECQAD4AwAh1QIAAO8EjAMi3gIBAPQDACGIAwEA9AMAIYkDQAD3AwAhigNAAPcDACG0AwAAJgAgtQMAACYAIA4NAACiBAAgEAAA8AQAIBIAAIsEACC3AgAA7gQAMLgCAAAmABC5AgAA7gQAMLoCAQD0AwAhwAJAAPgDACHBAkAA-AMAIdUCAADvBIwDIt4CAQD0AwAhiAMBAPQDACGJA0AA9wMAIYoDQAD3AwAhBMICAAAAjAMCwwIAAACMAwjEAgAAAIwDCMkCAAC_BIwDIg8PAACKBAAgtwIAAK8EADC4AgAA6wIAELkCAACvBAAwugIBAPQDACG7AgEA9AMAIb0CAQD1AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIAALEE9QIi8gIQALAEACHzAgIAngQAIbQDAADrAgAgtQMAAOsCACAPCgAA9AQAIAwAAPMEACAcAACiBAAgtwIAAPEEADC4AgAAHwAQuQIAAPEEADC6AgEA9AMAIb0CAQD0AwAhwAJAAPgDACHBAkAA-AMAIYwDAQD1AwAhlQMBAPQDACGWAwEA9AMAIZcDCADyBAAhmAMIAPIEACEIwgIIAAAAAcMCCAAAAAXEAggAAAAFxQIIAAAAAcYCCAAAAAHHAggAAAAByAIIAAAAAckCCACnBAAhFQoAAPQEACAUAACMBAAgFQAAjQQAIB0AAPkEACC3AgAA9QQAMLgCAAAbABC5AgAA9QQAMLoCAQD0AwAhvQIBAPUDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAA-ASjAyKOA0AA9wMAIZYDAQD0AwAhnQMBAPQDACGfAwAA9gSfAyKhAwAA9wShAyKjA0AA9wMAIbQDAAAbACC1AwAAGwAgGAMAAP0EACAEAAD-BAAgCQAA_wQAIAsAAIAFACAUAACMBAAgHgAAgQUAILcCAAD8BAAwuAIAAAsAELkCAAD8BAAwugIBAPQDACG7AgEA9AMAIbwCAQD0AwAhvgIgAPYDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHqAgEA9AMAIZMDAQD1AwAhlwMIAPIEACGYAwgA8gQAIaoDAQD1AwAhsgMBAPUDACG0AwAACwAgtQMAAAsAIBMKAAD0BAAgFAAAjAQAIBUAAI0EACAdAAD5BAAgtwIAAPUEADC4AgAAGwAQuQIAAPUEADC6AgEA9AMAIb0CAQD1AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIAAPgEowMijgNAAPcDACGWAwEA9AMAIZ0DAQD0AwAhnwMAAPYEnwMioQMAAPcEoQMiowNAAPcDACEEwgIAAACfAwLDAgAAAJ8DCMQCAAAAnwMIyQIAANYEnwMiBMICAAAAoQMCwwIAAAChAwjEAgAAAKEDCMkCAADUBKEDIgTCAgAAAKMDAsMCAAAAowMIxAIAAACjAwjJAgAA0gSjAyIRDAAA5AQAIBYAAJAEACC3AgAA4QQAMLgCAAA4ABC5AgAA4QQAMLoCAQD0AwAhwAJAAPgDACHBAkAA-AMAIdUCAADjBJIDIowDAQD0AwAhjQMBAPUDACGOA0AA9wMAIY8DQAD3AwAhkAMCAOIEACGSAwEA9QMAIbQDAAA4ACC1AwAAOAAgDwoAAPQEACC3AgAA-gQAMLgCAAAXABC5AgAA-gQAMLoCAQD0AwAhvQIBAPUDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAA-wSpAyKWAwEA9AMAIZ0DAQD0AwAhpgNAAPgDACGnA0AA-AMAIakDAQD0AwAhBMICAAAAqQMCwwIAAACpAwjEAgAAAKkDCMkCAADbBKkDIhYDAAD9BAAgBAAA_gQAIAkAAP8EACALAACABQAgFAAAjAQAIB4AAIEFACC3AgAA_AQAMLgCAAALABC5AgAA_AQAMLoCAQD0AwAhuwIBAPQDACG8AgEA9AMAIb4CIAD2AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh6gIBAPQDACGTAwEA9QMAIZcDCADyBAAhmAMIAPIEACGqAwEA9QMAIbIDAQD1AwAhDwUAAPoDACAIAAD5AwAgtwIAAPMDADC4AgAAywMAELkCAADzAwAwugIBAPQDACG7AgEA9AMAIbwCAQD0AwAhvQIBAPUDACG-AiAA9gMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIbQDAADLAwAgtQMAAMsDACARAwAA_QQAIAUAAPoDACAHAACFBQAgtwIAAIQFADC4AgAAAwAQuQIAAIQFADC6AgEA9AMAIbsCAQD0AwAhvAIBAPQDACG-AiAA9gMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIeoCAQD0AwAh8QIIAPIEACG0AwAAAwAgtQMAAAMAIA8EAACDBQAgBQAA-gMAILcCAACCBQAwuAIAAAcAELkCAACCBQAwugIBAPQDACG7AgEA9AMAIbwCAQD0AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIBAPUDACGqAwEA9AMAIbQDAAAHACC1AwAABwAgA80CAAAXACDOAgAAFwAgzwIAABcAIAPNAgAAGwAgzgIAABsAIM8CAAAbACANBAAAgwUAIAUAAPoDACC3AgAAggUAMLgCAAAHABC5AgAAggUAMLoCAQD0AwAhuwIBAPQDACG8AgEA9AMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIdUCAQD1AwAhqgMBAPQDACERAwAA_QQAIAUAAPoDACAHAACFBQAgtwIAAIQFADC4AgAAAwAQuQIAAIQFADC6AgEA9AMAIbsCAQD0AwAhvAIBAPQDACG-AiAA9gMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIeoCAQD0AwAh8QIIAPIEACG0AwAAAwAgtQMAAAMAIA8DAAD9BAAgBQAA-gMAIAcAAIUFACC3AgAAhAUAMLgCAAADABC5AgAAhAUAMLoCAQD0AwAhuwIBAPQDACG8AgEA9AMAIb4CIAD2AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh6gIBAPQDACHxAggA8gQAIQPNAgAABwAgzgIAAAcAIM8CAAAHACAAAAAAAbkDAQAAAAEBuQMBAAAAAQG5AyAAAAABAbkDQAAAAAEBuQNAAAAAAQsrAAD_BQAwLAAAhAYAMLYDAACABgAwtwMAAIEGADC4AwAAggYAILkDAACDBgAwugMAAIMGADC7AwAAgwYAMLwDAACDBgAwvQMAAIUGADC-AwAAhgYAMAsrAACRBQAwLAAAlgUAMLYDAACSBQAwtwMAAJMFADC4AwAAlAUAILkDAACVBQAwugMAAJUFADC7AwAAlQUAMLwDAACVBQAwvQMAAJcFADC-AwAAmAUAMBEEAAD6BQAgCQAA-wUAIAsAAPwFACAUAAD-BQAgHgAA_QUAILoCAQAAAAG7AgEAAAABvAIBAAAAAb4CIAAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAGTAwEAAAABlwMIAAAAAZgDCAAAAAGqAwEAAAABsgMBAAAAAQIAAAABACArAAD5BQAgAwAAAAEAICsAAPkFACAsAACcBQAgASQAAMEJADAWAwAA_QQAIAQAAP4EACAJAAD_BAAgCwAAgAUAIBQAAIwEACAeAACBBQAgtwIAAPwEADC4AgAACwAQuQIAAPwEADC6AgEAAAABuwIBAPQDACG8AgEAAAABvgIgAPYDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHqAgEA9AMAIZMDAQD1AwAhlwMIAPIEACGYAwgA8gQAIaoDAQD1AwAhsgMBAPUDACECAAAAAQAgJAAAnAUAIAIAAACZBQAgJAAAmgUAIBC3AgAAmAUAMLgCAACZBQAQuQIAAJgFADC6AgEA9AMAIbsCAQD0AwAhvAIBAPQDACG-AiAA9gMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIeoCAQD0AwAhkwMBAPUDACGXAwgA8gQAIZgDCADyBAAhqgMBAPUDACGyAwEA9QMAIRC3AgAAmAUAMLgCAACZBQAQuQIAAJgFADC6AgEA9AMAIbsCAQD0AwAhvAIBAPQDACG-AiAA9gMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIeoCAQD0AwAhkwMBAPUDACGXAwgA8gQAIZgDCADyBAAhqgMBAPUDACGyAwEA9QMAIQy6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG-AiAAjAUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIZMDAQCLBQAhlwMIAJsFACGYAwgAmwUAIaoDAQCLBQAhsgMBAIsFACEFuQMIAAAAAb8DCAAAAAHAAwgAAAABwQMIAAAAAcIDCAAAAAERBAAAnQUAIAkAAJ4FACALAACfBQAgFAAAoQUAIB4AAKAFACC6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG-AiAAjAUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIZMDAQCLBQAhlwMIAJsFACGYAwgAmwUAIaoDAQCLBQAhsgMBAIsFACEHKwAAlgkAICwAAL8JACC2AwAAlwkAILcDAAC-CQAgugMAAAMAILsDAAADACC8AwAABQAgBysAAJQJACAsAAC8CQAgtgMAAJUJACC3AwAAuwkAILoDAAAHACC7AwAABwAgvAMAAAkAIAsrAADsBQAwLAAA8QUAMLYDAADtBQAwtwMAAO4FADC4AwAA7wUAILkDAADwBQAwugMAAPAFADC7AwAA8AUAMLwDAADwBQAwvQMAAPIFADC-AwAA8wUAMAsrAACyBQAwLAAAtwUAMLYDAACzBQAwtwMAALQFADC4AwAAtQUAILkDAAC2BQAwugMAALYFADC7AwAAtgUAMLwDAAC2BQAwvQMAALgFADC-AwAAuQUAMAsrAACiBQAwLAAApwUAMLYDAACjBQAwtwMAAKQFADC4AwAApQUAILkDAACmBQAwugMAAKYFADC7AwAApgUAMLwDAACmBQAwvQMAAKgFADC-AwAAqQUAMAoMAACwBQAgHAAAsQUAILoCAQAAAAG9AgEAAAABwAJAAAAAAcECQAAAAAGMAwEAAAABlQMBAAAAAZcDCAAAAAGYAwgAAAABAgAAACEAICsAAK8FACADAAAAIQAgKwAArwUAICwAAKwFACABJAAAugkAMA8KAAD0BAAgDAAA8wQAIBwAAKIEACC3AgAA8QQAMLgCAAAfABC5AgAA8QQAMLoCAQAAAAG9AgEA9AMAIcACQAD4AwAhwQJAAPgDACGMAwEA9QMAIZUDAQD0AwAhlgMBAPQDACGXAwgA8gQAIZgDCADyBAAhAgAAACEAICQAAKwFACACAAAAqgUAICQAAKsFACAMtwIAAKkFADC4AgAAqgUAELkCAACpBQAwugIBAPQDACG9AgEA9AMAIcACQAD4AwAhwQJAAPgDACGMAwEA9QMAIZUDAQD0AwAhlgMBAPQDACGXAwgA8gQAIZgDCADyBAAhDLcCAACpBQAwuAIAAKoFABC5AgAAqQUAMLoCAQD0AwAhvQIBAPQDACHAAkAA-AMAIcECQAD4AwAhjAMBAPUDACGVAwEA9AMAIZYDAQD0AwAhlwMIAPIEACGYAwgA8gQAIQi6AgEAigUAIb0CAQCKBQAhwAJAAI4FACHBAkAAjgUAIYwDAQCLBQAhlQMBAIoFACGXAwgAmwUAIZgDCACbBQAhCgwAAK0FACAcAACuBQAgugIBAIoFACG9AgEAigUAIcACQACOBQAhwQJAAI4FACGMAwEAiwUAIZUDAQCKBQAhlwMIAJsFACGYAwgAmwUAIQcrAACyCQAgLAAAuAkAILYDAACzCQAgtwMAALcJACC6AwAAGwAguwMAABsAILwDAAAdACAFKwAAsAkAICwAALUJACC2AwAAsQkAILcDAAC0CQAgvAMAAK8DACAKDAAAsAUAIBwAALEFACC6AgEAAAABvQIBAAAAAcACQAAAAAHBAkAAAAABjAMBAAAAAZUDAQAAAAGXAwgAAAABmAMIAAAAAQMrAACyCQAgtgMAALMJACC8AwAAHQAgAysAALAJACC2AwAAsQkAILwDAACvAwAgDhQAAOkFACAVAADqBQAgHQAA6wUAILoCAQAAAAG9AgEAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB1QIAAACjAwKOA0AAAAABnQMBAAAAAZ8DAAAAnwMCoQMAAAChAwKjA0AAAAABAgAAAB0AICsAAOgFACADAAAAHQAgKwAA6AUAICwAAL8FACABJAAArwkAMBMKAAD0BAAgFAAAjAQAIBUAAI0EACAdAAD5BAAgtwIAAPUEADC4AgAAGwAQuQIAAPUEADC6AgEAAAABvQIBAPUDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAA-ASjAyKOA0AA9wMAIZYDAQD0AwAhnQMBAPQDACGfAwAA9gSfAyKhAwAA9wShAyKjA0AA9wMAIQIAAAAdACAkAAC_BQAgAgAAALoFACAkAAC7BQAgD7cCAAC5BQAwuAIAALoFABC5AgAAuQUAMLoCAQD0AwAhvQIBAPUDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAA-ASjAyKOA0AA9wMAIZYDAQD0AwAhnQMBAPQDACGfAwAA9gSfAyKhAwAA9wShAyKjA0AA9wMAIQ-3AgAAuQUAMLgCAAC6BQAQuQIAALkFADC6AgEA9AMAIb0CAQD1AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIAAPgEowMijgNAAPcDACGWAwEA9AMAIZ0DAQD0AwAhnwMAAPYEnwMioQMAAPcEoQMiowNAAPcDACELugIBAIoFACG9AgEAiwUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdUCAAC-BaMDIo4DQACNBQAhnQMBAIoFACGfAwAAvAWfAyKhAwAAvQWhAyKjA0AAjQUAIQG5AwAAAJ8DAgG5AwAAAKEDAgG5AwAAAKMDAg4UAADABQAgFQAAwQUAIB0AAMIFACC6AgEAigUAIb0CAQCLBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh1QIAAL4FowMijgNAAI0FACGdAwEAigUAIZ8DAAC8BZ8DIqEDAAC9BaEDIqMDQACNBQAhCysAAN0FADAsAADhBQAwtgMAAN4FADC3AwAA3wUAMLgDAADgBQAguQMAAKYFADC6AwAApgUAMLsDAACmBQAwvAMAAKYFADC9AwAA4gUAML4DAACpBQAwCysAAMwFADAsAADRBQAwtgMAAM0FADC3AwAAzgUAMLgDAADPBQAguQMAANAFADC6AwAA0AUAMLsDAADQBQAwvAMAANAFADC9AwAA0gUAML4DAADTBQAwBysAAMMFACAsAADGBQAgtgMAAMQFACC3AwAAxQUAILoDAAA4ACC7AwAAOAAgvAMAADoAIAoWAADLBQAgugIBAAAAAcACQAAAAAHBAkAAAAAB1QIAAACSAwKNAwEAAAABjgNAAAAAAY8DQAAAAAGQAwIAAAABkgMBAAAAAQIAAAA6ACArAADDBQAgAwAAADgAICsAAMMFACAsAADHBQAgDAAAADgAIBYAAMoFACAkAADHBQAgugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAMkFkgMijQMBAIsFACGOA0AAjQUAIY8DQACNBQAhkAMCAMgFACGSAwEAiwUAIQoWAADKBQAgugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAMkFkgMijQMBAIsFACGOA0AAjQUAIY8DQACNBQAhkAMCAMgFACGSAwEAiwUAIQW5AwIAAAABvwMCAAAAAcADAgAAAAHBAwIAAAABwgMCAAAAAQG5AwAAAJIDAgcrAACqCQAgLAAArQkAILYDAACrCQAgtwMAAKwJACC6AwAAPAAguwMAADwAILwDAACXAwAgAysAAKoJACC2AwAAqwkAILwDAACXAwAgChYAANsFACAYAADcBQAgugIBAAAAAdUCAAAAmwMCjQMBAAAAAY4DQAAAAAGPA0AAAAABmQMBAAAAAZsDQAAAAAGcA0AAAAABAgAAADUAICsAANoFACADAAAANQAgKwAA2gUAICwAANcFACABJAAAqQkAMBAMAADkBAAgFgAA6AQAIBgAAKIEACC3AgAA5gQAMLgCAAAzABC5AgAA5gQAMLoCAQAAAAHVAgAA5wSbAyKMAwEA9AMAIY0DAQD0AwAhjgNAAPcDACGPA0AA9wMAIZkDAQD0AwAhmwNAAPgDACGcA0AA9wMAIbMDAADlBAAgAgAAADUAICQAANcFACACAAAA1AUAICQAANUFACAMtwIAANMFADC4AgAA1AUAELkCAADTBQAwugIBAPQDACHVAgAA5wSbAyKMAwEA9AMAIY0DAQD0AwAhjgNAAPcDACGPA0AA9wMAIZkDAQD0AwAhmwNAAPgDACGcA0AA9wMAIQy3AgAA0wUAMLgCAADUBQAQuQIAANMFADC6AgEA9AMAIdUCAADnBJsDIowDAQD0AwAhjQMBAPQDACGOA0AA9wMAIY8DQAD3AwAhmQMBAPQDACGbA0AA-AMAIZwDQAD3AwAhCLoCAQCKBQAh1QIAANYFmwMijQMBAIoFACGOA0AAjQUAIY8DQACNBQAhmQMBAIoFACGbA0AAjgUAIZwDQACNBQAhAbkDAAAAmwMCChYAANgFACAYAADZBQAgugIBAIoFACHVAgAA1gWbAyKNAwEAigUAIY4DQACNBQAhjwNAAI0FACGZAwEAigUAIZsDQACOBQAhnANAAI0FACEFKwAAoQkAICwAAKcJACC2AwAAogkAILcDAACmCQAgvAMAAJcDACAFKwAAnwkAICwAAKQJACC2AwAAoAkAILcDAACjCQAgvAMAAK8DACAKFgAA2wUAIBgAANwFACC6AgEAAAAB1QIAAACbAwKNAwEAAAABjgNAAAAAAY8DQAAAAAGZAwEAAAABmwNAAAAAAZwDQAAAAAEDKwAAoQkAILYDAACiCQAgvAMAAJcDACADKwAAnwkAILYDAACgCQAgvAMAAK8DACAKCgAA5wUAIBwAALEFACC6AgEAAAABvQIBAAAAAcACQAAAAAHBAkAAAAABlQMBAAAAAZYDAQAAAAGXAwgAAAABmAMIAAAAAQIAAAAhACArAADmBQAgAwAAACEAICsAAOYFACAsAADkBQAgASQAAJ4JADACAAAAIQAgJAAA5AUAIAIAAACqBQAgJAAA4wUAIAi6AgEAigUAIb0CAQCKBQAhwAJAAI4FACHBAkAAjgUAIZUDAQCKBQAhlgMBAIoFACGXAwgAmwUAIZgDCACbBQAhCgoAAOUFACAcAACuBQAgugIBAIoFACG9AgEAigUAIcACQACOBQAhwQJAAI4FACGVAwEAigUAIZYDAQCKBQAhlwMIAJsFACGYAwgAmwUAIQUrAACZCQAgLAAAnAkAILYDAACaCQAgtwMAAJsJACC8AwAAAQAgCgoAAOcFACAcAACxBQAgugIBAAAAAb0CAQAAAAHAAkAAAAABwQJAAAAAAZUDAQAAAAGWAwEAAAABlwMIAAAAAZgDCAAAAAEDKwAAmQkAILYDAACaCQAgvAMAAAEAIA4UAADpBQAgFQAA6gUAIB0AAOsFACC6AgEAAAABvQIBAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAdUCAAAAowMCjgNAAAAAAZ0DAQAAAAGfAwAAAJ8DAqEDAAAAoQMCowNAAAAAAQQrAADdBQAwtgMAAN4FADC4AwAA4AUAILwDAACmBQAwBCsAAMwFADC2AwAAzQUAMLgDAADPBQAgvAMAANAFADADKwAAwwUAILYDAADEBQAgvAMAADoAIAq6AgEAAAABvQIBAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAdUCAAAAqQMCnQMBAAAAAaYDQAAAAAGnA0AAAAABqQMBAAAAAQIAAAAZACArAAD4BQAgAwAAABkAICsAAPgFACAsAAD3BQAgASQAAJgJADAPCgAA9AQAILcCAAD6BAAwuAIAABcAELkCAAD6BAAwugIBAAAAAb0CAQD1AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh1QIAAPsEqQMilgMBAPQDACGdAwEA9AMAIaYDQAD4AwAhpwNAAPgDACGpAwEA9AMAIQIAAAAZACAkAAD3BQAgAgAAAPQFACAkAAD1BQAgDrcCAADzBQAwuAIAAPQFABC5AgAA8wUAMLoCAQD0AwAhvQIBAPUDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAA-wSpAyKWAwEA9AMAIZ0DAQD0AwAhpgNAAPgDACGnA0AA-AMAIakDAQD0AwAhDrcCAADzBQAwuAIAAPQFABC5AgAA8wUAMLoCAQD0AwAhvQIBAPUDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgAA-wSpAyKWAwEA9AMAIZ0DAQD0AwAhpgNAAPgDACGnA0AA-AMAIakDAQD0AwAhCroCAQCKBQAhvQIBAIsFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgAA9gWpAyKdAwEAigUAIaYDQACOBQAhpwNAAI4FACGpAwEAigUAIQG5AwAAAKkDAgq6AgEAigUAIb0CAQCLBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh1QIAAPYFqQMinQMBAIoFACGmA0AAjgUAIacDQACOBQAhqQMBAIoFACEKugIBAAAAAb0CAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAKkDAp0DAQAAAAGmA0AAAAABpwNAAAAAAakDAQAAAAERBAAA-gUAIAkAAPsFACALAAD8BQAgFAAA_gUAIB4AAP0FACC6AgEAAAABuwIBAAAAAbwCAQAAAAG-AiAAAAABvwJAAAAAAcACQAAAAAHBAkAAAAABkwMBAAAAAZcDCAAAAAGYAwgAAAABqgMBAAAAAbIDAQAAAAEDKwAAlgkAILYDAACXCQAgvAMAAAUAIAMrAACUCQAgtgMAAJUJACC8AwAACQAgBCsAAOwFADC2AwAA7QUAMLgDAADvBQAgvAMAAPAFADAEKwAAsgUAMLYDAACzBQAwuAMAALUFACC8AwAAtgUAMAQrAACiBQAwtgMAAKMFADC4AwAApQUAILwDAACmBQAwCgUAALAGACAHAACvBgAgugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAfECCAAAAAECAAAABQAgKwAArgYAIAMAAAAFACArAACuBgAgLAAAiQYAIAEkAACTCQAwDwMAAP0EACAFAAD6AwAgBwAAhQUAILcCAACEBQAwuAIAAAMAELkCAACEBQAwugIBAAAAAbsCAQD0AwAhvAIBAAAAAb4CIAD2AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh6gIBAPQDACHxAggA8gQAIQIAAAAFACAkAACJBgAgAgAAAIcGACAkAACIBgAgDLcCAACGBgAwuAIAAIcGABC5AgAAhgYAMLoCAQD0AwAhuwIBAPQDACG8AgEA9AMAIb4CIAD2AwAhvwJAAPcDACHAAkAA-AMAIcECQAD4AwAh6gIBAPQDACHxAggA8gQAIQy3AgAAhgYAMLgCAACHBgAQuQIAAIYGADC6AgEA9AMAIbsCAQD0AwAhvAIBAPQDACG-AiAA9gMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIeoCAQD0AwAh8QIIAPIEACEIugIBAIoFACG7AgEAigUAIbwCAQCKBQAhvgIgAIwFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHxAggAmwUAIQoFAACLBgAgBwAAigYAILoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb4CIACMBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh8QIIAJsFACELKwAAlwYAMCwAAJwGADC2AwAAmAYAMLcDAACZBgAwuAMAAJoGACC5AwAAmwYAMLoDAACbBgAwuwMAAJsGADC8AwAAmwYAML0DAACdBgAwvgMAAJ4GADALKwAAjAYAMCwAAJAGADC2AwAAjQYAMLcDAACOBgAwuAMAAI8GACC5AwAAlQUAMLoDAACVBQAwuwMAAJUFADC8AwAAlQUAML0DAACRBgAwvgMAAJgFADARAwAAlgYAIAkAAPsFACALAAD8BQAgFAAA_gUAIB4AAP0FACC6AgEAAAABuwIBAAAAAbwCAQAAAAG-AiAAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB6gIBAAAAAZMDAQAAAAGXAwgAAAABmAMIAAAAAbIDAQAAAAECAAAAAQAgKwAAlQYAIAMAAAABACArAACVBgAgLAAAkwYAIAEkAACSCQAwAgAAAAEAICQAAJMGACACAAAAmQUAICQAAJIGACAMugIBAIoFACG7AgEAigUAIbwCAQCKBQAhvgIgAIwFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHqAgEAigUAIZMDAQCLBQAhlwMIAJsFACGYAwgAmwUAIbIDAQCLBQAhEQMAAJQGACAJAACeBQAgCwAAnwUAIBQAAKEFACAeAACgBQAgugIBAIoFACG7AgEAigUAIbwCAQCKBQAhvgIgAIwFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHqAgEAigUAIZMDAQCLBQAhlwMIAJsFACGYAwgAmwUAIbIDAQCLBQAhBSsAAI0JACAsAACQCQAgtgMAAI4JACC3AwAAjwkAILwDAADIAwAgEQMAAJYGACAJAAD7BQAgCwAA_AUAIBQAAP4FACAeAAD9BQAgugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAeoCAQAAAAGTAwEAAAABlwMIAAAAAZgDCAAAAAGyAwEAAAABAysAAI0JACC2AwAAjgkAILwDAADIAwAgCAUAAK0GACC6AgEAAAABuwIBAAAAAbwCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgEAAAABAgAAAAkAICsAAKwGACADAAAACQAgKwAArAYAICwAAKEGACABJAAAjAkAMA0EAACDBQAgBQAA-gMAILcCAACCBQAwuAIAAAcAELkCAACCBQAwugIBAAAAAbsCAQD0AwAhvAIBAAAAAb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIdUCAQD1AwAhqgMBAPQDACECAAAACQAgJAAAoQYAIAIAAACfBgAgJAAAoAYAIAu3AgAAngYAMLgCAACfBgAQuQIAAJ4GADC6AgEA9AMAIbsCAQD0AwAhvAIBAPQDACG_AkAA9wMAIcACQAD4AwAhwQJAAPgDACHVAgEA9QMAIaoDAQD0AwAhC7cCAACeBgAwuAIAAJ8GABC5AgAAngYAMLoCAQD0AwAhuwIBAPQDACG8AgEA9AMAIb8CQAD3AwAhwAJAAPgDACHBAkAA-AMAIdUCAQD1AwAhqgMBAPQDACEHugIBAIoFACG7AgEAigUAIbwCAQCKBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh1QIBAIsFACEIBQAAogYAILoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdUCAQCLBQAhCysAAKMGADAsAACnBgAwtgMAAKQGADC3AwAApQYAMLgDAACmBgAguQMAAJUFADC6AwAAlQUAMLsDAACVBQAwvAMAAJUFADC9AwAAqAYAML4DAACYBQAwEQMAAJYGACAEAAD6BQAgCwAA_AUAIBQAAP4FACAeAAD9BQAgugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAeoCAQAAAAGTAwEAAAABlwMIAAAAAZgDCAAAAAGqAwEAAAABAgAAAAEAICsAAKsGACADAAAAAQAgKwAAqwYAICwAAKoGACABJAAAiwkAMAIAAAABACAkAACqBgAgAgAAAJkFACAkAACpBgAgDLoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb4CIACMBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh6gIBAIoFACGTAwEAiwUAIZcDCACbBQAhmAMIAJsFACGqAwEAiwUAIREDAACUBgAgBAAAnQUAIAsAAJ8FACAUAAChBQAgHgAAoAUAILoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb4CIACMBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh6gIBAIoFACGTAwEAiwUAIZcDCACbBQAhmAMIAJsFACGqAwEAiwUAIREDAACWBgAgBAAA-gUAIAsAAPwFACAUAAD-BQAgHgAA_QUAILoCAQAAAAG7AgEAAAABvAIBAAAAAb4CIAAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHqAgEAAAABkwMBAAAAAZcDCAAAAAGYAwgAAAABqgMBAAAAAQgFAACtBgAgugIBAAAAAbsCAQAAAAG8AgEAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB1QIBAAAAAQQrAACjBgAwtgMAAKQGADC4AwAApgYAILwDAACVBQAwCgUAALAGACAHAACvBgAgugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAfECCAAAAAEEKwAAlwYAMLYDAACYBgAwuAMAAJoGACC8AwAAmwYAMAQrAACMBgAwtgMAAI0GADC4AwAAjwYAILwDAACVBQAwBCsAAP8FADC2AwAAgAYAMLgDAACCBgAgvAMAAIMGADAEKwAAkQUAMLYDAACSBQAwuAMAAJQFACC8AwAAlQUAMAAAAAAAAbkDAAAA0wICAbkDAAAA1QICAbkDAAAA2wICBysAAMAHACAsAADDBwAgtgMAAMEHACC3AwAAwgcAILoDAAAkACC7AwAAJAAgvAMAAIwCACALKwAApAcAMCwAAKkHADC2AwAApQcAMLcDAACmBwAwuAMAAKcHACC5AwAAqAcAMLoDAACoBwAwuwMAAKgHADC8AwAAqAcAML0DAACqBwAwvgMAAKsHADALKwAAkgcAMCwAAJcHADC2AwAAkwcAMLcDAACUBwAwuAMAAJUHACC5AwAAlgcAMLoDAACWBwAwuwMAAJYHADC8AwAAlgcAML0DAACYBwAwvgMAAJkHADALKwAAiQcAMCwAAI0HADC2AwAAigcAMLcDAACLBwAwuAMAAIwHACC5AwAApgUAMLoDAACmBQAwuwMAAKYFADC8AwAApgUAML0DAACOBwAwvgMAAKkFADALKwAAgAcAMCwAAIQHADC2AwAAgQcAMLcDAACCBwAwuAMAAIMHACC5AwAA0AUAMLoDAADQBQAwuwMAANAFADC8AwAA0AUAML0DAACFBwAwvgMAANMFADALKwAA9AYAMCwAAPkGADC2AwAA9QYAMLcDAAD2BgAwuAMAAPcGACC5AwAA-AYAMLoDAAD4BgAwuwMAAPgGADC8AwAA-AYAML0DAAD6BgAwvgMAAPsGADALKwAA6AYAMCwAAO0GADC2AwAA6QYAMLcDAADqBgAwuAMAAOsGACC5AwAA7AYAMLoDAADsBgAwuwMAAOwGADC8AwAA7AYAML0DAADuBgAwvgMAAO8GADAHKwAAwwYAICwAAMYGACC2AwAAxAYAILcDAADFBgAgugMAADwAILsDAAA8ACC8AwAAlwMAIBEVAADmBgAgFwAA5wYAILoCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAOcCAt8CAQAAAAHgAgEAAAAB4QIBAAAAAeICAgAAAAHjAgEAAAAB5AIBAAAAAeUCgAAAAAHoAgAAAOgCAukCAQAAAAHqAgEAAAABAgAAAJcDACArAADDBgAgAwAAADwAICsAAMMGACAsAADHBgAgEwAAADwAIBUAAMsGACAXAADMBgAgJAAAxwYAILoCAQCKBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh1QIAAMkG5wIi3wIBAIoFACHgAgEAigUAIeECAQCLBQAh4gICAMgGACHjAgEAiwUAIeQCAQCLBQAh5QKAAAAAAegCAADKBugCIukCAQCLBQAh6gIBAIsFACERFQAAywYAIBcAAMwGACC6AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdUCAADJBucCIt8CAQCKBQAh4AIBAIoFACHhAgEAiwUAIeICAgDIBgAh4wIBAIsFACHkAgEAiwUAIeUCgAAAAAHoAgAAygboAiLpAgEAiwUAIeoCAQCLBQAhBbkDAgAAAAG_AwIAAAABwAMCAAAAAcEDAgAAAAHCAwIAAAABAbkDAAAA5wICAbkDAAAA6AICCysAANsGADAsAADfBgAwtgMAANwGADC3AwAA3QYAMLgDAADeBgAguQMAANAFADC6AwAA0AUAMLsDAADQBQAwvAMAANAFADC9AwAA4AYAML4DAADTBQAwCysAAM0GADAsAADSBgAwtgMAAM4GADC3AwAAzwYAMLgDAADQBgAguQMAANEGADC6AwAA0QYAMLsDAADRBgAwvAMAANEGADC9AwAA0wYAML4DAADUBgAwCgwAANoGACC6AgEAAAABwAJAAAAAAcECQAAAAAHVAgAAAJIDAowDAQAAAAGOA0AAAAABjwNAAAAAAZADAgAAAAGSAwEAAAABAgAAADoAICsAANkGACADAAAAOgAgKwAA2QYAICwAANcGACABJAAAigkAMA8MAADkBAAgFgAAkAQAILcCAADhBAAwuAIAADgAELkCAADhBAAwugIBAAAAAcACQAD4AwAhwQJAAPgDACHVAgAA4wSSAyKMAwEAAAABjQMBAPUDACGOA0AA9wMAIY8DQAD3AwAhkAMCAOIEACGSAwEA9QMAIQIAAAA6ACAkAADXBgAgAgAAANUGACAkAADWBgAgDbcCAADUBgAwuAIAANUGABC5AgAA1AYAMLoCAQD0AwAhwAJAAPgDACHBAkAA-AMAIdUCAADjBJIDIowDAQD0AwAhjQMBAPUDACGOA0AA9wMAIY8DQAD3AwAhkAMCAOIEACGSAwEA9QMAIQ23AgAA1AYAMLgCAADVBgAQuQIAANQGADC6AgEA9AMAIcACQAD4AwAhwQJAAPgDACHVAgAA4wSSAyKMAwEA9AMAIY0DAQD1AwAhjgNAAPcDACGPA0AA9wMAIZADAgDiBAAhkgMBAPUDACEJugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAMkFkgMijAMBAIoFACGOA0AAjQUAIY8DQACNBQAhkAMCAMgFACGSAwEAiwUAIQoMAADYBgAgugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAMkFkgMijAMBAIoFACGOA0AAjQUAIY8DQACNBQAhkAMCAMgFACGSAwEAiwUAIQUrAACFCQAgLAAAiAkAILYDAACGCQAgtwMAAIcJACC8AwAAHQAgCgwAANoGACC6AgEAAAABwAJAAAAAAcECQAAAAAHVAgAAAJIDAowDAQAAAAGOA0AAAAABjwNAAAAAAZADAgAAAAGSAwEAAAABAysAAIUJACC2AwAAhgkAILwDAAAdACAKDAAA5QYAIBgAANwFACC6AgEAAAAB1QIAAACbAwKMAwEAAAABjgNAAAAAAY8DQAAAAAGZAwEAAAABmwNAAAAAAZwDQAAAAAECAAAANQAgKwAA5AYAIAMAAAA1ACArAADkBgAgLAAA4gYAIAEkAACECQAwAgAAADUAICQAAOIGACACAAAA1AUAICQAAOEGACAIugIBAIoFACHVAgAA1gWbAyKMAwEAigUAIY4DQACNBQAhjwNAAI0FACGZAwEAigUAIZsDQACOBQAhnANAAI0FACEKDAAA4wYAIBgAANkFACC6AgEAigUAIdUCAADWBZsDIowDAQCKBQAhjgNAAI0FACGPA0AAjQUAIZkDAQCKBQAhmwNAAI4FACGcA0AAjQUAIQUrAAD_CAAgLAAAggkAILYDAACACQAgtwMAAIEJACC8AwAAHQAgCgwAAOUGACAYAADcBQAgugIBAAAAAdUCAAAAmwMCjAMBAAAAAY4DQAAAAAGPA0AAAAABmQMBAAAAAZsDQAAAAAGcA0AAAAABAysAAP8IACC2AwAAgAkAILwDAAAdACAEKwAA2wYAMLYDAADcBgAwuAMAAN4GACC8AwAA0AUAMAQrAADNBgAwtgMAAM4GADC4AwAA0AYAILwDAADRBgAwCLoCAQAAAAHAAkAAAAABrAMBAAAAAa0DAQAAAAGuAwEAAAABrwOAAAAAAbADgAAAAAGxAwEAAAABAgAAAEYAICsAAPMGACADAAAARgAgKwAA8wYAICwAAPIGACABJAAA_ggAMA0aAACiBAAgtwIAAN8EADC4AgAARAAQuQIAAN8EADC6AgEAAAABwAJAAPgDACGrAwEA9AMAIawDAQD0AwAhrQMBAPQDACGuAwEA9AMAIa8DAACfBAAgsAMAAJ8EACCxAwEA9QMAIQIAAABGACAkAADyBgAgAgAAAPAGACAkAADxBgAgDLcCAADvBgAwuAIAAPAGABC5AgAA7wYAMLoCAQD0AwAhwAJAAPgDACGrAwEA9AMAIawDAQD0AwAhrQMBAPQDACGuAwEA9AMAIa8DAACfBAAgsAMAAJ8EACCxAwEA9QMAIQy3AgAA7wYAMLgCAADwBgAQuQIAAO8GADC6AgEA9AMAIcACQAD4AwAhqwMBAPQDACGsAwEA9AMAIa0DAQD0AwAhrgMBAPQDACGvAwAAnwQAILADAACfBAAgsQMBAPUDACEIugIBAIoFACHAAkAAjgUAIawDAQCKBQAhrQMBAIoFACGuAwEAigUAIa8DgAAAAAGwA4AAAAABsQMBAIsFACEIugIBAIoFACHAAkAAjgUAIawDAQCKBQAhrQMBAIoFACGuAwEAigUAIa8DgAAAAAGwA4AAAAABsQMBAIsFACEIugIBAAAAAcACQAAAAAGsAwEAAAABrQMBAAAAAa4DAQAAAAGvA4AAAAABsAOAAAAAAbEDAQAAAAEFugIBAAAAAcACQAAAAAGdAwEAAAABpAMBAAAAAaUDIAAAAAECAAAAQgAgKwAA_wYAIAMAAABCACArAAD_BgAgLAAA_gYAIAEkAAD9CAAwCg0AAKIEACC3AgAA4AQAMLgCAABAABC5AgAA4AQAMLoCAQAAAAHAAkAA-AMAId4CAQD0AwAhnQMBAPQDACGkAwEA9AMAIaUDIAD2AwAhAgAAAEIAICQAAP4GACACAAAA_AYAICQAAP0GACAJtwIAAPsGADC4AgAA_AYAELkCAAD7BgAwugIBAPQDACHAAkAA-AMAId4CAQD0AwAhnQMBAPQDACGkAwEA9AMAIaUDIAD2AwAhCbcCAAD7BgAwuAIAAPwGABC5AgAA-wYAMLoCAQD0AwAhwAJAAPgDACHeAgEA9AMAIZ0DAQD0AwAhpAMBAPQDACGlAyAA9gMAIQW6AgEAigUAIcACQACOBQAhnQMBAIoFACGkAwEAigUAIaUDIACMBQAhBboCAQCKBQAhwAJAAI4FACGdAwEAigUAIaQDAQCKBQAhpQMgAIwFACEFugIBAAAAAcACQAAAAAGdAwEAAAABpAMBAAAAAaUDIAAAAAEKDAAA5QYAIBYAANsFACC6AgEAAAAB1QIAAACbAwKMAwEAAAABjQMBAAAAAY4DQAAAAAGPA0AAAAABmwNAAAAAAZwDQAAAAAECAAAANQAgKwAAiAcAIAMAAAA1ACArAACIBwAgLAAAhwcAIAEkAAD8CAAwAgAAADUAICQAAIcHACACAAAA1AUAICQAAIYHACAIugIBAIoFACHVAgAA1gWbAyKMAwEAigUAIY0DAQCKBQAhjgNAAI0FACGPA0AAjQUAIZsDQACOBQAhnANAAI0FACEKDAAA4wYAIBYAANgFACC6AgEAigUAIdUCAADWBZsDIowDAQCKBQAhjQMBAIoFACGOA0AAjQUAIY8DQACNBQAhmwNAAI4FACGcA0AAjQUAIQoMAADlBgAgFgAA2wUAILoCAQAAAAHVAgAAAJsDAowDAQAAAAGNAwEAAAABjgNAAAAAAY8DQAAAAAGbA0AAAAABnANAAAAAAQoKAADnBQAgDAAAsAUAILoCAQAAAAG9AgEAAAABwAJAAAAAAcECQAAAAAGMAwEAAAABlgMBAAAAAZcDCAAAAAGYAwgAAAABAgAAACEAICsAAJEHACADAAAAIQAgKwAAkQcAICwAAJAHACABJAAA-wgAMAIAAAAhACAkAACQBwAgAgAAAKoFACAkAACPBwAgCLoCAQCKBQAhvQIBAIoFACHAAkAAjgUAIcECQACOBQAhjAMBAIsFACGWAwEAigUAIZcDCACbBQAhmAMIAJsFACEKCgAA5QUAIAwAAK0FACC6AgEAigUAIb0CAQCKBQAhwAJAAI4FACHBAkAAjgUAIYwDAQCLBQAhlgMBAIoFACGXAwgAmwUAIZgDCACbBQAhCgoAAOcFACAMAACwBQAgugIBAAAAAb0CAQAAAAHAAkAAAAABwQJAAAAAAYwDAQAAAAGWAwEAAAABlwMIAAAAAZgDCAAAAAEWEQAAowcAILoCAQAAAAHAAkAAAAABwQJAAAAAAdUCAAAA9wIC9QIBAAAAAfcCEAAAAAH4AgEAAAAB-gIAAAD6AgL7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wKAAAAAAYADQAAAAAGBAwEAAAABggMBAAAAAYMDQAAAAAGEAxAAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABAgAAAC4AICsAAKIHACADAAAALgAgKwAAogcAICwAAKAHACABJAAA-ggAMBsNAACiBAAgEQAA7QQAILcCAADpBAAwuAIAACwAELkCAADpBAAwugIBAAAAAcACQAD4AwAhwQJAAPgDACHVAgAA6gT3AiLeAgEA9AMAIfUCAQD0AwAh9wIQALAEACH4AgEA9AMAIfoCAADrBPoCIvsCAQAAAAH8AgEAAAAB_QIBAAAAAf4CAQD1AwAh_wIAAJ8EACCAA0AA9wMAIYEDAQD1AwAhggMBAPUDACGDA0AA9wMAIYQDEADsBAAhhQMBAAAAAYYDAQAAAAGHAwEA9QMAIQIAAAAuACAkAACgBwAgAgAAAJoHACAkAACbBwAgGbcCAACZBwAwuAIAAJoHABC5AgAAmQcAMLoCAQD0AwAhwAJAAPgDACHBAkAA-AMAIdUCAADqBPcCIt4CAQD0AwAh9QIBAPQDACH3AhAAsAQAIfgCAQD0AwAh-gIAAOsE-gIi-wIBAPQDACH8AgEA9QMAIf0CAQD1AwAh_gIBAPUDACH_AgAAnwQAIIADQAD3AwAhgQMBAPUDACGCAwEA9QMAIYMDQAD3AwAhhAMQAOwEACGFAwEA9QMAIYYDAQD1AwAhhwMBAPUDACEZtwIAAJkHADC4AgAAmgcAELkCAACZBwAwugIBAPQDACHAAkAA-AMAIcECQAD4AwAh1QIAAOoE9wIi3gIBAPQDACH1AgEA9AMAIfcCEACwBAAh-AIBAPQDACH6AgAA6wT6AiL7AgEA9AMAIfwCAQD1AwAh_QIBAPUDACH-AgEA9QMAIf8CAACfBAAggANAAPcDACGBAwEA9QMAIYIDAQD1AwAhgwNAAPcDACGEAxAA7AQAIYUDAQD1AwAhhgMBAPUDACGHAwEA9QMAIRW6AgEAigUAIcACQACOBQAhwQJAAI4FACHVAgAAnAf3AiL1AgEAigUAIfcCEACdBwAh-AIBAIoFACH6AgAAngf6AiL7AgEAigUAIfwCAQCLBQAh_QIBAIsFACH-AgEAiwUAIf8CgAAAAAGAA0AAjQUAIYEDAQCLBQAhggMBAIsFACGDA0AAjQUAIYQDEACfBwAhhQMBAIsFACGGAwEAiwUAIYcDAQCLBQAhAbkDAAAA9wICBbkDEAAAAAG_AxAAAAABwAMQAAAAAcEDEAAAAAHCAxAAAAABAbkDAAAA-gICBbkDEAAAAAG_AxAAAAABwAMQAAAAAcEDEAAAAAHCAxAAAAABFhEAAKEHACC6AgEAigUAIcACQACOBQAhwQJAAI4FACHVAgAAnAf3AiL1AgEAigUAIfcCEACdBwAh-AIBAIoFACH6AgAAngf6AiL7AgEAigUAIfwCAQCLBQAh_QIBAIsFACH-AgEAiwUAIf8CgAAAAAGAA0AAjQUAIYEDAQCLBQAhggMBAIsFACGDA0AAjQUAIYQDEACfBwAhhQMBAIsFACGGAwEAiwUAIYcDAQCLBQAhBSsAAPUIACAsAAD4CAAgtgMAAPYIACC3AwAA9wgAILwDAAAoACAWEQAAowcAILoCAQAAAAHAAkAAAAABwQJAAAAAAdUCAAAA9wIC9QIBAAAAAfcCEAAAAAH4AgEAAAAB-gIAAAD6AgL7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wKAAAAAAYADQAAAAAGBAwEAAAABggMBAAAAAYMDQAAAAAGEAxAAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABAysAAPUIACC2AwAA9ggAILwDAAAoACAJEAAAvgcAIBIAAL8HACC6AgEAAAABwAJAAAAAAcECQAAAAAHVAgAAAIwDAogDAQAAAAGJA0AAAAABigNAAAAAAQIAAAAoACArAAC9BwAgAwAAACgAICsAAL0HACAsAACvBwAgASQAAPQIADAODQAAogQAIBAAAPAEACASAACLBAAgtwIAAO4EADC4AgAAJgAQuQIAAO4EADC6AgEAAAABwAJAAPgDACHBAkAA-AMAIdUCAADvBIwDIt4CAQD0AwAhiAMBAPQDACGJA0AA9wMAIYoDQAD3AwAhAgAAACgAICQAAK8HACACAAAArAcAICQAAK0HACALtwIAAKsHADC4AgAArAcAELkCAACrBwAwugIBAPQDACHAAkAA-AMAIcECQAD4AwAh1QIAAO8EjAMi3gIBAPQDACGIAwEA9AMAIYkDQAD3AwAhigNAAPcDACELtwIAAKsHADC4AgAArAcAELkCAACrBwAwugIBAPQDACHAAkAA-AMAIcECQAD4AwAh1QIAAO8EjAMi3gIBAPQDACGIAwEA9AMAIYkDQAD3AwAhigNAAPcDACEHugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAK4HjAMiiAMBAIoFACGJA0AAjQUAIYoDQACNBQAhAbkDAAAAjAMCCRAAALAHACASAACxBwAgugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAK4HjAMiiAMBAIoFACGJA0AAjQUAIYoDQACNBQAhBSsAAOkIACAsAADyCAAgtgMAAOoIACC3AwAA8QgAILwDAADoAgAgCysAALIHADAsAAC2BwAwtgMAALMHADC3AwAAtAcAMLgDAAC1BwAguQMAAJYHADC6AwAAlgcAMLsDAACWBwAwvAMAAJYHADC9AwAAtwcAML4DAACZBwAwFg0AALwHACC6AgEAAAABwAJAAAAAAcECQAAAAAHVAgAAAPcCAt4CAQAAAAH3AhAAAAAB-AIBAAAAAfoCAAAA-gIC-wIBAAAAAfwCAQAAAAH9AgEAAAAB_gIBAAAAAf8CgAAAAAGAA0AAAAABgQMBAAAAAYIDAQAAAAGDA0AAAAABhAMQAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAQIAAAAuACArAAC7BwAgAwAAAC4AICsAALsHACAsAAC5BwAgASQAAPAIADACAAAALgAgJAAAuQcAIAIAAACaBwAgJAAAuAcAIBW6AgEAigUAIcACQACOBQAhwQJAAI4FACHVAgAAnAf3AiLeAgEAigUAIfcCEACdBwAh-AIBAIoFACH6AgAAngf6AiL7AgEAigUAIfwCAQCLBQAh_QIBAIsFACH-AgEAiwUAIf8CgAAAAAGAA0AAjQUAIYEDAQCLBQAhggMBAIsFACGDA0AAjQUAIYQDEACfBwAhhQMBAIsFACGGAwEAiwUAIYcDAQCLBQAhFg0AALoHACC6AgEAigUAIcACQACOBQAhwQJAAI4FACHVAgAAnAf3AiLeAgEAigUAIfcCEACdBwAh-AIBAIoFACH6AgAAngf6AiL7AgEAigUAIfwCAQCLBQAh_QIBAIsFACH-AgEAiwUAIf8CgAAAAAGAA0AAjQUAIYEDAQCLBQAhggMBAIsFACGDA0AAjQUAIYQDEACfBwAhhQMBAIsFACGGAwEAiwUAIYcDAQCLBQAhBSsAAOsIACAsAADuCAAgtgMAAOwIACC3AwAA7QgAILwDAACvAwAgFg0AALwHACC6AgEAAAABwAJAAAAAAcECQAAAAAHVAgAAAPcCAt4CAQAAAAH3AhAAAAAB-AIBAAAAAfoCAAAA-gIC-wIBAAAAAfwCAQAAAAH9AgEAAAAB_gIBAAAAAf8CgAAAAAGAA0AAAAABgQMBAAAAAYIDAQAAAAGDA0AAAAABhAMQAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAQMrAADrCAAgtgMAAOwIACC8AwAArwMAIAkQAAC-BwAgEgAAvwcAILoCAQAAAAHAAkAAAAABwQJAAAAAAdUCAAAAjAMCiAMBAAAAAYkDQAAAAAGKA0AAAAABAysAAOkIACC2AwAA6ggAILwDAADoAgAgBCsAALIHADC2AwAAswcAMLgDAAC1BwAgvAMAAJYHADAGugIBAAAAAcACQAAAAAHBAkAAAAAB3wIBAAAAAZMDAQAAAAGUAwEAAAABAgAAAIwCACArAADABwAgAwAAACQAICsAAMAHACAsAADEBwAgCAAAACQAICQAAMQHACC6AgEAigUAIcACQACOBQAhwQJAAI4FACHfAgEAiwUAIZMDAQCLBQAhlAMBAIsFACEGugIBAIoFACHAAkAAjgUAIcECQACOBQAh3wIBAIsFACGTAwEAiwUAIZQDAQCLBQAhAysAAMAHACC2AwAAwQcAILwDAACMAgAgBCsAAKQHADC2AwAApQcAMLgDAACnBwAgvAMAAKgHADAEKwAAkgcAMLYDAACTBwAwuAMAAJUHACC8AwAAlgcAMAQrAACJBwAwtgMAAIoHADC4AwAAjAcAILwDAACmBQAwBCsAAIAHADC2AwAAgQcAMLgDAACDBwAgvAMAANAFADAEKwAA9AYAMLYDAAD1BgAwuAMAAPcGACC8AwAA-AYAMAQrAADoBgAwtgMAAOkGADC4AwAA6wYAILwDAADsBgAwAysAAMMGACC2AwAAxAYAILwDAACXAwAgBA0AANwHACDfAgAAhgUAIJMDAACGBQAglAMAAIYFACAAAAAAAAAKDQAA3AcAIBUAANEHACAXAADdBwAgvwIAAIYFACDhAgAAhgUAIOMCAACGBQAg5AIAAIYFACDlAgAAhgUAIOkCAACGBQAg6gIAAIYFACAAAAAAAAUrAADkCAAgLAAA5wgAILYDAADlCAAgtwMAAOYIACC8AwAArwMAIAMrAADkCAAgtgMAAOUIACC8AwAArwMAIAsOAADNBwAgDwAAzgcAIBMAAM8HACAUAADQBwAgFQAA0QcAIBYAANQHACAZAADSBwAgGwAA0wcAIL8CAACGBQAg0QIAAIYFACDZAgAAhgUAIAAAAAAAAAUrAADfCAAgLAAA4ggAILYDAADgCAAgtwMAAOEIACC8AwAAyAMAIAMrAADfCAAgtgMAAOAIACC8AwAAyAMAIAAAAAAAAbkDAAAA9QICCysAAOwHADAsAADwBwAwtgMAAO0HADC3AwAA7gcAMLgDAADvBwAguQMAAKgHADC6AwAAqAcAMLsDAACoBwAwvAMAAKgHADC9AwAA8QcAML4DAACrBwAwCQ0AAPYHACASAAC_BwAgugIBAAAAAcACQAAAAAHBAkAAAAAB1QIAAACMAwLeAgEAAAABiQNAAAAAAYoDQAAAAAECAAAAKAAgKwAA9QcAIAMAAAAoACArAAD1BwAgLAAA8wcAIAEkAADeCAAwAgAAACgAICQAAPMHACACAAAArAcAICQAAPIHACAHugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAK4HjAMi3gIBAIoFACGJA0AAjQUAIYoDQACNBQAhCQ0AAPQHACASAACxBwAgugIBAIoFACHAAkAAjgUAIcECQACOBQAh1QIAAK4HjAMi3gIBAIoFACGJA0AAjQUAIYoDQACNBQAhBSsAANkIACAsAADcCAAgtgMAANoIACC3AwAA2wgAILwDAACvAwAgCQ0AAPYHACASAAC_BwAgugIBAAAAAcACQAAAAAHBAkAAAAAB1QIAAACMAwLeAgEAAAABiQNAAAAAAYoDQAAAAAEDKwAA2QgAILYDAADaCAAgvAMAAK8DACAEKwAA7AcAMLYDAADtBwAwuAMAAO8HACC8AwAAqAcAMAAAAAAAAAAAAAAAAAAAAAAFKwAA1AgAICwAANcIACC2AwAA1QgAILcDAADWCAAgvAMAAK8DACADKwAA1AgAILYDAADVCAAgvAMAAK8DACAAAAAAAAAAAAAAAAUrAADPCAAgLAAA0ggAILYDAADQCAAgtwMAANEIACC8AwAAAQAgAysAAM8IACC2AwAA0AgAILwDAAABACAAAAAFKwAAyggAICwAAM0IACC2AwAAywgAILcDAADMCAAgvAMAAK8DACADKwAAyggAILYDAADLCAAgvAMAAK8DACAAAAAFKwAAxQgAICwAAMgIACC2AwAAxggAILcDAADHCAAgvAMAAAEAIAMrAADFCAAgtgMAAMYIACC8AwAAAQAgAAAABSsAAMAIACAsAADDCAAgtgMAAMEIACC3AwAAwggAILwDAAAFACADKwAAwAgAILYDAADBCAAgvAMAAAUAIAAAAAUrAAC7CAAgLAAAvggAILYDAAC8CAAgtwMAAL0IACC8AwAArwMAIAMrAAC7CAAgtgMAALwIACC8AwAArwMAIAAAAAAACAoAALMIACAUAADQBwAgFQAA0QcAIB0AALQIACC9AgAAhgUAIL8CAACGBQAgjgMAAIYFACCjAwAAhgUAIAUNAADcBwAgEAAAsggAIBIAAM8HACCJAwAAhgUAIIoDAACGBQAgAw8AAM4HACC9AgAAhgUAIL8CAACGBQAgDAMAALUIACAEAAC2CAAgCQAAtwgAIAsAALgIACAUAADQBwAgHgAAuQgAIL8CAACGBQAgkwMAAIYFACCXAwAAhgUAIJgDAACGBQAgqgMAAIYFACCyAwAAhgUAIAcMAACwCAAgFgAA1AcAII0DAACGBQAgjgMAAIYFACCPAwAAhgUAIJADAACGBQAgkgMAAIYFACAEBQAAtAYAIAgAALMGACC9AgAAhgUAIL8CAACGBQAgBQMAALUIACAFAAC0BgAgBwAAuggAIL8CAACGBQAg8QIAAIYFACAEBAAAtggAIAUAALQGACC_AgAAhgUAINUCAACGBQAgAAAAFw4AAMUHACAPAADGBwAgEwAAxwcAIBQAAMgHACAVAADJBwAgFgAAzAcAIBkAAMoHACC6AgEAAAABuwIBAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAdACAQAAAAHRAgEAAAAB0wIAAADTAgLVAgAAANUCAtYCIAAAAAHXAiAAAAAB2AIgAAAAAdkCAQAAAAHbAgAAANsCAtwCAQAAAAHdAgEAAAABAgAAAK8DACArAAC7CAAgAwAAALIDACArAAC7CAAgLAAAvwgAIBkAAACyAwAgDgAAuwYAIA8AALwGACATAAC9BgAgFAAAvgYAIBUAAL8GACAWAADCBgAgGQAAwAYAICQAAL8IACC6AgEAigUAIbsCAQCKBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh0AIBAIoFACHRAgEAiwUAIdMCAAC4BtMCItUCAAC5BtUCItYCIACMBQAh1wIgAIwFACHYAiAAjAUAIdkCAQCLBQAh2wIAALoG2wIi3AIBAIoFACHdAgEAigUAIRcOAAC7BgAgDwAAvAYAIBMAAL0GACAUAAC-BgAgFQAAvwYAIBYAAMIGACAZAADABgAgugIBAIoFACG7AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdACAQCKBQAh0QIBAIsFACHTAgAAuAbTAiLVAgAAuQbVAiLWAiAAjAUAIdcCIACMBQAh2AIgAIwFACHZAgEAiwUAIdsCAAC6BtsCItwCAQCKBQAh3QIBAIoFACELAwAA5AcAIAUAALAGACC6AgEAAAABuwIBAAAAAbwCAQAAAAG-AiAAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB6gIBAAAAAfECCAAAAAECAAAABQAgKwAAwAgAIAMAAAADACArAADACAAgLAAAxAgAIA0AAAADACADAADjBwAgBQAAiwYAICQAAMQIACC6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG-AiAAjAUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIeoCAQCKBQAh8QIIAJsFACELAwAA4wcAIAUAAIsGACC6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG-AiAAjAUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIeoCAQCKBQAh8QIIAJsFACESAwAAlgYAIAQAAPoFACAJAAD7BQAgFAAA_gUAIB4AAP0FACC6AgEAAAABuwIBAAAAAbwCAQAAAAG-AiAAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB6gIBAAAAAZMDAQAAAAGXAwgAAAABmAMIAAAAAaoDAQAAAAGyAwEAAAABAgAAAAEAICsAAMUIACADAAAACwAgKwAAxQgAICwAAMkIACAUAAAACwAgAwAAlAYAIAQAAJ0FACAJAACeBQAgFAAAoQUAIB4AAKAFACAkAADJCAAgugIBAIoFACG7AgEAigUAIbwCAQCKBQAhvgIgAIwFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHqAgEAigUAIZMDAQCLBQAhlwMIAJsFACGYAwgAmwUAIaoDAQCLBQAhsgMBAIsFACESAwAAlAYAIAQAAJ0FACAJAACeBQAgFAAAoQUAIB4AAKAFACC6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG-AiAAjAUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIeoCAQCKBQAhkwMBAIsFACGXAwgAmwUAIZgDCACbBQAhqgMBAIsFACGyAwEAiwUAIRcOAADFBwAgDwAAxgcAIBMAAMcHACAUAADIBwAgFQAAyQcAIBYAAMwHACAbAADLBwAgugIBAAAAAbsCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHQAgEAAAAB0QIBAAAAAdMCAAAA0wIC1QIAAADVAgLWAiAAAAAB1wIgAAAAAdgCIAAAAAHZAgEAAAAB2wIAAADbAgLcAgEAAAAB3QIBAAAAAQIAAACvAwAgKwAAyggAIAMAAACyAwAgKwAAyggAICwAAM4IACAZAAAAsgMAIA4AALsGACAPAAC8BgAgEwAAvQYAIBQAAL4GACAVAAC_BgAgFgAAwgYAIBsAAMEGACAkAADOCAAgugIBAIoFACG7AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdACAQCKBQAh0QIBAIsFACHTAgAAuAbTAiLVAgAAuQbVAiLWAiAAjAUAIdcCIACMBQAh2AIgAIwFACHZAgEAiwUAIdsCAAC6BtsCItwCAQCKBQAh3QIBAIoFACEXDgAAuwYAIA8AALwGACATAAC9BgAgFAAAvgYAIBUAAL8GACAWAADCBgAgGwAAwQYAILoCAQCKBQAhuwIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHQAgEAigUAIdECAQCLBQAh0wIAALgG0wIi1QIAALkG1QIi1gIgAIwFACHXAiAAjAUAIdgCIACMBQAh2QIBAIsFACHbAgAAugbbAiLcAgEAigUAId0CAQCKBQAhEgMAAJYGACAEAAD6BQAgCQAA-wUAIAsAAPwFACAUAAD-BQAgugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAeoCAQAAAAGTAwEAAAABlwMIAAAAAZgDCAAAAAGqAwEAAAABsgMBAAAAAQIAAAABACArAADPCAAgAwAAAAsAICsAAM8IACAsAADTCAAgFAAAAAsAIAMAAJQGACAEAACdBQAgCQAAngUAIAsAAJ8FACAUAAChBQAgJAAA0wgAILoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb4CIACMBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh6gIBAIoFACGTAwEAiwUAIZcDCACbBQAhmAMIAJsFACGqAwEAiwUAIbIDAQCLBQAhEgMAAJQGACAEAACdBQAgCQAAngUAIAsAAJ8FACAUAAChBQAgugIBAIoFACG7AgEAigUAIbwCAQCKBQAhvgIgAIwFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHqAgEAigUAIZMDAQCLBQAhlwMIAJsFACGYAwgAmwUAIaoDAQCLBQAhsgMBAIsFACEXDwAAxgcAIBMAAMcHACAUAADIBwAgFQAAyQcAIBYAAMwHACAZAADKBwAgGwAAywcAILoCAQAAAAG7AgEAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB0AIBAAAAAdECAQAAAAHTAgAAANMCAtUCAAAA1QIC1gIgAAAAAdcCIAAAAAHYAiAAAAAB2QIBAAAAAdsCAAAA2wIC3AIBAAAAAd0CAQAAAAECAAAArwMAICsAANQIACADAAAAsgMAICsAANQIACAsAADYCAAgGQAAALIDACAPAAC8BgAgEwAAvQYAIBQAAL4GACAVAAC_BgAgFgAAwgYAIBkAAMAGACAbAADBBgAgJAAA2AgAILoCAQCKBQAhuwIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHQAgEAigUAIdECAQCLBQAh0wIAALgG0wIi1QIAALkG1QIi1gIgAIwFACHXAiAAjAUAIdgCIACMBQAh2QIBAIsFACHbAgAAugbbAiLcAgEAigUAId0CAQCKBQAhFw8AALwGACATAAC9BgAgFAAAvgYAIBUAAL8GACAWAADCBgAgGQAAwAYAIBsAAMEGACC6AgEAigUAIbsCAQCKBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh0AIBAIoFACHRAgEAiwUAIdMCAAC4BtMCItUCAAC5BtUCItYCIACMBQAh1wIgAIwFACHYAiAAjAUAIdkCAQCLBQAh2wIAALoG2wIi3AIBAIoFACHdAgEAigUAIRcOAADFBwAgEwAAxwcAIBQAAMgHACAVAADJBwAgFgAAzAcAIBkAAMoHACAbAADLBwAgugIBAAAAAbsCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHQAgEAAAAB0QIBAAAAAdMCAAAA0wIC1QIAAADVAgLWAiAAAAAB1wIgAAAAAdgCIAAAAAHZAgEAAAAB2wIAAADbAgLcAgEAAAAB3QIBAAAAAQIAAACvAwAgKwAA2QgAIAMAAACyAwAgKwAA2QgAICwAAN0IACAZAAAAsgMAIA4AALsGACATAAC9BgAgFAAAvgYAIBUAAL8GACAWAADCBgAgGQAAwAYAIBsAAMEGACAkAADdCAAgugIBAIoFACG7AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdACAQCKBQAh0QIBAIsFACHTAgAAuAbTAiLVAgAAuQbVAiLWAiAAjAUAIdcCIACMBQAh2AIgAIwFACHZAgEAiwUAIdsCAAC6BtsCItwCAQCKBQAh3QIBAIoFACEXDgAAuwYAIBMAAL0GACAUAAC-BgAgFQAAvwYAIBYAAMIGACAZAADABgAgGwAAwQYAILoCAQCKBQAhuwIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHQAgEAigUAIdECAQCLBQAh0wIAALgG0wIi1QIAALkG1QIi1gIgAIwFACHXAiAAjAUAIdgCIACMBQAh2QIBAIsFACHbAgAAugbbAiLcAgEAigUAId0CAQCKBQAhB7oCAQAAAAHAAkAAAAABwQJAAAAAAdUCAAAAjAMC3gIBAAAAAYkDQAAAAAGKA0AAAAABCQUAALIGACC6AgEAAAABuwIBAAAAAbwCAQAAAAG9AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAQIAAADIAwAgKwAA3wgAIAMAAADLAwAgKwAA3wgAICwAAOMIACALAAAAywMAIAUAAJAFACAkAADjCAAgugIBAIoFACG7AgEAigUAIbwCAQCKBQAhvQIBAIsFACG-AiAAjAUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIQkFAACQBQAgugIBAIoFACG7AgEAigUAIbwCAQCKBQAhvQIBAIsFACG-AiAAjAUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIRcOAADFBwAgDwAAxgcAIBMAAMcHACAUAADIBwAgFQAAyQcAIBkAAMoHACAbAADLBwAgugIBAAAAAbsCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHQAgEAAAAB0QIBAAAAAdMCAAAA0wIC1QIAAADVAgLWAiAAAAAB1wIgAAAAAdgCIAAAAAHZAgEAAAAB2wIAAADbAgLcAgEAAAAB3QIBAAAAAQIAAACvAwAgKwAA5AgAIAMAAACyAwAgKwAA5AgAICwAAOgIACAZAAAAsgMAIA4AALsGACAPAAC8BgAgEwAAvQYAIBQAAL4GACAVAAC_BgAgGQAAwAYAIBsAAMEGACAkAADoCAAgugIBAIoFACG7AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdACAQCKBQAh0QIBAIsFACHTAgAAuAbTAiLVAgAAuQbVAiLWAiAAjAUAIdcCIACMBQAh2AIgAIwFACHZAgEAiwUAIdsCAAC6BtsCItwCAQCKBQAh3QIBAIoFACEXDgAAuwYAIA8AALwGACATAAC9BgAgFAAAvgYAIBUAAL8GACAZAADABgAgGwAAwQYAILoCAQCKBQAhuwIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHQAgEAigUAIdECAQCLBQAh0wIAALgG0wIi1QIAALkG1QIi1gIgAIwFACHXAiAAjAUAIdgCIACMBQAh2QIBAIsFACHbAgAAugbbAiLcAgEAigUAId0CAQCKBQAhCboCAQAAAAG7AgEAAAABvQIBAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAdUCAAAA9QIC8gIQAAAAAfMCAgAAAAECAAAA6AIAICsAAOkIACAXDgAAxQcAIA8AAMYHACAUAADIBwAgFQAAyQcAIBYAAMwHACAZAADKBwAgGwAAywcAILoCAQAAAAG7AgEAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB0AIBAAAAAdECAQAAAAHTAgAAANMCAtUCAAAA1QIC1gIgAAAAAdcCIAAAAAHYAiAAAAAB2QIBAAAAAdsCAAAA2wIC3AIBAAAAAd0CAQAAAAECAAAArwMAICsAAOsIACADAAAAsgMAICsAAOsIACAsAADvCAAgGQAAALIDACAOAAC7BgAgDwAAvAYAIBQAAL4GACAVAAC_BgAgFgAAwgYAIBkAAMAGACAbAADBBgAgJAAA7wgAILoCAQCKBQAhuwIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHQAgEAigUAIdECAQCLBQAh0wIAALgG0wIi1QIAALkG1QIi1gIgAIwFACHXAiAAjAUAIdgCIACMBQAh2QIBAIsFACHbAgAAugbbAiLcAgEAigUAId0CAQCKBQAhFw4AALsGACAPAAC8BgAgFAAAvgYAIBUAAL8GACAWAADCBgAgGQAAwAYAIBsAAMEGACC6AgEAigUAIbsCAQCKBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh0AIBAIoFACHRAgEAiwUAIdMCAAC4BtMCItUCAAC5BtUCItYCIACMBQAh1wIgAIwFACHYAiAAjAUAIdkCAQCLBQAh2wIAALoG2wIi3AIBAIoFACHdAgEAigUAIRW6AgEAAAABwAJAAAAAAcECQAAAAAHVAgAAAPcCAt4CAQAAAAH3AhAAAAAB-AIBAAAAAfoCAAAA-gIC-wIBAAAAAfwCAQAAAAH9AgEAAAAB_gIBAAAAAf8CgAAAAAGAA0AAAAABgQMBAAAAAYIDAQAAAAGDA0AAAAABhAMQAAAAAYUDAQAAAAGGAwEAAAABhwMBAAAAAQMAAADrAgAgKwAA6QgAICwAAPMIACALAAAA6wIAICQAAPMIACC6AgEAigUAIbsCAQCKBQAhvQIBAIsFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgAA6gf1AiLyAhAAnQcAIfMCAgDIBgAhCboCAQCKBQAhuwIBAIoFACG9AgEAiwUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdUCAADqB_UCIvICEACdBwAh8wICAMgGACEHugIBAAAAAcACQAAAAAHBAkAAAAAB1QIAAACMAwKIAwEAAAABiQNAAAAAAYoDQAAAAAEKDQAA9gcAIBAAAL4HACC6AgEAAAABwAJAAAAAAcECQAAAAAHVAgAAAIwDAt4CAQAAAAGIAwEAAAABiQNAAAAAAYoDQAAAAAECAAAAKAAgKwAA9QgAIAMAAAAmACArAAD1CAAgLAAA-QgAIAwAAAAmACANAAD0BwAgEAAAsAcAICQAAPkIACC6AgEAigUAIcACQACOBQAhwQJAAI4FACHVAgAArgeMAyLeAgEAigUAIYgDAQCKBQAhiQNAAI0FACGKA0AAjQUAIQoNAAD0BwAgEAAAsAcAILoCAQCKBQAhwAJAAI4FACHBAkAAjgUAIdUCAACuB4wDIt4CAQCKBQAhiAMBAIoFACGJA0AAjQUAIYoDQACNBQAhFboCAQAAAAHAAkAAAAABwQJAAAAAAdUCAAAA9wIC9QIBAAAAAfcCEAAAAAH4AgEAAAAB-gIAAAD6AgL7AgEAAAAB_AIBAAAAAf0CAQAAAAH-AgEAAAAB_wKAAAAAAYADQAAAAAGBAwEAAAABggMBAAAAAYMDQAAAAAGEAxAAAAABhQMBAAAAAYYDAQAAAAGHAwEAAAABCLoCAQAAAAG9AgEAAAABwAJAAAAAAcECQAAAAAGMAwEAAAABlgMBAAAAAZcDCAAAAAGYAwgAAAABCLoCAQAAAAHVAgAAAJsDAowDAQAAAAGNAwEAAAABjgNAAAAAAY8DQAAAAAGbA0AAAAABnANAAAAAAQW6AgEAAAABwAJAAAAAAZ0DAQAAAAGkAwEAAAABpQMgAAAAAQi6AgEAAAABwAJAAAAAAawDAQAAAAGtAwEAAAABrgMBAAAAAa8DgAAAAAGwA4AAAAABsQMBAAAAAQ8KAACWCAAgFAAA6QUAIB0AAOsFACC6AgEAAAABvQIBAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAdUCAAAAowMCjgNAAAAAAZYDAQAAAAGdAwEAAAABnwMAAACfAwKhAwAAAKEDAqMDQAAAAAECAAAAHQAgKwAA_wgAIAMAAAAbACArAAD_CAAgLAAAgwkAIBEAAAAbACAKAACVCAAgFAAAwAUAIB0AAMIFACAkAACDCQAgugIBAIoFACG9AgEAiwUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdUCAAC-BaMDIo4DQACNBQAhlgMBAIoFACGdAwEAigUAIZ8DAAC8BZ8DIqEDAAC9BaEDIqMDQACNBQAhDwoAAJUIACAUAADABQAgHQAAwgUAILoCAQCKBQAhvQIBAIsFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgAAvgWjAyKOA0AAjQUAIZYDAQCKBQAhnQMBAIoFACGfAwAAvAWfAyKhAwAAvQWhAyKjA0AAjQUAIQi6AgEAAAAB1QIAAACbAwKMAwEAAAABjgNAAAAAAY8DQAAAAAGZAwEAAAABmwNAAAAAAZwDQAAAAAEPCgAAlggAIBQAAOkFACAVAADqBQAgugIBAAAAAb0CAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAKMDAo4DQAAAAAGWAwEAAAABnQMBAAAAAZ8DAAAAnwMCoQMAAAChAwKjA0AAAAABAgAAAB0AICsAAIUJACADAAAAGwAgKwAAhQkAICwAAIkJACARAAAAGwAgCgAAlQgAIBQAAMAFACAVAADBBQAgJAAAiQkAILoCAQCKBQAhvQIBAIsFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgAAvgWjAyKOA0AAjQUAIZYDAQCKBQAhnQMBAIoFACGfAwAAvAWfAyKhAwAAvQWhAyKjA0AAjQUAIQ8KAACVCAAgFAAAwAUAIBUAAMEFACC6AgEAigUAIb0CAQCLBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh1QIAAL4FowMijgNAAI0FACGWAwEAigUAIZ0DAQCKBQAhnwMAALwFnwMioQMAAL0FoQMiowNAAI0FACEJugIBAAAAAcACQAAAAAHBAkAAAAAB1QIAAACSAwKMAwEAAAABjgNAAAAAAY8DQAAAAAGQAwIAAAABkgMBAAAAAQy6AgEAAAABuwIBAAAAAbwCAQAAAAG-AiAAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB6gIBAAAAAZMDAQAAAAGXAwgAAAABmAMIAAAAAaoDAQAAAAEHugIBAAAAAbsCAQAAAAG8AgEAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB1QIBAAAAAQkIAACxBgAgugIBAAAAAbsCAQAAAAG8AgEAAAABvQIBAAAAAb4CIAAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAECAAAAyAMAICsAAI0JACADAAAAywMAICsAAI0JACAsAACRCQAgCwAAAMsDACAIAACPBQAgJAAAkQkAILoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb0CAQCLBQAhvgIgAIwFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACEJCAAAjwUAILoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb0CAQCLBQAhvgIgAIwFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACEMugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAeoCAQAAAAGTAwEAAAABlwMIAAAAAZgDCAAAAAGyAwEAAAABCLoCAQAAAAG7AgEAAAABvAIBAAAAAb4CIAAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHxAggAAAABCQQAAKUIACC6AgEAAAABuwIBAAAAAbwCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgEAAAABqgMBAAAAAQIAAAAJACArAACUCQAgCwMAAOQHACAHAACvBgAgugIBAAAAAbsCAQAAAAG8AgEAAAABvgIgAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAeoCAQAAAAHxAggAAAABAgAAAAUAICsAAJYJACAKugIBAAAAAb0CAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAKkDAp0DAQAAAAGmA0AAAAABpwNAAAAAAakDAQAAAAESAwAAlgYAIAQAAPoFACAJAAD7BQAgCwAA_AUAIB4AAP0FACC6AgEAAAABuwIBAAAAAbwCAQAAAAG-AiAAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB6gIBAAAAAZMDAQAAAAGXAwgAAAABmAMIAAAAAaoDAQAAAAGyAwEAAAABAgAAAAEAICsAAJkJACADAAAACwAgKwAAmQkAICwAAJ0JACAUAAAACwAgAwAAlAYAIAQAAJ0FACAJAACeBQAgCwAAnwUAIB4AAKAFACAkAACdCQAgugIBAIoFACG7AgEAigUAIbwCAQCKBQAhvgIgAIwFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHqAgEAigUAIZMDAQCLBQAhlwMIAJsFACGYAwgAmwUAIaoDAQCLBQAhsgMBAIsFACESAwAAlAYAIAQAAJ0FACAJAACeBQAgCwAAnwUAIB4AAKAFACC6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG-AiAAjAUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIeoCAQCKBQAhkwMBAIsFACGXAwgAmwUAIZgDCACbBQAhqgMBAIsFACGyAwEAiwUAIQi6AgEAAAABvQIBAAAAAcACQAAAAAHBAkAAAAABlQMBAAAAAZYDAQAAAAGXAwgAAAABmAMIAAAAARcOAADFBwAgDwAAxgcAIBMAAMcHACAUAADIBwAgFgAAzAcAIBkAAMoHACAbAADLBwAgugIBAAAAAbsCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHQAgEAAAAB0QIBAAAAAdMCAAAA0wIC1QIAAADVAgLWAiAAAAAB1wIgAAAAAdgCIAAAAAHZAgEAAAAB2wIAAADbAgLcAgEAAAAB3QIBAAAAAQIAAACvAwAgKwAAnwkAIBINAADbBwAgFwAA5wYAILoCAQAAAAG_AkAAAAABwAJAAAAAAcECQAAAAAHVAgAAAOcCAt4CAQAAAAHfAgEAAAAB4AIBAAAAAeECAQAAAAHiAgIAAAAB4wIBAAAAAeQCAQAAAAHlAoAAAAAB6AIAAADoAgLpAgEAAAAB6gIBAAAAAQIAAACXAwAgKwAAoQkAIAMAAACyAwAgKwAAnwkAICwAAKUJACAZAAAAsgMAIA4AALsGACAPAAC8BgAgEwAAvQYAIBQAAL4GACAWAADCBgAgGQAAwAYAIBsAAMEGACAkAAClCQAgugIBAIoFACG7AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdACAQCKBQAh0QIBAIsFACHTAgAAuAbTAiLVAgAAuQbVAiLWAiAAjAUAIdcCIACMBQAh2AIgAIwFACHZAgEAiwUAIdsCAAC6BtsCItwCAQCKBQAh3QIBAIoFACEXDgAAuwYAIA8AALwGACATAAC9BgAgFAAAvgYAIBYAAMIGACAZAADABgAgGwAAwQYAILoCAQCKBQAhuwIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHQAgEAigUAIdECAQCLBQAh0wIAALgG0wIi1QIAALkG1QIi1gIgAIwFACHXAiAAjAUAIdgCIACMBQAh2QIBAIsFACHbAgAAugbbAiLcAgEAigUAId0CAQCKBQAhAwAAADwAICsAAKEJACAsAACoCQAgFAAAADwAIA0AANoHACAXAADMBgAgJAAAqAkAILoCAQCKBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh1QIAAMkG5wIi3gIBAIoFACHfAgEAigUAIeACAQCKBQAh4QIBAIsFACHiAgIAyAYAIeMCAQCLBQAh5AIBAIsFACHlAoAAAAAB6AIAAMoG6AIi6QIBAIsFACHqAgEAiwUAIRINAADaBwAgFwAAzAYAILoCAQCKBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh1QIAAMkG5wIi3gIBAIoFACHfAgEAigUAIeACAQCKBQAh4QIBAIsFACHiAgIAyAYAIeMCAQCLBQAh5AIBAIsFACHlAoAAAAAB6AIAAMoG6AIi6QIBAIsFACHqAgEAiwUAIQi6AgEAAAAB1QIAAACbAwKNAwEAAAABjgNAAAAAAY8DQAAAAAGZAwEAAAABmwNAAAAAAZwDQAAAAAESDQAA2wcAIBUAAOYGACC6AgEAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB1QIAAADnAgLeAgEAAAAB3wIBAAAAAeACAQAAAAHhAgEAAAAB4gICAAAAAeMCAQAAAAHkAgEAAAAB5QKAAAAAAegCAAAA6AIC6QIBAAAAAeoCAQAAAAECAAAAlwMAICsAAKoJACADAAAAPAAgKwAAqgkAICwAAK4JACAUAAAAPAAgDQAA2gcAIBUAAMsGACAkAACuCQAgugIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgAAyQbnAiLeAgEAigUAId8CAQCKBQAh4AIBAIoFACHhAgEAiwUAIeICAgDIBgAh4wIBAIsFACHkAgEAiwUAIeUCgAAAAAHoAgAAygboAiLpAgEAiwUAIeoCAQCLBQAhEg0AANoHACAVAADLBgAgugIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgAAyQbnAiLeAgEAigUAId8CAQCKBQAh4AIBAIoFACHhAgEAiwUAIeICAgDIBgAh4wIBAIsFACHkAgEAiwUAIeUCgAAAAAHoAgAAygboAiLpAgEAiwUAIeoCAQCLBQAhC7oCAQAAAAG9AgEAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB1QIAAACjAwKOA0AAAAABnQMBAAAAAZ8DAAAAnwMCoQMAAAChAwKjA0AAAAABFw4AAMUHACAPAADGBwAgEwAAxwcAIBUAAMkHACAWAADMBwAgGQAAygcAIBsAAMsHACC6AgEAAAABuwIBAAAAAb8CQAAAAAHAAkAAAAABwQJAAAAAAdACAQAAAAHRAgEAAAAB0wIAAADTAgLVAgAAANUCAtYCIAAAAAHXAiAAAAAB2AIgAAAAAdkCAQAAAAHbAgAAANsCAtwCAQAAAAHdAgEAAAABAgAAAK8DACArAACwCQAgDwoAAJYIACAVAADqBQAgHQAA6wUAILoCAQAAAAG9AgEAAAABvwJAAAAAAcACQAAAAAHBAkAAAAAB1QIAAACjAwKOA0AAAAABlgMBAAAAAZ0DAQAAAAGfAwAAAJ8DAqEDAAAAoQMCowNAAAAAAQIAAAAdACArAACyCQAgAwAAALIDACArAACwCQAgLAAAtgkAIBkAAACyAwAgDgAAuwYAIA8AALwGACATAAC9BgAgFQAAvwYAIBYAAMIGACAZAADABgAgGwAAwQYAICQAALYJACC6AgEAigUAIbsCAQCKBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh0AIBAIoFACHRAgEAiwUAIdMCAAC4BtMCItUCAAC5BtUCItYCIACMBQAh1wIgAIwFACHYAiAAjAUAIdkCAQCLBQAh2wIAALoG2wIi3AIBAIoFACHdAgEAigUAIRcOAAC7BgAgDwAAvAYAIBMAAL0GACAVAAC_BgAgFgAAwgYAIBkAAMAGACAbAADBBgAgugIBAIoFACG7AgEAigUAIb8CQACNBQAhwAJAAI4FACHBAkAAjgUAIdACAQCKBQAh0QIBAIsFACHTAgAAuAbTAiLVAgAAuQbVAiLWAiAAjAUAIdcCIACMBQAh2AIgAIwFACHZAgEAiwUAIdsCAAC6BtsCItwCAQCKBQAh3QIBAIoFACEDAAAAGwAgKwAAsgkAICwAALkJACARAAAAGwAgCgAAlQgAIBUAAMEFACAdAADCBQAgJAAAuQkAILoCAQCKBQAhvQIBAIsFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgAAvgWjAyKOA0AAjQUAIZYDAQCKBQAhnQMBAIoFACGfAwAAvAWfAyKhAwAAvQWhAyKjA0AAjQUAIQ8KAACVCAAgFQAAwQUAIB0AAMIFACC6AgEAigUAIb0CAQCLBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh1QIAAL4FowMijgNAAI0FACGWAwEAigUAIZ0DAQCKBQAhnwMAALwFnwMioQMAAL0FoQMiowNAAI0FACEIugIBAAAAAb0CAQAAAAHAAkAAAAABwQJAAAAAAYwDAQAAAAGVAwEAAAABlwMIAAAAAZgDCAAAAAEDAAAABwAgKwAAlAkAICwAAL0JACALAAAABwAgBAAApAgAICQAAL0JACC6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgEAiwUAIaoDAQCKBQAhCQQAAKQIACC6AgEAigUAIbsCAQCKBQAhvAIBAIoFACG_AkAAjQUAIcACQACOBQAhwQJAAI4FACHVAgEAiwUAIaoDAQCKBQAhAwAAAAMAICsAAJYJACAsAADACQAgDQAAAAMAIAMAAOMHACAHAACKBgAgJAAAwAkAILoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb4CIACMBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh6gIBAIoFACHxAggAmwUAIQsDAADjBwAgBwAAigYAILoCAQCKBQAhuwIBAIoFACG8AgEAigUAIb4CIACMBQAhvwJAAI0FACHAAkAAjgUAIcECQACOBQAh6gIBAIoFACHxAggAmwUAIQy6AgEAAAABuwIBAAAAAbwCAQAAAAG-AiAAAAABvwJAAAAAAcACQAAAAAHBAkAAAAABkwMBAAAAAZcDCAAAAAGYAwgAAAABqgMBAAAAAbIDAQAAAAEHAwACBBUDBgAaCRYECxoIFFMKHh4JAwUSAQYABwgGAwQDAAIFDwEGAAYHCgQDBAADBQ0BBgAFAQUOAAIFEQAHEAACBRQACBMAAQoAAQUGABkKAAEUIgoVTxIdUBQDCgABDCMJHAALCQYAGA4lDA8pDRMxEBQyChU2EhZIExlDFhtHFwENAAsEBgARDQALEAAOEi8QAgYADw8qDQEPKwACDQALEQANARIwAAMMAAkWABMYAAsEBgAVDQALFTcSFzsUAgwACRY9EwIVPgAXPwABDQALARoACwYPSQATSgAUSwAVTAAZTQAbTgACFFEAFVIAAwtUABRWAB5VAAADAwACBGADCWEEAwMAAgRnAwloBAUGAB8xACAyACEzACI0ACMAAAAAAAUGAB8xACAyACEzACI0ACMBGgALARoACwMGACgzACk0ACoAAAADBgAoMwApNAAqAQQAAwEEAAMDBgAvMwAwNAAxAAAAAwYALzMAMDQAMQEKAAEBCgABAwYANjMANzQAOAAAAAMGADYzADc0ADgBDQALAQ0ACwMGAD0zAD40AD8AAAADBgA9MwA-NAA_AQoAAQEKAAEDBgBEMwBFNABGAAAAAwYARDMARTQARgMMAAkWABMYAAsDDAAJFgATGAALAwYASzMATDQATQAAAAMGAEszAEw0AE0DCgABDP4BCRwACwMKAAEMhAIJHAALBQYAUjEAUzIAVDMAVTQAVgAAAAAABQYAUjEAUzIAVDMAVTQAVgENAAsBDQALAwYAWzMAXDQAXQAAAAMGAFszAFw0AF0CDAAJFq4CEwIMAAkWtAITBQYAYjEAYzIAZDMAZTQAZgAAAAAABQYAYjEAYzIAZDMAZTQAZgINAAsQAA4CDQALEAAOAwYAazMAbDQAbQAAAAMGAGszAGw0AG0CDQALEQANAg0ACxEADQUGAHIxAHMyAHQzAHU0AHYAAAAAAAUGAHIxAHMyAHQzAHU0AHYAAAUGAHsxAHwyAH0zAH40AH8AAAAAAAUGAHsxAHwyAH0zAH40AH8BAwACAQMAAgUGAIQBMQCFATIAhgEzAIcBNACIAQAAAAAABQYAhAExAIUBMgCGATMAhwE0AIgBAQ0ACwENAAsFBgCNATEAjgEyAI8BMwCQATQAkQEAAAAAAAUGAI0BMQCOATIAjwEzAJABNACRAQAAAwYAlgEzAJcBNACYAQAAAAMGAJYBMwCXATQAmAEAAAMGAJ0BMwCeATQAnwEAAAADBgCdATMAngE0AJ8BHwIBIFcBIVgBIlkBI1oBJVwBJl4bJ18cKGMBKWUbKmYdLWkBLmoBL2sbNW4eNm8kN3AXOHEXOXIXOnMXO3QXPHYXPXgbPnklP3sXQH0bQX4mQn8XQ4ABF0SBARtFhAEnRoUBK0eGAQRIhwEESYgBBEqJAQRLigEETIwBBE2OARtOjwEsT5EBBFCTARtRlAEtUpUBBFOWAQRUlwEbVZoBLlabATJXnAEIWJ0BCFmeAQhanwEIW6ABCFyiAQhdpAEbXqUBM1-nAQhgqQEbYaoBNGKrAQhjrAEIZK0BG2WwATVmsQE5Z7IBFmizARZptAEWarUBFmu2ARZsuAEWbboBG267ATpvvQEWcL8BG3HAATtywQEWc8IBFnTDARt1xgE8dscBQHfIAQl4yQEJecoBCXrLAQl7zAEJfM4BCX3QARt-0QFBf9MBCYAB1QEbgQHWAUKCAdcBCYMB2AEJhAHZARuFAdwBQ4YB3QFHhwHeARKIAd8BEokB4AESigHhARKLAeIBEowB5AESjQHmARuOAecBSI8B6QESkAHrARuRAewBSZIB7QESkwHuARKUAe8BG5UB8gFKlgHzAU6XAfQBCpgB9QEKmQH2AQqaAfcBCpsB-AEKnAH6AQqdAfwBG54B_QFPnwGAAgqgAYICG6EBgwJQogGFAgqjAYYCCqQBhwIbpQGKAlGmAYsCV6cBjQIMqAGOAgypAZACDKoBkQIMqwGSAgysAZQCDK0BlgIbrgGXAlivAZkCDLABmwIbsQGcAlmyAZ0CDLMBngIMtAGfAhu1AaICWrYBowJetwGkAhS4AaUCFLkBpgIUugGnAhS7AagCFLwBqgIUvQGsAhu-Aa0CX78BsAIUwAGyAhvBAbMCYMIBtQIUwwG2AhTEAbcCG8UBugJhxgG7AmfHAbwCDcgBvQINyQG-Ag3KAb8CDcsBwAINzAHCAg3NAcQCG84BxQJozwHHAg3QAckCG9EBygJp0gHLAg3TAcwCDdQBzQIb1QHQAmrWAdECbtcB0gIQ2AHTAhDZAdQCENoB1QIQ2wHWAhDcAdgCEN0B2gIb3gHbAm_fAd0CEOAB3wIb4QHgAnDiAeECEOMB4gIQ5AHjAhvlAeYCceYB5wJ35wHpAg7oAeoCDukB7QIO6gHuAg7rAe8CDuwB8QIO7QHzAhvuAfQCeO8B9gIO8AH4AhvxAfkCefIB-gIO8wH7Ag70AfwCG_UB_wJ69gGAA4AB9wGBAwP4AYIDA_kBgwMD-gGEAwP7AYUDA_wBhwMD_QGJAxv-AYoDgQH_AYwDA4ACjgMbgQKPA4IBggKQAwODApEDA4QCkgMbhQKVA4MBhgKWA4kBhwKYAxOIApkDE4kCmwMTigKcAxOLAp0DE4wCnwMTjQKhAxuOAqIDigGPAqQDE5ACpgMbkQKnA4sBkgKoAxOTAqkDE5QCqgMblQKtA4wBlgKuA5IBlwKwAwuYArEDC5kCtAMLmgK1AwubArYDC5wCuAMLnQK6AxueArsDkwGfAr0DC6ACvwMboQLAA5QBogLBAwujAsIDC6QCwwMbpQLGA5UBpgLHA5kBpwLJAwKoAsoDAqkCzQMCqgLOAwKrAs8DAqwC0QMCrQLTAxuuAtQDmgGvAtYDArAC2AMbsQLZA5sBsgLaAwKzAtsDArQC3AMbtQLfA5wBtgLgA6AB"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AnyNull: () => AnyNull2,
  AreaScalarFieldEnum: () => AreaScalarFieldEnum,
  AuditLogScalarFieldEnum: () => AuditLogScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  FeederScalarFieldEnum: () => FeederScalarFieldEnum,
  JsonNull: () => JsonNull2,
  JsonNullValueFilter: () => JsonNullValueFilter,
  LoadSheddingScheduleScalarFieldEnum: () => LoadSheddingScheduleScalarFieldEnum,
  ModelName: () => ModelName,
  NotificationScalarFieldEnum: () => NotificationScalarFieldEnum,
  NullTypes: () => NullTypes2,
  NullableJsonNullValueInput: () => NullableJsonNullValueInput,
  NullsOrder: () => NullsOrder,
  OutageAssignmentScalarFieldEnum: () => OutageAssignmentScalarFieldEnum,
  OutageReportScalarFieldEnum: () => OutageReportScalarFieldEnum,
  OutageScalarFieldEnum: () => OutageScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  ProfileScalarFieldEnum: () => ProfileScalarFieldEnum,
  QueryMode: () => QueryMode,
  RestorationScalarFieldEnum: () => RestorationScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  SubscriptionPaymentScalarFieldEnum: () => SubscriptionPaymentScalarFieldEnum,
  SubscriptionPlanScalarFieldEnum: () => SubscriptionPlanScalarFieldEnum,
  SubscriptionScalarFieldEnum: () => SubscriptionScalarFieldEnum,
  SubstationScalarFieldEnum: () => SubstationScalarFieldEnum,
  TechnicianScalarFieldEnum: () => TechnicianScalarFieldEnum,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  ZoneScalarFieldEnum: () => ZoneScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
var runtime2 = __toESM(require("@prisma/client/runtime/client"), 1);
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.10.0",
  engine: "0edf323efd1d98336f3f0a68684b56f689b900d3"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  Area: "Area",
  AuditLog: "AuditLog",
  Feeder: "Feeder",
  LoadSheddingSchedule: "LoadSheddingSchedule",
  Notification: "Notification",
  Outage: "Outage",
  OutageAssignment: "OutageAssignment",
  OutageReport: "OutageReport",
  Profile: "Profile",
  Restoration: "Restoration",
  Subscription: "Subscription",
  SubscriptionPayment: "SubscriptionPayment",
  SubscriptionPlan: "SubscriptionPlan",
  Substation: "Substation",
  Technician: "Technician",
  User: "User",
  Zone: "Zone"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var AreaScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  zoneId: "zoneId",
  substationId: "substationId",
  feederId: "feederId",
  address: "address",
  latitude: "latitude",
  longitude: "longitude",
  isActive: "isActive",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var AuditLogScalarFieldEnum = {
  id: "id",
  actorId: "actorId",
  action: "action",
  entity: "entity",
  entityId: "entityId",
  oldValue: "oldValue",
  newValue: "newValue",
  ipAddress: "ipAddress",
  createdAt: "createdAt"
};
var FeederScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  substationId: "substationId",
  status: "status",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var LoadSheddingScheduleScalarFieldEnum = {
  id: "id",
  areaId: "areaId",
  title: "title",
  description: "description",
  startTime: "startTime",
  endTime: "endTime",
  status: "status",
  createdById: "createdById",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt"
};
var NotificationScalarFieldEnum = {
  id: "id",
  userId: "userId",
  title: "title",
  message: "message",
  isRead: "isRead",
  createdAt: "createdAt"
};
var OutageScalarFieldEnum = {
  id: "id",
  areaId: "areaId",
  title: "title",
  description: "description",
  type: "type",
  priority: "priority",
  status: "status",
  startedAt: "startedAt",
  restoredAt: "restoredAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt"
};
var OutageAssignmentScalarFieldEnum = {
  id: "id",
  outageId: "outageId",
  technicianId: "technicianId",
  assignedById: "assignedById",
  status: "status",
  assignedAt: "assignedAt",
  acceptedAt: "acceptedAt",
  startedAt: "startedAt",
  completedAt: "completedAt"
};
var OutageReportScalarFieldEnum = {
  id: "id",
  outageId: "outageId",
  reporterId: "reporterId",
  areaId: "areaId",
  description: "description",
  latitude: "latitude",
  longitude: "longitude",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ProfileScalarFieldEnum = {
  id: "id",
  userId: "userId",
  phone: "phone",
  address: "address",
  avatarUrl: "avatarUrl",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var RestorationScalarFieldEnum = {
  id: "id",
  outageId: "outageId",
  technicianId: "technicianId",
  startedAt: "startedAt",
  completedAt: "completedAt",
  duration: "duration",
  status: "status",
  remarks: "remarks",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionScalarFieldEnum = {
  id: "id",
  userId: "userId",
  planId: "planId",
  startDate: "startDate",
  endDate: "endDate",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionPaymentScalarFieldEnum = {
  id: "id",
  userId: "userId",
  subscriptionId: "subscriptionId",
  status: "status",
  amount: "amount",
  currency: "currency",
  paymentGateway: "paymentGateway",
  merchantInvoiceNumber: "merchantInvoiceNumber",
  bkashPaymentId: "bkashPaymentId",
  bkashTrxId: "bkashTrxId",
  payerReference: "payerReference",
  gatewayResponse: "gatewayResponse",
  paidAt: "paidAt",
  refundTrxId: "refundTrxId",
  refundReason: "refundReason",
  refundedAt: "refundedAt",
  refundAmount: "refundAmount",
  stripeSessionId: "stripeSessionId",
  stripePaymentIntentId: "stripePaymentIntentId",
  stripeCustomerId: "stripeCustomerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SubscriptionPlanScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  durationDays: "durationDays",
  status: "status",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt"
};
var SubstationScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  zoneId: "zoneId",
  capacity: "capacity",
  isActive: "isActive",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var TechnicianScalarFieldEnum = {
  id: "id",
  userId: "userId",
  phone: "phone",
  employeeId: "employeeId",
  skills: "skills",
  experienceYears: "experienceYears",
  resume: "resume",
  resumePublicId: "resumePublicId",
  additionalFiles: "additionalFiles",
  status: "status",
  verificationStatus: "verificationStatus",
  rejectionReason: "rejectionReason",
  zoneId: "zoneId",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  role: "role",
  status: "status",
  emailVerified: "emailVerified",
  isDeleted: "isDeleted",
  needPasswordChange: "needPasswordChange",
  googleId: "googleId",
  authProvider: "authProvider",
  imageUrl: "imageUrl",
  imagePublicId: "imagePublicId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  deletedAt: "deletedAt"
};
var ZoneScalarFieldEnum = {
  id: "id",
  name: "name",
  code: "code",
  description: "description",
  isActive: "isActive",
  deletedAt: "deletedAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var NullableJsonNullValueInput = {
  DbNull: DbNull2,
  JsonNull: JsonNull2
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var JsonNullValueFilter = {
  DbNull: DbNull2,
  JsonNull: JsonNull2,
  AnyNull: AnyNull2
};
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/enums.ts
var UserRole = {
  CUSTOMER: "CUSTOMER",
  TECHNICIAN: "TECHNICIAN",
  OPERATOR: "OPERATOR",
  ADMIN: "ADMIN"
};
var UserStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var ScheduleStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var OutageType = {
  PLANNED: "PLANNED",
  UNEXPECTED: "UNEXPECTED"
};
var OutageStatus = {
  REPORTED: "REPORTED",
  VERIFIED: "VERIFIED",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  RESTORED: "RESTORED",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED"
};
var Priority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
};
var TechnicianStatus = {
  AVAILABLE: "AVAILABLE",
  BUSY: "BUSY",
  OFFLINE: "OFFLINE"
};
var TechnicianVerificationStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED"
};
var PaymentGateway = {
  BKASH: "BKASH",
  STRIPE: "STRIPE",
  SSLCOMMERZ: "SSLCOMMERZ"
};
var AuthProvider = {
  GOOGLE: "GOOGLE",
  CREDENTIAL: "CREDENTIAL"
};
var AssignmentStatus = {
  ASSIGNED: "ASSIGNED",
  ACCEPTED: "ACCEPTED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var SubscriptionPlanStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE"
};
var SubscriptionStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED"
};
var RestorationStatus = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};

// src/generated/prisma/client.ts
var import_meta = {};
globalThis["__dirname"] = path2.dirname((0, import_node_url.fileURLToPath)(import_meta.url));
var PrismaClient = getPrismaClientClass();

// src/app/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new import_adapter_pg.PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/app/modules/auth/auth.service.ts
var import_http_status = __toESM(require("http-status"), 1);
var import_bcryptjs = __toESM(require("bcryptjs"), 1);

// src/app/lib/redis.ts
var import_redis = require("redis");
var redisClient = (0, import_redis.createClient)({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port),
    reconnectStrategy: (retries) => {
      console.log(`\u{1F504} Redis reconnecting... Attempt: ${retries}`);
      return Math.min(retries * 500, 1e4);
    }
  }
});
redisClient.on("error", (error) => {
  console.error("\u274C Redis Client Error:", error);
});
redisClient.on("connect", () => {
  console.log("\u{1F7E5} Redis Connecting...");
});
redisClient.on("ready", () => {
  console.log("\u{1F525} Redis Connected Successfully!!");
});
redisClient.on("reconnecting", () => {
  console.log("\u{1F504} Redis Reconnecting...");
});
redisClient.on("end", () => {
  console.log("\u{1F534} Redis Connection Closed!");
});

// src/app/modules/auth/auth.service.ts
var import_crypto = __toESM(require("crypto"), 1);
var import_ejs = __toESM(require("ejs"), 1);
var import_path2 = __toESM(require("path"), 1);

// src/app/lib/nodemailer.ts
var import_nodemailer = __toESM(require("nodemailer"), 1);
var transporter = import_nodemailer.default.createTransport({
  service: "gmail",
  auth: {
    user: config_default.smtp_user,
    pass: config_default.smtp_password
  }
});

// src/app/utils/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var createToken = (payload, secret, expiresIn) => {
  const token = import_jsonwebtoken.default.sign(payload, secret, {
    expiresIn
  });
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const verifiedToken = import_jsonwebtoken.default.verify(token, secret);
    return {
      success: true,
      data: verifiedToken
    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
var jwtUtils = {
  createToken,
  verifyToken
};

// src/app/lib/googleAuth.ts
var import_google_auth_library = require("google-auth-library");
var googleClient = new import_google_auth_library.OAuth2Client({
  client_id: config_default.google_client_id
});

// src/app/lib/cloudinary.ts
var import_cloudinary = require("cloudinary");
import_cloudinary.v2.config({
  cloud_name: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_api_secret
});
var cloudinary = import_cloudinary.v2;

// src/app/modules/auth/auth.service.ts
var registerUserIntoDB = async (payload) => {
  const { name, password } = payload;
  const email = payload.email.trim().toLowerCase();
  const isUserExists = await prisma.user.findUnique({
    where: { email }
  });
  if (isUserExists) {
    throw new AppError(
      import_http_status.default.CONFLICT,
      "User with this email already exists"
    );
  }
  const hashedPassword = await import_bcryptjs.default.hash(password, 8);
  const expirationSeconds = 5 * 60;
  const otpKey = `user-registration-otp:${email}`;
  const otpValue = import_crypto.default.randomInt(1e5, 1e6).toString();
  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds
    }
  });
  const userRegistrationKey = `user-registration-data:${email}`;
  const redisUserDataPayload = {
    name,
    email,
    password: hashedPassword
  };
  await redisClient.set(
    userRegistrationKey,
    JSON.stringify(redisUserDataPayload),
    {
      expiration: {
        type: "EX",
        value: expirationSeconds
      }
    }
  );
  const templatePath = import_path2.default.join(
    process.cwd(),
    "src/app/templates/registration-user-otp.ejs"
  );
  const templateData = {
    name,
    email,
    otp: otpValue,
    expirationMinutes: expirationSeconds / 60
  };
  const html = await import_ejs.default.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: email,
    subject: "Email Verification",
    html
  });
};
var verifyEmailIntoDB = async (payload) => {
  const otp = payload.otp;
  const email = payload.email.trim().toLowerCase();
  const isUserExists = await prisma.user.findUnique({
    where: { email }
  });
  if (isUserExists?.status === "BLOCKED") {
    throw new AppError(import_http_status.default.FORBIDDEN, "User is Blocked!");
  }
  if (isUserExists?.emailVerified) {
    throw new AppError(import_http_status.default.CONFLICT, "Email ALready Verified!");
  }
  if (isUserExists?.isDeleted || isUserExists?.status === "DELETED") {
    throw new AppError(import_http_status.default.GONE, "User is Deleted!");
  }
  const otpKey = `user-registration-otp:${email}`;
  const redisOtp = await redisClient.get(otpKey);
  if (!redisOtp) {
    throw new AppError(import_http_status.default.BAD_REQUEST, "Invalid OTP!");
  }
  if (redisOtp !== otp) {
    throw new AppError(import_http_status.default.BAD_REQUEST, "OTP Does Not Match!");
  }
  await redisClient.del([otpKey]);
  const userRegistrationKey = `user-registration-data:${email}`;
  const redisUserData = await redisClient.get(userRegistrationKey);
  if (!redisUserData) {
    throw new AppError(import_http_status.default.NOT_FOUND, "User Does not Exist!");
  }
  const userPayload = JSON.parse(redisUserData);
  const createdUser = await prisma.user.create({
    data: {
      name: userPayload.name,
      email: userPayload.email,
      password: userPayload.password,
      role: UserRole.CUSTOMER,
      emailVerified: true,
      status: UserStatus.ACTIVE
    },
    omit: { password: true }
  });
  await redisClient.del(userRegistrationKey);
  const templatePath = import_path2.default.join(
    process.cwd(),
    "src/app/templates/user-welcome-email.ejs"
  );
  const templateData = {
    name: createdUser.name
  };
  const html = await import_ejs.default.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: email,
    subject: "Welcome To GridCare System",
    html
  });
  const { ...user } = createdUser;
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken2 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    user,
    accessToken,
    refreshToken: refreshToken2
  };
};
var loginUserIntoDB = async (payload) => {
  const { password } = payload;
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email }
  });
  if (!user) {
    throw new AppError(import_http_status.default.NOT_FOUND, "User not found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(import_http_status.default.FORBIDDEN, "User is blocked");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(import_http_status.default.GONE, "User is deleted");
  }
  const isPasswordMatched = await import_bcryptjs.default.compare(
    password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(import_http_status.default.UNAUTHORIZED, "Invalid credentials");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken2 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken2
  };
};
var getMeIntoDB = async (user) => {
  const isUserExists = await prisma.user.findUnique({
    where: {
      id: user.id
    },
    omit: {
      password: true
    }
  });
  if (!isUserExists) {
    throw new AppError(import_http_status.default.NOT_FOUND, "User not found");
  }
  return isUserExists;
};
var refreshTokenIntoDB = async (token) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(
    token,
    config_default.jwt_refresh_secret
  );
  if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
    throw new AppError(
      import_http_status.default.UNAUTHORIZED,
      config_default.node_env === "development" ? verifiedRefreshToken.error : "Invalid refresh token"
    );
  }
  const data = verifiedRefreshToken.data;
  const user = await prisma.user.findUnique({
    where: { id: data.userId }
  });
  if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
    throw new AppError(
      import_http_status.default.UNAUTHORIZED,
      "User is inactive or not found"
    );
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken2 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken2
  };
};
var getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    omit: { password: true }
  });
  return users;
};
var getUserByIdFromDB = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    omit: { password: true }
  });
  if (!user) {
    throw new AppError(import_http_status.default.NOT_FOUND, "User Not Found...!");
  }
  return user;
};
var updateMyProfileIntoDB = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(import_http_status.default.NOT_FOUND, "User Not Found...!");
  }
  const { name } = payload;
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name }
  });
  return updatedUser;
};
var changePasswordIntoDB = async (userId, oldPassword, newPassword) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  if (!user) {
    throw new AppError(import_http_status.default.NOT_FOUND, "User Not Found...!");
  }
  const isPasswordMatched = await import_bcryptjs.default.compare(
    oldPassword,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(import_http_status.default.UNAUTHORIZED, "Invalid old password");
  }
  const hashedNewPassword = await import_bcryptjs.default.hash(
    newPassword,
    Number(config_default.bcrypt_salt_rounds)
  );
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword }
  });
  return updatedUser;
};
var googleLoginIntoDB = async (payload) => {
  let googleIdTokenPayload = null;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: payload.idToken,
      audience: config_default.google_client_id
    });
    googleIdTokenPayload = ticket.getPayload();
  } catch (error) {
    console.log("Google ID Token Verification Failed", error);
    throw new AppError(
      import_http_status.default.UNAUTHORIZED,
      "Invalid Or Expired Google Id Token"
    );
  }
  if (!googleIdTokenPayload) {
    throw new AppError(
      import_http_status.default.UNAUTHORIZED,
      "Invalid Or Expired Google Id Token"
    );
  }
  if (!googleIdTokenPayload.email) {
    throw new AppError(import_http_status.default.BAD_REQUEST, "Google Email Not Found");
  }
  if (!googleIdTokenPayload.name) {
    throw new AppError(
      import_http_status.default.BAD_REQUEST,
      "Google Email User Name Not Found"
    );
  }
  const ifUserExistWithGoogleAuth = await prisma.user.findUnique({
    where: {
      email: googleIdTokenPayload.email,
      role: UserRole.CUSTOMER,
      googleId: googleIdTokenPayload.sub
    }
  });
  let user = ifUserExistWithGoogleAuth;
  if (!ifUserExistWithGoogleAuth) {
    const ifUserExistWithCredentials = await prisma.user.findUnique({
      where: {
        email: googleIdTokenPayload.email,
        role: UserRole.CUSTOMER,
        authProvider: AuthProvider.CREDENTIAL
      }
    });
    if (ifUserExistWithCredentials) {
      if (!ifUserExistWithCredentials.emailVerified) {
        throw new AppError(
          import_http_status.default.BAD_REQUEST,
          "Email Not Verified"
        );
      }
      if (ifUserExistWithCredentials.status === UserStatus.BLOCKED) {
        throw new AppError(import_http_status.default.FORBIDDEN, "User Is Blocked");
      }
      if (ifUserExistWithCredentials.isDeleted || ifUserExistWithCredentials.status === UserStatus.DELETED) {
        throw new AppError(import_http_status.default.GONE, "User Is Deleted");
      }
      user = await prisma.user.update({
        where: {
          id: ifUserExistWithCredentials.id
        },
        data: {
          googleId: googleIdTokenPayload.sub
        }
      });
    } else {
      user = await prisma.user.create({
        data: {
          name: googleIdTokenPayload.name,
          email: googleIdTokenPayload.email,
          role: UserRole.CUSTOMER,
          googleId: googleIdTokenPayload.sub,
          authProvider: AuthProvider.GOOGLE,
          emailVerified: true
        }
      });
      const templatePath = import_path2.default.join(
        process.cwd(),
        "src/app/templates/user-welcome-email.ejs"
      );
      const templateData = {
        name: user.name
      };
      const html = await import_ejs.default.renderFile(templatePath, templateData);
      await transporter.sendMail({
        from: config_default.email_sender,
        to: user.email,
        subject: "Welcome To GridCare System",
        html
      });
    }
  }
  if (!user) {
    throw new AppError(import_http_status.default.NOT_FOUND, "User Not Found");
  }
  if (user.status === UserStatus.BLOCKED) {
    throw new AppError(import_http_status.default.FORBIDDEN, "User Is Blocked");
  }
  if (user.isDeleted || user.status === UserStatus.DELETED) {
    throw new AppError(import_http_status.default.GONE, "User Is Deleted");
  }
  const jwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_access_secret,
    config_default.jwt_access_expires_in
  );
  const refreshToken2 = jwtUtils.createToken(
    jwtPayload,
    config_default.jwt_refresh_secret,
    config_default.jwt_refresh_expires_in
  );
  return {
    accessToken,
    refreshToken: refreshToken2
  };
};
var forgotPasswordIntoDB = async (payload) => {
  const { email } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(import_http_status.default.NOT_FOUND, "User Does Not Exist!");
  }
  if (isUserExist.status === "BLOCKED") {
    throw new AppError(import_http_status.default.FORBIDDEN, "User is Blocked!");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(import_http_status.default.BAD_REQUEST, "User Not Verified!");
  }
  if (isUserExist.isDeleted || isUserExist.status === "DELETED") {
    throw new AppError(import_http_status.default.GONE, "User is Deleted!");
  }
  if (isUserExist.googleId && isUserExist.authProvider === "GOOGLE") {
    throw new AppError(
      import_http_status.default.BAD_REQUEST,
      "User Has Account With Google!"
    );
  }
  const otp = import_crypto.default.randomInt(1e5, 1e6).toString();
  const key = `forgot-password-otp:${isUserExist.email}`;
  const expirationSeconds = 5 * 60;
  await redisClient.set(key, otp, {
    expiration: {
      type: "EX",
      value: expirationSeconds
    }
  });
  const templatePath = import_path2.default.join(
    process.cwd(),
    "src/app/templates/forgot-password.ejs"
  );
  const templateData = {
    name: isUserExist.name,
    otp,
    expirationMinutes: expirationSeconds / 60
  };
  const html = await import_ejs.default.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: isUserExist.email,
    subject: "Forgot Password",
    html
  });
};
var resetPasswordIntoDB = async (payload) => {
  const { email, otp, newPassword } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!isUserExist) {
    throw new AppError(import_http_status.default.NOT_FOUND, "User Does Not Exist!");
  }
  if (isUserExist.status === "BLOCKED") {
    throw new AppError(import_http_status.default.FORBIDDEN, "User is Blocked!");
  }
  if (!isUserExist.emailVerified) {
    throw new AppError(import_http_status.default.BAD_REQUEST, "User Not Verified!");
  }
  if (isUserExist.isDeleted || isUserExist.status === "DELETED") {
    throw new AppError(import_http_status.default.GONE, "User is Deleted!");
  }
  if (isUserExist.googleId && isUserExist.authProvider === "GOOGLE") {
    throw new AppError(
      import_http_status.default.BAD_REQUEST,
      "User Has Account With Google!"
    );
  }
  const key = `forgot-password-otp:${isUserExist.email}`;
  const redisOtp = await redisClient.get(key);
  if (!redisOtp) {
    throw new AppError(import_http_status.default.BAD_REQUEST, "Invalid OTP!");
  }
  if (redisOtp !== otp) {
    throw new AppError(import_http_status.default.BAD_REQUEST, "OTP Does Not Match!");
  }
  const hashedNewPassword = await import_bcryptjs.default.hash(
    newPassword,
    Number(config_default.bcrypt_salt_rounds)
  );
  await prisma.user.update({
    where: {
      email: isUserExist.email
    },
    data: {
      password: hashedNewPassword
    }
  });
  await redisClient.del([key]);
  const templatePath = import_path2.default.join(
    process.cwd(),
    "src/app/templates/reset-password-success.ejs"
  );
  const templateData = {
    name: isUserExist.name
  };
  const html = await import_ejs.default.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: isUserExist.email,
    subject: "Password Changed",
    html
  });
};
var uploadProfileImageIntoDB = async (buffer, userId) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      imageUrl: true,
      imagePublicId: true
    }
  });
  const cloudinaryResult = await new Promise(
    (resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: "auto"
        },
        async (error, result) => {
          if (error) {
            return reject(error);
          }
          if (!result) {
            return reject(
              new AppError(
                import_http_status.default.INTERNAL_SERVER_ERROR,
                "No result returned from Cloudinary"
              )
            );
          }
          resolve(result);
        }
      ).end(buffer);
    }
  );
  const updatedUser = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      imageUrl: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id
    },
    omit: {
      password: true
    }
  });
  if (currentUser?.imagePublicId && currentUser.imageUrl) {
    await cloudinary.uploader.destroy(currentUser.imagePublicId);
  }
  return updatedUser;
};
var authServices = {
  registerUserIntoDB,
  verifyEmailIntoDB,
  loginUserIntoDB,
  getMeIntoDB,
  refreshTokenIntoDB,
  getAllUsersFromDB,
  getUserByIdFromDB,
  updateMyProfileIntoDB,
  changePasswordIntoDB,
  googleLoginIntoDB,
  forgotPasswordIntoDB,
  resetPasswordIntoDB,
  uploadProfileImageIntoDB
};

// src/app/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/app/modules/auth/auth.controller.ts
var import_http_status2 = __toESM(require("http-status"), 1);
var registerUser = catchAsync_default(async (req, res) => {
  const payload = req.body;
  await authServices.registerUserIntoDB(payload);
  sendResponse(res, {
    statusCode: import_http_status2.default.CREATED,
    success: true,
    message: "Verification OTP Sent & Verification Your Account...!",
    data: null
  });
});
var verifyEmail = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const result = await authServices.verifyEmailIntoDB(payload);
  const { user, accessToken, refreshToken: refreshToken2 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken2, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: "Email Verified Successfully!!",
    data: { user, accessToken, refreshToken: refreshToken2 }
  });
});
var loginUser = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const result = await authServices.loginUserIntoDB(payload);
  const { accessToken, refreshToken: refreshToken2 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken2, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: "User logged in Successfully!",
    data: {
      accessToken,
      refreshToken: refreshToken2
    }
  });
});
var getMe = catchAsync_default(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError(
      import_http_status2.default.BAD_REQUEST,
      "User information is missing in the request"
    );
  }
  const result = await authServices.getMeIntoDB(user);
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: "User Profile Fetched Successfully!",
    data: result
  });
});
var refreshToken = catchAsync_default(async (req, res) => {
  if (!req.cookies.refreshToken) {
    throw new AppError(import_http_status2.default.BAD_REQUEST, "Refresh token is missing");
  }
  const result = await authServices.refreshTokenIntoDB(
    req.cookies.refreshToken
  );
  const { accessToken, refreshToken: newRefreshToken } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: "New tokens generated successfully!",
    data: {
      accessToken,
      refreshToken: newRefreshToken
    }
  });
});
var getAllUsers = catchAsync_default(async (req, res) => {
  const result = await authServices.getAllUsersFromDB();
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: "All Users Fetched Successfully!",
    data: result
  });
});
var getUserById = catchAsync_default(async (req, res) => {
  const userId = req.params.id;
  const result = await authServices.getUserByIdFromDB(userId);
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: "Single User Found Successfully!",
    data: result
  });
});
var updateMyProfile = catchAsync_default(async (req, res) => {
  const userId = req.user?.id;
  const payload = req.body;
  const result = await authServices.updateMyProfileIntoDB(userId, payload);
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: "Profile Updated Successfully!",
    data: result
  });
});
var changePassword = catchAsync_default(async (req, res) => {
  const userId = req.user?.id;
  const { oldPassword, newPassword } = req.body;
  const result = await authServices.changePasswordIntoDB(
    userId,
    oldPassword,
    newPassword
  );
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: "Password Changed Successfully!",
    data: result
  });
});
var googleLogin = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const result = await authServices.googleLoginIntoDB(payload);
  const { accessToken, refreshToken: refreshToken2 } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24
    // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken2, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1e3 * 60 * 60 * 24 * 7
    // 7 days
  });
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: "New tokens generated successfully!",
    data: {
      accessToken,
      refreshToken: refreshToken2
    }
  });
});
var forgotPassword = catchAsync_default(async (req, res) => {
  const payload = req.body;
  await authServices.forgotPasswordIntoDB(payload);
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: `OTP Sent To Email : ${payload.email}`,
    data: null
  });
});
var resetPassword = catchAsync_default(async (req, res) => {
  const payload = req.body;
  await authServices.resetPasswordIntoDB(payload);
  sendResponse(res, {
    statusCode: import_http_status2.default.OK,
    success: true,
    message: "Password Changed Successfully!",
    data: null
  });
});
var uploadProfileImage = catchAsync_default(
  async (req, res) => {
    if (!req.file) {
      res.status(import_http_status2.default.BAD_REQUEST).json({
        success: false,
        message: "No file uploaded."
      });
      return;
    }
    const userId = req.user?.id;
    const fileBuffer = req.file.buffer;
    const result = await authServices.uploadProfileImageIntoDB(
      fileBuffer,
      userId
    );
    sendResponse(res, {
      statusCode: import_http_status2.default.OK,
      success: true,
      message: "Profile image uploaded successfully!",
      data: result
    });
  }
);
var authControllers = {
  registerUser,
  verifyEmail,
  loginUser,
  getMe,
  refreshToken,
  getAllUsers,
  getUserById,
  updateMyProfile,
  changePassword,
  googleLogin,
  forgotPassword,
  resetPassword,
  uploadProfileImage
};

// src/app/middleware/validateRequest.ts
var import_http_status3 = __toESM(require("http-status"), 1);
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    const result = zodSchema.safeParse(req.body ?? {});
    if (!result.success) {
      throw new AppError(
        import_http_status3.default.BAD_REQUEST,
        result.error.issues[0]?.message ?? "Validation failed"
      );
    }
    req.body = result.data;
    next();
  };
};

// src/app/modules/auth/auth.validation.ts
var import_zod = require("zod");
var registrationZodSchema = import_zod.z.object({
  name: import_zod.z.string().min(3, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters").trim(),
  email: import_zod.z.string().email("Please provide a valid email address").toLowerCase().trim(),
  password: import_zod.z.string().min(8, "Password Must Minimum 8 Characters Long.").regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter").regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter").regex(/[0-9]/, "Password must contain at least 1 Number").regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least 1 Special Character"
  ).max(100, "Password must not exceed 100 characters")
});
var emailVerifyZodSchema = import_zod.z.object({
  email: import_zod.z.email("Not email!!"),
  otp: import_zod.z.string().length(6)
});
var loginZodSchema = import_zod.z.object({
  email: import_zod.z.email(),
  password: import_zod.z.string().min(8, "Password Must Minimum 8 Characters Long.").regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter").regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter").regex(/[0-9]/, "Password must contain at least 1 Number").regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least 1 Special Character"
  )
});
var forgotPasswordZodSchema = import_zod.z.object({
  email: import_zod.z.email()
});
var resetPasswordZodSchema = import_zod.z.object({
  email: import_zod.z.email(),
  newPassword: import_zod.z.string().min(8, "Password Must Minimum 8 Characters Long.").regex(/[a-z]/, "Password must contain at least 1 Lowercase Letter").regex(/[A-Z]/, "Password must contain at least 1 Uppercase Letter").regex(/[0-9]/, "Password must contain at least 1 Number").regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least 1 Special Character"
  ),
  otp: import_zod.z.string().length(6)
});
var userValidation = {
  registrationZodSchema,
  emailVerifyZodSchema,
  loginZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema
};

// src/app/middleware/checkAuth.ts
var import_http_status4 = __toESM(require("http-status"), 1);
var auth = (...requiredRoles) => {
  return catchAsync_default(
    async (req, _res, next) => {
      const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : req.headers.authorization;
      if (!token) {
        throw new AppError(
          import_http_status4.default.UNAUTHORIZED,
          "You are not logged in. Please log in to access this resource."
        );
      }
      const verifiedToken = jwtUtils.verifyToken(
        token,
        config_default.jwt_access_secret
      );
      if (!verifiedToken.success) {
        throw new AppError(
          import_http_status4.default.UNAUTHORIZED,
          verifiedToken.error
        );
      }
      const { id } = verifiedToken.data;
      if (!id || typeof id !== "string") {
        throw new AppError(
          import_http_status4.default.UNAUTHORIZED,
          "Invalid authentication token."
        );
      }
      const user = await prisma.user.findUnique({
        where: {
          id
        }
      });
      if (!user) {
        throw new AppError(
          import_http_status4.default.UNAUTHORIZED,
          "User not found. Please log in again."
        );
      }
      if (user.isDeleted) {
        throw new AppError(
          import_http_status4.default.UNAUTHORIZED,
          "Your account has been deleted."
        );
      }
      if (user.status === UserStatus.BLOCKED) {
        throw new AppError(
          import_http_status4.default.FORBIDDEN,
          "Your account has been blocked. Please contact support."
        );
      }
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        throw new AppError(
          import_http_status4.default.FORBIDDEN,
          "Forbidden. You don't have permission to access this resource."
        );
      }
      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
      next();
    }
  );
};

// src/app/lib/multer.ts
var import_multer = __toESM(require("multer"), 1);
var storage = import_multer.default.memoryStorage();
var upload = (0, import_multer.default)({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10 MB
  }
});

// src/app/modules/auth/auth.route.ts
var router = (0, import_express.Router)();
router.post(
  "/register",
  validateRequest(userValidation.registrationZodSchema),
  authControllers.registerUser
);
router.post(
  "/verify-email",
  validateRequest(userValidation.emailVerifyZodSchema),
  authControllers.verifyEmail
);
router.post("/login", authControllers.loginUser);
router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.OPERATOR),
  authControllers.getMe
);
router.post("/refresh-token", authControllers.refreshToken);
router.get("/all-users", authControllers.getAllUsers);
router.get("/user/:id", authControllers.getUserById);
router.put(
  "/my-profile",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.OPERATOR),
  authControllers.updateMyProfile
);
router.post(
  "/change-password",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.OPERATOR),
  authControllers.changePassword
);
router.post("/google", authControllers.googleLogin);
router.post(
  "/forgot-password",
  validateRequest(userValidation.forgotPasswordZodSchema),
  authControllers.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(userValidation.resetPasswordZodSchema),
  authControllers.resetPassword
);
router.patch(
  "/profile-image",
  auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.OPERATOR),
  upload.single("profileImage"),
  authControllers.uploadProfileImage
);
var authRoutes = router;

// src/app/modules/zone/zone.route.ts
var import_express2 = require("express");

// src/app/modules/zone/zone.validation.ts
var import_zod2 = require("zod");
var createZoneValidationSchema = import_zod2.z.object({
  name: import_zod2.z.string({
    error: "Zone name is required"
  }).min(2, "Zone name must be at least 2 characters long").max(100, "Zone name must not exceed 100 characters").trim(),
  code: import_zod2.z.string({
    error: "Zone code is required"
  }).min(2, "Zone code must be at least 2 characters long").max(20, "Zone code must not exceed 20 characters").regex(
    /^[A-Z0-9_-]+$/,
    "Zone code can contain only uppercase letters, numbers, underscore and hyphen"
  ).trim(),
  description: import_zod2.z.string().max(500, "Description must not exceed 500 characters").trim().optional(),
  isActive: import_zod2.z.boolean().optional()
});
var updateZoneValidationSchema = import_zod2.z.object({
  name: import_zod2.z.string().min(2, "Zone name must be at least 2 characters long").max(100, "Zone name must not exceed 100 characters").trim().optional(),
  code: import_zod2.z.string().min(2, "Zone code must be at least 2 characters long").max(20, "Zone code must not exceed 20 characters").regex(
    /^[A-Z0-9_-]+$/,
    "Zone code can contain only uppercase letters, numbers, underscore and hyphen"
  ).trim().optional(),
  description: import_zod2.z.string().max(500, "Description must not exceed 500 characters").trim().optional(),
  isActive: import_zod2.z.boolean().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required to update the zone"
});

// src/app/modules/zone/zone.controller.ts
var import_http_status6 = __toESM(require("http-status"), 1);

// src/app/modules/zone/zone.service.ts
var import_http_status5 = __toESM(require("http-status"), 1);
var createZoneIntoDB = async (payload) => {
  const existingZoneByName = await prisma.zone.findFirst({
    where: {
      name: payload.name,
      deletedAt: null
    }
  });
  if (existingZoneByName) {
    throw new AppError(
      import_http_status5.default.CONFLICT,
      "A zone with this name already exists."
    );
  }
  const existingZoneByCode = await prisma.zone.findUnique({
    where: {
      code: payload.code
    }
  });
  if (existingZoneByCode && existingZoneByCode.deletedAt === null) {
    throw new AppError(
      import_http_status5.default.CONFLICT,
      "A zone with this code already exists."
    );
  }
  const zone = await prisma.zone.create({
    data: {
      name: payload.name,
      code: payload.code,
      description: payload.description,
      isActive: payload.isActive ?? true
    }
  });
  return zone;
};
var getAllZonesFromDB = async () => {
  const zones = await prisma.zone.findMany({
    where: {
      deletedAt: null
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return zones;
};
var getSingleZoneFromDB = async (id) => {
  const zone = await prisma.zone.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!zone) {
    throw new AppError(import_http_status5.default.NOT_FOUND, "Zone not found.");
  }
  return zone;
};
var updateZoneIntoDB = async (id, payload) => {
  const existingZone = await prisma.zone.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingZone) {
    throw new AppError(import_http_status5.default.NOT_FOUND, "Zone not found.");
  }
  if (payload.name) {
    const duplicateName = await prisma.zone.findFirst({
      where: {
        name: payload.name,
        deletedAt: null,
        NOT: {
          id
        }
      }
    });
    if (duplicateName) {
      throw new AppError(
        import_http_status5.default.CONFLICT,
        "A zone with this name already exists."
      );
    }
  }
  if (payload.code) {
    const duplicateCode = await prisma.zone.findFirst({
      where: {
        code: payload.code,
        deletedAt: null,
        NOT: {
          id
        }
      }
    });
    if (duplicateCode) {
      throw new AppError(
        import_http_status5.default.CONFLICT,
        "A zone with this code already exists."
      );
    }
  }
  const updatedZone = await prisma.zone.update({
    where: {
      id
    },
    data: {
      ...payload.name !== void 0 && {
        name: payload.name
      },
      ...payload.code !== void 0 && {
        code: payload.code
      },
      ...payload.description !== void 0 && {
        description: payload.description
      },
      ...payload.isActive !== void 0 && {
        isActive: payload.isActive
      }
    }
  });
  return updatedZone;
};
var deleteZoneFromDB = async (id) => {
  const existingZone = await prisma.zone.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingZone) {
    throw new AppError(import_http_status5.default.NOT_FOUND, "Zone not found.");
  }
  const deletedZone = await prisma.zone.update({
    where: {
      id
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date(),
      isActive: false
    }
  });
  return deletedZone;
};
var zoneServices = {
  createZoneIntoDB,
  getAllZonesFromDB,
  getSingleZoneFromDB,
  updateZoneIntoDB,
  deleteZoneFromDB
};

// src/app/modules/zone/zone.controller.ts
var createZone = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const result = await zoneServices.createZoneIntoDB(payload);
  sendResponse(res, {
    statusCode: import_http_status6.default.CREATED,
    success: true,
    message: "Zone created successfully!",
    data: result
  });
});
var getAllZones = catchAsync_default(async (req, res) => {
  const result = await zoneServices.getAllZonesFromDB();
  sendResponse(res, {
    statusCode: import_http_status6.default.OK,
    success: true,
    message: "All zones retrieved successfully!",
    data: result
  });
});
var getSingleZone = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await zoneServices.getSingleZoneFromDB(id);
  sendResponse(res, {
    statusCode: import_http_status6.default.OK,
    success: true,
    message: "Single zone retrieved successfully!",
    data: result
  });
});
var updateZone = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await zoneServices.updateZoneIntoDB(id, req.body);
  sendResponse(res, {
    statusCode: import_http_status6.default.OK,
    success: true,
    message: "Zone updated successfully!",
    data: result
  });
});
var deleteZone = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await zoneServices.deleteZoneFromDB(id);
  sendResponse(res, {
    statusCode: import_http_status6.default.OK,
    success: true,
    message: "Zone deleted successfully!",
    data: result
  });
});
var zoneControllers = {
  createZone,
  getAllZones,
  getSingleZone,
  updateZone,
  deleteZone
};

// src/app/modules/zone/zone.route.ts
var router2 = (0, import_express2.Router)();
router2.post(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(createZoneValidationSchema),
  zoneControllers.createZone
);
router2.get("/", auth(), zoneControllers.getAllZones);
router2.get("/:id", auth(), zoneControllers.getSingleZone);
router2.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(updateZoneValidationSchema),
  zoneControllers.updateZone
);
router2.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  zoneControllers.deleteZone
);
var zoneRoutes = router2;

// src/app/modules/substation/substation.route.ts
var import_express3 = require("express");

// src/app/modules/substation/substation.controller.ts
var import_http_status8 = __toESM(require("http-status"), 1);

// src/app/modules/substation/substation.service.ts
var import_http_status7 = __toESM(require("http-status"), 1);
var createSubstationIntoDB = async (payload) => {
  const zone = await prisma.zone.findFirst({
    where: {
      id: payload.zoneId,
      deletedAt: null
    }
  });
  if (!zone) {
    throw new AppError(import_http_status7.default.NOT_FOUND, "Zone not found.");
  }
  if (!zone.isActive) {
    throw new AppError(
      import_http_status7.default.BAD_REQUEST,
      "Cannot create substation under an inactive zone."
    );
  }
  const existingSubstationByName = await prisma.substation.findFirst({
    where: {
      name: payload.name,
      deletedAt: null
    }
  });
  if (existingSubstationByName) {
    throw new AppError(
      import_http_status7.default.CONFLICT,
      "A substation with this name already exists."
    );
  }
  const existingSubstationByCode = await prisma.substation.findUnique({
    where: {
      code: payload.code
    }
  });
  if (existingSubstationByCode && existingSubstationByCode.deletedAt === null) {
    throw new AppError(
      import_http_status7.default.CONFLICT,
      "A substation with this code already exists."
    );
  }
  const substation = await prisma.substation.create({
    data: {
      name: payload.name,
      code: payload.code,
      zoneId: payload.zoneId,
      capacity: payload.capacity,
      isActive: payload.isActive ?? true
    },
    include: {
      zone: true
    }
  });
  return substation;
};
var getAllSubstationsFromDB = async () => {
  const substations = await prisma.substation.findMany({
    where: {
      deletedAt: null
    },
    include: {
      zone: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return substations;
};
var getSingleSubstationFromDB = async (id) => {
  const substation = await prisma.substation.findFirst({
    where: {
      id,
      deletedAt: null
    },
    include: {
      zone: true
    }
  });
  if (!substation) {
    throw new AppError(import_http_status7.default.NOT_FOUND, "Substation not found.");
  }
  return substation;
};
var updateSubstationIntoDB = async (id, payload) => {
  const existingSubstation = await prisma.substation.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingSubstation) {
    throw new AppError(import_http_status7.default.NOT_FOUND, "Substation not found.");
  }
  if (payload.zoneId) {
    const zone = await prisma.zone.findFirst({
      where: {
        id: payload.zoneId,
        deletedAt: null
      }
    });
    if (!zone) {
      throw new AppError(import_http_status7.default.NOT_FOUND, "Zone not found.");
    }
    if (!zone.isActive) {
      throw new AppError(
        import_http_status7.default.BAD_REQUEST,
        "Cannot assign substation to an inactive zone."
      );
    }
  }
  if (payload.name) {
    const duplicateName = await prisma.substation.findFirst({
      where: {
        name: payload.name,
        deletedAt: null,
        NOT: {
          id
        }
      }
    });
    if (duplicateName) {
      throw new AppError(
        import_http_status7.default.CONFLICT,
        "A substation with this name already exists."
      );
    }
  }
  if (payload.code) {
    const duplicateCode = await prisma.substation.findFirst({
      where: {
        code: payload.code,
        deletedAt: null,
        NOT: {
          id
        }
      }
    });
    if (duplicateCode) {
      throw new AppError(
        import_http_status7.default.CONFLICT,
        "A substation with this code already exists."
      );
    }
  }
  const updatedSubstation = await prisma.substation.update({
    where: {
      id
    },
    data: {
      ...payload.name !== void 0 && {
        name: payload.name
      },
      ...payload.code !== void 0 && {
        code: payload.code
      },
      ...payload.zoneId !== void 0 && {
        zoneId: payload.zoneId
      },
      ...payload.capacity !== void 0 && {
        capacity: payload.capacity
      },
      ...payload.isActive !== void 0 && {
        isActive: payload.isActive
      }
    },
    include: {
      zone: true
    }
  });
  return updatedSubstation;
};
var deleteSubstationFromDB = async (id) => {
  const existingSubstation = await prisma.substation.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingSubstation) {
    throw new AppError(import_http_status7.default.NOT_FOUND, "Substation not found.");
  }
  const deletedSubstation = await prisma.substation.update({
    where: {
      id
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date(),
      isActive: false
    }
  });
  return deletedSubstation;
};
var substationServices = {
  createSubstationIntoDB,
  getAllSubstationsFromDB,
  getSingleSubstationFromDB,
  updateSubstationIntoDB,
  deleteSubstationFromDB
};

// src/app/modules/substation/substation.controller.ts
var createSubstation = catchAsync_default(async (req, res) => {
  const result = await substationServices.createSubstationIntoDB(req.body);
  sendResponse(res, {
    statusCode: import_http_status8.default.CREATED,
    success: true,
    message: "Substation created successfully!",
    data: result
  });
});
var getAllSubstations = catchAsync_default(async (_req, res) => {
  const result = await substationServices.getAllSubstationsFromDB();
  sendResponse(res, {
    statusCode: import_http_status8.default.OK,
    success: true,
    message: "All Substations retrieved successfully!",
    data: result
  });
});
var getSingleSubstation = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await substationServices.getSingleSubstationFromDB(
    id
  );
  sendResponse(res, {
    statusCode: import_http_status8.default.OK,
    success: true,
    message: "Substation retrieved successfully!",
    data: result
  });
});
var updateSubstation = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await substationServices.updateSubstationIntoDB(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status8.default.OK,
    success: true,
    message: "Substation updated successfully!",
    data: result
  });
});
var deleteSubstation = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await substationServices.deleteSubstationFromDB(
    id
  );
  sendResponse(res, {
    statusCode: import_http_status8.default.OK,
    success: true,
    message: "Substation deleted successfully!",
    data: result
  });
});
var substationControllers = {
  createSubstation,
  getAllSubstations,
  getSingleSubstation,
  updateSubstation,
  deleteSubstation
};

// src/app/modules/substation/substation.validation.ts
var import_zod3 = require("zod");
var createSubstationValidationSchema = import_zod3.z.object({
  name: import_zod3.z.string({
    error: "Substation name is required"
  }).min(2, "Substation name must be at least 2 characters long").max(100, "Substation name must not exceed 100 characters").trim(),
  code: import_zod3.z.string({
    error: "Substation code is required"
  }).min(2, "Substation code must be at least 2 characters long").max(30, "Substation code must not exceed 30 characters").regex(
    /^[A-Z0-9_-]+$/,
    "Substation code can contain only uppercase letters, numbers, underscore and hyphen"
  ).trim(),
  zoneId: import_zod3.z.string({
    error: "Zone ID is required"
  }).uuid("Invalid zone ID"),
  capacity: import_zod3.z.number({
    error: "Capacity must be a number"
  }).positive("Capacity must be greater than 0").optional(),
  isActive: import_zod3.z.boolean().optional()
});
var updateSubstationValidationSchema = import_zod3.z.object({
  name: import_zod3.z.string().min(2, "Substation name must be at least 2 characters long").max(100, "Substation name must not exceed 100 characters").trim().optional(),
  code: import_zod3.z.string().min(2, "Substation code must be at least 2 characters long").max(30, "Substation code must not exceed 30 characters").regex(
    /^[A-Z0-9_-]+$/,
    "Substation code can contain only uppercase letters, numbers, underscore and hyphen"
  ).trim().optional(),
  zoneId: import_zod3.z.string().uuid("Invalid zone ID").optional(),
  capacity: import_zod3.z.number({
    error: "Capacity must be a number"
  }).positive("Capacity must be greater than 0").optional(),
  isActive: import_zod3.z.boolean().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required to update the substation"
});

// src/app/modules/substation/substation.route.ts
var router3 = (0, import_express3.Router)();
router3.post(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(createSubstationValidationSchema),
  substationControllers.createSubstation
);
router3.get("/", auth(), substationControllers.getAllSubstations);
router3.get("/:id", auth(), substationControllers.getSingleSubstation);
router3.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(updateSubstationValidationSchema),
  substationControllers.updateSubstation
);
router3.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  substationControllers.deleteSubstation
);
var substationRoutes = router3;

// src/app/modules/feeder/feeder.route.ts
var import_express4 = require("express");

// src/app/modules/feeder/feeder.controller.ts
var import_http_status10 = __toESM(require("http-status"), 1);

// src/app/modules/feeder/feeder.service.ts
var import_http_status9 = __toESM(require("http-status"), 1);
var createFeederIntoDB = async (payload) => {
  const substation = await prisma.substation.findFirst({
    where: {
      id: payload.substationId,
      deletedAt: null
    }
  });
  if (!substation) {
    throw new AppError(
      import_http_status9.default.NOT_FOUND,
      "Substation not found."
    );
  }
  if (!substation.isActive) {
    throw new AppError(
      import_http_status9.default.BAD_REQUEST,
      "Cannot create feeder under an inactive substation."
    );
  }
  const existingFeederByName = await prisma.feeder.findFirst({
    where: {
      name: payload.name,
      substationId: payload.substationId,
      deletedAt: null
    }
  });
  if (existingFeederByName) {
    throw new AppError(
      import_http_status9.default.CONFLICT,
      "A feeder with this name already exists under this substation."
    );
  }
  const existingFeederByCode = await prisma.feeder.findUnique({
    where: {
      code: payload.code
    }
  });
  if (existingFeederByCode && existingFeederByCode.deletedAt === null) {
    throw new AppError(
      import_http_status9.default.CONFLICT,
      "A feeder with this code already exists."
    );
  }
  const feeder = await prisma.feeder.create({
    data: {
      name: payload.name,
      code: payload.code,
      substationId: payload.substationId,
      status: payload.status
    },
    include: {
      substation: true
    }
  });
  return feeder;
};
var getAllFeedersFromDB = async () => {
  const feeders = await prisma.feeder.findMany({
    where: {
      deletedAt: null
    },
    include: {
      substation: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return feeders;
};
var getSingleFeederFromDB = async (id) => {
  const feeder = await prisma.feeder.findFirst({
    where: {
      id,
      deletedAt: null
    },
    include: {
      substation: true
    }
  });
  if (!feeder) {
    throw new AppError(
      import_http_status9.default.NOT_FOUND,
      "Feeder not found."
    );
  }
  return feeder;
};
var updateFeederIntoDB = async (id, payload) => {
  const existingFeeder = await prisma.feeder.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingFeeder) {
    throw new AppError(
      import_http_status9.default.NOT_FOUND,
      "Feeder not found."
    );
  }
  if (payload.substationId) {
    const substation = await prisma.substation.findFirst({
      where: {
        id: payload.substationId,
        deletedAt: null
      }
    });
    if (!substation) {
      throw new AppError(
        import_http_status9.default.NOT_FOUND,
        "Substation not found."
      );
    }
    if (!substation.isActive) {
      throw new AppError(
        import_http_status9.default.BAD_REQUEST,
        "Cannot assign feeder to an inactive substation."
      );
    }
  }
  const targetSubstationId = payload.substationId ?? existingFeeder.substationId;
  if (payload.name) {
    const duplicateName = await prisma.feeder.findFirst({
      where: {
        name: payload.name,
        substationId: targetSubstationId,
        deletedAt: null,
        NOT: {
          id
        }
      }
    });
    if (duplicateName) {
      throw new AppError(
        import_http_status9.default.CONFLICT,
        "A feeder with this name already exists under this substation."
      );
    }
  }
  if (payload.code) {
    const duplicateCode = await prisma.feeder.findFirst({
      where: {
        code: payload.code,
        deletedAt: null,
        NOT: {
          id
        }
      }
    });
    if (duplicateCode) {
      throw new AppError(
        import_http_status9.default.CONFLICT,
        "A feeder with this code already exists."
      );
    }
  }
  const updatedFeeder = await prisma.feeder.update({
    where: {
      id
    },
    data: {
      ...payload.name !== void 0 && {
        name: payload.name
      },
      ...payload.code !== void 0 && {
        code: payload.code
      },
      ...payload.substationId !== void 0 && {
        substationId: payload.substationId
      },
      ...payload.status !== void 0 && {
        status: payload.status
      }
    },
    include: {
      substation: true
    }
  });
  return updatedFeeder;
};
var deleteFeederFromDB = async (id) => {
  const existingFeeder = await prisma.feeder.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingFeeder) {
    throw new AppError(
      import_http_status9.default.NOT_FOUND,
      "Feeder not found."
    );
  }
  const deletedFeeder = await prisma.feeder.update({
    where: {
      id
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return deletedFeeder;
};
var feederServices = {
  createFeederIntoDB,
  getAllFeedersFromDB,
  getSingleFeederFromDB,
  updateFeederIntoDB,
  deleteFeederFromDB
};

// src/app/modules/feeder/feeder.controller.ts
var createFeeder = catchAsync_default(async (req, res) => {
  const result = await feederServices.createFeederIntoDB(req.body);
  sendResponse(res, {
    statusCode: import_http_status10.default.CREATED,
    success: true,
    message: "Feeder created successfully!",
    data: result
  });
});
var getAllFeeders = catchAsync_default(async (_req, res) => {
  const result = await feederServices.getAllFeedersFromDB();
  sendResponse(res, {
    statusCode: import_http_status10.default.OK,
    success: true,
    message: "All Feeders retrieved successfully!",
    data: result
  });
});
var getSingleFeeder = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await feederServices.getSingleFeederFromDB(id);
  sendResponse(res, {
    statusCode: import_http_status10.default.OK,
    success: true,
    message: "Single Feeder retrieved successfully!",
    data: result
  });
});
var updateFeeder = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await feederServices.updateFeederIntoDB(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status10.default.OK,
    success: true,
    message: "Feeder updated successfully!",
    data: result
  });
});
var deleteFeeder = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await feederServices.deleteFeederFromDB(id);
  sendResponse(res, {
    statusCode: import_http_status10.default.OK,
    success: true,
    message: "Feeder deleted successfully!",
    data: result
  });
});
var feederControllers = {
  createFeeder,
  getAllFeeders,
  getSingleFeeder,
  updateFeeder,
  deleteFeeder
};

// src/app/modules/feeder/feeder.validation.ts
var import_zod4 = require("zod");
var createFeederValidationSchema = import_zod4.z.object({
  name: import_zod4.z.string({
    error: "Feeder name is required"
  }).min(2, "Feeder name must be at least 2 characters long").max(100, "Feeder name must not exceed 100 characters").trim(),
  code: import_zod4.z.string({
    error: "Feeder code is required"
  }).min(2, "Feeder code must be at least 2 characters long").max(30, "Feeder code must not exceed 30 characters").regex(
    /^[A-Z0-9_-]+$/,
    "Feeder code can contain only uppercase letters, numbers, underscore and hyphen"
  ).trim(),
  substationId: import_zod4.z.string({
    error: "Substation ID is required"
  }).uuid("Invalid substation ID"),
  status: import_zod4.z.string().min(2, "Status must be at least 2 characters long").max(30, "Status must not exceed 30 characters").trim().optional()
});
var updateFeederValidationSchema = import_zod4.z.object({
  name: import_zod4.z.string().min(2, "Feeder name must be at least 2 characters long").max(100, "Feeder name must not exceed 100 characters").trim().optional(),
  code: import_zod4.z.string().min(2, "Feeder code must be at least 2 characters long").max(30, "Feeder code must not exceed 30 characters").regex(
    /^[A-Z0-9_-]+$/,
    "Feeder code can contain only uppercase letters, numbers, underscore and hyphen"
  ).trim().optional(),
  substationId: import_zod4.z.string().uuid("Invalid substation ID").optional(),
  status: import_zod4.z.string().min(2, "Status must be at least 2 characters long").max(30, "Status must not exceed 30 characters").trim().optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required to update the feeder"
});

// src/app/modules/feeder/feeder.route.ts
var router4 = (0, import_express4.Router)();
router4.post(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(createFeederValidationSchema),
  feederControllers.createFeeder
);
router4.get("/", auth(), feederControllers.getAllFeeders);
router4.get("/:id", auth(), feederControllers.getSingleFeeder);
router4.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(updateFeederValidationSchema),
  feederControllers.updateFeeder
);
router4.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  feederControllers.deleteFeeder
);
var feederRoutes = router4;

// src/app/modules/area/area.route.ts
var import_express5 = __toESM(require("express"), 1);

// src/app/modules/area/area.controller.ts
var import_http_status12 = __toESM(require("http-status"), 1);

// src/app/modules/area/area.service.ts
var import_http_status11 = __toESM(require("http-status"), 1);
var createAreaIntoDB = async (payload) => {
  const existingArea = await prisma.area.findFirst({
    where: {
      OR: [
        {
          code: payload.code
        },
        {
          name: payload.name,
          zoneId: payload.zoneId
        }
      ],
      deletedAt: null
    }
  });
  if (existingArea) {
    throw new AppError(
      import_http_status11.default.CONFLICT,
      "Area with this code or name already exists"
    );
  }
  const area = await prisma.area.create({
    data: payload,
    include: {
      zone: true,
      substation: true,
      feeder: true
    }
  });
  return area;
};
var getAllAreasFromDB = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    zoneId,
    substationId,
    feederId,
    isActive
  } = query;
  const skip = (page - 1) * limit;
  const andConditions = [
    {
      deletedAt: null
    }
  ];
  if (search) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          code: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          address: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    });
  }
  if (zoneId) {
    andConditions.push({
      zoneId
    });
  }
  if (substationId) {
    andConditions.push({
      substationId
    });
  }
  if (feederId) {
    andConditions.push({
      feederId
    });
  }
  if (isActive !== void 0) {
    andConditions.push({
      isActive
    });
  }
  const whereConditions = {
    AND: andConditions
  };
  const [areas, total] = await Promise.all([
    prisma.area.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        zone: true,
        substation: true,
        feeder: true
      }
    }),
    prisma.area.count({
      where: whereConditions
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: areas
  };
};
var getAreaByIdFromDB = async (id) => {
  const area = await prisma.area.findFirst({
    where: {
      id,
      deletedAt: null
    },
    include: {
      zone: true,
      substation: true,
      feeder: true,
      schedules: true,
      outages: true
    }
  });
  if (!area) {
    throw new AppError(import_http_status11.default.NOT_FOUND, "Area not found");
  }
  return area;
};
var updateAreaIntoDB = async (id, payload) => {
  const existingArea = await prisma.area.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingArea) {
    throw new AppError(import_http_status11.default.NOT_FOUND, "Area not found");
  }
  if (payload.code) {
    const duplicateCode = await prisma.area.findFirst({
      where: {
        code: payload.code,
        id: {
          not: id
        },
        deletedAt: null
      }
    });
    if (duplicateCode) {
      throw new AppError(import_http_status11.default.CONFLICT, "Area code already exists");
    }
  }
  const area = await prisma.area.update({
    where: {
      id
    },
    data: payload,
    include: {
      zone: true,
      substation: true,
      feeder: true
    }
  });
  return area;
};
var deleteAreaFromDB = async (id) => {
  const area = await prisma.area.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!area) {
    throw new AppError(import_http_status11.default.NOT_FOUND, "Area not found");
  }
  await prisma.area.update({
    where: {
      id
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date(),
      isActive: false
    }
  });
  return null;
};
var searchAreasFromDB = async (search) => {
  if (!search?.trim()) {
    throw new AppError(import_http_status11.default.BAD_REQUEST, "Search query is required");
  }
  const areas = await prisma.area.findMany({
    where: {
      deletedAt: null,
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          code: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          address: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    },
    orderBy: {
      name: "asc"
    },
    include: {
      zone: true,
      substation: true,
      feeder: true
    }
  });
  return areas;
};
var areaServices = {
  createAreaIntoDB,
  getAllAreasFromDB,
  getAreaByIdFromDB,
  updateAreaIntoDB,
  deleteAreaFromDB,
  searchAreasFromDB
};

// src/app/modules/area/area.controller.ts
var createArea = catchAsync_default(async (req, res) => {
  const result = await areaServices.createAreaIntoDB(req.body);
  sendResponse(res, {
    statusCode: import_http_status12.default.CREATED,
    success: true,
    message: "Area created successfully!",
    data: result
  });
});
var getAllAreas = catchAsync_default(async (req, res) => {
  const result = await areaServices.getAllAreasFromDB(req.query);
  sendResponse(res, {
    statusCode: import_http_status12.default.OK,
    success: true,
    message: "All Areas retrieved successfully!",
    data: result.data
  });
});
var getAreaById = catchAsync_default(async (req, res) => {
  const result = await areaServices.getAreaByIdFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: import_http_status12.default.OK,
    success: true,
    message: "Single Area retrieved successfully!",
    data: result
  });
});
var updateArea = catchAsync_default(async (req, res) => {
  const result = await areaServices.updateAreaIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status12.default.OK,
    success: true,
    message: "Area updated successfully!",
    data: result
  });
});
var deleteArea = catchAsync_default(async (req, res) => {
  await areaServices.deleteAreaFromDB(req.params.id);
  sendResponse(res, {
    statusCode: import_http_status12.default.OK,
    success: true,
    message: "Area deleted successfully!",
    data: null
  });
});
var searchAreas = catchAsync_default(async (req, res) => {
  const result = await areaServices.searchAreasFromDB(req.query.q);
  sendResponse(res, {
    statusCode: import_http_status12.default.OK,
    success: true,
    message: "Areas search completed successfully!",
    data: result
  });
});
var areaControllers = {
  createArea,
  getAllAreas,
  getAreaById,
  updateArea,
  deleteArea,
  searchAreas
};

// src/app/modules/area/area.validation.ts
var import_zod5 = require("zod");
var createAreaSchema = import_zod5.z.object({
  name: import_zod5.z.string().min(2, "Area name must be at least 2 characters").max(100, "Area name cannot exceed 100 characters"),
  code: import_zod5.z.string().min(2, "Area code must be at least 2 characters").max(50, "Area code cannot exceed 50 characters").regex(
    /^[A-Z0-9_-]+$/,
    "Area code can only contain uppercase letters, numbers, _ and -"
  ),
  zoneId: import_zod5.z.string().uuid("Invalid zone ID"),
  substationId: import_zod5.z.string().uuid("Invalid substation ID").optional().nullable(),
  feederId: import_zod5.z.string().uuid("Invalid feeder ID").optional().nullable(),
  address: import_zod5.z.string().max(255, "Address cannot exceed 255 characters").optional().nullable(),
  latitude: import_zod5.z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90").optional().nullable(),
  longitude: import_zod5.z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180").optional().nullable(),
  isActive: import_zod5.z.boolean().optional()
});
var updateAreaSchema = import_zod5.z.object({
  name: import_zod5.z.string().min(2).max(100).optional(),
  code: import_zod5.z.string().min(2).max(50).regex(
    /^[A-Z0-9_-]+$/,
    "Area code can only contain uppercase letters, numbers, _ and -"
  ).optional(),
  zoneId: import_zod5.z.string().uuid("Invalid zone ID").optional(),
  substationId: import_zod5.z.string().uuid("Invalid substation ID").optional().nullable(),
  feederId: import_zod5.z.string().uuid("Invalid feeder ID").optional().nullable(),
  address: import_zod5.z.string().max(255).optional().nullable(),
  latitude: import_zod5.z.number().min(-90).max(90).optional().nullable(),
  longitude: import_zod5.z.number().min(-180).max(180).optional().nullable(),
  isActive: import_zod5.z.boolean().optional()
});
var areaQuerySchema = import_zod5.z.object({
  page: import_zod5.z.coerce.number().int().min(1).optional(),
  limit: import_zod5.z.coerce.number().int().min(1).max(100).optional(),
  search: import_zod5.z.string().optional(),
  zoneId: import_zod5.z.string().uuid().optional(),
  substationId: import_zod5.z.string().uuid().optional(),
  feederId: import_zod5.z.string().uuid().optional(),
  isActive: import_zod5.z.enum(["true", "false"]).transform((value) => value === "true").optional()
});
var AreaValidation = {
  createAreaSchema,
  updateAreaSchema,
  areaQuerySchema
};

// src/app/modules/area/area.route.ts
var router5 = import_express5.default.Router();
router5.post(
  "/",
  validateRequest(AreaValidation.createAreaSchema),
  areaControllers.createArea
);
router5.get("/search", areaControllers.searchAreas);
router5.get(
  "/",
  validateRequest(AreaValidation.areaQuerySchema),
  areaControllers.getAllAreas
);
router5.get("/:id", areaControllers.getAreaById);
router5.patch(
  "/:id",
  validateRequest(AreaValidation.updateAreaSchema),
  areaControllers.updateArea
);
router5.delete("/:id", areaControllers.deleteArea);
var areaRoutes = router5;

// src/app/modules/outage/outage.route.ts
var import_express6 = __toESM(require("express"), 1);

// src/app/modules/outage/outage.controller.ts
var import_http_status14 = __toESM(require("http-status"), 1);

// src/app/modules/outage/outage.service.ts
var import_http_status13 = __toESM(require("http-status"), 1);
var ACTIVE_OUTAGE_STATUSES = [
  OutageStatus.REPORTED,
  OutageStatus.VERIFIED,
  OutageStatus.ASSIGNED,
  OutageStatus.IN_PROGRESS
];
var createOutageIntoDB = async (payload) => {
  const {
    areaId,
    title,
    description,
    type,
    priority,
    status,
    startedAt,
    restoredAt
  } = payload;
  const area = await prisma.area.findFirst({
    where: {
      id: areaId,
      deletedAt: null,
      isActive: true
    }
  });
  if (!area) {
    throw new AppError(import_http_status13.default.NOT_FOUND, "Area not found or inactive");
  }
  if (startedAt && restoredAt && restoredAt < startedAt) {
    throw new AppError(
      import_http_status13.default.BAD_REQUEST,
      "Restored time cannot be earlier than started time"
    );
  }
  const outageStatus = status ?? OutageStatus.REPORTED;
  if (restoredAt && outageStatus !== OutageStatus.RESTORED && outageStatus !== OutageStatus.CLOSED) {
    throw new AppError(
      import_http_status13.default.BAD_REQUEST,
      "restoredAt can only be provided when outage status is RESTORED or CLOSED"
    );
  }
  const existingActiveOutage = await prisma.outage.findFirst({
    where: {
      areaId,
      deletedAt: null,
      status: {
        in: ACTIVE_OUTAGE_STATUSES
      },
      title: {
        equals: title,
        mode: "insensitive"
      }
    }
  });
  if (existingActiveOutage) {
    throw new AppError(
      import_http_status13.default.CONFLICT,
      "An active outage with this title already exists in this area"
    );
  }
  const outage = await prisma.outage.create({
    data: {
      areaId,
      title,
      description,
      type,
      priority: priority ?? Priority.MEDIUM,
      status: outageStatus,
      startedAt,
      restoredAt
    },
    include: {
      area: true
    }
  });
  return outage;
};
var getAllOutagesFromDB = async (params) => {
  const {
    page = 1,
    limit = 10,
    search,
    areaId,
    status,
    type,
    priority
  } = params;
  const skip = (page - 1) * limit;
  const andConditions = [
    {
      deletedAt: null
    }
  ];
  if (search?.trim()) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: search.trim(),
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search.trim(),
            mode: "insensitive"
          }
        },
        {
          area: {
            name: {
              contains: search.trim(),
              mode: "insensitive"
            }
          }
        },
        {
          area: {
            code: {
              contains: search.trim(),
              mode: "insensitive"
            }
          }
        }
      ]
    });
  }
  if (areaId) {
    andConditions.push({
      areaId
    });
  }
  if (status) {
    andConditions.push({
      status
    });
  }
  if (type) {
    andConditions.push({
      type
    });
  }
  if (priority) {
    andConditions.push({
      priority
    });
  }
  const whereConditions = {
    AND: andConditions
  };
  const [outages, total] = await prisma.$transaction([
    prisma.outage.findMany({
      where: whereConditions,
      skip,
      take: limit,
      include: {
        area: true,
        reports: {
          orderBy: {
            createdAt: "desc"
          }
        },
        assignments: {
          include: {
            technician: true,
            assignedBy: true
          },
          orderBy: {
            assignedAt: "desc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.outage.count({
      where: whereConditions
    })
  ]);
  return {
    data: outages,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  };
};
var getSingleOutageFromDB = async (id) => {
  const outage = await prisma.outage.findFirst({
    where: { id },
    include: {
      area: true,
      reports: {
        include: {
          reporter: true
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      assignments: {
        include: {
          technician: true,
          assignedBy: true
        },
        orderBy: {
          assignedAt: "desc"
        }
      },
      payments: true
    }
  });
  if (!outage) {
    throw new AppError(import_http_status13.default.NOT_FOUND, "Outage not found");
  }
  return outage;
};
var updateOutageIntoDB = async (id, payload) => {
  const existingOutage = await prisma.outage.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingOutage) {
    throw new AppError(import_http_status13.default.NOT_FOUND, "Outage not found");
  }
  if (payload.areaId && payload.areaId !== existingOutage.areaId) {
    const area = await prisma.area.findFirst({
      where: {
        id: payload.areaId,
        deletedAt: null,
        isActive: true
      }
    });
    if (!area) {
      throw new AppError(
        import_http_status13.default.NOT_FOUND,
        "Area not found or inactive"
      );
    }
  }
  const finalStartedAt = payload.startedAt !== void 0 ? payload.startedAt : existingOutage.startedAt;
  const finalRestoredAt = payload.restoredAt !== void 0 ? payload.restoredAt : existingOutage.restoredAt;
  const finalStatus = payload.status ?? existingOutage.status;
  let startedAtToSave = finalStartedAt;
  if (payload.status === OutageStatus.IN_PROGRESS && !startedAtToSave) {
    startedAtToSave = /* @__PURE__ */ new Date();
  }
  let restoredAtToSave = finalRestoredAt;
  if (payload.status === OutageStatus.RESTORED && !restoredAtToSave) {
    restoredAtToSave = /* @__PURE__ */ new Date();
  }
  if (startedAtToSave && restoredAtToSave && restoredAtToSave < startedAtToSave) {
    throw new AppError(
      import_http_status13.default.BAD_REQUEST,
      "Restored time cannot be earlier than started time"
    );
  }
  if (restoredAtToSave && finalStatus !== OutageStatus.RESTORED && finalStatus !== OutageStatus.CLOSED) {
    throw new AppError(
      import_http_status13.default.BAD_REQUEST,
      "restoredAt can only be set when outage status is RESTORED or CLOSED"
    );
  }
  const finalAreaId = payload.areaId ?? existingOutage.areaId;
  const finalTitle = payload.title ?? existingOutage.title;
  const titleChanged = finalTitle.toLowerCase() !== existingOutage.title.toLowerCase();
  const areaChanged = finalAreaId !== existingOutage.areaId;
  if (titleChanged || areaChanged) {
    const duplicateOutage = await prisma.outage.findFirst({
      where: {
        id: {
          not: id
        },
        areaId: finalAreaId,
        title: {
          equals: finalTitle,
          mode: "insensitive"
        },
        deletedAt: null,
        status: {
          in: ACTIVE_OUTAGE_STATUSES
        }
      }
    });
    if (duplicateOutage) {
      throw new AppError(
        import_http_status13.default.CONFLICT,
        "An active outage with this title already exists in this area"
      );
    }
  }
  const updatedOutage = await prisma.outage.update({
    where: {
      id
    },
    data: {
      ...payload.areaId !== void 0 && {
        areaId: payload.areaId
      },
      ...payload.title !== void 0 && {
        title: payload.title
      },
      ...payload.description !== void 0 && {
        description: payload.description
      },
      ...payload.type !== void 0 && {
        type: payload.type
      },
      ...payload.priority !== void 0 && {
        priority: payload.priority
      },
      ...payload.status !== void 0 && {
        status: payload.status
      },
      startedAt: startedAtToSave,
      restoredAt: restoredAtToSave
    },
    include: {
      area: true,
      reports: {
        orderBy: {
          createdAt: "desc"
        }
      },
      assignments: {
        include: {
          technician: true,
          assignedBy: true
        },
        orderBy: {
          assignedAt: "desc"
        }
      }
    }
  });
  return updatedOutage;
};
var deleteOutageFromDB = async (id) => {
  const existingOutage = await prisma.outage.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingOutage) {
    throw new AppError(import_http_status13.default.NOT_FOUND, "Outage not found");
  }
  if (existingOutage.status === OutageStatus.IN_PROGRESS) {
    throw new AppError(
      import_http_status13.default.BAD_REQUEST,
      "In-progress outage cannot be deleted"
    );
  }
  const deletedOutage = await prisma.outage.update({
    where: {
      id
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  return deletedOutage;
};
var searchOutagesFromDB = async (searchTerm) => {
  const search = searchTerm.trim();
  if (!search) {
    throw new AppError(import_http_status13.default.BAD_REQUEST, "Search query is required");
  }
  const searchUpper = search.toUpperCase();
  const orConditions = [
    {
      title: {
        contains: search,
        mode: "insensitive"
      }
    },
    {
      description: {
        contains: search,
        mode: "insensitive"
      }
    },
    {
      area: {
        name: {
          contains: search,
          mode: "insensitive"
        }
      }
    },
    {
      area: {
        code: {
          contains: search,
          mode: "insensitive"
        }
      }
    }
  ];
  if (Object.values(OutageType).includes(searchUpper)) {
    orConditions.push({
      type: searchUpper
    });
  }
  if (Object.values(OutageStatus).includes(searchUpper)) {
    orConditions.push({
      status: searchUpper
    });
  }
  if (Object.values(Priority).includes(searchUpper)) {
    orConditions.push({
      priority: searchUpper
    });
  }
  const outages = await prisma.outage.findMany({
    where: {
      deletedAt: null,
      OR: orConditions
    },
    include: {
      area: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return outages;
};
var getActiveOutagesFromDB = async () => {
  const outages = await prisma.outage.findMany({
    where: {
      deletedAt: null,
      status: {
        in: ACTIVE_OUTAGE_STATUSES
      }
    },
    include: {
      area: true,
      assignments: {
        include: {
          technician: true,
          assignedBy: true
        }
      }
    },
    orderBy: [
      {
        priority: "desc"
      },
      {
        createdAt: "desc"
      }
    ]
  });
  return outages;
};
var getOutagesByAreaFromDB = async (areaId) => {
  const area = await prisma.area.findFirst({
    where: {
      id: areaId,
      deletedAt: null
    }
  });
  if (!area) {
    throw new AppError(import_http_status13.default.NOT_FOUND, "Area not found");
  }
  const outages = await prisma.outage.findMany({
    where: {
      areaId,
      deletedAt: null
    },
    include: {
      area: true,
      reports: {
        orderBy: {
          createdAt: "desc"
        }
      },
      assignments: {
        include: {
          technician: true,
          assignedBy: true
        },
        orderBy: {
          assignedAt: "desc"
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return outages;
};
var outageServices = {
  createOutageIntoDB,
  getAllOutagesFromDB,
  getSingleOutageFromDB,
  updateOutageIntoDB,
  deleteOutageFromDB,
  searchOutagesFromDB,
  getActiveOutagesFromDB,
  getOutagesByAreaFromDB
};

// src/app/modules/outage/outage.controller.ts
var createOutage = catchAsync_default(async (req, res) => {
  const result = await outageServices.createOutageIntoDB(req.body);
  sendResponse(res, {
    statusCode: import_http_status14.default.CREATED,
    success: true,
    message: "Outage created successfully",
    data: result
  });
});
var getAllOutages = catchAsync_default(async (req, res) => {
  const { page, limit, search, areaId, status, type, priority } = req.query;
  const result = await outageServices.getAllOutagesFromDB({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    search: search ? String(search) : void 0,
    areaId: areaId ? String(areaId) : void 0,
    status: status ? String(status).toUpperCase() : void 0,
    type: type ? String(type).toUpperCase() : void 0,
    priority: priority ? String(priority).toUpperCase() : void 0
  });
  sendResponse(res, {
    statusCode: import_http_status14.default.OK,
    success: true,
    message: "All Outages retrieved successfully",
    data: result.data
  });
});
var getSingleOutage = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await outageServices.getSingleOutageFromDB(id);
  sendResponse(res, {
    statusCode: import_http_status14.default.OK,
    success: true,
    message: "Single Outage retrieved successfully",
    data: result
  });
});
var updateOutage = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await outageServices.updateOutageIntoDB(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status14.default.OK,
    success: true,
    message: "Outage updated successfully",
    data: result
  });
});
var deleteOutage = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await outageServices.deleteOutageFromDB(id);
  sendResponse(res, {
    statusCode: import_http_status14.default.OK,
    success: true,
    message: "Outage deleted successfully",
    data: result
  });
});
var searchOutages = catchAsync_default(async (req, res) => {
  const searchTerm = String(req.query.search ?? "");
  const result = await outageServices.searchOutagesFromDB(searchTerm);
  sendResponse(res, {
    statusCode: import_http_status14.default.OK,
    success: true,
    message: "Outages searched successfully",
    data: result
  });
});
var getActiveOutages = catchAsync_default(async (_req, res) => {
  const result = await outageServices.getActiveOutagesFromDB();
  sendResponse(res, {
    statusCode: import_http_status14.default.OK,
    success: true,
    message: "Active outages retrieved successfully",
    data: result
  });
});
var getOutagesByArea = catchAsync_default(async (req, res) => {
  const { areaId } = req.params;
  const result = await outageServices.getOutagesByAreaFromDB(
    areaId
  );
  sendResponse(res, {
    statusCode: import_http_status14.default.OK,
    success: true,
    message: "Area outages retrieved successfully",
    data: result
  });
});
var outageControllers = {
  createOutage,
  getAllOutages,
  getSingleOutage,
  updateOutage,
  deleteOutage,
  searchOutages,
  getActiveOutages,
  getOutagesByArea
};

// src/app/modules/outage/outage.validation.ts
var import_zod6 = require("zod");
var createOutageSchema = import_zod6.z.object({
  areaId: import_zod6.z.string().uuid("Invalid area ID"),
  title: import_zod6.z.string().min(3, "Title must be at least 3 characters").max(200),
  description: import_zod6.z.string().max(1e3).optional(),
  type: import_zod6.z.enum(["PLANNED", "UNEXPECTED"]),
  priority: import_zod6.z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  status: import_zod6.z.enum([
    "REPORTED",
    "VERIFIED",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESTORED",
    "CLOSED",
    "CANCELLED"
  ]).optional(),
  startedAt: import_zod6.z.coerce.date().optional(),
  restoredAt: import_zod6.z.coerce.date().optional()
});
var updateOutageSchema = import_zod6.z.object({
  areaId: import_zod6.z.string().uuid("Invalid area ID").optional(),
  title: import_zod6.z.string().min(3).max(200).optional(),
  description: import_zod6.z.string().max(1e3).nullable().optional(),
  type: import_zod6.z.enum(["PLANNED", "UNEXPECTED"]).optional(),
  priority: import_zod6.z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  status: import_zod6.z.enum([
    "REPORTED",
    "VERIFIED",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESTORED",
    "CLOSED",
    "CANCELLED"
  ]).optional(),
  startedAt: import_zod6.z.coerce.date().nullable().optional(),
  restoredAt: import_zod6.z.coerce.date().nullable().optional()
});
var OutageValidation = {
  createOutageSchema,
  updateOutageSchema
};

// src/app/modules/outage/outage.route.ts
var router6 = import_express6.default.Router();
router6.post(
  "/",
  validateRequest(OutageValidation.createOutageSchema),
  outageControllers.createOutage
);
router6.get("/search", outageControllers.searchOutages);
router6.get("/active", outageControllers.getActiveOutages);
router6.get("/area/:areaId", outageControllers.getOutagesByArea);
router6.get("/", outageControllers.getAllOutages);
router6.get("/:id", outageControllers.getSingleOutage);
router6.patch(
  "/:id",
  validateRequest(OutageValidation.updateOutageSchema),
  outageControllers.updateOutage
);
router6.delete("/:id", outageControllers.deleteOutage);
var outageRoutes = router6;

// src/app/modules/outageReport/outageReport.route.ts
var import_express7 = __toESM(require("express"), 1);

// src/app/modules/outageReport/outageReport.controller.ts
var import_http_status16 = __toESM(require("http-status"), 1);

// src/app/modules/outageReport/outageReport.service.ts
var import_http_status15 = __toESM(require("http-status"), 1);
var createOutageReportIntoDB = async (reporterId, payload) => {
  const reporter = await prisma.user.findUnique({
    where: { id: reporterId }
  });
  if (!reporter) {
    throw new AppError(import_http_status15.default.NOT_FOUND, "Reporter not found");
  }
  const area = await prisma.area.findUnique({
    where: { id: payload.areaId }
  });
  if (!area) {
    throw new AppError(import_http_status15.default.NOT_FOUND, "Area not found");
  }
  if (payload.outageId) {
    const outage = await prisma.outage.findUnique({
      where: { id: payload.outageId }
    });
    if (!outage) {
      throw new AppError(import_http_status15.default.NOT_FOUND, "Outage not found");
    }
  }
  const result = await prisma.outageReport.create({
    data: {
      reporterId,
      outageId: payload.outageId,
      areaId: payload.areaId,
      description: payload.description,
      latitude: payload.latitude,
      longitude: payload.longitude
    },
    include: {
      reporter: true,
      area: true,
      outage: true
    }
  });
  return result;
};
var getAllOutageReportsFromDB = async () => {
  const result = await prisma.outageReport.findMany({
    include: {
      reporter: true,
      area: true,
      outage: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getSingleOutageReportFromDB = async (id) => {
  const result = await prisma.outageReport.findUnique({
    where: {
      id
    },
    include: {
      reporter: true,
      area: true,
      outage: true
    }
  });
  if (!result) {
    throw new AppError(import_http_status15.default.NOT_FOUND, "Outage report not found");
  }
  return result;
};
var getReportsByOutageFromDB = async (outageId) => {
  const outage = await prisma.outage.findUnique({
    where: {
      id: outageId
    }
  });
  if (!outage) {
    throw new AppError(import_http_status15.default.NOT_FOUND, "Outage not found");
  }
  const result = await prisma.outageReport.findMany({
    where: {
      outageId
    },
    include: {
      reporter: true,
      area: true,
      outage: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var getReportsByAreaFromDB = async (areaId) => {
  const area = await prisma.area.findUnique({
    where: {
      id: areaId
    }
  });
  if (!area) {
    throw new AppError(import_http_status15.default.NOT_FOUND, "Area not found");
  }
  const result = await prisma.outageReport.findMany({
    where: {
      areaId
    },
    include: {
      reporter: true,
      area: true,
      outage: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var updateOutageReportIntoDB = async (id, payload) => {
  const existingReport = await prisma.outageReport.findUnique({
    where: {
      id
    }
  });
  if (!existingReport) {
    throw new AppError(import_http_status15.default.NOT_FOUND, "Outage report not found");
  }
  if (payload.areaId) {
    const area = await prisma.area.findUnique({
      where: {
        id: payload.areaId
      }
    });
    if (!area) {
      throw new AppError(import_http_status15.default.NOT_FOUND, "Area not found");
    }
  }
  if (payload.outageId) {
    const outage = await prisma.outage.findUnique({
      where: {
        id: payload.outageId
      }
    });
    if (!outage) {
      throw new AppError(import_http_status15.default.NOT_FOUND, "Outage not found");
    }
  }
  const result = await prisma.outageReport.update({
    where: {
      id
    },
    data: {
      ...payload.outageId !== void 0 && {
        outageId: payload.outageId
      },
      ...payload.areaId !== void 0 && {
        areaId: payload.areaId
      },
      ...payload.description !== void 0 && {
        description: payload.description
      },
      ...payload.latitude !== void 0 && {
        latitude: payload.latitude
      },
      ...payload.longitude !== void 0 && {
        longitude: payload.longitude
      }
    },
    include: {
      reporter: true,
      area: true,
      outage: true
    }
  });
  return result;
};
var deleteOutageReportFromDB = async (id) => {
  const existingReport = await prisma.outageReport.findUnique({
    where: {
      id
    }
  });
  if (!existingReport) {
    throw new AppError(import_http_status15.default.NOT_FOUND, "Outage report not found");
  }
  const result = await prisma.outageReport.delete({
    where: {
      id
    }
  });
  return result;
};
var outageReportServices = {
  createOutageReportIntoDB,
  getAllOutageReportsFromDB,
  getSingleOutageReportFromDB,
  getReportsByOutageFromDB,
  getReportsByAreaFromDB,
  updateOutageReportIntoDB,
  deleteOutageReportFromDB
};

// src/app/modules/outageReport/outageReport.controller.ts
var createOutageReport = catchAsync_default(async (req, res) => {
  const reporterId = req.user?.id;
  if (!reporterId) {
    throw new AppError(
      import_http_status16.default.UNAUTHORIZED,
      "Authentication required to create an outage report"
    );
  }
  const result = await outageReportServices.createOutageReportIntoDB(
    reporterId,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status16.default.CREATED,
    success: true,
    message: "Outage report created successfully!",
    data: result
  });
});
var getAllOutageReports = catchAsync_default(async (req, res) => {
  const result = await outageReportServices.getAllOutageReportsFromDB();
  sendResponse(res, {
    statusCode: import_http_status16.default.OK,
    success: true,
    message: "All outage reports retrieved successfully",
    data: result
  });
});
var getSingleOutageReport = catchAsync_default(
  async (req, res) => {
    const { id } = req.params;
    const result = await outageReportServices.getSingleOutageReportFromDB(
      id
    );
    sendResponse(res, {
      statusCode: import_http_status16.default.OK,
      success: true,
      message: "Single outage report retrieved successfully",
      data: result
    });
  }
);
var getReportsByOutage = catchAsync_default(async (req, res) => {
  const { outageId } = req.params;
  const result = await outageReportServices.getReportsByOutageFromDB(
    outageId
  );
  sendResponse(res, {
    statusCode: import_http_status16.default.OK,
    success: true,
    message: "Outage reports retrieved successfully",
    data: result
  });
});
var getReportsByArea = catchAsync_default(async (req, res) => {
  const { areaId } = req.params;
  const result = await outageReportServices.getReportsByAreaFromDB(
    areaId
  );
  sendResponse(res, {
    statusCode: import_http_status16.default.OK,
    success: true,
    message: "Area outage reports retrieved successfully",
    data: result
  });
});
var updateOutageReport = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await outageReportServices.updateOutageReportIntoDB(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status16.default.OK,
    success: true,
    message: "Outage report updated successfully",
    data: result
  });
});
var deleteOutageReport = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await outageReportServices.deleteOutageReportFromDB(
    id
  );
  sendResponse(res, {
    statusCode: import_http_status16.default.OK,
    success: true,
    message: "Outage report deleted successfully",
    data: result
  });
});
var outageReportControllers = {
  createOutageReport,
  getAllOutageReports,
  getSingleOutageReport,
  getReportsByOutage,
  getReportsByArea,
  updateOutageReport,
  deleteOutageReport
};

// src/app/modules/outageReport/outageReport.validation.ts
var import_zod7 = require("zod");
var createOutageReportSchema = import_zod7.z.object({
  outageId: import_zod7.z.string().uuid("Invalid outage ID").optional(),
  areaId: import_zod7.z.string().uuid("Invalid area ID"),
  description: import_zod7.z.string().min(5, "Description must be at least 5 characters").max(1e3, "Description cannot exceed 1000 characters"),
  latitude: import_zod7.z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90").optional(),
  longitude: import_zod7.z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180").optional()
});
var updateOutageReportSchema = import_zod7.z.object({
  outageId: import_zod7.z.string().uuid("Invalid outage ID").nullable().optional(),
  areaId: import_zod7.z.string().uuid("Invalid area ID").optional(),
  description: import_zod7.z.string().min(5, "Description must be at least 5 characters").max(1e3, "Description cannot exceed 1000 characters").optional(),
  latitude: import_zod7.z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90").nullable().optional(),
  longitude: import_zod7.z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180").nullable().optional()
});
var OutageReportValidation = {
  createOutageReportSchema,
  updateOutageReportSchema
};

// src/app/modules/outageReport/outageReport.route.ts
var router7 = import_express7.default.Router();
router7.post(
  "/",
  auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(OutageReportValidation.createOutageReportSchema),
  outageReportControllers.createOutageReport
);
router7.get("/outage/:outageId", outageReportControllers.getReportsByOutage);
router7.get("/area/:areaId", outageReportControllers.getReportsByArea);
router7.get("/", outageReportControllers.getAllOutageReports);
router7.get("/:id", outageReportControllers.getSingleOutageReport);
router7.patch(
  "/:id",
  auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(OutageReportValidation.updateOutageReportSchema),
  outageReportControllers.updateOutageReport
);
router7.delete(
  "/:id",
  auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
  outageReportControllers.deleteOutageReport
);
var outageReportRoutes = router7;

// src/app/modules/outageAssignment/outageAssignment.route.ts
var import_express8 = __toESM(require("express"), 1);

// src/app/modules/outageAssignment/outageAssignment.controller.ts
var import_http_status18 = __toESM(require("http-status"), 1);

// src/app/modules/outageAssignment/outageAssignment.service.ts
var import_http_status17 = __toESM(require("http-status"), 1);
var createOutageAssignmentIntoDB = async (assignedById, payload) => {
  const { outageId, technicianId } = payload;
  const assignedBy = await prisma.user.findUnique({
    where: {
      id: assignedById
    }
  });
  if (!assignedBy) {
    throw new AppError(import_http_status17.default.NOT_FOUND, "Assigned By User Not Found");
  }
  const outage = await prisma.outage.findUnique({
    where: {
      id: outageId
    }
  });
  if (!outage) {
    throw new AppError(import_http_status17.default.NOT_FOUND, "Outage Not Found");
  }
  const technician = await prisma.technician.findUnique({
    where: {
      id: technicianId
    }
  });
  if (!technician) {
    throw new AppError(import_http_status17.default.NOT_FOUND, "Technician Not Found");
  }
  const existingAssignment = await prisma.outageAssignment.findUnique({
    where: {
      outageId_technicianId: {
        outageId,
        technicianId
      }
    }
  });
  if (existingAssignment) {
    throw new AppError(
      import_http_status17.default.CONFLICT,
      "This Technician is Already Assigned to This Outage"
    );
  }
  const result = await prisma.outageAssignment.create({
    data: {
      outageId,
      technicianId,
      assignedById
    },
    include: {
      outage: true,
      technician: true,
      assignedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return result;
};
var getAllOutageAssignmentsFromDB = async () => {
  const result = await prisma.outageAssignment.findMany({
    orderBy: {
      assignedAt: "desc"
    },
    include: {
      outage: true,
      technician: true,
      assignedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return result;
};
var getSingleOutageAssignmentFromDB = async (id) => {
  const result = await prisma.outageAssignment.findUnique({
    where: {
      id
    },
    include: {
      outage: true,
      technician: true,
      assignedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  if (!result) {
    throw new AppError(import_http_status17.default.NOT_FOUND, "Outage Assignment Not Found");
  }
  return result;
};
var updateOutageAssignmentIntoDB = async (id, payload) => {
  const existingAssignment = await prisma.outageAssignment.findUnique({
    where: {
      id
    }
  });
  if (!existingAssignment) {
    throw new AppError(import_http_status17.default.NOT_FOUND, "Outage Assignment Not Found");
  }
  const result = await prisma.outageAssignment.update({
    where: {
      id
    },
    data: {
      completedAt: payload.completedAt !== void 0 ? payload.completedAt : existingAssignment.completedAt
    },
    include: {
      outage: true,
      technician: true,
      assignedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return result;
};
var deleteOutageAssignmentFromDB = async (id) => {
  const existingAssignment = await prisma.outageAssignment.findUnique({
    where: {
      id
    }
  });
  if (!existingAssignment) {
    throw new AppError(import_http_status17.default.NOT_FOUND, "Outage Assignment Not Found");
  }
  const result = await prisma.outageAssignment.delete({
    where: {
      id
    }
  });
  return result;
};
var getAssignmentsByOutageFromDB = async (outageId) => {
  const outage = await prisma.outage.findUnique({
    where: {
      id: outageId
    }
  });
  if (!outage) {
    throw new AppError(import_http_status17.default.NOT_FOUND, "Outage Not Found");
  }
  const result = await prisma.outageAssignment.findMany({
    where: {
      outageId
    },
    orderBy: {
      assignedAt: "desc"
    },
    include: {
      technician: true,
      assignedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return result;
};
var getAssignmentsByTechnicianFromDB = async (technicianId) => {
  const technician = await prisma.technician.findUnique({
    where: {
      id: technicianId
    }
  });
  if (!technician) {
    throw new AppError(import_http_status17.default.NOT_FOUND, "Technician Not Found");
  }
  const result = await prisma.outageAssignment.findMany({
    where: {
      technicianId
    },
    orderBy: {
      assignedAt: "desc"
    },
    include: {
      outage: true,
      assignedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return result;
};
var getMyAssignmentsFromDB = async (userId) => {
  const technician = await prisma.technician.findUnique({
    where: {
      userId
    }
  });
  if (!technician) {
    throw new AppError(
      import_http_status17.default.NOT_FOUND,
      "Technician Profile Not Found"
    );
  }
  const result = await prisma.outageAssignment.findMany({
    where: {
      technicianId: technician.id
    },
    orderBy: {
      assignedAt: "desc"
    },
    include: {
      outage: true,
      assignedBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
  return result;
};
var outageAssignmentServices = {
  createOutageAssignmentIntoDB,
  getAllOutageAssignmentsFromDB,
  getSingleOutageAssignmentFromDB,
  updateOutageAssignmentIntoDB,
  deleteOutageAssignmentFromDB,
  getAssignmentsByOutageFromDB,
  getAssignmentsByTechnicianFromDB,
  getMyAssignmentsFromDB
};

// src/app/modules/outageAssignment/outageAssignment.controller.ts
var createOutageAssignment = catchAsync_default(async (req, res) => {
  const assignedById = req.user?.id;
  const result = await outageAssignmentServices.createOutageAssignmentIntoDB(
    assignedById,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status18.default.CREATED,
    success: true,
    message: "Outage Assigned to Technician Successfully!",
    data: result
  });
});
var getAllOutageAssignments = catchAsync_default(async (req, res) => {
  const result = await outageAssignmentServices.getAllOutageAssignmentsFromDB();
  sendResponse(res, {
    statusCode: import_http_status18.default.OK,
    success: true,
    message: "All Outage Assignments Retrieved Successfully!",
    data: result
  });
});
var getSingleOutageAssignment = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await outageAssignmentServices.getSingleOutageAssignmentFromDB(
    id
  );
  sendResponse(res, {
    statusCode: import_http_status18.default.OK,
    success: true,
    message: "Single Outage Assignment Retrieved Successfully!",
    data: result
  });
});
var updateOutageAssignment = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await outageAssignmentServices.updateOutageAssignmentIntoDB(
    id,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status18.default.OK,
    success: true,
    message: "Outage Assignment Updated Successfully!",
    data: result
  });
});
var deleteOutageAssignment = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await outageAssignmentServices.deleteOutageAssignmentFromDB(
    id
  );
  sendResponse(res, {
    statusCode: import_http_status18.default.OK,
    success: true,
    message: "Outage Assignment Deleted Successfully!",
    data: result
  });
});
var getAssignmentsByOutage = catchAsync_default(async (req, res) => {
  const { outageId } = req.params;
  const result = await outageAssignmentServices.getAssignmentsByOutageFromDB(
    outageId
  );
  sendResponse(res, {
    statusCode: import_http_status18.default.OK,
    success: true,
    message: "Outage Assignments Retrieved Successfully!",
    data: result
  });
});
var getAssignmentsByTechnician = catchAsync_default(async (req, res) => {
  const { technicianId } = req.params;
  const result = await outageAssignmentServices.getAssignmentsByTechnicianFromDB(
    technicianId
  );
  sendResponse(res, {
    statusCode: import_http_status18.default.OK,
    success: true,
    message: "Technician Assignments Retrieved Successfully!",
    data: result
  });
});
var getMyAssignments = catchAsync_default(async (req, res) => {
  console.log("Authenticated User:", req.user);
  const userId = req.user?.id;
  console.log("User ID:", userId);
  const result = await outageAssignmentServices.getMyAssignmentsFromDB(
    userId
  );
  sendResponse(res, {
    statusCode: import_http_status18.default.OK,
    success: true,
    message: "My Outage Assignments Retrieved Successfully!",
    data: result
  });
});
var outageAssignmentControllers = {
  createOutageAssignment,
  getAllOutageAssignments,
  getSingleOutageAssignment,
  updateOutageAssignment,
  deleteOutageAssignment,
  getAssignmentsByOutage,
  getAssignmentsByTechnician,
  getMyAssignments
};

// src/app/modules/outageAssignment/outageAssignment.validation.ts
var import_zod8 = require("zod");
var createOutageAssignmentValidationSchema = import_zod8.z.object({
  outageId: import_zod8.z.string({ message: "Outage ID is required" }).uuid("Invalid outage ID"),
  technicianId: import_zod8.z.string({ message: "Technician ID is required" }).uuid("Invalid technician ID")
});
var updateOutageAssignmentValidationSchema = import_zod8.z.object({
  completedAt: import_zod8.z.string().datetime({ message: "Invalid completedAt datetime" }).nullable().optional()
});
var OutageAssignmentValidation = {
  createOutageAssignmentValidationSchema,
  updateOutageAssignmentValidationSchema
};

// src/app/modules/outageAssignment/outageAssignment.route.ts
var router8 = import_express8.default.Router();
router8.post(
  "/",
  auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(
    OutageAssignmentValidation.createOutageAssignmentValidationSchema
  ),
  outageAssignmentControllers.createOutageAssignment
);
router8.get(
  "/my-assignments",
  auth(UserRole.TECHNICIAN),
  outageAssignmentControllers.getMyAssignments
  // TODO 
);
router8.get(
  "/outage/:outageId",
  auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
  outageAssignmentControllers.getAssignmentsByOutage
);
router8.get(
  "/technician/:technicianId",
  auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
  outageAssignmentControllers.getAssignmentsByTechnician
);
router8.get(
  "/",
  auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
  outageAssignmentControllers.getAllOutageAssignments
);
router8.get(
  "/:id",
  auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
  outageAssignmentControllers.getSingleOutageAssignment
);
router8.patch(
  "/:id",
  auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(
    OutageAssignmentValidation.updateOutageAssignmentValidationSchema
  ),
  outageAssignmentControllers.updateOutageAssignment
);
router8.delete(
  "/:id",
  auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
  outageAssignmentControllers.deleteOutageAssignment
);
var outageAssignmentRoutes = router8;

// src/app/modules/technician/technician.route.ts
var import_express9 = require("express");

// src/app/modules/technician/technician.validation.ts
var import_zod9 = require("zod");
var applyTechnicianValidationSchema = import_zod9.z.object({
  user: import_zod9.z.object({
    name: import_zod9.z.string().min(2, "Name must be at least 2 characters"),
    email: import_zod9.z.string().email("Invalid email address")
  }),
  technician: import_zod9.z.object({
    phone: import_zod9.z.string().min(11, "Phone number must be at least 11 characters"),
    employeeId: import_zod9.z.string().min(2, "Employee ID must be at least 2 characters"),
    skills: import_zod9.z.string().optional(),
    experienceYears: import_zod9.z.number().int().min(0).default(0),
    technicianFee: import_zod9.z.number().min(0).optional(),
    zoneId: import_zod9.z.string().uuid().optional()
  })
});
var updateTechnicianValidationSchema = import_zod9.z.object({
  body: import_zod9.z.object({
    phone: import_zod9.z.string().min(11).max(20).optional(),
    employeeId: import_zod9.z.string().min(2).max(50).optional(),
    skills: import_zod9.z.string().max(500).optional(),
    experienceYears: import_zod9.z.number().int().min(0).max(60).optional(),
    resume: import_zod9.z.string().optional(),
    resumePublicId: import_zod9.z.string().optional(),
    additionalFiles: import_zod9.z.union([import_zod9.z.record(import_zod9.z.string(), import_zod9.z.unknown()), import_zod9.z.array(import_zod9.z.unknown())]).optional(),
    technicianFee: import_zod9.z.number().min(0).optional(),
    zoneId: import_zod9.z.string().uuid().nullable().optional()
  })
});
var updateTechnicianStatusValidationSchema = import_zod9.z.object({
  body: import_zod9.z.object({
    status: import_zod9.z.enum(TechnicianStatus)
  })
});
var updateTechnicianVerificationValidationSchema = import_zod9.z.object({
  body: import_zod9.z.object({
    verificationStatus: import_zod9.z.enum(TechnicianVerificationStatus),
    rejectionReason: import_zod9.z.string().max(500).optional()
  })
});
var rejectTechnicianValidationSchema = import_zod9.z.object({
  body: import_zod9.z.object({
    rejectionReason: import_zod9.z.string().min(5, "Rejection reason must be at least 5 characters").max(500, "Rejection reason must not exceed 500 characters")
  })
});

// src/app/modules/technician/technician.controller.ts
var import_http_status20 = __toESM(require("http-status"), 1);

// src/app/modules/technician/technician.service.ts
var import_http_status19 = __toESM(require("http-status"), 1);
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var import_ejs2 = __toESM(require("ejs"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_crypto2 = __toESM(require("crypto"), 1);
var uploadFileToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "gridcare/technicians"
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (!result) {
          return reject(
            new AppError(
              import_http_status19.default.INTERNAL_SERVER_ERROR,
              "No result returned from Cloudinary"
            )
          );
        }
        resolve(result);
      }
    );
    uploadStream.end(file.buffer);
  });
};
var applyAsTechnicianIntoDB = async (payload, resume, additionalFiles) => {
  if (!payload?.user) {
    throw new AppError(
      import_http_status19.default.BAD_REQUEST,
      "User information is required"
    );
  }
  if (!payload?.technician) {
    throw new AppError(
      import_http_status19.default.BAD_REQUEST,
      "Technician information is required"
    );
  }
  if (!payload.user.name?.trim()) {
    throw new AppError(import_http_status19.default.BAD_REQUEST, "Name is required");
  }
  if (!payload.user.email?.trim()) {
    throw new AppError(import_http_status19.default.BAD_REQUEST, "Email is required");
  }
  if (!resume) {
    throw new AppError(import_http_status19.default.BAD_REQUEST, "Resume is required");
  }
  const allowedResumeMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  const allowedResumeExtensions = [".pdf", ".doc", ".docx"];
  const resumeExtension = import_path3.default.extname(resume.originalname).toLowerCase();
  const isValidResume = allowedResumeMimeTypes.includes(resume.mimetype) || allowedResumeExtensions.includes(resumeExtension);
  if (!isValidResume) {
    throw new AppError(
      import_http_status19.default.BAD_REQUEST,
      "Resume must be a PDF, DOC, or DOCX file"
    );
  }
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.user.email
    }
  });
  if (existingUser) {
    throw new AppError(
      import_http_status19.default.CONFLICT,
      "User already exists with this email"
    );
  }
  const existingPhone = await prisma.technician.findUnique({
    where: {
      phone: payload.technician.phone
    }
  });
  if (existingPhone) {
    throw new AppError(
      import_http_status19.default.CONFLICT,
      "Technician already exists with this phone number"
    );
  }
  const existingEmployeeId = await prisma.technician.findUnique({
    where: {
      employeeId: payload.technician.employeeId
    }
  });
  if (existingEmployeeId) {
    throw new AppError(
      import_http_status19.default.CONFLICT,
      "Technician already exists with this employee ID"
    );
  }
  let resumeUploadResult = null;
  const additionalFilesUploadResults = [];
  try {
    resumeUploadResult = await uploadFileToCloudinary(resume);
    for (const file of additionalFiles) {
      const uploadedFile = await uploadFileToCloudinary(file);
      additionalFilesUploadResults.push(uploadedFile);
    }
  } catch (error) {
    console.error("Technician file upload failed:", error);
    const uploadedFiles = [
      ...resumeUploadResult ? [resumeUploadResult] : [],
      ...additionalFilesUploadResults
    ];
    await Promise.allSettled(
      uploadedFiles.map(
        (file) => cloudinary.uploader.destroy(file.public_id, {
          resource_type: file.resource_type
        })
      )
    );
    throw new AppError(
      import_http_status19.default.INTERNAL_SERVER_ERROR,
      "Failed to upload technician documents"
    );
  }
  if (!resumeUploadResult) {
    throw new AppError(
      import_http_status19.default.INTERNAL_SERVER_ERROR,
      "Resume upload failed"
    );
  }
  const randomTechnicianPassword = import_crypto2.default.randomBytes(8).toString("hex");
  const hashedPassword = await import_bcryptjs2.default.hash(
    randomTechnicianPassword,
    Number(config_default.bcrypt_salt_rounds)
  );
  let technicianApplication;
  try {
    technicianApplication = await prisma.user.create({
      data: {
        name: payload.user.name.trim(),
        email: payload.user.email.trim().toLowerCase(),
        password: hashedPassword,
        role: UserRole.TECHNICIAN,
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
            additionalFiles: additionalFilesUploadResults.map(
              (file) => ({
                url: file.secure_url,
                publicId: file.public_id,
                resourceType: file.resource_type,
                originalFilename: file.original_filename
              })
            ),
            verificationStatus: TechnicianVerificationStatus.PENDING,
            status: TechnicianStatus.AVAILABLE
          }
        }
      },
      include: {
        technician: true
      }
    });
  } catch (error) {
    console.error("Technician database creation failed:", error);
    const uploadedFiles = [
      resumeUploadResult,
      ...additionalFilesUploadResults
    ];
    await Promise.allSettled(
      uploadedFiles.map(
        (file) => cloudinary.uploader.destroy(file.public_id, {
          resource_type: file.resource_type
        })
      )
    );
    if (error instanceof prismaNamespace_exports.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new AppError(
        import_http_status19.default.CONFLICT,
        "Email, phone, or employee ID already exists"
      );
    }
    throw new AppError(
      import_http_status19.default.INTERNAL_SERVER_ERROR,
      "Failed to create technician application"
    );
  }
  const expirationSeconds = 60 * 60;
  const otpKey = `technician-application-otp:${payload.user.email.trim().toLowerCase()}`;
  const otpValue = import_crypto2.default.randomInt(1e5, 1e6).toString();
  try {
    await redisClient.set(otpKey, otpValue, {
      expiration: {
        type: "EX",
        value: expirationSeconds
      }
    });
  } catch (error) {
    console.error("Redis OTP save failed:", error);
    try {
      await prisma.user.delete({
        where: {
          id: technicianApplication.id
        }
      });
    } catch (deleteError) {
      console.error("User rollback failed:", deleteError);
    }
    await Promise.allSettled(
      [resumeUploadResult, ...additionalFilesUploadResults].map(
        (file) => cloudinary.uploader.destroy(file.public_id, {
          resource_type: file.resource_type
        })
      )
    );
    throw new AppError(
      import_http_status19.default.INTERNAL_SERVER_ERROR,
      "Failed to generate verification OTP"
    );
  }
  const templatePath = import_path3.default.join(
    process.cwd(),
    "src/app/templates/registration-user-otp.ejs"
  );
  const templateData = {
    name: technicianApplication.name,
    email: technicianApplication.email,
    otp: otpValue,
    expirationMinutes: expirationSeconds / 60
  };
  let html;
  try {
    html = await import_ejs2.default.renderFile(templatePath, templateData);
  } catch (error) {
    console.error("Email template rendering failed:", error);
    await redisClient.del(otpKey);
    try {
      await prisma.user.delete({
        where: {
          id: technicianApplication.id
        }
      });
    } catch (deleteError) {
      console.error("User rollback failed:", deleteError);
    }
    await Promise.allSettled(
      [resumeUploadResult, ...additionalFilesUploadResults].map(
        (file) => cloudinary.uploader.destroy(file.public_id, {
          resource_type: file.resource_type
        })
      )
    );
    throw new AppError(
      import_http_status19.default.INTERNAL_SERVER_ERROR,
      "Failed to prepare verification email"
    );
  }
  try {
    await transporter.sendMail({
      from: config_default.email_sender,
      to: technicianApplication.email,
      subject: "GridCare Technician Application - Email Verification",
      html
    });
  } catch (error) {
    console.error("Technician verification email failed:", error);
    await redisClient.del(otpKey);
    try {
      await prisma.user.delete({
        where: {
          id: technicianApplication.id
        }
      });
    } catch (deleteError) {
      console.error("User rollback failed:", deleteError);
    }
    await Promise.allSettled(
      [resumeUploadResult, ...additionalFilesUploadResults].map(
        (file) => cloudinary.uploader.destroy(file.public_id, {
          resource_type: file.resource_type
        })
      )
    );
    throw new AppError(
      import_http_status19.default.INTERNAL_SERVER_ERROR,
      "Failed to send verification email"
    );
  }
  return {
    id: technicianApplication.id,
    name: technicianApplication.name,
    email: technicianApplication.email,
    role: technicianApplication.role,
    technician: technicianApplication.technician,
    // Development only
    temporaryPassword: randomTechnicianPassword
  };
};
var verifyTechnicianEmailIntoDB = async (payload) => {
  const otp = payload.otp;
  const email = payload.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email, role: UserRole.TECHNICIAN }
  });
  if (!existingUser) {
    throw new AppError(
      import_http_status19.default.NOT_FOUND,
      "Technician Application Not Found. Please Apply Again."
    );
  }
  if (existingUser.emailVerified) {
    throw new AppError(import_http_status19.default.CONFLICT, "Email Already Verified");
  }
  const otpKey = `technician-application-otp:${email}`;
  const redisOtp = await redisClient.get(otpKey);
  if (!redisOtp) {
    throw new AppError(
      import_http_status19.default.BAD_REQUEST,
      "OTP Expired. Your Application Window Has Closed, Please Apply Again."
    );
  }
  if (redisOtp !== otp) {
    throw new AppError(import_http_status19.default.BAD_REQUEST, "OTP Does Not Match");
  }
  await redisClient.del(otpKey);
  const verifiedUser = await prisma.user.update({
    where: { id: existingUser.id },
    data: { emailVerified: true },
    omit: { password: true },
    include: { technician: true }
  });
  return verifiedUser;
};
var approveTechnicianIntoDB = async (payload, reviewer) => {
  const { technicianId, verificationStatus, rejectionReason } = payload;
  const existingTechnician = await prisma.technician.findUnique({
    where: {
      id: technicianId
    },
    include: {
      user: true
    }
  });
  if (!existingTechnician) {
    throw new AppError(
      import_http_status19.default.NOT_FOUND,
      "Technician Application Not Found"
    );
  }
  if (!existingTechnician.user.emailVerified) {
    throw new AppError(
      import_http_status19.default.BAD_REQUEST,
      "Technician Has Not Verified Their Email Yet. Application Cannot Be Reviewed."
    );
  }
  if (existingTechnician.verificationStatus !== TechnicianVerificationStatus.PENDING) {
    throw new AppError(
      import_http_status19.default.CONFLICT,
      `Technician Application Has Already Been ${existingTechnician.verificationStatus.toLowerCase()}`
    );
  }
  if (verificationStatus === TechnicianVerificationStatus.REJECTED && !rejectionReason) {
    throw new AppError(
      import_http_status19.default.BAD_REQUEST,
      "Rejection Reason Is Required When Rejecting A Technician Application"
    );
  }
  const updatedTechnician = await prisma.technician.update({
    where: {
      id: technicianId
    },
    data: {
      verificationStatus,
      rejectionReason: verificationStatus === TechnicianVerificationStatus.REJECTED ? rejectionReason : null
    },
    include: {
      user: true
    }
  });
  const isApproved = verificationStatus === TechnicianVerificationStatus.APPROVED;
  const templatePath = import_path3.default.join(
    process.cwd(),
    `src/app/templates/${isApproved ? "technician-application-approved.ejs" : "technician-application-rejected.ejs"}`
  );
  const templateData = {
    name: updatedTechnician.user.name,
    reason: updatedTechnician.rejectionReason
  };
  const html = await import_ejs2.default.renderFile(templatePath, templateData);
  await transporter.sendMail({
    from: config_default.email_sender,
    to: updatedTechnician.user.email,
    subject: isApproved ? "Your Technician Application Has Been Approved" : "Your Technician Application Has Been Rejected",
    html
  });
  return updatedTechnician;
};
var getAllTechniciansIntoDB = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const andConditions = [];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          phone: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        },
        {
          employeeId: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        },
        {
          skills: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        },
        {
          user: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive"
            }
          }
        },
        {
          user: {
            email: {
              contains: query.searchTerm,
              mode: "insensitive"
            }
          }
        }
      ]
    });
  }
  if (query.phone) {
    andConditions.push({
      phone: {
        contains: query.phone,
        mode: "insensitive"
      }
    });
  }
  if (query.employeeId) {
    andConditions.push({
      employeeId: {
        equals: query.employeeId,
        mode: "insensitive"
      }
    });
  }
  if (query.skills) {
    andConditions.push({
      skills: {
        contains: query.skills,
        mode: "insensitive"
      }
    });
  }
  if (query.verificationStatus) {
    andConditions.push({
      verificationStatus: query.verificationStatus
    });
  }
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  andConditions.push({
    deletedAt: null
  });
  const allTechnicians = await prisma.technician.findMany({
    where: {
      AND: andConditions
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      user: {
        omit: {
          password: true
        }
      }
    }
  });
  const totalTechnicianCount = await prisma.technician.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: allTechnicians,
    meta: {
      page,
      limit,
      total: totalTechnicianCount,
      totalPages: Math.ceil(totalTechnicianCount / limit)
    }
  };
};
var updateTechnicianProfileIntoDB = async (payload, user) => {
  const existingTechnician = await prisma.technician.findUnique({
    where: { userId: user.id }
  });
  if (!existingTechnician) {
    throw new AppError(import_http_status19.default.NOT_FOUND, "Doctor Profile Not Found");
  }
  const updatedTechnician = await prisma.technician.update({
    where: { id: existingTechnician.id },
    data: payload
  });
  return updatedTechnician;
};
var getAvailableTechnicianByTodaysScheduleIntoDB = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const andConditions = [
    {
      verificationStatus: TechnicianVerificationStatus.APPROVED
    },
    {
      status: TechnicianStatus.AVAILABLE
    },
    {
      deletedAt: null
    }
  ];
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          phone: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        },
        {
          employeeId: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        },
        {
          skills: {
            contains: query.searchTerm,
            mode: "insensitive"
          }
        },
        {
          user: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive"
            }
          }
        },
        {
          user: {
            email: {
              contains: query.searchTerm,
              mode: "insensitive"
            }
          }
        }
      ]
    });
  }
  if (query.skills) {
    andConditions.push({
      skills: {
        contains: query.skills,
        mode: "insensitive"
      }
    });
  }
  if (query.zoneId) {
    andConditions.push({
      zoneId: query.zoneId
    });
  }
  const availableTechnicians = await prisma.technician.findMany({
    where: {
      AND: andConditions
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
    },
    include: {
      user: {
        omit: {
          password: true
        }
      }
    }
  });
  const totalAvailableTechnicianCount = await prisma.technician.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: availableTechnicians,
    meta: {
      page,
      limit,
      total: totalAvailableTechnicianCount,
      totalPages: Math.ceil(totalAvailableTechnicianCount / limit)
    }
  };
};
var getAllTechniciansListPublicIntoDB = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const safeLimit = Number.isInteger(limit) && limit > 0 ? Math.min(limit, 100) : 10;
  const safePage = Number.isInteger(page) && page > 0 ? page : 1;
  const safeSkip = (safePage - 1) * safeLimit;
  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "experienceYears",
    "technicianFee",
    "employeeId",
    "phone"
  ];
  const sortBy = allowedSortFields.includes(query.sortBy || "") ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
  const andConditions = [
    {
      verificationStatus: TechnicianVerificationStatus.APPROVED
    },
    {
      status: TechnicianStatus.AVAILABLE
    },
    {
      deletedAt: null
    }
  ];
  if (query.searchTerm?.trim()) {
    const searchTerm = query.searchTerm.trim();
    andConditions.push({
      OR: [
        {
          phone: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          employeeId: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          skills: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          user: {
            name: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        },
        {
          user: {
            email: {
              contains: searchTerm,
              mode: "insensitive"
            }
          }
        }
      ]
    });
  }
  if (query.skills?.trim()) {
    andConditions.push({
      skills: {
        contains: query.skills.trim(),
        mode: "insensitive"
      }
    });
  }
  if (query.zoneId?.trim()) {
    andConditions.push({
      zoneId: query.zoneId.trim()
    });
  }
  const [allTechnicians, totalTechnicianCount] = await Promise.all([
    prisma.technician.findMany({
      where: {
        AND: andConditions
      },
      take: safeLimit,
      skip: safeSkip,
      orderBy: {
        [sortBy]: sortOrder
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
            imageUrl: true
          }
        }
      }
    }),
    prisma.technician.count({
      where: {
        AND: andConditions
      }
    })
  ]);
  return {
    data: allTechnicians,
    meta: {
      page: safePage,
      limit: safeLimit,
      total: totalTechnicianCount,
      totalPages: Math.ceil(totalTechnicianCount / safeLimit)
    }
  };
};
var getSingleTechnicianPublicProfileIntoDB = async (technicianId) => {
  if (!technicianId) {
    throw new AppError(import_http_status19.default.BAD_REQUEST, "Technician ID is required");
  }
  const technician = await prisma.technician.findFirst({
    where: {
      id: technicianId,
      deletedAt: null,
      verificationStatus: TechnicianVerificationStatus.APPROVED,
      status: TechnicianStatus.AVAILABLE
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
          imageUrl: true
        }
      }
    }
  });
  if (!technician) {
    throw new AppError(import_http_status19.default.NOT_FOUND, "Technician Not Found");
  }
  return technician;
};
var technicianServices = {
  applyAsTechnicianIntoDB,
  verifyTechnicianEmailIntoDB,
  approveTechnicianIntoDB,
  getAllTechniciansIntoDB,
  updateTechnicianProfileIntoDB,
  getAvailableTechnicianByTodaysScheduleIntoDB,
  getAllTechniciansListPublicIntoDB,
  getSingleTechnicianPublicProfileIntoDB
};

// src/app/modules/technician/technician.controller.ts
var applyAsTechnician = catchAsync_default(async (req, res) => {
  const files = req.files;
  const resume = files?.["resume"]?.[0] || null;
  const additionalFiles = files?.["additionalFiles"] || [];
  if (!req.body.data) {
    throw new AppError(
      import_http_status20.default.BAD_REQUEST,
      "Technician application data is required"
    );
  }
  let parsedData;
  try {
    parsedData = JSON.parse(req.body.data);
  } catch (error) {
    throw new AppError(import_http_status20.default.BAD_REQUEST, "Invalid JSON data");
  }
  const zodValidationResult = applyTechnicianValidationSchema.safeParse(parsedData);
  if (!zodValidationResult.success) {
    throw new AppError(
      import_http_status20.default.BAD_REQUEST,
      zodValidationResult.error.issues[0].message
    );
  }
  const payload = zodValidationResult.data;
  const result = await technicianServices.applyAsTechnicianIntoDB(
    payload,
    resume,
    additionalFiles
  );
  sendResponse(res, {
    statusCode: import_http_status20.default.OK,
    success: true,
    message: "Applied As Technician Successful!!",
    data: result
  });
});
var verifyTechnicianEmail = catchAsync_default(
  async (req, res) => {
    const payload = req.body;
    const result = await technicianServices.verifyTechnicianEmailIntoDB(payload);
    sendResponse(res, {
      statusCode: import_http_status20.default.OK,
      success: true,
      message: "Technician Email Verified Successfully!!",
      data: result
    });
  }
);
var approveTechnician = catchAsync_default(async (req, res) => {
  const payload = req.body;
  const user = req.user;
  const result = await technicianServices.approveTechnicianIntoDB(
    payload,
    user
  );
  sendResponse(res, {
    statusCode: import_http_status20.default.OK,
    success: true,
    message: "Technician Email Approved Successfully!!",
    data: result
  });
});
var getAllTechnicians = catchAsync_default(async (req, res) => {
  const query = req.query;
  const { data, meta } = await technicianServices.getAllTechniciansIntoDB(query);
  sendResponse(res, {
    statusCode: import_http_status20.default.OK,
    success: true,
    message: "All Technicians Retrieved Successfully!!",
    data,
    meta
  });
});
var updateTechnicianProfile = catchAsync_default(
  async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const result = await technicianServices.updateTechnicianProfileIntoDB(
      payload,
      user
    );
    sendResponse(res, {
      statusCode: import_http_status20.default.OK,
      success: true,
      message: "Technician Profile Updated Successfully!!",
      data: result
    });
  }
);
var getAvailableTechnicianByTodaysSchedule = catchAsync_default(
  async (req, res) => {
    const query = req.query;
    const { data, meta } = await technicianServices.getAvailableTechnicianByTodaysScheduleIntoDB(
      query
    );
    sendResponse(res, {
      statusCode: import_http_status20.default.OK,
      success: true,
      message: "Today's Available Technician Retrieved Successfully!",
      data,
      meta
    });
  }
);
var getAllTechniciansListPublic = catchAsync_default(
  async (req, res) => {
    const query = req.query;
    const { data, meta } = await technicianServices.getAllTechniciansListPublicIntoDB(query);
    sendResponse(res, {
      statusCode: import_http_status20.default.OK,
      success: true,
      message: "Technician Retrieved Successfully!!",
      data,
      meta
    });
  }
);
var getSingleTechnicianPublicProfile = catchAsync_default(
  async (req, res) => {
    const { technicianId } = req.params;
    if (!technicianId) {
      throw new AppError(
        import_http_status20.default.BAD_REQUEST,
        "Technician ID is required"
      );
    }
    const result = await technicianServices.getSingleTechnicianPublicProfileIntoDB(
      technicianId
    );
    sendResponse(res, {
      statusCode: import_http_status20.default.OK,
      success: true,
      message: "Technician public profile retrieved successfully",
      data: result
    });
  }
);
var technicianControllers = {
  applyAsTechnician,
  verifyTechnicianEmail,
  approveTechnician,
  getAllTechnicians,
  updateTechnicianProfile,
  getAvailableTechnicianByTodaysSchedule,
  getAllTechniciansListPublic,
  getSingleTechnicianPublicProfile
};

// src/app/modules/technician/technician.route.ts
var router9 = (0, import_express9.Router)();
router9.post(
  "/apply-as-technician",
  upload.fields([
    {
      name: "resume",
      maxCount: 1
    },
    {
      name: "additionalFiles",
      maxCount: 5
    }
  ]),
  technicianControllers.applyAsTechnician
);
router9.post(
  "/apply-as-technician/verify-email",
  technicianControllers.verifyTechnicianEmail
);
router9.post(
  "/approve-technician",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  technicianControllers.approveTechnician
);
router9.get(
  "/all-technician",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  technicianControllers.getAllTechnicians
);
router9.patch(
  "/update-my-profile",
  auth(UserRole.TECHNICIAN),
  validateRequest(updateTechnicianVerificationValidationSchema),
  technicianControllers.updateTechnicianProfile
);
router9.get(
  "/public/available-today",
  technicianControllers.getAvailableTechnicianByTodaysSchedule
);
router9.get(
  "/public/all-technician",
  technicianControllers.getAllTechniciansListPublic
);
router9.get(
  "/public/:technicianId",
  technicianControllers.getSingleTechnicianPublicProfile
);
var technicianRoutes = router9;

// src/app/modules/notifications/notification.route.ts
var import_express10 = require("express");

// src/app/modules/notifications/notification.controller.ts
var import_http_status22 = __toESM(require("http-status"), 1);

// src/app/modules/notifications/notification.service.ts
var import_http_status21 = __toESM(require("http-status"), 1);
var createNotificationIntoDB = async (payload) => {
  const { userId, title, message } = payload;
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new AppError(import_http_status21.default.NOT_FOUND, "User not found");
  }
  const notification = await prisma.notification.create({
    data: {
      userId,
      title,
      message
    }
  });
  return notification;
};
var getMyNotificationsFromDB = async (userId, query) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;
  const notifications = await prisma.notification.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    },
    skip,
    take: limit
  });
  const total = await prisma.notification.count({
    where: {
      userId
    }
  });
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: notifications
  };
};
var getMyUnreadNotificationsFromDB = async (userId) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
      isRead: false
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return notifications;
};
var getAllNotificationsFromDB = async (query) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm?.trim();
  const where = {
    ...searchTerm ? {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          message: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      ]
    } : {}
  };
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    }),
    prisma.notification.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: notifications
  };
};
var getSingleNotificationFromDB = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId
    }
  });
  if (!notification) {
    throw new AppError(import_http_status21.default.NOT_FOUND, "Notification not found");
  }
  return notification;
};
var markNotificationAsReadIntoDB = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId
    }
  });
  if (!notification) {
    throw new AppError(import_http_status21.default.NOT_FOUND, "Notification not found");
  }
  const result = await prisma.notification.update({
    where: {
      id: notificationId
    },
    data: {
      isRead: true
    }
  });
  return result;
};
var markAllNotificationsAsReadIntoDB = async (userId) => {
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false
    },
    data: {
      isRead: true
    }
  });
  return {
    count: result.count
  };
};
var deleteNotificationFromDB = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId
    }
  });
  if (!notification) {
    throw new AppError(import_http_status21.default.NOT_FOUND, "Notification not found");
  }
  await prisma.notification.delete({
    where: {
      id: notificationId
    }
  });
  return null;
};
var deleteAllReadNotificationsFromDB = async (userId) => {
  const result = await prisma.notification.deleteMany({
    where: {
      userId,
      isRead: true
    }
  });
  return {
    count: result.count
  };
};
var notificationServices = {
  createNotificationIntoDB,
  getMyNotificationsFromDB,
  getMyUnreadNotificationsFromDB,
  getAllNotificationsFromDB,
  getSingleNotificationFromDB,
  markNotificationAsReadIntoDB,
  markAllNotificationsAsReadIntoDB,
  deleteNotificationFromDB,
  deleteAllReadNotificationsFromDB
};

// src/app/modules/notifications/notification.controller.ts
var createNotification = catchAsync_default(async (req, res) => {
  const result = await notificationServices.createNotificationIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status22.default.CREATED,
    success: true,
    message: "Notification Created Successfully!",
    data: result
  });
});
var getMyNotifications = catchAsync_default(async (req, res) => {
  const userId = req.user?.id;
  const result = await notificationServices.getMyNotificationsFromDB(
    userId,
    req.query
  );
  sendResponse(res, {
    statusCode: import_http_status22.default.OK,
    success: true,
    message: "All Notifications Retrieved Successfully!",
    data: result.data
  });
});
var getMyUnreadNotifications = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const result = await notificationServices.getMyUnreadNotificationsFromDB(
      userId
    );
    sendResponse(res, {
      statusCode: import_http_status22.default.OK,
      success: true,
      message: "Unread Notifications Retrieved Successfully!",
      data: result
    });
  }
);
var getAllNotifications = catchAsync_default(async (req, res) => {
  const result = await notificationServices.getAllNotificationsFromDB(
    req.query
  );
  sendResponse(res, {
    statusCode: import_http_status22.default.OK,
    success: true,
    message: "All Notifications Retrieved Successfully!",
    data: result.data
  });
});
var getSingleNotification = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await notificationServices.getSingleNotificationFromDB(
      userId,
      id
    );
    sendResponse(res, {
      statusCode: import_http_status22.default.OK,
      success: true,
      message: "Single Notification Retrieved Successfully!",
      data: result
    });
  }
);
var markNotificationAsRead = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await notificationServices.markNotificationAsReadIntoDB(
      userId,
      id
    );
    sendResponse(res, {
      statusCode: import_http_status22.default.OK,
      success: true,
      message: "Notification Marked As Read!",
      data: result
    });
  }
);
var markAllNotificationsAsRead = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const result = await notificationServices.markAllNotificationsAsReadIntoDB(
      userId
    );
    sendResponse(res, {
      statusCode: import_http_status22.default.OK,
      success: true,
      message: "All Notifications Marked As Read!",
      data: result
    });
  }
);
var deleteNotification = catchAsync_default(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.params;
  await notificationServices.deleteNotificationFromDB(
    userId,
    id
  );
  sendResponse(res, {
    statusCode: import_http_status22.default.OK,
    success: true,
    message: "Notification Deleted Successfully!",
    data: null
  });
});
var deleteAllReadNotifications = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const result = await notificationServices.deleteAllReadNotificationsFromDB(
      userId
    );
    sendResponse(res, {
      statusCode: import_http_status22.default.OK,
      success: true,
      message: "All Read Notifications Deleted Successfully!",
      data: result
    });
  }
);
var notificationControllers = {
  createNotification,
  getMyNotifications,
  getMyUnreadNotifications,
  getSingleNotification,
  getAllNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  deleteAllReadNotifications
};

// src/app/modules/notifications/notification.validation.ts
var import_zod10 = require("zod");
var createNotificationValidationSchema = import_zod10.z.object({
  userId: import_zod10.z.string().uuid("Invalid User ID"),
  title: import_zod10.z.string({ message: "Title is required" }).min(3, "Title must be at least 3 characters").max(200, "Title cannot exceed 200 characters"),
  message: import_zod10.z.string({ message: "Message is required" }).min(3, "Message must be at least 3 characters").max(1e3, "Message cannot exceed 1000 characters")
});
var NotificationValidation = {
  createNotificationValidationSchema
};

// src/app/modules/notifications/notification.route.ts
var router10 = (0, import_express10.Router)();
router10.post(
  "/",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.CUSTOMER
  ),
  validateRequest(NotificationValidation.createNotificationValidationSchema),
  notificationControllers.createNotification
);
router10.get(
  "/my",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.CUSTOMER
  ),
  notificationControllers.getMyNotifications
);
router10.get(
  "/my/unread",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.CUSTOMER
  ),
  notificationControllers.getMyUnreadNotifications
);
router10.patch(
  "/my/read-all",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.CUSTOMER
  ),
  notificationControllers.markAllNotificationsAsRead
);
router10.delete(
  "/my/read",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.CUSTOMER
  ),
  notificationControllers.deleteAllReadNotifications
);
router10.patch(
  "/:id/read",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.CUSTOMER
  ),
  notificationControllers.markNotificationAsRead
);
router10.get(
  "/",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.CUSTOMER
  ),
  notificationControllers.getAllNotifications
);
router10.get(
  "/:id",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.CUSTOMER
  ),
  notificationControllers.getSingleNotification
);
router10.delete(
  "/:id",
  auth(
    UserRole.ADMIN,
    UserRole.OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.CUSTOMER
  ),
  notificationControllers.deleteNotification
);
var notificationRoutes = router10;

// src/app/modules/auditLog/auditLog.route.ts
var import_express11 = require("express");

// src/app/modules/auditLog/auditLog.controller.ts
var import_http_status24 = __toESM(require("http-status"), 1);

// src/app/modules/auditLog/auditLog.service.ts
var import_http_status23 = __toESM(require("http-status"), 1);
var createAuditLogIntoDB = async (actorId, payload) => {
  const { action, entity, entityId, oldValue, newValue, ipAddress } = payload;
  const actor = await prisma.user.findUnique({
    where: {
      id: actorId
    }
  });
  if (!actor) {
    throw new AppError(import_http_status23.default.NOT_FOUND, "Actor/User not found");
  }
  const result = await prisma.auditLog.create({
    data: {
      actorId,
      action,
      entity,
      entityId,
      oldValue,
      newValue,
      ipAddress
    },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
  return result;
};
var getAllAuditLogsFromDB = async (query) => {
  const page = query.page ? Number(query.page) : 1;
  const limit = query.limit ? Number(query.limit) : 10;
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm?.trim();
  const where = {};
  if (searchTerm) {
    where.OR = [
      {
        action: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        entity: {
          contains: searchTerm,
          mode: "insensitive"
        }
      }
    ];
  }
  if (query.actorId) {
    where.actorId = query.actorId;
  }
  if (query.entity) {
    where.entity = query.entity;
  }
  if (query.entityId) {
    where.entityId = query.entityId;
  }
  if (query.action) {
    where.action = query.action;
  }
  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    }),
    prisma.auditLog.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: logs
  };
};
var getSingleAuditLogFromDB = async (id) => {
  const result = await prisma.auditLog.findUnique({
    where: {
      id
    },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
  if (!result) {
    throw new AppError(import_http_status23.default.NOT_FOUND, "Audit Log not found");
  }
  return result;
};
var getAuditLogsByEntityFromDB = async (entity, entityId) => {
  const result = await prisma.auditLog.findMany({
    where: {
      entity,
      entityId
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
  return result;
};
var deleteAuditLogFromDB = async (id) => {
  const auditLog = await prisma.auditLog.findUnique({
    where: {
      id
    }
  });
  if (!auditLog) {
    throw new AppError(import_http_status23.default.NOT_FOUND, "Audit Log not found");
  }
  await prisma.auditLog.delete({
    where: {
      id
    }
  });
  return null;
};
var auditLogServices = {
  createAuditLogIntoDB,
  getAllAuditLogsFromDB,
  getSingleAuditLogFromDB,
  getAuditLogsByEntityFromDB,
  deleteAuditLogFromDB
};

// src/app/modules/auditLog/auditLog.controller.ts
var createAuditLog = catchAsync_default(async (req, res) => {
  const actorId = req.user?.id;
  const result = await auditLogServices.createAuditLogIntoDB(
    actorId,
    {
      ...req.body,
      ipAddress: req.body.ipAddress || req.ip || void 0
    }
  );
  sendResponse(res, {
    statusCode: import_http_status24.default.CREATED,
    success: true,
    message: "Audit Log Created Successfully!",
    data: result
  });
});
var getAllAuditLogs = catchAsync_default(async (req, res) => {
  const query = req.query;
  const result = await auditLogServices.getAllAuditLogsFromDB(query);
  sendResponse(res, {
    statusCode: import_http_status24.default.OK,
    success: true,
    message: "All Audit Logs Retrieved Successfully!",
    data: result.data
  });
});
var getSingleAuditLog = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  const result = await auditLogServices.getSingleAuditLogFromDB(id);
  sendResponse(res, {
    statusCode: import_http_status24.default.OK,
    success: true,
    message: "Single Audit Log Retrieved Successfully!",
    data: result
  });
});
var getAuditLogsByEntity = catchAsync_default(async (req, res) => {
  const { entity, entityId } = req.params;
  const result = await auditLogServices.getAuditLogsByEntityFromDB(
    entity,
    entityId
  );
  sendResponse(res, {
    statusCode: import_http_status24.default.OK,
    success: true,
    message: "Entity Audit Logs Retrieved Successfully!",
    data: result
  });
});
var deleteAuditLog = catchAsync_default(async (req, res) => {
  const { id } = req.params;
  await auditLogServices.deleteAuditLogFromDB(id);
  sendResponse(res, {
    statusCode: import_http_status24.default.OK,
    success: true,
    message: "Audit Log Deleted Successfully!",
    data: null
  });
});
var auditLogControllers = {
  createAuditLog,
  getAllAuditLogs,
  getSingleAuditLog,
  getAuditLogsByEntity,
  deleteAuditLog
};

// src/app/modules/auditLog/auditLog.validation.ts
var import_zod11 = require("zod");
var createAuditLogValidationSchema = import_zod11.z.object({
  action: import_zod11.z.string({ message: "Action is required" }).min(2, "Action must be at least 2 characters").max(100, "Action cannot exceed 100 characters"),
  entity: import_zod11.z.string({ message: "Entity is required" }).min(2, "Entity must be at least 2 characters").max(100, "Entity cannot exceed 100 characters"),
  entityId: import_zod11.z.string({ message: "Entity ID is required" }).uuid("Invalid Entity ID"),
  oldValue: import_zod11.z.unknown().optional(),
  newValue: import_zod11.z.unknown().optional(),
  ipAddress: import_zod11.z.string().max(100, "IP address is invalid").optional()
});
var AuditLogValidation = {
  createAuditLogValidationSchema
};

// src/app/modules/auditLog/auditLog.route.ts
var router11 = (0, import_express11.Router)();
router11.post(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(AuditLogValidation.createAuditLogValidationSchema),
  auditLogControllers.createAuditLog
);
router11.get(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  auditLogControllers.getAllAuditLogs
);
router11.get(
  "/entity/:entityId",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  auditLogControllers.getAuditLogsByEntity
);
router11.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  auditLogControllers.getSingleAuditLog
);
router11.delete("/:id", auth(UserRole.ADMIN), auditLogControllers.deleteAuditLog);
var auditLogRoutes = router11;

// src/app/modules/subscriptions/subscription.route.ts
var import_express12 = require("express");

// src/app/modules/subscriptions/subscription.controller.ts
var import_http_status26 = __toESM(require("http-status"), 1);

// src/app/modules/subscriptions/subscription.service.ts
var import_http_status25 = __toESM(require("http-status"), 1);
var createSubscriptionPlanIntoDB = async (payload) => {
  const existingPlan = await prisma.subscriptionPlan.findFirst({
    where: {
      name: payload.name,
      deletedAt: null
    }
  });
  if (existingPlan) {
    throw new AppError(
      import_http_status25.default.CONFLICT,
      "Subscription plan with this name already exists"
    );
  }
  const result = await prisma.subscriptionPlan.create({
    data: {
      name: payload.name,
      description: payload.description,
      price: payload.price,
      durationDays: payload.durationDays,
      status: payload.status ?? SubscriptionPlanStatus.ACTIVE
    }
  });
  return result;
};
var getAllSubscriptionPlansFromDB = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = query.search?.trim();
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "name",
    "price",
    "durationDays"
  ];
  const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";
  const where = {
    deletedAt: null,
    ...search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    },
    ...query.status && {
      status: query.status
    }
  };
  const [data, total] = await prisma.$transaction([
    prisma.subscriptionPlan.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [finalSortBy]: sortOrder
      },
      include: {
        _count: {
          select: {
            subscriptions: true
          }
        }
      }
    }),
    prisma.subscriptionPlan.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data
  };
};
var getSingleSubscriptionPlanFromDB = async (id) => {
  const result = await prisma.subscriptionPlan.findFirst({
    where: {
      id,
      deletedAt: null
    },
    include: {
      _count: {
        select: {
          subscriptions: true
        }
      }
    }
  });
  if (!result) {
    throw new AppError(import_http_status25.default.NOT_FOUND, "Subscription plan not found");
  }
  return result;
};
var updateSubscriptionPlanIntoDB = async (id, payload) => {
  const existingPlan = await prisma.subscriptionPlan.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingPlan) {
    throw new AppError(import_http_status25.default.NOT_FOUND, "Subscription plan not found");
  }
  if (payload.name && payload.name !== existingPlan.name) {
    const duplicatePlan = await prisma.subscriptionPlan.findFirst({
      where: {
        name: payload.name,
        id: {
          not: id
        },
        deletedAt: null
      }
    });
    if (duplicatePlan) {
      throw new AppError(
        import_http_status25.default.CONFLICT,
        "Subscription plan with this name already exists"
      );
    }
  }
  const result = await prisma.subscriptionPlan.update({
    where: {
      id
    },
    data: payload
  });
  return result;
};
var deleteSubscriptionPlanFromDB = async (id) => {
  const existingPlan = await prisma.subscriptionPlan.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingPlan) {
    throw new AppError(import_http_status25.default.NOT_FOUND, "Subscription plan not found");
  }
  const activeSubscriptions = await prisma.subscription.count({
    where: {
      planId: id,
      status: SubscriptionStatus.ACTIVE
    }
  });
  if (activeSubscriptions > 0) {
    throw new AppError(
      import_http_status25.default.BAD_REQUEST,
      "Cannot delete a plan with active subscriptions"
    );
  }
  const result = await prisma.subscriptionPlan.update({
    where: {
      id
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date(),
      status: SubscriptionPlanStatus.INACTIVE
    }
  });
  return result;
};
var createSubscriptionIntoDB = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new AppError(import_http_status25.default.NOT_FOUND, "User not found");
  }
  const plan = await prisma.subscriptionPlan.findFirst({
    where: {
      id: payload.planId,
      status: SubscriptionPlanStatus.ACTIVE,
      deletedAt: null
    }
  });
  if (!plan) {
    throw new AppError(
      import_http_status25.default.NOT_FOUND,
      "Active subscription plan not found"
    );
  }
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      endDate: {
        gt: /* @__PURE__ */ new Date()
      }
    }
  });
  if (activeSubscription) {
    throw new AppError(
      import_http_status25.default.BAD_REQUEST,
      "You already have an active subscription"
    );
  }
  const result = await prisma.subscription.create({
    data: {
      userId,
      planId: plan.id,
      startDate: null,
      endDate: null,
      status: SubscriptionStatus.PENDING
    },
    include: {
      plan: true
    }
  });
  return result;
};
var getMySubscriptionFromDB = async (userId) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: SubscriptionStatus.ACTIVE,
      endDate: {
        gt: /* @__PURE__ */ new Date()
      }
    },
    include: {
      plan: true,
      payments: true
    },
    orderBy: {
      endDate: "desc"
    }
  });
  return subscription;
};
var getMySubscriptionHistoryFromDB = async (userId) => {
  const result = await prisma.subscription.findMany({
    where: {
      userId
    },
    include: {
      plan: true,
      payments: true
    },
    orderBy: {
      createdAt: "desc"
    }
  });
  return result;
};
var cancelSubscriptionIntoDB = async (userId, subscriptionId) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      id: subscriptionId,
      userId,
      status: SubscriptionStatus.ACTIVE
    }
  });
  if (!subscription) {
    throw new AppError(
      import_http_status25.default.NOT_FOUND,
      "Active subscription not found"
    );
  }
  const result = await prisma.subscription.update({
    where: {
      id: subscriptionId
    },
    data: {
      status: SubscriptionStatus.CANCELLED
    }
  });
  return result;
};
var subscriptionServices = {
  createSubscriptionPlanIntoDB,
  getAllSubscriptionPlansFromDB,
  getSingleSubscriptionPlanFromDB,
  updateSubscriptionPlanIntoDB,
  deleteSubscriptionPlanFromDB,
  createSubscriptionIntoDB,
  getMySubscriptionFromDB,
  getMySubscriptionHistoryFromDB,
  cancelSubscriptionIntoDB
};

// src/app/modules/subscriptions/subscription.controller.ts
var createSubscriptionPlan = catchAsync_default(
  async (req, res) => {
    const result = await subscriptionServices.createSubscriptionPlanIntoDB(
      req.body
    );
    sendResponse(res, {
      statusCode: import_http_status26.default.CREATED,
      success: true,
      message: "Subscription plan created successfully",
      data: result
    });
  }
);
var getAllSubscriptionPlans = catchAsync_default(
  async (req, res) => {
    const result = await subscriptionServices.getAllSubscriptionPlansFromDB(
      req.query
    );
    sendResponse(res, {
      statusCode: import_http_status26.default.OK,
      success: true,
      message: "All Subscription plans retrieved successfully",
      data: result.data
    });
  }
);
var getSingleSubscriptionPlan = catchAsync_default(
  async (req, res) => {
    const result = await subscriptionServices.getSingleSubscriptionPlanFromDB(
      req.params.id
    );
    sendResponse(res, {
      statusCode: import_http_status26.default.OK,
      success: true,
      message: "Single Subscription plan retrieved successfully",
      data: result
    });
  }
);
var updateSubscriptionPlan = catchAsync_default(
  async (req, res) => {
    const result = await subscriptionServices.updateSubscriptionPlanIntoDB(
      req.params.id,
      req.body
    );
    sendResponse(res, {
      statusCode: import_http_status26.default.OK,
      success: true,
      message: "Subscription plan updated successfully",
      data: result
    });
  }
);
var deleteSubscriptionPlan = catchAsync_default(
  async (req, res) => {
    const result = await subscriptionServices.deleteSubscriptionPlanFromDB(
      req.params.id
    );
    sendResponse(res, {
      statusCode: import_http_status26.default.OK,
      success: true,
      message: "Subscription plan deleted successfully",
      data: result
    });
  }
);
var createSubscription = catchAsync_default(async (req, res) => {
  const userId = req.user?.id;
  const result = await subscriptionServices.createSubscriptionIntoDB(
    userId,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status26.default.CREATED,
    success: true,
    message: "Subscription created successfully",
    data: result
  });
});
var getMySubscription = catchAsync_default(async (req, res) => {
  const userId = req.user?.id;
  const result = await subscriptionServices.getMySubscriptionFromDB(
    userId
  );
  sendResponse(res, {
    statusCode: import_http_status26.default.OK,
    success: true,
    message: "Current subscription retrieved successfully",
    data: result
  });
});
var getMySubscriptionHistory = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const result = await subscriptionServices.getMySubscriptionHistoryFromDB(
      userId
    );
    sendResponse(res, {
      statusCode: import_http_status26.default.OK,
      success: true,
      message: "Subscription history retrieved successfully",
      data: result
    });
  }
);
var cancelSubscription = catchAsync_default(async (req, res) => {
  const userId = req.user?.id;
  const result = await subscriptionServices.cancelSubscriptionIntoDB(
    userId,
    req.params.id
  );
  sendResponse(res, {
    statusCode: import_http_status26.default.OK,
    success: true,
    message: "Subscription cancelled successfully",
    data: result
  });
});
var subscriptionControllers = {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSingleSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  createSubscription,
  getMySubscription,
  getMySubscriptionHistory,
  cancelSubscription
};

// src/app/modules/subscriptions/subscription.validation.ts
var import_zod12 = require("zod");
var createSubscriptionPlanValidationSchema = import_zod12.z.object({
  name: import_zod12.z.string().min(2, "Plan name must be at least 2 characters").max(100, "Plan name cannot exceed 100 characters"),
  description: import_zod12.z.string().max(500, "Description cannot exceed 500 characters").optional(),
  price: import_zod12.z.number().positive("Price must be greater than 0"),
  durationDays: import_zod12.z.number().int("Duration must be an integer").positive("Duration must be greater than 0"),
  status: import_zod12.z.enum(["ACTIVE", "INACTIVE"]).optional()
});
var updateSubscriptionPlanValidationSchema = import_zod12.z.object({
  name: import_zod12.z.string().min(2, "Plan name must be at least 2 characters").max(100, "Plan name cannot exceed 100 characters").optional(),
  description: import_zod12.z.string().max(500, "Description cannot exceed 500 characters").optional(),
  price: import_zod12.z.number().positive("Price must be greater than 0").optional(),
  durationDays: import_zod12.z.number().int("Duration must be an integer").positive("Duration must be greater than 0").optional(),
  status: import_zod12.z.enum(["ACTIVE", "INACTIVE"]).optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required for update"
});
var createSubscriptionValidationSchema = import_zod12.z.object({
  planId: import_zod12.z.string().uuid("Invalid subscription plan ID")
});

// src/app/modules/subscriptions/subscription.route.ts
var router12 = (0, import_express12.Router)();
router12.post(
  "/plans",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(createSubscriptionPlanValidationSchema),
  subscriptionControllers.createSubscriptionPlan
);
router12.get("/plans", subscriptionControllers.getAllSubscriptionPlans);
router12.get("/plans/:id", subscriptionControllers.getSingleSubscriptionPlan);
router12.patch(
  "/plans/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(updateSubscriptionPlanValidationSchema),
  subscriptionControllers.updateSubscriptionPlan
);
router12.delete(
  "/plans/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  subscriptionControllers.deleteSubscriptionPlan
);
router12.post(
  "/",
  auth(UserRole.CUSTOMER),
  validateRequest(createSubscriptionValidationSchema),
  subscriptionControllers.createSubscription
);
router12.get(
  "/my-subscription",
  auth(UserRole.CUSTOMER),
  subscriptionControllers.getMySubscription
);
router12.get(
  "/history",
  auth(UserRole.CUSTOMER),
  subscriptionControllers.getMySubscriptionHistory
);
router12.patch(
  "/:id/cancel",
  auth(UserRole.CUSTOMER),
  subscriptionControllers.cancelSubscription
);
var subscriptionRoutes = router12;

// src/app/modules/loadSheddingSchedule/loadSheddingSchedule.route.ts
var import_express13 = require("express");

// src/app/modules/loadSheddingSchedule/loadSheddingSchedule.controller.ts
var import_http_status28 = __toESM(require("http-status"), 1);

// src/app/modules/loadSheddingSchedule/loadSheddingSchedule.service.ts
var import_http_status27 = __toESM(require("http-status"), 1);
var createLoadSheddingScheduleIntoDB = async (createdById, payload) => {
  const { areaId, title, description, startTime, endTime, scheduleFee } = payload;
  const area = await prisma.area.findUnique({
    where: {
      id: areaId
    }
  });
  if (!area) {
    throw new AppError(import_http_status27.default.NOT_FOUND, "Area Not Found");
  }
  const existingSchedule = await prisma.loadSheddingSchedule.findFirst({
    where: {
      areaId,
      deletedAt: null,
      startTime: {
        lt: endTime
      },
      endTime: {
        gt: startTime
      },
      status: {
        not: ScheduleStatus.CANCELLED
      }
    }
  });
  if (existingSchedule) {
    throw new AppError(
      import_http_status27.default.CONFLICT,
      "Another load shedding schedule already exists for this area during the selected time"
    );
  }
  const result = await prisma.loadSheddingSchedule.create({
    data: {
      areaId,
      title,
      description,
      startTime,
      endTime,
      scheduleFee: scheduleFee !== void 0 ? new prismaNamespace_exports.Decimal(scheduleFee) : void 0,
      createdById,
      status: ScheduleStatus.DRAFT
    },
    include: {
      area: true
    }
  });
  return result;
};
var getAllLoadSheddingSchedulesFromDB = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const searchTerm = query.searchTerm?.trim();
  const where = {
    deletedAt: null,
    ...searchTerm && {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      ]
    },
    ...query.areaId && {
      areaId: query.areaId
    },
    ...query.status && {
      status: query.status
    }
  };
  const [data, total] = await Promise.all([
    prisma.loadSheddingSchedule.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        startTime: "asc"
      },
      include: {
        area: true
      }
    }),
    prisma.loadSheddingSchedule.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data
  };
};
var getSingleLoadSheddingScheduleFromDB = async (id) => {
  const result = await prisma.loadSheddingSchedule.findFirst({
    where: {
      id,
      deletedAt: null
    },
    include: {
      area: true
    }
  });
  if (!result) {
    throw new AppError(
      import_http_status27.default.NOT_FOUND,
      "Load Shedding Schedule Not Found"
    );
  }
  return result;
};
var updateLoadSheddingScheduleIntoDB = async (id, payload) => {
  const existingSchedule = await prisma.loadSheddingSchedule.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingSchedule) {
    throw new AppError(
      import_http_status27.default.NOT_FOUND,
      "Load Shedding Schedule Not Found"
    );
  }
  if (existingSchedule.status === ScheduleStatus.COMPLETED || existingSchedule.status === ScheduleStatus.CANCELLED) {
    throw new AppError(
      import_http_status27.default.BAD_REQUEST,
      `Cannot update a ${existingSchedule.status.toLowerCase()} schedule`
    );
  }
  const startTime = payload.startTime ?? existingSchedule.startTime;
  const endTime = payload.endTime ?? existingSchedule.endTime;
  if (endTime <= startTime) {
    throw new AppError(
      import_http_status27.default.BAD_REQUEST,
      "End time must be after start time"
    );
  }
  const result = await prisma.loadSheddingSchedule.update({
    where: {
      id
    },
    data: {
      ...payload.areaId !== void 0 && {
        areaId: payload.areaId
      },
      ...payload.title !== void 0 && {
        title: payload.title
      },
      ...payload.description !== void 0 && {
        description: payload.description
      },
      ...payload.startTime !== void 0 && {
        startTime: payload.startTime
      },
      ...payload.endTime !== void 0 && {
        endTime: payload.endTime
      },
      ...payload.scheduleFee !== void 0 && {
        scheduleFee: payload.scheduleFee === null ? null : new prismaNamespace_exports.Decimal(payload.scheduleFee)
      }
    },
    include: {
      area: true
    }
  });
  return result;
};
var deleteLoadSheddingScheduleFromDB = async (id) => {
  const existingSchedule = await prisma.loadSheddingSchedule.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!existingSchedule) {
    throw new AppError(
      import_http_status27.default.NOT_FOUND,
      "Load Shedding Schedule Not Found"
    );
  }
  await prisma.loadSheddingSchedule.update({
    where: {
      id
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date(),
      status: ScheduleStatus.CANCELLED
    }
  });
  return null;
};
var publishLoadSheddingScheduleIntoDB = async (id) => {
  const schedule = await prisma.loadSheddingSchedule.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!schedule) {
    throw new AppError(
      import_http_status27.default.NOT_FOUND,
      "Load Shedding Schedule Not Found"
    );
  }
  if (schedule.status !== ScheduleStatus.DRAFT) {
    throw new AppError(
      import_http_status27.default.BAD_REQUEST,
      "Only draft schedules can be published"
    );
  }
  const result = await prisma.loadSheddingSchedule.update({
    where: {
      id
    },
    data: {
      status: ScheduleStatus.PUBLISHED
    },
    include: {
      area: true
    }
  });
  return result;
};
var activateLoadSheddingScheduleIntoDB = async (id) => {
  const schedule = await prisma.loadSheddingSchedule.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!schedule) {
    throw new AppError(
      import_http_status27.default.NOT_FOUND,
      "Load Shedding Schedule Not Found"
    );
  }
  if (schedule.status !== ScheduleStatus.PUBLISHED) {
    throw new AppError(
      import_http_status27.default.BAD_REQUEST,
      "Only published schedules can be activated"
    );
  }
  const result = await prisma.loadSheddingSchedule.update({
    where: {
      id
    },
    data: {
      status: ScheduleStatus.ACTIVE
    },
    include: {
      area: true
    }
  });
  return result;
};
var completeLoadSheddingScheduleIntoDB = async (id) => {
  const schedule = await prisma.loadSheddingSchedule.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!schedule) {
    throw new AppError(
      import_http_status27.default.NOT_FOUND,
      "Load Shedding Schedule Not Found"
    );
  }
  if (schedule.status !== ScheduleStatus.ACTIVE) {
    throw new AppError(
      import_http_status27.default.BAD_REQUEST,
      "Only active schedules can be completed"
    );
  }
  const result = await prisma.loadSheddingSchedule.update({
    where: {
      id
    },
    data: {
      status: ScheduleStatus.COMPLETED
    },
    include: {
      area: true
    }
  });
  return result;
};
var cancelLoadSheddingScheduleIntoDB = async (id) => {
  const schedule = await prisma.loadSheddingSchedule.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!schedule) {
    throw new AppError(
      import_http_status27.default.NOT_FOUND,
      "Load Shedding Schedule Not Found"
    );
  }
  if (schedule.status === ScheduleStatus.COMPLETED) {
    throw new AppError(
      import_http_status27.default.BAD_REQUEST,
      "Completed schedule cannot be cancelled"
    );
  }
  if (schedule.status === ScheduleStatus.CANCELLED) {
    throw new AppError(
      import_http_status27.default.BAD_REQUEST,
      "Schedule is already cancelled"
    );
  }
  const result = await prisma.loadSheddingSchedule.update({
    where: {
      id
    },
    data: {
      status: ScheduleStatus.CANCELLED
    },
    include: {
      area: true
    }
  });
  return result;
};
var getUpcomingLoadSheddingSchedulesFromDB = async () => {
  const now = /* @__PURE__ */ new Date();
  const result = await prisma.loadSheddingSchedule.findMany({
    where: {
      deletedAt: null,
      startTime: {
        gt: now
      },
      status: ScheduleStatus.COMPLETED
    },
    orderBy: {
      startTime: "asc"
    },
    include: {
      area: true
    }
  });
  return result;
};
var loadSheddingScheduleServices = {
  createLoadSheddingScheduleIntoDB,
  getAllLoadSheddingSchedulesFromDB,
  getSingleLoadSheddingScheduleFromDB,
  updateLoadSheddingScheduleIntoDB,
  deleteLoadSheddingScheduleFromDB,
  publishLoadSheddingScheduleIntoDB,
  activateLoadSheddingScheduleIntoDB,
  completeLoadSheddingScheduleIntoDB,
  cancelLoadSheddingScheduleIntoDB,
  getUpcomingLoadSheddingSchedulesFromDB
};

// src/app/modules/loadSheddingSchedule/loadSheddingSchedule.controller.ts
var createLoadSheddingSchedule = catchAsync_default(
  async (req, res) => {
    const createdById = req.user?.id;
    const result = await loadSheddingScheduleServices.createLoadSheddingScheduleIntoDB(
      createdById,
      {
        ...req.body,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime)
      }
    );
    sendResponse(res, {
      statusCode: import_http_status28.default.CREATED,
      success: true,
      message: "Load Shedding Schedule Created Successfully!",
      data: result
    });
  }
);
var getAllLoadSheddingSchedules = catchAsync_default(
  async (req, res) => {
    const result = await loadSheddingScheduleServices.getAllLoadSheddingSchedulesFromDB(
      req.query
    );
    sendResponse(res, {
      statusCode: import_http_status28.default.OK,
      success: true,
      message: "All Load Shedding Schedules Retrieved Successfully!",
      data: result.data
    });
  }
);
var getSingleLoadSheddingSchedule = catchAsync_default(
  async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingScheduleServices.getSingleLoadSheddingScheduleFromDB(
      id
    );
    sendResponse(res, {
      statusCode: import_http_status28.default.OK,
      success: true,
      message: "Single Load Shedding Schedule Retrieved Successfully!",
      data: result
    });
  }
);
var updateLoadSheddingSchedule = catchAsync_default(
  async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingScheduleServices.updateLoadSheddingScheduleIntoDB(
      id,
      {
        ...req.body,
        ...req.body.startTime && {
          startTime: new Date(req.body.startTime)
        },
        ...req.body.endTime && {
          endTime: new Date(req.body.endTime)
        }
      }
    );
    sendResponse(res, {
      statusCode: import_http_status28.default.OK,
      success: true,
      message: "Load Shedding Schedule Updated Successfully!",
      data: result
    });
  }
);
var deleteLoadSheddingSchedule = catchAsync_default(
  async (req, res) => {
    const { id } = req.params;
    await loadSheddingScheduleServices.deleteLoadSheddingScheduleFromDB(
      id
    );
    sendResponse(res, {
      statusCode: import_http_status28.default.OK,
      success: true,
      message: "Load Shedding Schedule Deleted Successfully!",
      data: null
    });
  }
);
var publishLoadSheddingSchedule = catchAsync_default(
  async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingScheduleServices.publishLoadSheddingScheduleIntoDB(
      id
    );
    sendResponse(res, {
      statusCode: import_http_status28.default.OK,
      success: true,
      message: "Load Shedding Schedule Published Successfully!",
      data: result
    });
  }
);
var activateLoadSheddingSchedule = catchAsync_default(
  async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingScheduleServices.activateLoadSheddingScheduleIntoDB(
      id
    );
    sendResponse(res, {
      statusCode: import_http_status28.default.OK,
      success: true,
      message: "Load Shedding Schedule Activated Successfully!",
      data: result
    });
  }
);
var completeLoadSheddingSchedule = catchAsync_default(
  async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingScheduleServices.completeLoadSheddingScheduleIntoDB(
      id
    );
    sendResponse(res, {
      statusCode: import_http_status28.default.OK,
      success: true,
      message: "Load Shedding Schedule Completed Successfully!",
      data: result
    });
  }
);
var cancelLoadSheddingSchedule = catchAsync_default(
  async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingScheduleServices.cancelLoadSheddingScheduleIntoDB(
      id
    );
    sendResponse(res, {
      statusCode: import_http_status28.default.OK,
      success: true,
      message: "Load Shedding Schedule Cancelled Successfully!",
      data: result
    });
  }
);
var getUpcomingLoadSheddingSchedules = catchAsync_default(
  async (req, res) => {
    const result = await loadSheddingScheduleServices.getUpcomingLoadSheddingSchedulesFromDB();
    sendResponse(res, {
      statusCode: import_http_status28.default.OK,
      success: true,
      message: "Upcoming Load Shedding Schedules Retrieved Successfully!",
      data: result
    });
  }
);
var loadSheddingScheduleControllers = {
  createLoadSheddingSchedule,
  getAllLoadSheddingSchedules,
  getSingleLoadSheddingSchedule,
  updateLoadSheddingSchedule,
  deleteLoadSheddingSchedule,
  publishLoadSheddingSchedule,
  activateLoadSheddingSchedule,
  completeLoadSheddingSchedule,
  cancelLoadSheddingSchedule,
  getUpcomingLoadSheddingSchedules
};

// src/app/modules/loadSheddingSchedule/loadSheddingSchedule.validation.ts
var import_zod13 = require("zod");
var createLoadSheddingScheduleValidationSchema = import_zod13.z.object({
  areaId: import_zod13.z.string({ message: "Area ID is required" }).uuid("Invalid Area ID"),
  title: import_zod13.z.string({ message: "Title is required" }).min(3, "Title must be at least 3 characters"),
  description: import_zod13.z.string().max(1e3, "Description cannot exceed 1000 characters").optional(),
  startTime: import_zod13.z.string({ message: "Start time is required" }).datetime("Invalid start time"),
  endTime: import_zod13.z.string({ message: "End time is required" }).datetime("Invalid end time"),
  scheduleFee: import_zod13.z.number().nonnegative("Schedule fee cannot be negative").optional()
}).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
  message: "End time must be after start time",
  path: ["endTime"]
});
var updateLoadSheddingScheduleValidationSchema = import_zod13.z.object({
  areaId: import_zod13.z.string().uuid("Invalid Area ID").optional(),
  title: import_zod13.z.string().min(3, "Title must be at least 3 characters").optional(),
  description: import_zod13.z.string().max(1e3, "Description cannot exceed 1000 characters").nullable().optional(),
  startTime: import_zod13.z.string().datetime("Invalid start time").optional(),
  endTime: import_zod13.z.string().datetime("Invalid end time").optional(),
  scheduleFee: import_zod13.z.number().nonnegative("Schedule fee cannot be negative").nullable().optional()
}).refine(
  (data) => {
    if (data.startTime && data.endTime) {
      return new Date(data.endTime) > new Date(data.startTime);
    }
    return true;
  },
  {
    message: "End time must be after start time",
    path: ["endTime"]
  }
);
var LoadSheddingScheduleValidation = {
  createLoadSheddingScheduleValidationSchema,
  updateLoadSheddingScheduleValidationSchema
};

// src/app/modules/loadSheddingSchedule/loadSheddingSchedule.route.ts
var router13 = (0, import_express13.Router)();
router13.get(
  "/upcoming",
  auth(UserRole.ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER),
  loadSheddingScheduleControllers.getUpcomingLoadSheddingSchedules
);
router13.post(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(
    LoadSheddingScheduleValidation.createLoadSheddingScheduleValidationSchema
  ),
  loadSheddingScheduleControllers.createLoadSheddingSchedule
);
router13.get(
  "/",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  loadSheddingScheduleControllers.getAllLoadSheddingSchedules
);
router13.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  loadSheddingScheduleControllers.getSingleLoadSheddingSchedule
);
router13.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  validateRequest(
    LoadSheddingScheduleValidation.updateLoadSheddingScheduleValidationSchema
  ),
  loadSheddingScheduleControllers.updateLoadSheddingSchedule
);
router13.patch(
  "/:id/publish",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  loadSheddingScheduleControllers.publishLoadSheddingSchedule
);
router13.patch(
  "/:id/activate",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  loadSheddingScheduleControllers.activateLoadSheddingSchedule
);
router13.patch(
  "/:id/complete",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  loadSheddingScheduleControllers.completeLoadSheddingSchedule
);
router13.patch(
  "/:id/cancel",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  loadSheddingScheduleControllers.cancelLoadSheddingSchedule
);
router13.delete(
  "/:id",
  auth(UserRole.ADMIN),
  loadSheddingScheduleControllers.deleteLoadSheddingSchedule
);
var loadSheddingScheduleRoutes = router13;

// src/app/modules/subscriptionPayment/subscriptionPayment.route.ts
var import_express14 = require("express");

// src/app/modules/subscriptionPayment/subscriptionPayment.validation.ts
var import_zod14 = require("zod");
var createSubscriptionPaymentValidationSchema = import_zod14.z.object({
  subscriptionId: import_zod14.z.string().uuid("Invalid subscription ID"),
  paymentGateway: import_zod14.z.nativeEnum(PaymentGateway).default(PaymentGateway.BKASH)
});

// src/app/modules/subscriptionPayment/subscriptionPayment.controller.ts
var import_http_status31 = __toESM(require("http-status"), 1);

// src/app/modules/subscriptionPayment/subscriptionPayment.service.ts
var import_http_status30 = __toESM(require("http-status"), 1);

// src/app/lib/bkash.ts
var import_http_status29 = __toESM(require("http-status"), 1);
var ID_TOKEN_KEY = "bkash:idToken";
var REFRESH_TOKEN_KEY = "bkash:refreshToken";
var ID_TOKEN_TTL = 60 * 60;
var REFRESH_TOKEN_TTL = 60 * 60 * 24 * 28;
var TOKEN_BUFFER = 60 * 10;
var parseResponse = async (response) => {
  const text = await response.text();
  if (!text) {
    return {};
  }
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
};
var getErrorMessage = (result, fallback) => {
  return result.statusMessage || result.errorMessage || fallback;
};
var getTokenTTL = (expiresIn) => {
  if (typeof expiresIn !== "number" || !Number.isFinite(expiresIn) || expiresIn <= 0) {
    return ID_TOKEN_TTL;
  }
  return Math.max(expiresIn - 60, 60);
};
var saveTokens = async (idToken, refreshToken2, expiresIn) => {
  await redisClient.set(ID_TOKEN_KEY, idToken, {
    expiration: {
      type: "EX",
      value: getTokenTTL(expiresIn)
    }
  });
  if (refreshToken2) {
    await redisClient.set(REFRESH_TOKEN_KEY, refreshToken2, {
      expiration: {
        type: "EX",
        value: REFRESH_TOKEN_TTL
      }
    });
  }
};
var grantNewToken = async () => {
  try {
    const response = await fetch(
      `${config_default.bkash_base_url}/tokenized/checkout/token/grant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config_default.bkash_username,
          password: config_default.bkash_password
        },
        body: JSON.stringify({
          app_key: config_default.bkash_app_key,
          app_secret: config_default.bkash_app_secret
        })
      }
    );
    const result = await parseResponse(response);
    console.log("BKASH GRANT TOKEN STATUS:", response.status);
    if (!response.ok || !result.id_token) {
      throw new AppError(
        import_http_status29.default.BAD_GATEWAY,
        getErrorMessage(result, "bKash token grant failed")
      );
    }
    if (!result.refresh_token) {
      throw new AppError(
        import_http_status29.default.BAD_GATEWAY,
        "bKash refresh token was not returned"
      );
    }
    await saveTokens(
      result.id_token,
      result.refresh_token,
      result.expires_in
    );
    return result.id_token;
  } catch (error) {
    console.error(
      "BKASH GRANT TOKEN ERROR:",
      error instanceof Error ? error.message : error
    );
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      import_http_status29.default.BAD_GATEWAY,
      "Failed to grant bKash token"
    );
  }
};
var refreshBKashToken = async (refreshToken2) => {
  try {
    const response = await fetch(
      `${config_default.bkash_base_url}/tokenized/checkout/token/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config_default.bkash_username,
          password: config_default.bkash_password
        },
        body: JSON.stringify({
          app_key: config_default.bkash_app_key,
          app_secret: config_default.bkash_app_secret,
          refresh_token: refreshToken2
        })
      }
    );
    const result = await parseResponse(response);
    console.log("BKASH REFRESH TOKEN STATUS:", response.status);
    if (!response.ok || !result.id_token) {
      console.warn(
        "bKash refresh failed. Trying new token grant.",
        getErrorMessage(result, "bKash refresh token failed")
      );
      return null;
    }
    await saveTokens(
      result.id_token,
      result.refresh_token,
      result.expires_in
    );
    return result.id_token;
  } catch (error) {
    console.warn(
      "BKASH REFRESH TOKEN ERROR:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
};
var getBKashIdToken = async () => {
  try {
    const idToken = await redisClient.get(ID_TOKEN_KEY);
    const refreshToken2 = await redisClient.get(REFRESH_TOKEN_KEY);
    const idTokenTTL = await redisClient.ttl(ID_TOKEN_KEY);
    const refreshTokenTTL = await redisClient.ttl(REFRESH_TOKEN_KEY);
    if (idToken && idTokenTTL > TOKEN_BUFFER) {
      return idToken;
    }
    if (refreshToken2 && refreshTokenTTL > TOKEN_BUFFER) {
      const newToken = await refreshBKashToken(refreshToken2);
      if (newToken) {
        return newToken;
      }
    }
    return await grantNewToken();
  } catch (error) {
    console.error(
      "BKASH TOKEN ERROR:",
      error instanceof Error ? error.message : error
    );
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      import_http_status29.default.INTERNAL_SERVER_ERROR,
      "Failed to obtain bKash ID token"
    );
  }
};

// src/app/modules/subscriptionPayment/subscriptionPayment.service.ts
var toJson = (data) => {
  return JSON.parse(JSON.stringify(data));
};
var generateMerchantInvoiceNumber = () => {
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `SUB-${Date.now()}-${random}`;
};
var normalizeBKashStatus = (status) => {
  const normalized = status?.trim().toUpperCase();
  switch (normalized) {
    case "COMPLETED":
    case "SUCCESS":
      return "COMPLETED";
    case "FAILED":
    case "FAILURE":
    case "DECLINED":
      return "FAILED";
    case "CANCELLED":
    case "CANCELED":
    case "CANCEL":
      return "CANCELLED";
    case "INITIATED":
    case "PROCESSING":
    case "PENDING":
      return "PENDING";
    default:
      return "UNKNOWN";
  }
};
var getBKashHeaders = (token) => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: token,
  "X-App-Key": config_default.bkash_app_key
});
var parseBKashResponse = async (response) => {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new AppError(
      import_http_status30.default.BAD_GATEWAY,
      `Invalid response received from bKash. HTTP Status: ${response.status}`
    );
  }
  if (!response.ok) {
    throw new AppError(
      import_http_status30.default.BAD_GATEWAY,
      data.statusMessage || data.errorMessage || `bKash API request failed. HTTP Status: ${response.status}`
    );
  }
  if (data.statusCode && data.statusCode !== "0000") {
    throw new AppError(
      import_http_status30.default.BAD_GATEWAY,
      data.statusMessage || data.errorMessage || `bKash transaction failed. Status Code: ${data.statusCode}`
    );
  }
  return data;
};
var createBKashPayment = async (payload) => {
  const token = await getBKashIdToken();
  if (!token) {
    throw new AppError(
      import_http_status30.default.BAD_GATEWAY,
      "Unable to get bKash authentication token"
    );
  }
  const response = await fetch(
    `${config_default.bkash_base_url}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: getBKashHeaders(token),
      body: JSON.stringify({
        mode: "0011",
        payerReference: payload.payerReference,
        callbackURL: payload.callbackURL,
        amount: payload.amount,
        currency: "BDT",
        intent: "sale",
        merchantInvoiceNumber: payload.merchantInvoiceNumber
      })
    }
  );
  const data = await parseBKashResponse(response);
  return data;
};
var executeBKashPayment = async (paymentID) => {
  const token = await getBKashIdToken();
  if (!token) {
    throw new AppError(
      import_http_status30.default.BAD_GATEWAY,
      "Unable to obtain bKash ID token"
    );
  }
  const response = await fetch(
    `${config_default.bkash_base_url}/tokenized/checkout/execute`,
    {
      method: "POST",
      headers: getBKashHeaders(token),
      body: JSON.stringify({
        paymentID
      })
    }
  );
  return parseBKashResponse(response);
};
var queryBKashPayment = async (paymentID) => {
  const token = await getBKashIdToken();
  if (!token) {
    throw new AppError(
      import_http_status30.default.BAD_GATEWAY,
      "Unable to obtain bKash ID token"
    );
  }
  const response = await fetch(
    `${config_default.bkash_base_url}/tokenized/checkout/payment/status`,
    {
      method: "POST",
      headers: getBKashHeaders(token),
      body: JSON.stringify({
        paymentID
      })
    }
  );
  return parseBKashResponse(response);
};
var getCheckoutURL = (gatewayResponse) => {
  if (!gatewayResponse || typeof gatewayResponse !== "object") {
    return null;
  }
  const data = gatewayResponse;
  if (typeof data.bkashURL === "string") {
    return data.bkashURL;
  }
  if (typeof data.paymentURL === "string") {
    return data.paymentURL;
  }
  return null;
};
var activateSubscriptionAfterPayment = async (paymentId, gatewayResponse) => {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.subscriptionPayment.findUnique({
      where: {
        id: paymentId
      },
      include: {
        subscription: {
          include: {
            plan: true
          }
        }
      }
    });
    if (!payment) {
      throw new AppError(
        import_http_status30.default.NOT_FOUND,
        "Subscription payment not found"
      );
    }
    if (payment.status === PaymentStatus.PAID) {
      return payment;
    }
    if (!payment.subscription) {
      throw new AppError(import_http_status30.default.NOT_FOUND, "Subscription not found");
    }
    const subscription = payment.subscription;
    if (!subscription.plan) {
      throw new AppError(
        import_http_status30.default.NOT_FOUND,
        "Subscription plan not found"
      );
    }
    const gatewayAmount = Number(gatewayResponse.amount);
    const localAmount = Number(payment.amount);
    if (Number.isNaN(gatewayAmount) || gatewayAmount !== localAmount) {
      throw new AppError(
        import_http_status30.default.BAD_GATEWAY,
        "Payment amount mismatch"
      );
    }
    if (gatewayResponse.merchantInvoiceNumber && gatewayResponse.merchantInvoiceNumber !== payment.merchantInvoiceNumber) {
      throw new AppError(
        import_http_status30.default.BAD_GATEWAY,
        "Merchant invoice number mismatch"
      );
    }
    const now = /* @__PURE__ */ new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + subscription.plan.durationDays);
    const updatedPayment = await tx.subscriptionPayment.update({
      where: {
        id: payment.id
      },
      data: {
        status: PaymentStatus.PAID,
        bkashTrxId: gatewayResponse.trxID ?? payment.bkashTrxId,
        paidAt: now,
        gatewayResponse: toJson(gatewayResponse)
      }
    });
    await tx.subscription.update({
      where: {
        id: subscription.id
      },
      data: {
        status: SubscriptionStatus.ACTIVE,
        startDate: now,
        endDate
      }
    });
    return updatedPayment;
  });
};
var updateLocalPaymentStatus = async (paymentId, status, gatewayResponse) => {
  return prisma.subscriptionPayment.update({
    where: {
      id: paymentId
    },
    data: {
      status,
      gatewayResponse: gatewayResponse ? toJson(gatewayResponse) : void 0,
      ...status === PaymentStatus.PAID ? {
        paidAt: /* @__PURE__ */ new Date()
      } : {}
    }
  });
};
var processBKashResult = async (paymentId, result) => {
  const status = normalizeBKashStatus(result.transactionStatus);
  switch (status) {
    case "COMPLETED":
      return activateSubscriptionAfterPayment(paymentId, result);
    case "FAILED":
      return updateLocalPaymentStatus(
        paymentId,
        PaymentStatus.FAILED,
        result
      );
    case "CANCELLED":
      return updateLocalPaymentStatus(
        paymentId,
        PaymentStatus.CANCELLED,
        result
      );
    case "PENDING":
    case "UNKNOWN":
    default:
      return updateLocalPaymentStatus(
        paymentId,
        PaymentStatus.PENDING,
        result
      );
  }
};
var createSubscriptionPaymentIntoDB = async (userId, payload) => {
  const paymentGateway = payload.paymentGateway ?? PaymentGateway.BKASH;
  if (paymentGateway !== PaymentGateway.BKASH) {
    throw new AppError(
      import_http_status30.default.BAD_REQUEST,
      `${paymentGateway} payment gateway is not implemented yet`
    );
  }
  const subscription = await prisma.subscription.findFirst({
    where: {
      id: payload.subscriptionId,
      userId
    },
    include: {
      plan: true
    }
  });
  if (!subscription) {
    throw new AppError(import_http_status30.default.NOT_FOUND, "Subscription not found");
  }
  if (!subscription.plan) {
    throw new AppError(import_http_status30.default.NOT_FOUND, "Subscription plan not found");
  }
  if (subscription.plan.status && subscription.plan.status !== "ACTIVE") {
    throw new AppError(
      import_http_status30.default.BAD_REQUEST,
      "Subscription plan is not active"
    );
  }
  const paidPayment = await prisma.subscriptionPayment.findFirst({
    where: {
      subscriptionId: payload.subscriptionId,
      userId,
      status: PaymentStatus.PAID
    }
  });
  if (paidPayment) {
    throw new AppError(
      import_http_status30.default.CONFLICT,
      "This subscription has already been paid"
    );
  }
  const existingPayment = await prisma.subscriptionPayment.findFirst({
    where: {
      subscriptionId: payload.subscriptionId,
      userId,
      status: PaymentStatus.PENDING,
      paymentGateway: PaymentGateway.BKASH
    }
  });
  if (existingPayment && existingPayment.bkashPaymentId) {
    const checkoutURL = getCheckoutURL(existingPayment.gatewayResponse);
    return {
      payment: existingPayment,
      paymentId: existingPayment.bkashPaymentId,
      bkashURL: checkoutURL,
      reused: true
    };
  }
  const merchantInvoiceNumber = generateMerchantInvoiceNumber();
  const payment = await prisma.subscriptionPayment.create({
    data: {
      userId,
      subscriptionId: subscription.id,
      amount: subscription.plan.price,
      currency: "BDT",
      paymentGateway: PaymentGateway.BKASH,
      status: PaymentStatus.PENDING,
      merchantInvoiceNumber
    }
  });
  try {
    const callbackURL = `${config_default.backend_url}/api/v1/subscription-payment/bkash/callback`;
    const bkashResponse = await createBKashPayment({
      amount: String(subscription.plan.price),
      merchantInvoiceNumber,
      callbackURL,
      payerReference: userId
    });
    if (!bkashResponse.paymentID) {
      throw new AppError(
        import_http_status30.default.BAD_GATEWAY,
        "bKash payment ID was not returned"
      );
    }
    const updatedPayment = await prisma.subscriptionPayment.update({
      where: {
        id: payment.id
      },
      data: {
        bkashPaymentId: bkashResponse.paymentID,
        gatewayResponse: toJson(bkashResponse)
      }
    });
    return {
      payment: {
        ...payment,
        bkashPaymentId: bkashResponse.paymentID,
        gatewayResponse: bkashResponse
      },
      paymentId: bkashResponse.paymentID,
      bkashURL: bkashResponse.bkashURL ?? bkashResponse.paymentURL ?? null,
      reused: false
    };
  } catch (error) {
    await prisma.subscriptionPayment.update({
      where: {
        id: payment.id
      },
      data: {
        status: PaymentStatus.FAILED
      }
    });
    throw error;
  }
};
var handleBKashCallbackIntoDB = async (paymentID, callbackStatus) => {
  const payment = await prisma.subscriptionPayment.findFirst({
    where: {
      bkashPaymentId: paymentID
    }
  });
  if (!payment) {
    throw new AppError(
      import_http_status30.default.NOT_FOUND,
      "Payment not found for this bKash payment ID"
    );
  }
  if (payment.status === PaymentStatus.PAID) {
    return {
      status: "COMPLETED",
      payment
    };
  }
  const normalizedCallbackStatus = normalizeBKashStatus(callbackStatus);
  if (normalizedCallbackStatus === "CANCELLED") {
    const updated = await updateLocalPaymentStatus(
      payment.id,
      PaymentStatus.CANCELLED,
      {
        callbackStatus,
        paymentID
      }
    );
    return {
      status: "CANCELLED",
      payment: updated
    };
  }
  if (normalizedCallbackStatus === "FAILED") {
    const updated = await updateLocalPaymentStatus(
      payment.id,
      PaymentStatus.FAILED,
      {
        callbackStatus,
        paymentID
      }
    );
    return {
      status: "FAILED",
      payment: updated
    };
  }
  try {
    const executeResult = await executeBKashPayment(paymentID);
    const executeStatus = normalizeBKashStatus(
      executeResult.transactionStatus
    );
    if (executeStatus === "COMPLETED") {
      const activated = await processBKashResult(
        payment.id,
        executeResult
      );
      return {
        status: "COMPLETED",
        payment: activated
      };
    }
    if (executeStatus === "FAILED") {
      const failed = await processBKashResult(payment.id, executeResult);
      return {
        status: "FAILED",
        payment: failed
      };
    }
    if (executeStatus === "CANCELLED") {
      const cancelled = await processBKashResult(
        payment.id,
        executeResult
      );
      return {
        status: "CANCELLED",
        payment: cancelled
      };
    }
  } catch (error) {
    console.error(
      "bKash execute error:",
      error instanceof Error ? error.message : error
    );
  }
  const queryResult = await queryBKashPayment(paymentID);
  const queryStatus = normalizeBKashStatus(queryResult.transactionStatus);
  if (queryStatus === "COMPLETED") {
    const activated = await processBKashResult(payment.id, queryResult);
    return {
      status: "COMPLETED",
      payment: activated
    };
  }
  if (queryStatus === "FAILED") {
    const failed = await processBKashResult(payment.id, queryResult);
    return {
      status: "FAILED",
      payment: failed
    };
  }
  if (queryStatus === "CANCELLED") {
    const cancelled = await processBKashResult(payment.id, queryResult);
    return {
      status: "CANCELLED",
      payment: cancelled
    };
  }
  const pending = await processBKashResult(payment.id, queryResult);
  return {
    status: "PENDING",
    payment: pending
  };
};
var verifyBKashPaymentIntoDB = async (userId, paymentID) => {
  const allPayments = await prisma.subscriptionPayment.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      userId: true,
      merchantInvoiceNumber: true,
      bkashPaymentId: true,
      status: true,
      createdAt: true
    }
  });
  console.log("USER PAYMENTS:", allPayments);
  const payment = await prisma.subscriptionPayment.findFirst({
    where: {
      userId,
      bkashPaymentId: paymentID
    }
  });
  if (!payment) {
    throw new AppError(import_http_status30.default.NOT_FOUND, "Payment not found");
  }
  if (payment.status === PaymentStatus.PAID) {
    return {
      status: "COMPLETED",
      payment
    };
  }
  let gatewayResult = await queryBKashPayment(paymentID);
  let status = normalizeBKashStatus(gatewayResult.transactionStatus);
  if (status === "PENDING") {
    try {
      const executeResult = await executeBKashPayment(paymentID);
      gatewayResult = executeResult;
      status = normalizeBKashStatus(executeResult.transactionStatus);
    } catch (error) {
      console.error(
        "bKash execute during verification:",
        error instanceof Error ? error.message : error
      );
      gatewayResult = await queryBKashPayment(paymentID);
      status = normalizeBKashStatus(gatewayResult.transactionStatus);
    }
  }
  const processed = await processBKashResult(payment.id, gatewayResult);
  return {
    status,
    payment: processed
  };
};
var getSingleSubscriptionPaymentIntoDB = async (paymentId, userId) => {
  const payment = await prisma.subscriptionPayment.findFirst({
    where: {
      id: paymentId,
      ...userId ? {
        userId
      } : {}
    },
    include: {
      subscription: {
        include: {
          plan: true
        }
      }
    }
  });
  if (!payment) {
    throw new AppError(
      import_http_status30.default.NOT_FOUND,
      "Subscription payment not found"
    );
  }
  return payment;
};
var getMySubscriptionPaymentsIntoDB = async (userId, query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const search = query.search?.trim();
  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "amount",
    "paidAt",
    "status"
  ];
  const sortBy = query.sortBy && allowedSortFields.includes(query.sortBy) ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
  const where = {
    userId,
    ...query.status ? {
      status: query.status
    } : {},
    ...query.paymentGateway ? {
      paymentGateway: query.paymentGateway
    } : {},
    ...search ? {
      OR: [
        {
          merchantInvoiceNumber: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          bkashPaymentId: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          bkashTrxId: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    } : {}
  };
  const [data, total] = await Promise.all([
    prisma.subscriptionPayment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        subscription: {
          include: {
            plan: true
          }
        }
      }
    }),
    prisma.subscriptionPayment.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data
  };
};
var getAllSubscriptionPaymentsIntoDB = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const search = query.search?.trim();
  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "amount",
    "paidAt",
    "status"
  ];
  const sortBy = query.sortBy && allowedSortFields.includes(query.sortBy) ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
  const where = {
    ...query.status ? {
      status: query.status
    } : {},
    ...query.paymentGateway ? {
      paymentGateway: query.paymentGateway
    } : {},
    ...search ? {
      OR: [
        {
          merchantInvoiceNumber: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          bkashPaymentId: {
            contains: search,
            mode: "insensitive"
          }
        },
        {
          bkashTrxId: {
            contains: search,
            mode: "insensitive"
          }
        }
      ]
    } : {}
  };
  const [data, total] = await Promise.all([
    prisma.subscriptionPayment.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        subscription: {
          include: {
            plan: true
          }
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    }),
    prisma.subscriptionPayment.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data
  };
};
var subscriptionPaymentServices = {
  createSubscriptionPaymentIntoDB,
  handleBKashCallbackIntoDB,
  verifyBKashPaymentIntoDB,
  getSingleSubscriptionPaymentIntoDB,
  getMySubscriptionPaymentsIntoDB,
  getAllSubscriptionPaymentsIntoDB
};

// src/app/modules/subscriptionPayment/subscriptionPayment.controller.ts
var createSubscriptionPayment = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        import_http_status31.default.UNAUTHORIZED,
        "User authentication required"
      );
    }
    const result = await subscriptionPaymentServices.createSubscriptionPaymentIntoDB(
      userId,
      req.body
    );
    sendResponse(res, {
      statusCode: import_http_status31.default.OK,
      success: true,
      message: result.reused ? "Existing bKash payment returned successfully" : "bKash payment created successfully",
      data: result
    });
  }
);
var bkashCallback = catchAsync_default(
  async (req, res) => {
    const paymentID = typeof req.query.paymentID === "string" ? req.query.paymentID : void 0;
    const callbackStatus = typeof req.query.status === "string" ? req.query.status : void 0;
    if (!paymentID) {
      res.redirect(`${config_default.frontend_url}/subscription/payment-failed`);
      return;
    }
    try {
      const result = await subscriptionPaymentServices.handleBKashCallbackIntoDB(
        paymentID,
        callbackStatus
      );
      let page = "payment-pending";
      switch (result.status) {
        case "COMPLETED":
          page = "payment-success";
          break;
        case "FAILED":
          page = "payment-failed";
          break;
        case "CANCELLED":
          page = "payment-cancelled";
          break;
        case "PENDING":
        default:
          page = "payment-pending";
          break;
      }
      res.redirect(
        `${config_default.frontend_url}/subscription/${page}?paymentId=${encodeURIComponent(
          paymentID
        )}`
      );
      return;
    } catch (error) {
      console.error("bKash callback error:", error);
      res.redirect(
        `${config_default.frontend_url}/subscription/payment-failed?paymentId=${encodeURIComponent(
          paymentID
        )}`
      );
      return;
    }
  }
);
var verifyBKashPayment = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const { paymentId } = req.params;
    if (!userId) {
      throw new AppError(
        import_http_status31.default.UNAUTHORIZED,
        "User authentication required"
      );
    }
    if (!paymentId) {
      throw new AppError(
        import_http_status31.default.BAD_REQUEST,
        "Payment ID is required"
      );
    }
    const result = await subscriptionPaymentServices.verifyBKashPaymentIntoDB(
      userId,
      paymentId
    );
    sendResponse(res, {
      statusCode: import_http_status31.default.OK,
      success: true,
      message: "Payment verification completed",
      data: result
    });
  }
);
var getSingleSubscriptionPayment = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    const { paymentId } = req.params;
    if (!userId) {
      throw new AppError(
        import_http_status31.default.UNAUTHORIZED,
        "User authentication required"
      );
    }
    if (!paymentId) {
      throw new AppError(
        import_http_status31.default.BAD_REQUEST,
        "Payment ID is required"
      );
    }
    const result = await subscriptionPaymentServices.getSingleSubscriptionPaymentIntoDB(
      paymentId,
      userId
    );
    sendResponse(res, {
      statusCode: import_http_status31.default.OK,
      success: true,
      message: "Subscription payment retrieved successfully",
      data: result
    });
  }
);
var getMySubscriptionPayments = catchAsync_default(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(
        import_http_status31.default.UNAUTHORIZED,
        "User authentication required"
      );
    }
    const result = await subscriptionPaymentServices.getMySubscriptionPaymentsIntoDB(
      userId,
      req.query
    );
    sendResponse(res, {
      statusCode: import_http_status31.default.OK,
      success: true,
      message: "My subscription payments retrieved successfully",
      data: result.data
    });
  }
);
var subscriptionPaymentControllers = {
  createSubscriptionPayment,
  bkashCallback,
  verifyBKashPayment,
  getSingleSubscriptionPayment,
  getMySubscriptionPayments
};

// src/app/modules/subscriptionPayment/subscriptionPayment.route.ts
var router14 = (0, import_express14.Router)();
router14.post(
  "/create",
  auth(UserRole.CUSTOMER),
  validateRequest(createSubscriptionPaymentValidationSchema),
  subscriptionPaymentControllers.createSubscriptionPayment
);
router14.get("/bkash/callback", subscriptionPaymentControllers.bkashCallback);
router14.get(
  "/verify/:paymentId",
  auth(UserRole.CUSTOMER),
  subscriptionPaymentControllers.verifyBKashPayment
);
router14.get(
  "/my",
  auth(UserRole.CUSTOMER),
  subscriptionPaymentControllers.getMySubscriptionPayments
);
router14.get(
  "/:paymentId",
  auth(UserRole.CUSTOMER),
  subscriptionPaymentControllers.getSingleSubscriptionPayment
);
var subscriptionPaymentRoutes = router14;

// src/app/modules/restoration/restoration.route.ts
var import_express15 = require("express");

// src/app/modules/restoration/restoration.validation.ts
var import_zod15 = require("zod");
var createRestorationValidationSchema = import_zod15.z.object({
  outageId: import_zod15.z.string().uuid("Invalid outage ID"),
  technicianId: import_zod15.z.string().uuid("Invalid technician ID"),
  remarks: import_zod15.z.string().max(1e3, "Remarks cannot exceed 1000 characters").optional()
});
var updateRestorationValidationSchema = import_zod15.z.object({
  remarks: import_zod15.z.string().max(1e3, "Remarks cannot exceed 1000 characters").optional()
});

// src/app/modules/restoration/restoration.controller.ts
var import_http_status33 = __toESM(require("http-status"), 1);

// src/app/modules/restoration/restoration.service.ts
var import_http_status32 = __toESM(require("http-status"), 1);
var startRestorationIntoDB = async (payload) => {
  const { outageId, technicianId, remarks } = payload;
  return prisma.$transaction(async (tx) => {
    const outage = await tx.outage.findFirst({
      where: {
        id: outageId,
        deletedAt: null
      }
    });
    if (!outage) {
      throw new AppError(import_http_status32.default.NOT_FOUND, "Outage not found");
    }
    if (outage.status === OutageStatus.RESTORED || outage.status === OutageStatus.CLOSED) {
      throw new AppError(
        import_http_status32.default.BAD_REQUEST,
        "This outage has already been restored or closed"
      );
    }
    if (outage.status === OutageStatus.CANCELLED) {
      throw new AppError(
        import_http_status32.default.BAD_REQUEST,
        "Cannot start restoration for a cancelled outage"
      );
    }
    const existingRestoration = await tx.restoration.findUnique({
      where: {
        outageId
      }
    });
    if (existingRestoration) {
      throw new AppError(
        import_http_status32.default.CONFLICT,
        "Restoration already exists for this outage"
      );
    }
    if (!technicianId) {
      throw new AppError(
        import_http_status32.default.BAD_REQUEST,
        "Technician ID is required"
      );
    }
    const technician = await tx.technician.findFirst({
      where: {
        id: technicianId,
        deletedAt: null
      }
    });
    if (!technician) {
      throw new AppError(import_http_status32.default.NOT_FOUND, "Technician not found");
    }
    if (technician.status !== TechnicianStatus.AVAILABLE) {
      throw new AppError(
        import_http_status32.default.BAD_REQUEST,
        "Technician is not available"
      );
    }
    const startedAt = /* @__PURE__ */ new Date();
    const restoration = await tx.restoration.create({
      data: {
        outageId,
        technicianId,
        startedAt,
        status: RestorationStatus.IN_PROGRESS,
        remarks
      },
      include: {
        outage: true,
        technician: true
      }
    });
    await tx.outage.update({
      where: {
        id: outageId
      },
      data: {
        status: OutageStatus.IN_PROGRESS,
        startedAt: outage.startedAt ?? startedAt
      }
    });
    await tx.technician.update({
      where: {
        id: technicianId
      },
      data: {
        status: TechnicianStatus.BUSY
      }
    });
    return restoration;
  });
};
var completeRestorationIntoDB = async (restorationId, payload) => {
  return prisma.$transaction(async (tx) => {
    const restoration = await tx.restoration.findUnique({
      where: {
        id: restorationId
      },
      include: {
        outage: true,
        technician: true
      }
    });
    if (!restoration) {
      throw new AppError(import_http_status32.default.NOT_FOUND, "Restoration not found");
    }
    if (restoration.status === RestorationStatus.COMPLETED) {
      throw new AppError(
        import_http_status32.default.BAD_REQUEST,
        "Restoration is already completed"
      );
    }
    if (restoration.status === RestorationStatus.CANCELLED) {
      throw new AppError(
        import_http_status32.default.BAD_REQUEST,
        "Cancelled restoration cannot be completed"
      );
    }
    if (!restoration.startedAt) {
      throw new AppError(
        import_http_status32.default.BAD_REQUEST,
        "Restoration start time is missing"
      );
    }
    const completedAt = /* @__PURE__ */ new Date();
    const duration = Math.max(
      0,
      Math.floor(
        (completedAt.getTime() - restoration.startedAt.getTime()) / (1e3 * 60)
      )
    );
    const updatedRestoration = await tx.restoration.update({
      where: {
        id: restorationId
      },
      data: {
        status: RestorationStatus.COMPLETED,
        completedAt,
        duration,
        remarks: payload?.remarks ?? restoration.remarks
      },
      include: {
        outage: true,
        technician: true
      }
    });
    await tx.outage.update({
      where: {
        id: restoration.outageId
      },
      data: {
        status: OutageStatus.RESTORED,
        restoredAt: completedAt
      }
    });
    if (restoration.technicianId) {
      await tx.technician.update({
        where: {
          id: restoration.technicianId
        },
        data: {
          status: TechnicianStatus.AVAILABLE
        }
      });
    }
    return updatedRestoration;
  });
};
var cancelRestorationIntoDB = async (restorationId, payload) => {
  return prisma.$transaction(async (tx) => {
    const restoration = await tx.restoration.findUnique({
      where: {
        id: restorationId
      }
    });
    if (!restoration) {
      throw new AppError(import_http_status32.default.NOT_FOUND, "Restoration not found");
    }
    if (restoration.status === RestorationStatus.COMPLETED) {
      throw new AppError(
        import_http_status32.default.BAD_REQUEST,
        "Completed restoration cannot be cancelled"
      );
    }
    if (restoration.status === RestorationStatus.CANCELLED) {
      throw new AppError(
        import_http_status32.default.BAD_REQUEST,
        "Restoration is already cancelled"
      );
    }
    const cancelledRestoration = await tx.restoration.update({
      where: {
        id: restorationId
      },
      data: {
        status: RestorationStatus.CANCELLED,
        remarks: payload?.remarks ?? restoration.remarks
      }
    });
    if (restoration.technicianId) {
      await tx.technician.update({
        where: {
          id: restoration.technicianId
        },
        data: {
          status: TechnicianStatus.AVAILABLE
        }
      });
    }
    return cancelledRestoration;
  });
};
var getSingleRestorationFromDB = async (restorationId) => {
  const restoration = await prisma.restoration.findUnique({
    where: {
      id: restorationId
    },
    include: {
      outage: {
        include: {
          area: true
        }
      },
      technician: {
        include: {
          user: true
        }
      }
    }
  });
  if (!restoration) {
    throw new AppError(import_http_status32.default.NOT_FOUND, "Restoration not found");
  }
  return restoration;
};
var getAllRestorationsFromDB = async (params) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const skip = (page - 1) * limit;
  const where = {
    ...params.status && {
      status: params.status
    },
    ...params.technicianId && {
      technicianId: params.technicianId
    },
    ...params.outageId && {
      outageId: params.outageId
    }
  };
  const [data, total] = await Promise.all([
    prisma.restoration.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        outage: {
          include: {
            area: true
          }
        },
        technician: true
      }
    }),
    prisma.restoration.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data
  };
};
var updateRestorationIntoDB = async (restorationId, payload) => {
  const restoration = await prisma.restoration.findUnique({
    where: {
      id: restorationId
    }
  });
  if (!restoration) {
    throw new AppError(import_http_status32.default.NOT_FOUND, "Restoration not found");
  }
  if (restoration.status !== RestorationStatus.IN_PROGRESS) {
    throw new AppError(
      import_http_status32.default.BAD_REQUEST,
      "Only in-progress restoration can be updated"
    );
  }
  return prisma.restoration.update({
    where: {
      id: restorationId
    },
    data: {
      remarks: payload.remarks
    }
  });
};
var deleteRestorationFromDB = async (restorationId) => {
  const restoration = await prisma.restoration.findUnique({
    where: {
      id: restorationId
    }
  });
  if (!restoration) {
    throw new AppError(import_http_status32.default.NOT_FOUND, "Restoration not found");
  }
  if (restoration.status === RestorationStatus.COMPLETED) {
    throw new AppError(
      import_http_status32.default.BAD_REQUEST,
      "Completed restoration cannot be deleted"
    );
  }
  return prisma.restoration.delete({
    where: {
      id: restorationId
    }
  });
};
var restorationServices = {
  startRestorationIntoDB,
  completeRestorationIntoDB,
  cancelRestorationIntoDB,
  getSingleRestorationFromDB,
  getAllRestorationsFromDB,
  updateRestorationIntoDB,
  deleteRestorationFromDB
};

// src/app/modules/restoration/restoration.controller.ts
var startRestoration = catchAsync_default(async (req, res) => {
  const result = await restorationServices.startRestorationIntoDB(req.body);
  sendResponse(res, {
    statusCode: import_http_status33.default.CREATED,
    success: true,
    message: "Restoration started successfully",
    data: result
  });
});
var completeRestoration = catchAsync_default(async (req, res) => {
  const result = await restorationServices.completeRestorationIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status33.default.OK,
    success: true,
    message: "Restoration completed successfully",
    data: result
  });
});
var cancelRestoration = catchAsync_default(async (req, res) => {
  const result = await restorationServices.cancelRestorationIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status33.default.OK,
    success: true,
    message: "Restoration cancelled successfully",
    data: result
  });
});
var getAllRestorations = catchAsync_default(async (req, res) => {
  const result = await restorationServices.getAllRestorationsFromDB({
    page: Number(req.query.page),
    limit: Number(req.query.limit),
    status: req.query.status,
    technicianId: req.query.technicianId,
    outageId: req.query.outageId
  });
  sendResponse(res, {
    statusCode: import_http_status33.default.OK,
    success: true,
    message: "Restorations retrieved successfully",
    data: result
  });
});
var getSingleRestoration = catchAsync_default(async (req, res) => {
  const result = await restorationServices.getSingleRestorationFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: import_http_status33.default.OK,
    success: true,
    message: "Restoration retrieved successfully",
    data: result
  });
});
var updateRestoration = catchAsync_default(async (req, res) => {
  const result = await restorationServices.updateRestorationIntoDB(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status33.default.OK,
    success: true,
    message: "Restoration updated successfully",
    data: result
  });
});
var deleteRestoration = catchAsync_default(async (req, res) => {
  const result = await restorationServices.deleteRestorationFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: import_http_status33.default.OK,
    success: true,
    message: "Restoration deleted successfully",
    data: result
  });
});
var restorationControllers = {
  startRestoration,
  completeRestoration,
  cancelRestoration,
  getAllRestorations,
  getSingleRestoration,
  updateRestoration,
  deleteRestoration
};

// src/app/modules/restoration/restoration.route.ts
var router15 = (0, import_express15.Router)();
router15.post(
  "/start",
  auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
  validateRequest(createRestorationValidationSchema),
  restorationControllers.startRestoration
);
router15.patch(
  "/:id/complete",
  auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
  validateRequest(updateRestorationValidationSchema),
  restorationControllers.completeRestoration
);
router15.patch(
  "/:id/cancel",
  auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
  validateRequest(updateRestorationValidationSchema),
  restorationControllers.cancelRestoration
);
router15.get(
  "/",
  auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
  restorationControllers.getAllRestorations
);
router15.get(
  "/:id",
  auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
  restorationControllers.getSingleRestoration
);
router15.patch(
  "/:id",
  auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
  validateRequest(updateRestorationValidationSchema),
  restorationControllers.updateRestoration
);
router15.delete(
  "/:id",
  auth(UserRole.ADMIN),
  restorationControllers.deleteRestoration
);
var restorationRoutes = router15;

// src/app/modules/analytics/analytics.route.ts
var import_express16 = require("express");

// src/app/modules/analytics/analytics.controller.ts
var import_http_status35 = __toESM(require("http-status"), 1);

// src/app/modules/analytics/analytics.service.ts
var import_http_status34 = __toESM(require("http-status"), 1);
var buildDateFilter = (query) => {
  const { startDate, endDate } = query;
  if (!startDate && !endDate) {
    return {};
  }
  const filter = {};
  if (startDate) {
    const date = new Date(startDate);
    if (Number.isNaN(date.getTime())) {
      throw new AppError(import_http_status34.default.BAD_REQUEST, "Invalid startDate");
    }
    filter.startDate = date;
  }
  if (endDate) {
    const date = new Date(endDate);
    if (Number.isNaN(date.getTime())) {
      throw new AppError(import_http_status34.default.BAD_REQUEST, "Invalid endDate");
    }
    date.setHours(23, 59, 59, 999);
    filter.endDate = date;
  }
  return filter;
};
var getOverviewAnalyticsFromDB = async (query) => {
  const { startDate, endDate } = buildDateFilter(query);
  const createdAtFilter = startDate || endDate ? {
    ...startDate && { gte: startDate },
    ...endDate && { lte: endDate }
  } : void 0;
  const outageWhere = {
    deletedAt: null,
    ...createdAtFilter && {
      createdAt: createdAtFilter
    },
    ...query.areaId && {
      areaId: query.areaId
    }
  };
  const [
    totalOutages,
    activeOutages,
    restoredOutages,
    plannedOutages,
    unexpectedOutages,
    criticalOutages,
    totalRestorations,
    completedRestorations,
    restorations
  ] = await Promise.all([
    prisma.outage.count({
      where: outageWhere
    }),
    prisma.outage.count({
      where: {
        ...outageWhere,
        status: {
          in: [
            OutageStatus.REPORTED,
            OutageStatus.VERIFIED,
            OutageStatus.ASSIGNED,
            OutageStatus.IN_PROGRESS
          ]
        }
      }
    }),
    prisma.outage.count({
      where: {
        ...outageWhere,
        status: OutageStatus.RESTORED
      }
    }),
    prisma.outage.count({
      where: {
        ...outageWhere,
        type: OutageType.PLANNED
      }
    }),
    prisma.outage.count({
      where: {
        ...outageWhere,
        type: OutageType.UNEXPECTED
      }
    }),
    prisma.outage.count({
      where: {
        ...outageWhere,
        priority: Priority.CRITICAL
      }
    }),
    prisma.restoration.count({
      where: {
        ...createdAtFilter && {
          createdAt: createdAtFilter
        }
      }
    }),
    prisma.restoration.count({
      where: {
        status: RestorationStatus.COMPLETED,
        ...createdAtFilter && {
          createdAt: createdAtFilter
        }
      }
    }),
    prisma.restoration.findMany({
      where: {
        status: RestorationStatus.COMPLETED,
        startedAt: {
          not: null
        },
        completedAt: {
          not: null
        },
        ...createdAtFilter && {
          createdAt: createdAtFilter
        }
      },
      select: {
        duration: true
      }
    })
  ]);
  const durations = restorations.map((item) => item.duration ?? 0).filter((duration) => duration >= 0);
  const totalDowntimeMinutes = durations.reduce(
    (sum, duration) => sum + duration,
    0
  );
  const averageRestorationMinutes = durations.length > 0 ? Math.round(totalDowntimeMinutes / durations.length) : 0;
  return {
    totalOutages,
    activeOutages,
    restoredOutages,
    plannedOutages,
    unexpectedOutages,
    criticalOutages,
    totalRestorations,
    completedRestorations,
    totalDowntimeMinutes,
    averageRestorationMinutes
  };
};
var getOutageAnalyticsFromDB = async (query) => {
  const { startDate, endDate } = buildDateFilter(query);
  const createdAtFilter = startDate || endDate ? {
    ...startDate && { gte: startDate },
    ...endDate && { lte: endDate }
  } : void 0;
  const where = {
    deletedAt: null,
    ...createdAtFilter && {
      createdAt: createdAtFilter
    },
    ...query.areaId && {
      areaId: query.areaId
    }
  };
  const [
    planned,
    unexpected,
    low,
    medium,
    high,
    critical,
    reported,
    verified,
    assigned,
    inProgress,
    restored,
    closed,
    cancelled
  ] = await Promise.all([
    prisma.outage.count({
      where: {
        ...where,
        type: OutageType.PLANNED
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        type: OutageType.UNEXPECTED
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        priority: Priority.LOW
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        priority: Priority.MEDIUM
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        priority: Priority.HIGH
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        priority: Priority.CRITICAL
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        status: OutageStatus.REPORTED
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        status: OutageStatus.VERIFIED
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        status: OutageStatus.ASSIGNED
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        status: OutageStatus.IN_PROGRESS
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        status: OutageStatus.RESTORED
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        status: OutageStatus.CLOSED
      }
    }),
    prisma.outage.count({
      where: {
        ...where,
        status: OutageStatus.CANCELLED
      }
    })
  ]);
  return {
    byType: [
      {
        type: OutageType.PLANNED,
        count: planned
      },
      {
        type: OutageType.UNEXPECTED,
        count: unexpected
      }
    ],
    byPriority: [
      {
        priority: Priority.LOW,
        count: low
      },
      {
        priority: Priority.MEDIUM,
        count: medium
      },
      {
        priority: Priority.HIGH,
        count: high
      },
      {
        priority: Priority.CRITICAL,
        count: critical
      }
    ],
    byStatus: [
      {
        status: OutageStatus.REPORTED,
        count: reported
      },
      {
        status: OutageStatus.VERIFIED,
        count: verified
      },
      {
        status: OutageStatus.ASSIGNED,
        count: assigned
      },
      {
        status: OutageStatus.IN_PROGRESS,
        count: inProgress
      },
      {
        status: OutageStatus.RESTORED,
        count: restored
      },
      {
        status: OutageStatus.CLOSED,
        count: closed
      },
      {
        status: OutageStatus.CANCELLED,
        count: cancelled
      }
    ]
  };
};
var analyticsServices = {
  getOverviewAnalyticsFromDB,
  getOutageAnalyticsFromDB
};

// src/app/modules/analytics/analytics.controller.ts
var getOverviewAnalytics = catchAsync_default(async (req, res) => {
  const result = await analyticsServices.getOverviewAnalyticsFromDB({
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    areaId: req.query.areaId,
    zoneId: req.query.zoneId,
    feederId: req.query.feederId,
    technicianId: req.query.technicianId
  });
  sendResponse(res, {
    statusCode: import_http_status35.default.OK,
    success: true,
    message: "Analytics overview retrieved successfully",
    data: result
  });
});
var getOutageAnalytics = catchAsync_default(async (req, res) => {
  const result = await analyticsServices.getOutageAnalyticsFromDB({
    startDate: req.query.startDate,
    endDate: req.query.endDate,
    areaId: req.query.areaId,
    zoneId: req.query.zoneId,
    feederId: req.query.feederId,
    technicianId: req.query.technicianId
  });
  sendResponse(res, {
    statusCode: import_http_status35.default.OK,
    success: true,
    message: "Outage analytics retrieved successfully",
    data: result
  });
});
var analyticsControllers = {
  getOverviewAnalytics,
  getOutageAnalytics
};

// src/app/modules/analytics/analytics.route.ts
var router16 = (0, import_express16.Router)();
router16.get(
  "/overview",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  analyticsControllers.getOverviewAnalytics
);
router16.get(
  "/outages",
  auth(UserRole.ADMIN, UserRole.OPERATOR),
  analyticsControllers.getOutageAnalytics
);
var analyticsRoutes = router16;

// src/app/modules/dashboard/dashboard.route.ts
var import_express17 = require("express");

// src/app/modules/dashboard/dashboard.controller.ts
var import_http_status37 = __toESM(require("http-status"), 1);

// src/app/modules/dashboard/dashboard.service.ts
var import_http_status36 = __toESM(require("http-status"), 1);
var getDateRange = () => {
  const start = /* @__PURE__ */ new Date();
  start.setHours(0, 0, 0, 0);
  const end = /* @__PURE__ */ new Date();
  end.setHours(23, 59, 59, 999);
  return { start, end };
};
var getAdminDashboardFromDB = async () => {
  const { start, end } = getDateRange();
  const [
    totalUsers,
    totalTechnicians,
    totalAreas,
    totalFeeders,
    totalSubstations,
    activeOutages,
    todayOutages,
    restoredToday,
    criticalOutages,
    pendingAssignments,
    activeRestorations,
    restorations,
    recentOutages,
    recentRestorations
  ] = await Promise.all([
    prisma.user.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.technician.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.area.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.feeder.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.substation.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.outage.count({
      where: {
        deletedAt: null,
        status: {
          in: [
            OutageStatus.REPORTED,
            OutageStatus.VERIFIED,
            OutageStatus.ASSIGNED,
            OutageStatus.IN_PROGRESS
          ]
        }
      }
    }),
    prisma.outage.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte: start,
          lte: end
        }
      }
    }),
    prisma.outage.count({
      where: {
        deletedAt: null,
        status: OutageStatus.RESTORED,
        restoredAt: {
          gte: start,
          lte: end
        }
      }
    }),
    prisma.outage.count({
      where: {
        deletedAt: null,
        priority: Priority.CRITICAL,
        status: {
          notIn: [
            OutageStatus.RESTORED,
            OutageStatus.CLOSED,
            OutageStatus.CANCELLED
          ]
        }
      }
    }),
    prisma.outageAssignment.count({
      where: {
        status: AssignmentStatus.ASSIGNED
      }
    }),
    prisma.restoration.count({
      where: {
        status: RestorationStatus.IN_PROGRESS
      }
    }),
    prisma.restoration.findMany({
      where: {
        status: RestorationStatus.COMPLETED,
        duration: {
          not: null
        }
      },
      select: {
        duration: true
      }
    }),
    prisma.outage.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10,
      select: {
        id: true,
        title: true,
        type: true,
        priority: true,
        status: true,
        createdAt: true,
        area: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }),
    prisma.restoration.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 10,
      select: {
        id: true,
        status: true,
        startedAt: true,
        completedAt: true,
        duration: true,
        outage: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
  ]);
  const totalDowntimeMinutes = restorations.reduce(
    (sum, item) => sum + (item.duration ?? 0),
    0
  );
  const averageRestorationMinutes = restorations.length > 0 ? Math.round(totalDowntimeMinutes / restorations.length) : 0;
  return {
    overview: {
      totalUsers,
      totalTechnicians,
      totalAreas,
      totalFeeders,
      totalSubstations
    },
    outages: {
      active: activeOutages,
      today: todayOutages,
      restoredToday,
      critical: criticalOutages
    },
    operations: {
      pendingAssignments,
      activeRestorations
    },
    performance: {
      averageRestorationMinutes,
      totalDowntimeMinutes
    },
    recentOutages,
    recentRestorations
  };
};
var getOperatorDashboardFromDB = async () => {
  const { start, end } = getDateRange();
  const [
    activeOutages,
    criticalOutages,
    todayOutages,
    pendingReports,
    pendingAssignments,
    activeRestorations,
    restoredToday,
    recentOutages
  ] = await Promise.all([
    prisma.outage.count({
      where: {
        deletedAt: null,
        status: {
          in: [
            OutageStatus.REPORTED,
            OutageStatus.VERIFIED,
            OutageStatus.ASSIGNED,
            OutageStatus.IN_PROGRESS
          ]
        }
      }
    }),
    prisma.outage.count({
      where: {
        deletedAt: null,
        priority: Priority.CRITICAL,
        status: {
          notIn: [
            OutageStatus.RESTORED,
            OutageStatus.CLOSED,
            OutageStatus.CANCELLED
          ]
        }
      }
    }),
    prisma.outage.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte: start,
          lte: end
        }
      }
    }),
    prisma.outageReport.count({
      where: {
        // Adjust status field if your OutageReport model
        // uses a different status structure.
      }
    }),
    prisma.outageAssignment.count({
      where: {
        status: AssignmentStatus.ASSIGNED
      }
    }),
    prisma.restoration.count({
      where: {
        status: RestorationStatus.IN_PROGRESS
      }
    }),
    prisma.outage.count({
      where: {
        deletedAt: null,
        status: OutageStatus.RESTORED,
        restoredAt: {
          gte: start,
          lte: end
        }
      }
    }),
    prisma.outage.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10,
      select: {
        id: true,
        title: true,
        type: true,
        priority: true,
        status: true,
        createdAt: true,
        area: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
  ]);
  return {
    outages: {
      active: activeOutages,
      critical: criticalOutages,
      today: todayOutages
    },
    operations: {
      pendingReports,
      pendingAssignments,
      activeRestorations,
      restoredToday
    },
    recentOutages
  };
};
var getTechnicianDashboardFromDB = async (technicianId) => {
  if (!technicianId) {
    throw new AppError(import_http_status36.default.BAD_REQUEST, "Technician ID is required");
  }
  const [
    totalAssignments,
    pendingAssignments,
    acceptedAssignments,
    inProgressAssignments,
    completedAssignments,
    activeRestorations,
    completedToday,
    restorations,
    currentRestoration
  ] = await Promise.all([
    prisma.outageAssignment.count({
      where: {
        technicianId
      }
    }),
    prisma.outageAssignment.count({
      where: {
        technicianId,
        status: AssignmentStatus.ASSIGNED
      }
    }),
    prisma.outageAssignment.count({
      where: {
        technicianId,
        status: AssignmentStatus.ACCEPTED
      }
    }),
    prisma.outageAssignment.count({
      where: {
        technicianId,
        status: AssignmentStatus.IN_PROGRESS
      }
    }),
    prisma.outageAssignment.count({
      where: {
        technicianId,
        status: AssignmentStatus.COMPLETED
      }
    }),
    prisma.restoration.count({
      where: {
        technicianId,
        status: RestorationStatus.IN_PROGRESS
      }
    }),
    prisma.restoration.count({
      where: {
        technicianId,
        status: RestorationStatus.COMPLETED,
        completedAt: {
          gte: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0))
        }
      }
    }),
    prisma.restoration.findMany({
      where: {
        technicianId,
        status: RestorationStatus.COMPLETED,
        duration: {
          not: null
        }
      },
      select: {
        duration: true
      }
    }),
    prisma.restoration.findFirst({
      where: {
        technicianId,
        status: RestorationStatus.IN_PROGRESS
      },
      orderBy: {
        startedAt: "desc"
      },
      select: {
        id: true,
        status: true,
        startedAt: true,
        completedAt: true,
        duration: true,
        outage: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
  ]);
  const totalMinutes = restorations.reduce(
    (sum, item) => sum + (item.duration ?? 0),
    0
  );
  const averageRestorationMinutes = restorations.length > 0 ? Math.round(totalMinutes / restorations.length) : 0;
  return {
    assignments: {
      total: totalAssignments,
      pending: pendingAssignments,
      accepted: acceptedAssignments,
      inProgress: inProgressAssignments,
      completed: completedAssignments
    },
    restorations: {
      active: activeRestorations,
      completedToday,
      averageRestorationMinutes
    },
    currentRestoration
  };
};
var dashboardServices = {
  getAdminDashboardFromDB,
  getOperatorDashboardFromDB,
  getTechnicianDashboardFromDB
};

// src/app/modules/dashboard/dashboard.controller.ts
var getAdminDashboard = catchAsync_default(async (req, res) => {
  const result = await dashboardServices.getAdminDashboardFromDB();
  sendResponse(res, {
    statusCode: import_http_status37.default.OK,
    success: true,
    message: "Admin dashboard retrieved successfully",
    data: result
  });
});
var getOperatorDashboard = catchAsync_default(async (req, res) => {
  const result = await dashboardServices.getOperatorDashboardFromDB();
  sendResponse(res, {
    statusCode: import_http_status37.default.OK,
    success: true,
    message: "Operator dashboard retrieved successfully",
    data: result
  });
});
var getTechnicianDashboard = catchAsync_default(
  async (req, res) => {
    const result = await dashboardServices.getTechnicianDashboardFromDB(
      req.params.technicianId
    );
    sendResponse(res, {
      statusCode: import_http_status37.default.OK,
      success: true,
      message: "Technician dashboard retrieved successfully",
      data: result
    });
  }
);
var dashboardControllers = {
  getAdminDashboard,
  getOperatorDashboard,
  getTechnicianDashboard
};

// src/app/modules/dashboard/dashboard.route.ts
var router17 = (0, import_express17.Router)();
router17.get(
  "/admin",
  auth(UserRole.ADMIN),
  dashboardControllers.getAdminDashboard
);
router17.get(
  "/operator",
  auth(UserRole.OPERATOR),
  dashboardControllers.getOperatorDashboard
);
router17.get(
  "/technician/:technicianId",
  auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
  dashboardControllers.getTechnicianDashboard
);
var dashboardRoutes = router17;

// src/app/modules/automatedSchedule/automatedSchedule.route.ts
var import_express18 = require("express");

// src/app/modules/automatedSchedule/automatedSchedule.controller.ts
var import_http_status39 = __toESM(require("http-status"), 1);

// src/app/modules/automatedSchedule/automatedSchedule.service.ts
var import_http_status38 = __toESM(require("http-status"), 1);
var createDateTime = (date, time) => {
  const dateTime = /* @__PURE__ */ new Date(`${date}T${time}:00`);
  if (Number.isNaN(dateTime.getTime())) {
    throw new AppError(
      import_http_status38.default.BAD_REQUEST,
      `Invalid date/time: ${date} ${time}`
    );
  }
  return dateTime;
};
var validateScheduleTime = (startTime, endTime) => {
  if (startTime >= endTime) {
    throw new AppError(
      import_http_status38.default.BAD_REQUEST,
      "End time must be greater than start time"
    );
  }
  const durationMinutes = (endTime.getTime() - startTime.getTime()) / 6e4;
  if (durationMinutes < 15) {
    throw new AppError(
      import_http_status38.default.BAD_REQUEST,
      "Schedule duration must be at least 15 minutes"
    );
  }
  if (durationMinutes > 24 * 60) {
    throw new AppError(
      import_http_status38.default.BAD_REQUEST,
      "Schedule duration cannot exceed 24 hours"
    );
  }
};
var generateSchedulesIntoDB = async (payload) => {
  const {
    areaIds,
    date,
    startTime: start,
    endTime: end,
    title,
    description,
    createdById
  } = payload;
  const startDateTime = createDateTime(date, start);
  const endDateTime = createDateTime(date, end);
  validateScheduleTime(startDateTime, endDateTime);
  const uniqueAreaIds = [...new Set(areaIds)];
  const areas = await prisma.area.findMany({
    where: {
      id: {
        in: uniqueAreaIds
      },
      isActive: true,
      deletedAt: null
    },
    select: {
      id: true,
      name: true,
      code: true
    }
  });
  if (areas.length !== uniqueAreaIds.length) {
    const foundIds = new Set(areas.map((area) => area.id));
    const missingAreaIds = uniqueAreaIds.filter((id) => !foundIds.has(id));
    throw new AppError(
      import_http_status38.default.NOT_FOUND,
      `Active area not found: ${missingAreaIds.join(", ")}`
    );
  }
  const conflicts = await prisma.loadSheddingSchedule.findMany({
    where: {
      areaId: {
        in: uniqueAreaIds
      },
      deletedAt: null,
      status: {
        notIn: [ScheduleStatus.CANCELLED, ScheduleStatus.COMPLETED]
      },
      startTime: {
        lt: endDateTime
      },
      endTime: {
        gt: startDateTime
      }
    },
    select: {
      id: true,
      areaId: true,
      title: true,
      startTime: true,
      endTime: true,
      status: true
    }
  });
  if (conflicts.length > 0) {
    const conflictAreaIds = [
      ...new Set(conflicts.map((conflict) => conflict.areaId))
    ];
    const conflictAreas = areas.filter(
      (area) => conflictAreaIds.includes(area.id)
    );
    const conflictNames = conflictAreas.map((area) => `${area.name} (${area.code})`).join(", ");
    throw new AppError(
      import_http_status38.default.CONFLICT,
      `Schedule conflict detected for: ${conflictNames}`
    );
  }
  const schedules = await prisma.$transaction(
    uniqueAreaIds.map((areaId) => {
      const area = areas.find((item) => item.id === areaId);
      return prisma.loadSheddingSchedule.create({
        data: {
          areaId,
          title: title ?? `Automated Load Shedding - ${area?.name ?? "Area"}`,
          description: description ?? `Automatically generated load shedding schedule for ${area?.name ?? "the selected area"}.`,
          startTime: startDateTime,
          endTime: endDateTime,
          status: ScheduleStatus.DRAFT,
          createdById
        },
        include: {
          area: {
            select: {
              id: true,
              name: true,
              code: true
            }
          }
        }
      });
    })
  );
  return schedules;
};
var getGeneratedSchedulesFromDB = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
  const skip = (page - 1) * limit;
  const where = {
    deletedAt: null,
    ...query.areaId && {
      areaId: query.areaId
    },
    ...query.status && {
      status: query.status
    },
    ...query.startDate && query.endDate && {
      startTime: {
        gte: /* @__PURE__ */ new Date(`${query.startDate}T00:00:00`),
        lte: /* @__PURE__ */ new Date(`${query.endDate}T23:59:59.999`)
      }
    }
  };
  const [data, total] = await Promise.all([
    prisma.loadSheddingSchedule.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        startTime: "desc"
      },
      include: {
        area: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    }),
    prisma.loadSheddingSchedule.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data
  };
};
var getSingleGeneratedScheduleFromDB = async (id) => {
  const schedule = await prisma.loadSheddingSchedule.findFirst({
    where: {
      id,
      deletedAt: null
    },
    include: {
      area: {
        select: {
          id: true,
          name: true,
          code: true,
          zoneId: true,
          substationId: true,
          feederId: true
        }
      }
    }
  });
  if (!schedule) {
    throw new AppError(import_http_status38.default.NOT_FOUND, "Schedule not found");
  }
  return schedule;
};
var publishGeneratedScheduleIntoDB = async (id) => {
  const schedule = await prisma.loadSheddingSchedule.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!schedule) {
    throw new AppError(import_http_status38.default.NOT_FOUND, "Schedule not found");
  }
  if (schedule.status !== ScheduleStatus.DRAFT) {
    throw new AppError(
      import_http_status38.default.BAD_REQUEST,
      `Cannot publish schedule with status ${schedule.status}`
    );
  }
  const published = await prisma.loadSheddingSchedule.update({
    where: {
      id
    },
    data: {
      status: ScheduleStatus.PUBLISHED
    },
    include: {
      area: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });
  return published;
};
var cancelGeneratedScheduleIntoDB = async (id) => {
  const schedule = await prisma.loadSheddingSchedule.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });
  if (!schedule) {
    throw new AppError(import_http_status38.default.NOT_FOUND, "Schedule not found");
  }
  if (schedule.status === ScheduleStatus.COMPLETED) {
    throw new AppError(
      import_http_status38.default.BAD_REQUEST,
      "Completed schedule cannot be cancelled"
    );
  }
  if (schedule.status === ScheduleStatus.CANCELLED) {
    throw new AppError(
      import_http_status38.default.BAD_REQUEST,
      "Schedule is already cancelled"
    );
  }
  return prisma.loadSheddingSchedule.update({
    where: {
      id
    },
    data: {
      status: ScheduleStatus.CANCELLED
    },
    include: {
      area: {
        select: {
          id: true,
          name: true,
          code: true
        }
      }
    }
  });
};
var automatedScheduleServices = {
  generateSchedulesIntoDB,
  getGeneratedSchedulesFromDB,
  getSingleGeneratedScheduleFromDB,
  publishGeneratedScheduleIntoDB,
  cancelGeneratedScheduleIntoDB
};

// src/app/modules/automatedSchedule/automatedSchedule.controller.ts
var generateSchedules = catchAsync_default(async (req, res) => {
  const result = await automatedScheduleServices.generateSchedulesIntoDB(
    req.body
  );
  sendResponse(res, {
    statusCode: import_http_status39.default.CREATED,
    success: true,
    message: "Automated schedules generated successfully",
    data: result
  });
});
var getSchedules = catchAsync_default(async (req, res) => {
  const result = await automatedScheduleServices.getGeneratedSchedulesFromDB({
    page: Number(req.query.page),
    limit: Number(req.query.limit),
    areaId: req.query.areaId,
    status: req.query.status,
    startDate: req.query.startDate,
    endDate: req.query.endDate
  });
  sendResponse(res, {
    statusCode: import_http_status39.default.OK,
    success: true,
    message: "Automated schedules retrieved successfully",
    data: result.data
  });
});
var getSingleSchedule = catchAsync_default(async (req, res) => {
  const result = await automatedScheduleServices.getSingleGeneratedScheduleFromDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: import_http_status39.default.OK,
    success: true,
    message: "Automated schedule retrieved successfully",
    data: result
  });
});
var publishSchedule = catchAsync_default(async (req, res) => {
  const result = await automatedScheduleServices.publishGeneratedScheduleIntoDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: import_http_status39.default.OK,
    success: true,
    message: "Schedule published successfully",
    data: result
  });
});
var cancelSchedule = catchAsync_default(async (req, res) => {
  const result = await automatedScheduleServices.cancelGeneratedScheduleIntoDB(
    req.params.id
  );
  sendResponse(res, {
    statusCode: import_http_status39.default.OK,
    success: true,
    message: "Schedule cancelled successfully",
    data: result
  });
});
var automatedScheduleControllers = {
  generateSchedules,
  getSchedules,
  getSingleSchedule,
  publishSchedule,
  cancelSchedule
};

// src/app/modules/automatedSchedule/automatedSchedule.validation.ts
var import_zod16 = require("zod");
var generateScheduleValidationSchema = import_zod16.z.object({
  areaIds: import_zod16.z.array(import_zod16.z.string().uuid("Invalid area ID")).min(1, "At least one area is required"),
  date: import_zod16.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  startTime: import_zod16.z.string().regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "Start time must be in HH:mm format"
  ),
  endTime: import_zod16.z.string().regex(
    /^([01]\d|2[0-3]):([0-5]\d)$/,
    "End time must be in HH:mm format"
  ),
  title: import_zod16.z.string().max(200, "Title cannot exceed 200 characters").optional(),
  description: import_zod16.z.string().max(1e3, "Description cannot exceed 1000 characters").optional(),
  createdById: import_zod16.z.string().uuid("Invalid creator ID")
});

// src/app/modules/automatedSchedule/automatedSchedule.route.ts
var router18 = (0, import_express18.Router)();
router18.post(
  "/generate",
  auth(UserRole.OPERATOR, UserRole.ADMIN),
  validateRequest(generateScheduleValidationSchema),
  automatedScheduleControllers.generateSchedules
);
router18.get(
  "/",
  auth(UserRole.OPERATOR, UserRole.ADMIN),
  automatedScheduleControllers.getSchedules
);
router18.get(
  "/:id",
  auth(UserRole.OPERATOR, UserRole.ADMIN),
  automatedScheduleControllers.getSingleSchedule
);
router18.patch(
  "/:id/publish",
  auth(UserRole.OPERATOR, UserRole.ADMIN),
  automatedScheduleControllers.publishSchedule
);
router18.patch(
  "/:id/cancel",
  auth(UserRole.OPERATOR, UserRole.ADMIN),
  automatedScheduleControllers.cancelSchedule
);
var automatedScheduleRoutes = router18;

// src/app/modules/admin/admin.route.ts
var import_express19 = require("express");

// src/app/modules/admin/admin.validation.ts
var import_zod17 = require("zod");
var updateUserRoleValidationSchema = import_zod17.z.object({
  role: import_zod17.z.enum(UserRole)
});

// src/app/modules/admin/admin.controller.ts
var import_http_status41 = __toESM(require("http-status"), 1);

// src/app/modules/admin/admin.service.ts
var import_http_status40 = __toESM(require("http-status"), 1);
var getAllUsersFromDB2 = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const where = {
    deletedAt: null
  };
  if (query.searchTerm) {
    where.OR = [
      {
        name: {
          contains: query.searchTerm,
          mode: "insensitive"
        }
      },
      {
        email: {
          contains: query.searchTerm,
          mode: "insensitive"
        }
      }
    ];
  }
  if (query.role) {
    where.role = query.role;
  }
  if (query.status) {
    where.status = query.status;
  }
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            phone: true,
            address: true
          }
        },
        technician: {
          select: {
            id: true,
            employeeId: true,
            status: true,
            verificationStatus: true
          }
        }
      }
    }),
    prisma.user.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: users
  };
};
var updateUserRoleIntoDB = async (adminId, userId, payload, ipAddress) => {
  const newRole = payload.role;
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true
    }
  });
  if (!existingUser) {
    throw new AppError(import_http_status40.default.NOT_FOUND, "User not found");
  }
  if (existingUser.role === newRole) {
    throw new AppError(
      import_http_status40.default.BAD_REQUEST,
      `User already has ${newRole} role`
    );
  }
  if (adminId === userId) {
    throw new AppError(
      import_http_status40.default.BAD_REQUEST,
      "You cannot change your own role"
    );
  }
  const result = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: {
        id: userId
      },
      data: {
        role: newRole
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        updatedAt: true
      }
    });
    await tx.auditLog.create({
      data: {
        actorId: adminId,
        action: "USER_ROLE_CHANGED",
        entity: "USER",
        entityId: userId,
        oldValue: {
          role: existingUser.role
        },
        newValue: {
          role: newRole
        },
        ipAddress: ipAddress || null
      }
    });
    return updatedUser;
  });
  return result;
};
var getAdminDashboardStatsFromDB = async () => {
  const today = /* @__PURE__ */ new Date();
  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(today);
  endOfToday.setHours(23, 59, 59, 999);
  const [
    totalUsers,
    totalCustomers,
    totalTechnicians,
    totalOperators,
    totalAdmins,
    activeUsers,
    blockedUsers,
    totalAreas,
    totalFeeders,
    totalSubstations,
    totalZones,
    activeOutages,
    criticalOutages,
    restoredOutages,
    pendingTechnicians,
    activeRestorations,
    todaySchedules,
    todayAuditLogs
  ] = await Promise.all([
    // Users
    prisma.user.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.user.count({
      where: {
        role: UserRole.CUSTOMER,
        deletedAt: null
      }
    }),
    prisma.user.count({
      where: {
        role: UserRole.TECHNICIAN,
        deletedAt: null
      }
    }),
    prisma.user.count({
      where: {
        role: UserRole.OPERATOR,
        deletedAt: null
      }
    }),
    prisma.user.count({
      where: {
        role: UserRole.ADMIN,
        deletedAt: null
      }
    }),
    prisma.user.count({
      where: {
        status: UserStatus.ACTIVE,
        deletedAt: null
      }
    }),
    prisma.user.count({
      where: {
        status: UserStatus.BLOCKED,
        deletedAt: null
      }
    }),
    // Infrastructure
    prisma.area.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.feeder.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.substation.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.zone.count({
      where: {
        deletedAt: null
      }
    }),
    // Outages
    prisma.outage.count({
      where: {
        deletedAt: null,
        status: {
          in: ["REPORTED", "VERIFIED", "ASSIGNED", "IN_PROGRESS"]
        }
      }
    }),
    prisma.outage.count({
      where: {
        deletedAt: null,
        priority: "CRITICAL",
        status: {
          notIn: ["RESTORED", "CLOSED", "CANCELLED"]
        }
      }
    }),
    prisma.outage.count({
      where: {
        deletedAt: null,
        status: "RESTORED"
      }
    }),
    // Technicians
    prisma.technician.count({
      where: {
        verificationStatus: "PENDING",
        deletedAt: null
      }
    }),
    // Restoration
    prisma.restoration.count({
      where: {
        status: "IN_PROGRESS"
      }
    }),
    // Today's schedules
    prisma.loadSheddingSchedule.count({
      where: {
        deletedAt: null,
        startTime: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    }),
    // Today's audit logs
    prisma.auditLog.count({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday
        }
      }
    })
  ]);
  return {
    users: {
      total: totalUsers,
      customers: totalCustomers,
      technicians: totalTechnicians,
      operators: totalOperators,
      admins: totalAdmins,
      active: activeUsers,
      blocked: blockedUsers
    },
    infrastructure: {
      zones: totalZones,
      substations: totalSubstations,
      feeders: totalFeeders,
      areas: totalAreas
    },
    outages: {
      active: activeOutages,
      critical: criticalOutages,
      restored: restoredOutages
    },
    technicians: {
      pendingVerification: pendingTechnicians
    },
    restorations: {
      active: activeRestorations
    },
    schedules: {
      today: todaySchedules
    },
    auditLogs: {
      today: todayAuditLogs
    }
  };
};
var getAuditLogsFromDB = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const skip = (page - 1) * limit;
  const where = {};
  if (query.action) {
    where.action = query.action;
  }
  if (query.entity) {
    where.entity = query.entity;
  }
  if (query.entityId) {
    where.entityId = query.entityId;
  }
  if (query.actorId) {
    where.actorId = query.actorId;
  }
  if (query.startDate || query.endDate) {
    where.createdAt = {};
    if (query.startDate) {
      where.createdAt.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      where.createdAt.lte = new Date(query.endDate);
    }
  }
  const [logs, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        actorId: true,
        action: true,
        entity: true,
        entityId: true,
        oldValue: true,
        newValue: true,
        ipAddress: true,
        createdAt: true,
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    }),
    prisma.auditLog.count({
      where
    })
  ]);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    },
    data: logs
  };
};
var adminServices = {
  getAllUsersFromDB: getAllUsersFromDB2,
  updateUserRoleIntoDB,
  getAdminDashboardStatsFromDB,
  getAuditLogsFromDB
};

// src/app/modules/admin/admin.controller.ts
var getAllUsers2 = catchAsync_default(async (req, res) => {
  const result = await adminServices.getAllUsersFromDB(req.query);
  sendResponse(res, {
    statusCode: import_http_status41.default.OK,
    success: true,
    message: "Users retrieved successfully!",
    data: result
  });
});
var updateUserRole = catchAsync_default(async (req, res) => {
  const adminId = req.user?.id;
  const userId = req.params.id;
  const ipAddress = req.ip || req.headers["x-forwarded-for"]?.toString();
  const result = await adminServices.updateUserRoleIntoDB(
    adminId,
    userId,
    req.body,
    ipAddress
  );
  sendResponse(res, {
    statusCode: import_http_status41.default.OK,
    success: true,
    message: "User role updated successfully!",
    data: result
  });
});
var getDashboardStats = catchAsync_default(async (_req, res) => {
  const result = await adminServices.getAdminDashboardStatsFromDB();
  sendResponse(res, {
    statusCode: import_http_status41.default.OK,
    success: true,
    message: "Admin dashboard statistics retrieved successfully!",
    data: result
  });
});
var getAuditLogs = catchAsync_default(async (req, res) => {
  const result = await adminServices.getAuditLogsFromDB(req.query);
  sendResponse(res, {
    statusCode: import_http_status41.default.OK,
    success: true,
    message: "Audit logs retrieved successfully!",
    data: result
  });
});
var adminControllers = {
  getAllUsers: getAllUsers2,
  updateUserRole,
  getDashboardStats,
  getAuditLogs
};

// src/app/modules/admin/admin.route.ts
var router19 = (0, import_express19.Router)();
router19.get("/users", auth(UserRole.ADMIN), adminControllers.getAllUsers);
router19.patch(
  "/users/:id/role",
  auth(UserRole.ADMIN),
  validateRequest(updateUserRoleValidationSchema),
  adminControllers.updateUserRole
);
router19.get(
  "/dashboard-stats",
  auth(UserRole.ADMIN),
  adminControllers.getDashboardStats
);
router19.get("/audit-logs", auth(UserRole.ADMIN), adminControllers.getAuditLogs);
var adminRoutes = router19;

// src/app/routes/index.ts
var router20 = (0, import_express20.Router)();
var routerManger = [
  {
    path: "/auth",
    route: authRoutes
  },
  {
    path: "/zones",
    route: zoneRoutes
  },
  {
    path: "/zones",
    route: zoneRoutes
  },
  {
    path: "/substations",
    route: substationRoutes
  },
  {
    path: "/substations",
    route: substationRoutes
  },
  {
    path: "/feeders",
    route: feederRoutes
  },
  {
    path: "/feeders",
    route: feederRoutes
  },
  {
    path: "/areas",
    route: areaRoutes
  },
  {
    path: "/areas",
    route: areaRoutes
  },
  {
    path: "/outages",
    route: outageRoutes
  },
  {
    path: "/outages",
    route: outageRoutes
  },
  {
    path: "/outageReports",
    route: outageReportRoutes
  },
  {
    path: "/outageReports",
    route: outageReportRoutes
  },
  {
    path: "/outageAssignments",
    route: outageAssignmentRoutes
  },
  {
    path: "/technicians",
    route: technicianRoutes
  },
  {
    path: "/load-shedding-schedules",
    route: loadSheddingScheduleRoutes
  },
  {
    path: "/notifications",
    route: notificationRoutes
  },
  {
    path: "/audit-logs",
    route: auditLogRoutes
  },
  {
    path: "/subscriptions",
    route: subscriptionRoutes
  },
  {
    path: "/subscription-payments",
    route: subscriptionPaymentRoutes
  },
  {
    path: "/restorations",
    route: restorationRoutes
  },
  {
    path: "/analytics",
    route: analyticsRoutes
  },
  {
    path: "/dashboard",
    route: dashboardRoutes
  },
  {
    path: "/automated-schedules",
    route: automatedScheduleRoutes
  },
  {
    path: "/admin",
    route: adminRoutes
  }
];
routerManger.forEach((r) => {
  router20.use(r.path, r.route);
});
var routes_default = router20;

// src/app/middleware/globalErrorHandler.ts
var import_http_status42 = __toESM(require("http-status"), 1);
var import_zod18 = require("zod");
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var { JsonWebTokenError, TokenExpiredError, NotBeforeError } = import_jsonwebtoken2.default;
var globalErrorHandler = (err, _req, res, _next) => {
  if (config_default.node_env === "development") {
    console.error("Global Error Handler:", err);
  }
  let statusCode = import_http_status42.default.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let details;
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof import_zod18.ZodError) {
    statusCode = import_http_status42.default.BAD_REQUEST;
    message = "Validation failed.";
    details = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message
    }));
  } else if (err instanceof TokenExpiredError) {
    statusCode = import_http_status42.default.UNAUTHORIZED;
    message = "Your authentication token has expired.";
  } else if (err instanceof NotBeforeError) {
    statusCode = import_http_status42.default.UNAUTHORIZED;
    message = "Your authentication token is not active yet.";
  } else if (err instanceof JsonWebTokenError) {
    statusCode = import_http_status42.default.UNAUTHORIZED;
    message = "Invalid authentication token.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = import_http_status42.default.BAD_REQUEST;
    message = "Invalid data provided.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = import_http_status42.default.CONFLICT;
        message = "A record with the provided unique value already exists.";
        details = err.meta;
        break;
      case "P2003":
        statusCode = import_http_status42.default.BAD_REQUEST;
        message = "Foreign key constraint failed.";
        details = err.meta;
        break;
      case "P2014":
        statusCode = import_http_status42.default.BAD_REQUEST;
        message = "The change violates a required database relation.";
        break;
      case "P2025":
        statusCode = import_http_status42.default.NOT_FOUND;
        message = "The requested record was not found.";
        break;
      case "P2021":
      case "P2022":
        statusCode = import_http_status42.default.INTERNAL_SERVER_ERROR;
        message = "Database configuration error.";
        break;
      default:
        statusCode = import_http_status42.default.INTERNAL_SERVER_ERROR;
        message = "A database error occurred.";
        break;
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    statusCode = import_http_status42.default.SERVICE_UNAVAILABLE;
    switch (err.errorCode) {
      case "P1000":
        message = "Database authentication failed.";
        break;
      case "P1001":
        message = "Unable to connect to the database server.";
        break;
      case "P1002":
        message = "Database connection timed out.";
        break;
      default:
        message = "Unable to initialize the database connection.";
        break;
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = import_http_status42.default.INTERNAL_SERVER_ERROR;
    message = "An unexpected database error occurred.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = import_http_status42.default.INTERNAL_SERVER_ERROR;
    message = "A critical database error occurred.";
  } else if (err instanceof Error) {
    statusCode = import_http_status42.default.INTERNAL_SERVER_ERROR;
    message = config_default.node_env === "development" ? err.message : "Internal Server Error";
  } else {
    statusCode = import_http_status42.default.INTERNAL_SERVER_ERROR;
    message = "An unexpected error occurred.";
  }
  const response = {
    success: false,
    statusCode,
    message
  };
  if (config_default.node_env === "development") {
    response.error = err;
    if (err instanceof Error) {
      response.stack = err.stack;
    }
    if (details) {
      response.details = details;
    }
  }
  res.status(statusCode).json(response);
};

// src/app/middleware/notFound.ts
var import_http_status43 = __toESM(require("http-status"), 1);
var notFound = (req, res) => {
  res.status(import_http_status43.default.NOT_FOUND).json({
    message: "Route not found",
    path: req.originalUrl,
    date: /* @__PURE__ */ new Date()
  });
};

// src/app.ts
var app = (0, import_express21.default)();
app.use(
  (0, import_cors.default)({
    origin: config_default.frontend_url,
    credentials: true
  })
);
app.use(import_express21.default.urlencoded({ extended: true }));
app.use(import_express21.default.json());
app.use((0, import_cookie_parser.default)());
app.use("/api/v1", routes_default);
app.get("/", (_req, res) => {
  res.status(200).send(`
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            :root {
                --navy: #102a4c;
                --navy-dark: #071a31;
                --blue: #0866d8;
                --blue-light: #edf6ff;
                --orange: #ff8a00;
                --green: #58b816;
                --muted: #66788f;
                --border: #e2eaf3;
                --white: #ffffff;
            }

            body {
                min-height: 100vh;

                font-family:
                    Inter,
                    ui-sans-serif,
                    system-ui,
                    -apple-system,
                    BlinkMacSystemFont,
                    "Segoe UI",
                    sans-serif;

                color: var(--navy);
                background: #ffffff;

                -webkit-font-smoothing: antialiased;
                text-rendering: optimizeLegibility;
            }

            .gridcare-page {
                width: 100%;
                min-height: 100vh;
                overflow: hidden;
                background: #ffffff;
            }

            /* =====================================================
               HERO
            ===================================================== */

            .hero {
                position: relative;
                min-height: 570px;

                display: flex;
                align-items: center;

                background:
                    linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0.98) 0%,
                        rgba(255, 255, 255, 0.94) 32%,
                        rgba(255, 255, 255, 0.55) 55%,
                        rgba(255, 255, 255, 0.10) 80%,
                        rgba(255, 255, 255, 0) 100%
                    ),
                    url("/Banner.png")
                    center / cover no-repeat;

                border-bottom: 5px solid var(--orange);
            }

            .hero::after {
                content: "";

                position: absolute;
                left: 50%;
                bottom: -11px;

                width: 340px;
                height: 16px;

                transform: translateX(-50%);

                background: var(--orange);

                border-radius: 0 0 12px 12px;
            }

            .hero-content {
                position: relative;
                z-index: 2;

                width: min(
                    1400px,
                    calc(100% - 48px)
                );

                margin: 0 auto;

                padding: 65px 0;
            }

            /* =====================================================
               BRAND
            ===================================================== */

            .brand {
                margin-bottom: 22px;

                font-size: clamp(
                    58px,
                    7vw,
                    94px
                );

                font-weight: 900;

                letter-spacing: -5px;

                line-height: 0.95;
            }

            .brand-grid {
                color: var(--navy-dark);
            }

            .brand-care {
                color: var(--orange);
            }

            /* =====================================================
               TAGLINE
            ===================================================== */

            .tagline {
                display: flex;
                align-items: center;

                gap: 14px;

                margin-bottom: 40px;

                color: var(--navy);

                font-size: clamp(
                    14px,
                    1.5vw,
                    20px
                );

                font-weight: 700;

                letter-spacing: 1.4px;

                text-transform: uppercase;
            }

            .tagline::before,
            .tagline::after {
                content: "";

                width: 42px;
                height: 3px;

                background: var(--orange);

                border-radius: 10px;
            }

            /* =====================================================
               HERO FEATURES
            ===================================================== */

            .hero-features {
                display: grid;

                grid-template-columns:
                    repeat(4, 1fr);

                width: min(
                    760px,
                    100%
                );
            }

            .hero-feature {
                min-height: 125px;

                display: flex;
                flex-direction: column;

                align-items: center;
                justify-content: center;

                padding: 12px 18px;

                text-align: center;

                border-right:
                    1px solid
                    rgba(
                        16,
                        42,
                        76,
                        0.16
                    );

                transition:
                    transform 0.25s ease,
                    background 0.25s ease;
            }

            .hero-feature:last-child {
                border-right: none;
            }

            .hero-feature:hover {
                transform: translateY(-5px);

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.30
                    );
            }

            .feature-icon {
                width: 64px;
                height: 64px;

                display: flex;
                align-items: center;
                justify-content: center;

                margin-bottom: 13px;

                color: var(--blue);

                background:
                    rgba(
                        237,
                        246,
                        255,
                        0.94
                    );

                border-radius: 50%;

                font-size: 30px;

                box-shadow:
                    0 8px 25px
                    rgba(
                        8,
                        102,
                        216,
                        0.10
                    );
            }

            .hero-feature h3 {
                color: var(--navy);

                font-size: 14px;

                font-weight: 700;

                line-height: 1.45;
            }

            /* =====================================================
               WELCOME
            ===================================================== */

            .welcome {
                position: relative;

                padding: 90px 0 105px;

                background:
                    radial-gradient(
                        circle at 5% 80%,
                        rgba(
                            8,
                            102,
                            216,
                            0.045
                        ),
                        transparent 28%
                    ),
                    radial-gradient(
                        circle at 90% 20%,
                        rgba(
                            255,
                            138,
                            0.045
                        ),
                        transparent 25%
                    ),
                    #ffffff;
            }

            .welcome-container {
                position: relative;
                z-index: 2;

                width: min(
                    1400px,
                    calc(100% - 48px)
                );

                margin: 0 auto;

                display: grid;

                grid-template-columns:
                    1.05fr
                    1.3fr;

                gap: 70px;

                align-items: center;
            }

            /* =====================================================
               WELCOME LEFT
            ===================================================== */

            .welcome-left {
                padding-right: 20px;
            }

            .welcome-badge {
                display: inline-flex;

                align-items: center;

                gap: 12px;

                margin-bottom: 27px;

                padding:
                    10px
                    20px
                    10px
                    12px;

                color: #ffffff;

                background: var(--orange);

                border-radius: 999px;

                font-size: 14px;

                font-weight: 800;

                letter-spacing: 0.5px;

                text-transform: uppercase;

                box-shadow:
                    0 8px 25px
                    rgba(
                        255,
                        138,
                        0,
                        0.20
                    );
            }

            .badge-icon {
                width: 36px;
                height: 36px;

                display: flex;
                align-items: center;
                justify-content: center;

                background:
                    rgba(
                        255,
                        255,
                        255,
                        0.18
                    );

                border-radius: 50%;

                font-size: 18px;
            }

            .welcome-title {
                margin-bottom: 26px;

                color: var(--navy);

                font-size: clamp(
                    36px,
                    4vw,
                    57px
                );

                font-weight: 800;

                letter-spacing: -2.5px;

                line-height: 1.1;
            }

            .welcome-title .accent {
                color: var(--orange);
            }

            .welcome-divider {
                width: 100%;
                height: 1px;

                margin-bottom: 25px;

                background: var(--border);
            }

            /* =====================================================
               MESSAGE
            ===================================================== */

            .welcome-message {
                display: flex;

                align-items: center;

                gap: 22px;
            }

            .message-icon {
                flex: 0 0 auto;

                width: 74px;
                height: 74px;

                display: flex;

                align-items: center;
                justify-content: center;

                color: var(--blue);

                background:
                    var(--blue-light);

                border-radius: 50%;

                font-size: 30px;
            }

            .welcome-message p {
                color: var(--navy);

                font-size: 18px;

                line-height: 1.8;
            }

            .welcome-message strong {
                color: var(--orange);
            }

            /* =====================================================
               VALUES
            ===================================================== */

            .values {
                display: grid;

                grid-template-columns:
                    repeat(4, 1fr);

                gap: 0;
            }

            .value {
                min-height: 235px;

                padding: 0 24px;

                text-align: center;

                border-right:
                    1px solid
                    var(--border);

                transition:
                    transform 0.25s ease;
            }

            .value:last-child {
                border-right: none;
            }

            .value:hover {
                transform: translateY(-5px);
            }

            .value-icon {
                width: 82px;
                height: 82px;

                display: flex;

                align-items: center;
                justify-content: center;

                margin:
                    0
                    auto
                    22px;

                color: var(--blue);

                background:
                    var(--blue-light);

                border-radius: 50%;

                font-size: 34px;
            }

            .value:nth-child(4)
                .value-icon {
                color: var(--green);

                background:
                    #effbe7;
            }

            .value h3 {
                margin-bottom: 13px;

                color: var(--navy);

                font-size: 15px;

                font-weight: 800;
            }

            .value p {
                color: #4d5f75;

                font-size: 13px;

                line-height: 1.8;
            }

            /* =====================================================
               FOOTER
            ===================================================== */

            .footer {
                padding: 22px 24px;

                color: #8492a5;

                background: #f8fafc;

                border-top:
                    1px solid
                    var(--border);

                text-align: center;

                font-size: 13px;
            }

            .footer strong {
                color: var(--navy);
            }

            .footer .orange {
                color: var(--orange);
            }

            /* =====================================================
               TABLET
            ===================================================== */

            @media (max-width: 1050px) {

                .hero {
                    min-height: 530px;

                    background:
                        linear-gradient(
                            90deg,
                            rgba(
                                255,
                                255,
                                255,
                                0.97
                            ) 0%,
                            rgba(
                                255,
                                255,
                                255,
                                0.85
                            ) 50%,
                            rgba(
                                255,
                                255,
                                255,
                                0.25
                            ) 100%
                        ),
                        url("/Banner.png")
                        center / cover no-repeat;
                }

                .welcome-container {
                    grid-template-columns: 1fr;

                    gap: 65px;
                }

                .welcome-left {
                    padding-right: 0;

                    text-align: center;
                }

                .welcome-message {
                    justify-content: center;

                    text-align: left;
                }

                .values {
                    max-width: 900px;

                    margin: 0 auto;
                }
            }

            /* =====================================================
               MOBILE
            ===================================================== */

            @media (max-width: 700px) {

                .hero {
                    min-height: auto;

                    background:
                        linear-gradient(
                            180deg,
                            rgba(
                                255,
                                255,
                                255,
                                0.96
                            ) 0%,
                            rgba(
                                255,
                                255,
                                255,
                                0.90
                            ) 58%,
                            rgba(
                                255,
                                255,
                                255,
                                0.72
                            ) 100%
                        ),
                        url("/Banner.png")
                        center / cover no-repeat;
                }

                .hero-content {
                    width:
                        calc(100% - 32px);

                    padding:
                        65px
                        0
                        60px;
                }

                .brand {
                    font-size:
                        clamp(
                            54px,
                            16vw,
                            78px
                        );

                    letter-spacing: -4px;

                    text-align: center;
                }

                .tagline {
                    justify-content: center;

                    margin-bottom: 34px;

                    font-size: 11px;

                    letter-spacing: 0.7px;

                    text-align: center;
                }

                .tagline::before,
                .tagline::after {
                    width: 25px;
                }

                .hero-features {
                    grid-template-columns:
                        repeat(2, 1fr);

                    width: 100%;

                    background:
                        rgba(
                            255,
                            255,
                            255,
                            0.60
                        );

                    border-radius: 20px;

                    backdrop-filter:
                        blur(6px);
                }

                .hero-feature {
                    min-height: 125px;

                    padding:
                        15px
                        10px;

                    border-right:
                        1px solid
                        rgba(
                            16,
                            42,
                            76,
                            0.12
                        );

                    border-bottom:
                        1px solid
                        rgba(
                            16,
                            42,
                            76,
                            0.12
                        );
                }

                .hero-feature:nth-child(2n) {
                    border-right: none;
                }

                .hero-feature:nth-child(3),
                .hero-feature:nth-child(4) {
                    border-bottom: none;
                }

                .feature-icon {
                    width: 52px;
                    height: 52px;

                    margin-bottom: 9px;

                    font-size: 23px;
                }

                .hero-feature h3 {
                    font-size: 12px;
                }

                .hero::after {
                    width: 190px;
                }

                /* Welcome */

                .welcome {
                    padding:
                        65px
                        0
                        80px;
                }

                .welcome-container {
                    width:
                        calc(100% - 32px);

                    gap: 50px;
                }

                .welcome-badge {
                    font-size: 12px;
                }

                .welcome-title {
                    font-size:
                        clamp(
                            34px,
                            10vw,
                            46px
                        );

                    letter-spacing: -1.8px;
                }

                .welcome-message {
                    align-items:
                        flex-start;
                }

                .message-icon {
                    width: 58px;
                    height: 58px;

                    font-size: 24px;
                }

                .welcome-message p {
                    font-size: 15px;
                }

                /* Values */

                .values {
                    grid-template-columns:
                        repeat(2, 1fr);
                }

                .value {
                    min-height: 220px;

                    padding: 15px;

                    border-right:
                        1px solid
                        var(--border);

                    border-bottom:
                        1px solid
                        var(--border);
                }

                .value:nth-child(2n) {
                    border-right: none;
                }

                .value:nth-child(3),
                .value:nth-child(4) {
                    border-bottom: none;
                }

                .value-icon {
                    width: 68px;
                    height: 68px;

                    margin-bottom: 17px;

                    font-size: 28px;
                }

                .value p {
                    font-size: 12px;
                }
            }

            /* =====================================================
               SMALL MOBILE
            ===================================================== */

            @media (max-width: 420px) {

                .hero-content {
                    padding-top: 52px;
                }

                .values {
                    grid-template-columns: 1fr;
                }

                .value {
                    min-height: auto;

                    padding:
                        25px
                        20px;

                    border-right:
                        none !important;

                    border-bottom:
                        1px solid
                        var(--border) !important;
                }

                .value:last-child {
                    border-bottom:
                        none !important;
                }
            }
        </style>


        <div class="gridcare-page">

            <!-- =================================================
                 HERO
            ================================================== -->

            <section class="hero">

                <div class="hero-content">

                    <div class="brand">
                        <span class="brand-grid">
                            Grid
                        </span><span class="brand-care">
                            Care
                        </span>
                    </div>


                    <div class="tagline">
                        Smart Power Outage Management System
                    </div>


                    <div class="hero-features">

                        <div class="hero-feature">

                            <div class="feature-icon">
                                \u26A1
                            </div>

                            <h3>
                                Real-time<br />
                                Monitoring
                            </h3>

                        </div>


                        <div class="hero-feature">

                            <div class="feature-icon">
                                \u{1F6E1}\uFE0F
                            </div>

                            <h3>
                                Outage<br />
                                Management
                            </h3>

                        </div>


                        <div class="hero-feature">

                            <div class="feature-icon">
                                \u{1F4CA}
                            </div>

                            <h3>
                                Analytics &<br />
                                Insights
                            </h3>

                        </div>


                        <div class="hero-feature">

                            <div class="feature-icon">
                                \u{1F514}
                            </div>

                            <h3>
                                Instant<br />
                                Alerts
                            </h3>

                        </div>

                    </div>

                </div>

            </section>


            <!-- =================================================
                 WELCOME
            ================================================== -->

            <section class="welcome">

                <div class="welcome-container">

                    <div class="welcome-left">

                        <div class="welcome-badge">

                            <span class="badge-icon">
                                \u{1F465}
                            </span>

                            Welcome Aboard

                        </div>


                        <h1 class="welcome-title">

                            Welcome to
                            <span class="accent">
                                GridCare
                            </span>,

                            <br />

                            Powering a Smarter Future!

                        </h1>


                        <div class="welcome-divider"></div>


                        <div class="welcome-message">

                            <div class="message-icon">
                                \u{1F465}
                            </div>

                            <p>

                                We're excited to have you
                                on board.

                                <br />

                                Let's
                                <strong>
                                    power the future
                                </strong>,
                                together.

                            </p>

                        </div>

                    </div>


                    <div class="values">

                        <div class="value">

                            <div class="value-icon">
                                \u26A1
                            </div>

                            <h3>
                                Smart Solutions
                            </h3>

                            <p>
                                Real-time monitoring
                                and intelligent outage
                                management.
                            </p>

                        </div>


                        <div class="value">

                            <div class="value-icon">
                                \u{1F6E1}\uFE0F
                            </div>

                            <h3>
                                Reliable Systems
                            </h3>

                            <p>
                                Built with enterprise-grade
                                security and high reliability.
                            </p>

                        </div>


                        <div class="value">

                            <div class="value-icon">
                                \u{1F4CA}
                            </div>

                            <h3>
                                Efficient Operations
                            </h3>

                            <p>
                                Data-driven insights that
                                optimize decisions and reduce
                                downtime.
                            </p>

                        </div>


                        <div class="value">

                            <div class="value-icon">
                                \u{1F33F}
                            </div>

                            <h3>
                                Sustainable Impact
                            </h3>

                            <p>
                                Supporting a cleaner,
                                smarter and more sustainable
                                future.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            <!-- =================================================
                 FOOTER
            ================================================== -->

            <footer class="footer">

                \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()}

                <strong>
                    Grid<span class="orange">
                        Care
                    </span>
                </strong>.

                All rights reserved.

            </footer>

        </div>
    `);
});
app.use(globalErrorHandler);
app.use(notFound);
var app_default = app;

// src/app/lib/cron.ts
var import_node_cron = __toESM(require("node-cron"), 1);
var deleteUnverifiedTechnicians = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1e3);
    const result = await prisma.user.deleteMany({
      where: {
        role: UserRole.TECHNICIAN,
        emailVerified: false,
        createdAt: {
          lt: oneHourAgo
        },
        technician: {
          verificationStatus: TechnicianVerificationStatus.PENDING
        }
      }
    });
    if (result.count > 0) {
      console.log(
        `\u{1F5D1}\uFE0F Cron: Deleted ${result.count} unverified technician application(s) older than 1 hour.`
      );
    } else {
      console.log(
        "\u2705 Cron: No expired unverified technician applications found."
      );
    }
  } catch (error) {
    console.error(
      "\u274C Cron: Failed to delete unverified technician applications.",
      error
    );
  }
};
var deleteRejectedTechnicians = async () => {
  try {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
    const result = await prisma.user.deleteMany({
      where: {
        role: UserRole.TECHNICIAN,
        createdAt: {
          lt: oneMonthAgo
        },
        technician: {
          verificationStatus: TechnicianVerificationStatus.REJECTED
        }
      }
    });
    if (result.count > 0) {
      console.log(
        `\u{1F5D1}\uFE0F Cron: Deleted ${result.count} rejected technician application(s) older than 30 days.`
      );
    } else {
      console.log(
        "\u2705 Cron: No expired rejected technician applications found."
      );
    }
  } catch (error) {
    console.error(
      "\u274C Cron: Failed to delete rejected technician applications.",
      error
    );
  }
};
var initializeCronJobs = () => {
  import_node_cron.default.schedule("0 * * * *", async () => {
    console.log("\u23F0 Running unverified technician cleanup...");
    await deleteUnverifiedTechnicians();
  });
  import_node_cron.default.schedule("0 2 * * *", async () => {
    console.log("\u23F0 Running rejected technician cleanup...");
    await deleteRejectedTechnicians();
  });
  console.log("\u23F0 Cron jobs initialized successfully.");
};

// src/app/utils/seed.ts
var import_bcryptjs3 = __toESM(require("bcryptjs"), 1);
var import_http_status44 = __toESM(require("http-status"), 1);
var seedAdmin = async () => {
  try {
    const name = config_default.admin_name;
    const email = config_default.admin_email;
    const password = config_default.admin_password;
    if (!name || !email || !password) {
      throw new AppError(
        import_http_status44.default.INTERNAL_SERVER_ERROR,
        "Admin name, email, or password is missing in the environment file."
      );
    }
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (existingAdmin) {
      console.log("\u{1F534} Admin already exists. Skipping admin seed.");
      return;
    }
    const hashedPassword = await import_bcryptjs3.default.hash(
      password,
      Number(config_default.bcrypt_salt_rounds)
    );
    const superAdmin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.ADMIN,
        emailVerified: true
      }
    });
    console.log(`Super Admin created successfully: ${superAdmin.email}`);
  } catch (error) {
    console.error("Error seeding Super Admin:", error);
  }
};
var seedOperator = async () => {
  try {
    const name = config_default.operator_name;
    const email = config_default.operator_email;
    const password = config_default.operator_password;
    if (!name || !email || !password) {
      throw new AppError(
        import_http_status44.default.INTERNAL_SERVER_ERROR,
        "Operator name, email, or password is missing in the environment file."
      );
    }
    const existingOperator = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (existingOperator) {
      console.log("\u{1F3C6} Operator already exists. Skipping operator seed.");
      return;
    }
    const hashedPassword = await import_bcryptjs3.default.hash(
      password,
      Number(config_default.bcrypt_salt_rounds)
    );
    const operator = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.OPERATOR,
        emailVerified: true
      }
    });
    console.log(`Operator created successfully: ${operator.email}`);
  } catch (error) {
    console.error("Error seeding Operator:", error);
  }
};
var seedTechnician = async () => {
  try {
    const name = config_default.technician_name;
    const email = config_default.technician_email;
    const password = config_default.technician_password;
    if (!name || !email || !password) {
      throw new AppError(
        import_http_status44.default.INTERNAL_SERVER_ERROR,
        "Technician name, email, or password is missing in the environment file."
      );
    }
    const existingTechnician = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (existingTechnician) {
      console.log(
        "\u{1F4E6} Technician already exists. Skipping technician seed."
      );
      return;
    }
    const hashedPassword = await import_bcryptjs3.default.hash(
      password,
      Number(config_default.bcrypt_salt_rounds)
    );
    const technician = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: UserRole.TECHNICIAN,
        emailVerified: true
      }
    });
    console.log(`Technician created successfully: ${technician.email}`);
  } catch (error) {
    console.error("Error seeding Technician:", error);
  }
};

// src/server.ts
var PORT = config_default.port;
var main = async () => {
  try {
    await prisma.$connect();
    console.log("\u{1F5C3}\uFE0F  Database connected successfully!!!");
    await redisClient.connect();
    await transporter.verify();
    console.log("\u2B50 Nodemailer Connected Successfully.");
    await seedAdmin();
    await seedOperator();
    await seedTechnician();
    initializeCronJobs();
    app_default.listen(PORT, () => {
      console.log(`\u{1F680} Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("\u274C Error starting the server:", error);
    await redisClient.quit().catch(() => {
    });
    await prisma.$disconnect().catch(() => {
    });
    process.exit(1);
  }
};
main();
//# sourceMappingURL=server.cjs.map