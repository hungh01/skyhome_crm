
import { CollaboratorListResponse } from "@/type/user/collaborator/collaborator-list-response"
import { fetcher } from "../fetcher-api"
import { BACKEND_URL } from "@/common/api"
import { Collaborator, CollaboratorFormData } from "@/type/user/collaborator/collaborator"
import { ErrorResponse } from "@/type/error"


// Fetch collaborator list with optional filters
export const collaboratorListApi = (page: number = 1, pageSize: number = 10, code: string = '', createAt: string = '', search: string = '', rank: string = '', address: string = '') => {
    return fetcher<CollaboratorListResponse>(`${BACKEND_URL}/collaborator?page=${page}&pageSize=${pageSize}&code=${code}&createAt=${createAt}&search=${search}&rank=${rank}&address=${address}`)
}

export const collaboratorDetailApi = (id: string) => {
    return fetcher<Collaborator>(`${BACKEND_URL}/collaborator/${id}`)
}


// Get all services to display in create collaborator form
export const collaboratorServicesApi = () => {
    return fetcher<{ services: { _id: string, name: string }[] }>(`${BACKEND_URL}/service?type=personal`)
}

// get all areas to display in create collaborator form
export const collaboratorAreasApi = () => {
    return fetcher<{ areas: { _id: string, ward: string, city: string, code: string }[] }>(`${BACKEND_URL}/area`)
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

