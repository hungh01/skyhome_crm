import { BACKEND_URL } from "@/common/api"
import { fetcher } from "../fetcher-api"




// Fetch collaborator list with optional filters
export const couponListApi = (page: number = 1, pageSize: number = 10) => {
    return fetcher(`${BACKEND_URL}/ctv?page=${page}&pageSize=${pageSize}`)
}
