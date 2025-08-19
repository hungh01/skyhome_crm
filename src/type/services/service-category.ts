import { Service } from "./services";

export interface ServiceCategory {
    _id: string;
    name: string;
    status: boolean;
    description?: string;
    services: Service[];
    category?: 'personal' | 'business';
}
