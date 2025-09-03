import { Order } from "../order/order";
import { Collaborator } from "../user/collaborator/collaborator";
import { Group } from "../user/collaborator/group";
import { Customer } from "../user/customer/customer";

export interface Transaction {
    _id: string;
    idView: string;
    idCustomer?: Customer | null;
    idCollaborator?: Collaborator | null;
    idGroupCollaborator?: Group | null;
    idOrder?: Order | null;
    idPunishment?: string | null;
    idStaffCreated?: string | null;
    idStaffVerify?: string | null;
    dateVerify: string;
    title?: string | null;
    money: number;
    transferNote?: string | null;
    kindTransaction: string;
    typeTransaction: string;
    paymentIn: string;
    paymentOut: string;
    status: 'pending' | 'processing' | 'done' | 'failed' | 'cancel' | 'refund';
    isDeleted: boolean;
    createdAt: string;
}