export interface Equipment {
    id: string;
    name: string;
    price: number;
    status: boolean;
    description?: string;
}

export interface ServiceSummary {
    id: string;
    name: string;
}

export interface Service {
    id: string;
    name: string;
    status: boolean;
    description?: string;
    basePrice: number;
    estimatedTime: number; // in minutes
    equipment?: Equipment[];
    category?: 'personal' | 'business';
}