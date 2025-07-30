import { Dayjs } from "dayjs";
import { fetcher } from "@/api/fetcher-api";
import { BACKEND_URL } from "@/common/api";
import { CustomerListResponse } from "@/type/user/customer/customer-list-respone";

export const customerListApi = (page: number = 1, pageSize: number = 10, code: string = '', createAt: Dayjs | '' = '', search: string = '', rank: string = '', address: string = '') => {
    return fetcher<CustomerListResponse>(`${BACKEND_URL}/users?page=${page}&pageSize=${pageSize}&code=${code}&createAt=${createAt}&search=${search}&rank=${rank}&address=${address}`)
}
