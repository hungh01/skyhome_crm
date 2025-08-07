import { ServiceSummary } from "../../services";
import { User } from "../user";
import { Group } from "./group";

export interface Collaborator {
    _id: string;
    code: string;
    activeDate: string;
    commissionRate: number;
    areas: { ward: string; city: string; code: string }[];
    userId: User;
    group: Group;
    services: ServiceSummary[];
    status: string;
    joinedAt: string;
}


export interface CollaboratorFormData {
    fullName: string;
    age: number;
    gender: number;
    address: string;
    phone: string;
    password: string;
    confirmPassword: string;
    referralCode: string;
    areas: string[];
    services: string[];
}

