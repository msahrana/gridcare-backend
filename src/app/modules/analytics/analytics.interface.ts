export interface IAnalyticsDateFilter {
    startDate?: Date;
    endDate?: Date;
}

export interface IAnalyticsQuery {
    startDate?: string;
    endDate?: string;
    zoneId?: string;
    areaId?: string;
    feederId?: string;
    technicianId?: string;
}

export interface IOverviewAnalytics {
    totalOutages: number;
    activeOutages: number;
    restoredOutages: number;
    plannedOutages: number;
    unexpectedOutages: number;
    criticalOutages: number;

    totalRestorations: number;
    completedRestorations: number;

    totalDowntimeMinutes: number;
    averageRestorationMinutes: number;
}

export interface IOutageAnalytics {
    byType: Array<{
        type: string;
        count: number;
    }>;

    byPriority: Array<{
        priority: string;
        count: number;
    }>;

    byStatus: Array<{
        status: string;
        count: number;
    }>;
}

export interface IAreaAnalytics {
    areaId: string;
    areaName: string;
    totalOutages: number;
    unexpectedOutages: number;
    plannedOutages: number;
    restoredOutages: number;
    totalDowntimeMinutes: number;
    averageRestorationMinutes: number;
}

export interface ITechnicianAnalytics {
    technicianId: string;
    technicianName: string;
    assignedOutages: number;
    completedRestorations: number;
    totalRestorationMinutes: number;
    averageRestorationMinutes: number;
}

export interface ITrendAnalytics {
    date: string;
    totalOutages: number;
    plannedOutages: number;
    unexpectedOutages: number;
    restoredOutages: number;
}
