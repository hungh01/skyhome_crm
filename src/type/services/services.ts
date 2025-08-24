import { Equipment } from "./equipmemt";
import { OptionalService } from "./optional";
import { ServiceCategory } from "./service-category";



export interface ServiceSummary {
    _id: string;
    name: string;
}

export interface Service {
    _id: string;
    name: string;
    description: string;
    thumbnail: string;
    status: boolean;
    numberOfCollaborators: number;
    durationMinutes: number;
    price: number;
    equipments?: Equipment[];
    optionalServices?: OptionalService[];
    serviceCategory?: ServiceCategory;
}


export interface ServiceRequest {
    _id?: string;
    name: string;
    description: string;
    thumbnail: string;
    status: boolean;
    numberOfCollaborators: number;
    durationMinutes: number;
    price: number;
    equipments?: Equipment[];
    optionalServices?: string[];
    serviceCategory?: string;
}