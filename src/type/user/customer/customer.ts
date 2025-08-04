import { User } from "../user";

export interface Customer {
    _id: string;
    code: string;
    activeDate: string;
    area: string;
    user: User;
    status: string;
    joinedAt: string
}