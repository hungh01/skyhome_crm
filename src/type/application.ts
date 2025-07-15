export interface CtvApplication {
    id: string;
    stt: number;
    ctvCode: string;
    createdDate: string;
    createdTime: string;
    name: string;
    phone: string;
    rating: number;
    area: string;
    serviceType: string;
    status: 'pending' | 'processing' | 'approved' | 'rejected' | 'contacted';
    avatar?: string;
}

export interface ApplicationStats {
    total: number;
    pending: number;
    processing: number;
    approved: number;
    rejected: number;
    contacted: number;
}

export interface ApplicationFilters {
    status?: string;
    area?: string;
    serviceType?: string;
    search?: string;
}
