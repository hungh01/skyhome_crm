
import { CollaboratorListResponse } from "@/type/user/collaborator/collaborator-list-response"
import { fetcher } from "../fetcher-api"
import { BACKEND_URL } from "@/common/api"


// Fetch collaborator list with optional filters
export const collaboratorListApi = (page: number = 1, pageSize: number = 10, code: string = '', createAt: string = '', search: string = '', rank: string = '', address: string = '') => {
    return fetcher<CollaboratorListResponse>(`${BACKEND_URL}/ctv?page=${page}&pageSize=${pageSize}&code=${code}&createAt=${createAt}&search=${search}&rank=${rank}&address=${address}`)
}
