export interface IRecentOutage {
    id: string;
    title: string;
    type: string;
    priority: string;
    status: string;
    area: {
        id: string;
        name: string;
    };
    createdAt: Date;
}

export interface IRecentRestoration {
    id: string;
    status: string;
    startedAt: Date | null;
    completedAt: Date | null;
    duration: number | null;
    outage: {
        id: string;
        title: string;
    };
}

export interface IAdminDashboard {
    overview: {
        totalUsers: number;
        totalTechnicians: number;
        totalAreas: number;
        totalFeeders: number;
        totalSubstations: number;
    };

    outages: {
        active: number;
        today: number;
        restoredToday: number;
        critical: number;
    };

    operations: {
        pendingAssignments: number;
        activeRestorations: number;
    };

    performance: {
        averageRestorationMinutes: number;
        totalDowntimeMinutes: number;
    };

    recentOutages: IRecentOutage[];
    recentRestorations: IRecentRestoration[];
}

export interface IOperatorDashboard {
    outages: {
        active: number;
        critical: number;
        today: number;
    };

    operations: {
        pendingReports: number;
        pendingAssignments: number;
        activeRestorations: number;
        restoredToday: number;
    };

    recentOutages: IRecentOutage[];
}

export interface ITechnicianDashboard {
    assignments: {
        total: number;
        pending: number;
        accepted: number;
        inProgress: number;
        completed: number;
    };

    restorations: {
        active: number;
        completedToday: number;
        averageRestorationMinutes: number;
    };

    currentRestoration: IRecentRestoration | null;
}

export interface ICustomerDashboard {
    outage: {
        current: IRecentOutage | null;
    };

    outages: {
        recent: number;
        planned: number;
        unexpected: number;
    };

    reports: {
        total: number;
        pending: number;
    };

    subscription: unknown | null;

    notifications: number;
}
