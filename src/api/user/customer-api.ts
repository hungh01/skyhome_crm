import { fetcher } from "@/api/fetcher-api";
import { BACKEND_URL } from "@/common/api";
import { CustomerListResponse } from "@/type/user/customer/customer-list-respone";
import { User } from "@/type/user/user";

// Fetch customer list with optional filters
export const customerListApi = (page: number = 1, pageSize: number = 10, code: string = '', createAt: string = '', search: string = '', rank: string = '', address: string = '') => {
    return fetcher<CustomerListResponse>(`${BACKEND_URL}/users?page=${page}&pageSize=${pageSize}&code=${code}&createAt=${createAt}&search=${search}&rank=${rank}&address=${address}`)
}

// Fetch user details by ID
export const customerDetailApi = (id: string) => {
    return fetcher<User>(`${BACKEND_URL}/users/${id}`)
}
