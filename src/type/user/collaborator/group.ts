import { Service } from "@/type/services";
import { Collaborator } from "./collaborator";
import { Area } from "@/type/area/area";

export interface Group {
    _id: string;
    name: string;
    services: Service[];
    areas: Area[];
    leaderId: Collaborator;
    memberIds: Collaborator[];
    description: string;
    commissionRate: number;
}
