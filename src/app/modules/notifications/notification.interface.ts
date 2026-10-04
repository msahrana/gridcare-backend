import { Notification } from '../../../generated/prisma/client';

export type ICreateNotificationPayload = {
    userId: string;
    title: string;
    message: string;
};

export type INotificationResponse = Notification;

export interface INotificationQuery {
    page?: string | number;
    limit?: string | number;
    searchTerm?: string;
}

