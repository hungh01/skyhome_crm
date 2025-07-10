import { ServiceSummary } from "./services";

export interface Partner {
    id: string;
    image: string;
    code: string;
    activeDate: string;
    name: string;
    phoneNumber: string;
    rate: number;
    address: string;
    sex: string;
    age: number;
    services: ServiceSummary[];
    status: string;
    createdAt: string; // Optional field for created date
}

