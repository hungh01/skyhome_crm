import { Equipment } from "./equipmemt";
import { OptionalService } from "./optional";
export type { OptionalService };
import { ServicePack } from "./service-pack";


export interface ServiceSummary {
    _id: string;
    name: string;
}

export interface Service {
    _id: string;
    name: string;
    image: string;
    status: boolean;
    durationMinutes: number;
    price: number;
    equipments?: Equipment[];
    optionalServices?: OptionalService[];
    category?: 'personal' | 'business';
}