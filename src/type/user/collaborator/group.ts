import { Collaborator } from "./collaborator";

export interface Group {
    id: string;
    leader: string;
    phoneLeader: string;
    imageLeader: string;
    groupName: string;
    rate: number;
    address: string;
    memberActive: number;
    memberTotal: number;
    members: Collaborator[];
}

