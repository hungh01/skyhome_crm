import { ServiceSummary } from "../../services";
import { User } from "../user";
import { Group } from "./group";

export interface Collaborator {
    _id: string;
    code: string;
    activeDate: string;
    commissionRate: number;
    area: string;
    user: User;
    group: Group;
    services: ServiceSummary[];
    status: string;
    joinedAt: string; // Optional field for created date
}

