
import { Collaborator } from "./collaborator";
import { Area } from "@/type/area/area";
import { ServiceCategory } from "@/type/services/service-category";

export interface Group {
    _id: string;
    name: string;
    serviceType: ServiceCategory[];
    areas: Area[];
    status: string;
    leaderId: Collaborator;
    memberIds: Collaborator[];
    description: string;
    commissionRate: number;
}
