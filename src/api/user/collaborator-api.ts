
import { CollaboratorListResponse } from "@/type/user/collaborator/collaborator-list-response"
import { fetcher } from "../fetcher-api"
import { BACKEND_URL } from "@/common/api"
import { Collaborator } from "@/type/user/collaborator/collaborator"


// Fetch collaborator list with optional filters
export const collaboratorListApi = (page: number = 1, pageSize: number = 10, code: string = '', createAt: string = '', search: string = '', rank: string = '', address: string = '') => {
    return fetcher<CollaboratorListResponse>(`${BACKEND_URL}/ctv?page=${page}&pageSize=${pageSize}&code=${code}&createAt=${createAt}&search=${search}&rank=${rank}&address=${address}`)
}

export const collaboratorDetailApi = (id: string) => {
    return fetcher<Collaborator>(`${BACKEND_URL}/ctv/${id}`)
}
