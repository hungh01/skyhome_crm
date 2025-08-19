import { Service } from "@/type/services/services";
import { Collaborator } from "./collaborator";
import { Area } from "@/type/area/area";

export interface Group {
    _id: string;
    name: string;
    services: Service[];
    areas: Area[];
    status: string;
    leaderId: Collaborator;
    memberIds: Collaborator[];
    description: string;
    commissionRate: number;
}
