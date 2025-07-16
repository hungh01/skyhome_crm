import { OptionalService } from "./services/optional";
export type { OptionalService };
import { ServicePack } from "./services/service-pack";

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
    servicePacks: ServicePack[];
    equipment?: Equipment[];
    optionalServices?: OptionalService[];
    category?: 'personal' | 'business';
}