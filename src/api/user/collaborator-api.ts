

import { fetcher } from "../fetcher-api"
import { BACKEND_URL } from "@/common/api"
import { Collaborator, CollaboratorFormData } from "@/type/user/collaborator/collaborator"
import { ErrorResponse } from "@/type/error"
import { DetailResponse } from "@/type/detailResponse/detailResponse"
import { Order } from "@/type/order"
import { Transaction } from "@/type/transaction"
import { Review } from "@/type/review/review"


// Fetch collaborator list with optional filters
export const collaboratorListApi = (page: number = 1, pageSize: number = 10, code: string = '', createAt: string = '', search: string = '', rank: string = '', address: string = '', status: string = '') => {
    return fetcher<DetailResponse<Collaborator[]> | ErrorResponse>(`${BACKEND_URL}/collaborator?page=${page}&pageSize=${pageSize}&code=${code}&createAt=${createAt}&search=${search}&rank=${rank}&address=${address}&status=${status}`)
}

export const collaboratorDetailApi = (id: string) => {
    return fetcher<DetailResponse<Collaborator> | ErrorResponse>(`${BACKEND_URL}/collaborator/${id}`)
}

// Get all services to display in create collaborator form
export const collaboratorServicesApi = () => {
    return fetcher<DetailResponse<{ _id: string, name: string }[]>>(`${BACKEND_URL}/service?type=personal`)
}

// get all areas to display in create collaborator form
export const collaboratorAreasApi = () => {
    return fetcher<DetailResponse<{ _id: string, ward: string, city: string, code: string }[]>>(`${BACKEND_URL}/area`)
}

// Create a new collaborator
export const createCollaboratorApi = (data: CollaboratorFormData) => {
    return fetcher<Collaborator | ErrorResponse>(`${BACKEND_URL}/user/create-collaborator`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

// get Order list by collaborator ID
export const getOrderListByCollaboratorIdApi = (collaboratorId: string, page: number = 1, pageSize: number = 3, day: string = '', service: string = '', location: string = '') => {
    return fetcher<DetailResponse<Order[]> | ErrorResponse>(`${BACKEND_URL}/collaborator/${collaboratorId}/orders?page=${page}&pageSize=${pageSize}&day=${day}&service=${service}&location=${location}`);
}

// get Transaction list by collaborator ID
export const getTransactionListByCollaboratorIdApi = (collaboratorId: string, page: number = 1, pageSize: number = 3) => {
    return fetcher<DetailResponse<Transaction[]> | ErrorResponse>(`${BACKEND_URL}/collaborator/${collaboratorId}/transactions?page=${page}&pageSize=${pageSize}`);
}

// get Review list by collaborator ID
export const getReviewListByCollaboratorIdApi = (collaboratorId: string, page: number = 1, pageSize: number = 3) => {
    return fetcher<DetailResponse<Review[]> | ErrorResponse>(`${BACKEND_URL}/review/collaborator/${collaboratorId}?page=${page}&pageSize=${pageSize}`);
}

// Update collaborator status
export const updateCollaboratorStatusApi = (collaboratorId: string, status: string) => {
    return fetcher<DetailResponse<Collaborator> | ErrorResponse>(`${BACKEND_URL}/collaborator/${collaboratorId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
    });
}

