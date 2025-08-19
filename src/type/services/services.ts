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
    image: string;
    status: boolean;
    numberOfPeople: number;
    durationMinutes: number;
    price: number;
    equipments?: Equipment[];
    optionalServices?: OptionalService[];
    serviceCategory?: ServiceCategory;
}