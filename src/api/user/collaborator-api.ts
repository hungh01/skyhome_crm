

import { fetcher } from "../fetcher-api"
import { BACKEND_URL } from "@/common/api"
import { Collaborator, CollaboratorFormData } from "@/type/user/collaborator/collaborator"
import { ErrorResponse } from "@/type/error"
import { DetailResponse } from "@/type/detailResponse/detailResponse"
import { Order } from "@/type/order/order"
import { Transaction } from "@/type/transaction/transaction"


// Fetch collaborator list with optional filters
export const collaboratorListApi = (page: number = 1, pageSize: number = 10, code: string = '', createAt: string = '', search: string = '', rank: string = '', address: string = '', status: string = '') => {
    return fetcher<DetailResponse<Collaborator[]> | ErrorResponse>(`${BACKEND_URL}/collaborator_manager?page=${page}&pageSize=${pageSize}&code=${code}&createAt=${createAt}&search=${search}&rank=${rank}&address=${address}&status=${status}`)
}

export const collaboratorDetailApi = (id: string) => {
    return fetcher<DetailResponse<Collaborator> | ErrorResponse>(`${BACKEND_URL}/collaborator_manager/${id}`)
}

// Get all services to display in create collaborator form
export const collaboratorServicesApi = () => {
    return fetcher<DetailResponse<{ _id: string, name: string }[]>>(`${BACKEND_URL}/service_manager?type=personal`)
}

// get all areas to display in create collaborator form
export const collaboratorAreasApi = () => {
    return fetcher<DetailResponse<{ _id: string, ward: string, city: string, code: string }[]>>(`${BACKEND_URL}/area_manager`)
}

// Create a new collaborator
export const createCollaboratorApi = (data: CollaboratorFormData) => {
    return fetcher<Collaborator | ErrorResponse>(`${BACKEND_URL}/user_manager/create-collaborator`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

// get Order list by collaborator ID
export const getOrderListByCollaboratorIdApi = (collaboratorId: string, page: number = 1, pageSize: number = 3, day: string = '', service: string = '', location: string = '') => {
    return fetcher<DetailResponse<Order[]> | ErrorResponse>(`${BACKEND_URL}/order_manager/collaborator/${collaboratorId}?page=${page}&pageSize=${pageSize}&day=${day}&service=${service}&location=${location}`);
}

// get Transaction list by collaborator ID
export const getTransactionListByCollaboratorIdApi = (collaboratorId: string, page: number = 1, pageSize: number = 3) => {
    return fetcher<DetailResponse<Transaction[]> | ErrorResponse>(`${BACKEND_URL}/transaction_manager/collaborator/${collaboratorId}?page=${page}&pageSize=${pageSize}`);
}


// get Orders with reviews (rating, comment, or images) by collaborator ID
export const getOrdersWithReviewsByCollaboratorIdApi = (collaboratorId: string, page: number = 1, pageSize: number = 3) => {
    return fetcher<DetailResponse<Order[]> | ErrorResponse>(`${BACKEND_URL}/order_manager/collaborator/${collaboratorId}/reviews?page=${page}&pageSize=${pageSize}`);
}

// Update collaborator status
export const updateCollaboratorStatusApi = (collaboratorId: string, status: string) => {
    return fetcher<DetailResponse<Collaborator> | ErrorResponse>(`${BACKEND_URL}/collaborator_manager/${collaboratorId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
    });
}

