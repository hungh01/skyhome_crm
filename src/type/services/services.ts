import { User } from "../user/user";
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
    price: number;
    durationMinutes: number;
    image: string;
    isActive: boolean;
    status: boolean;
    categoryId: ServiceCategory;
    createdBy?: User;
    thumbnail: string;
    numberOfCollaborators: number;
    optionalServices: OptionalService[];
    isDeleted: boolean;
}

export interface ServiceRequest {
    _id?: string;
    name?: string;
    description?: string;
    price?: number;
    durationMinutes?: number;
    image?: string;
    isActive?: boolean;
    status?: boolean;
    categoryId?: string;
    createdBy?: string;
    thumbnail?: string;
    numberOfCollaborators?: number;
    optionalServices?: string[];
    isDeleted?: boolean;
}

