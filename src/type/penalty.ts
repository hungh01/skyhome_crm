export interface Penalty {
    id: string;
    stt: number;
    penaltyCode: string;
    createdDate: string;
    createdTime: string;
    staffName: string;
    staffPhone: string;
    staffLevel: string;
    amount: number;
    orderCode: string;
    implementationDate: string;
    implementationTime: string;
    violationType: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    content: string;
    status: 'pending' | 'approved' | 'processing' | 'completed' | 'cancelled' | 'invalid';
    note?: string;
}

export interface PenaltyStats {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    invalid: number;
    expired: number;
}

export interface PenaltyFilters {
    status?: string;
    dateRange?: [string, string];
    staffType?: string;
    search?: string;
}
