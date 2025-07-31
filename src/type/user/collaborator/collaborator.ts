import { ServiceSummary } from "../../services";
import { User } from "../user";

export interface Collaborator {
    _id: string;
    image: string;
    code: string;
    activeDate: string;
    user: User;
    rate: number;
    services: ServiceSummary[];
    status: string;
    joinedAt: string; // Optional field for created date
}

