import { fetcher } from "@/api/fetcher-api";
import { BACKEND_URL } from "@/common/api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Order } from "@/type/order";
import { Transaction } from "@/type/transaction";
import { UserListResponse } from "@/type/user/customer/customer-list-response";

import { User } from "@/type/user/user";

// Fetch customer list with optional filters
export const customerListApi = (page: number = 1, pageSize: number = 10, code: string = '', createAt: string = '', search: string = '', rank: string = '', address: string = '') => {
    return fetcher<UserListResponse>(`${BACKEND_URL}/customer?page=${page}&pageSize=${pageSize}&code=${code}&createAt=${createAt}&search=${search}&rank=${rank}&address=${address}`)
}

// Fetch user details by ID
export const customerDetailApi = (id: string) => {
    return fetcher<DetailResponse<User>>(`${BACKEND_URL}/customer/${id}`)
};

// Create a new customer
export const createCustomerApi = (user: User) => {
    return fetcher<User>(`${BACKEND_URL}/customer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
}

// Update customer
export const updateCustomerApi = (user: User) => {
    return fetcher<User>(`${BACKEND_URL}/customer/${user._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
};

// Get Order list by user ID
export const getOrderListByUserIdApi = (userId: string, page: number = 1, pageSize: number = 3, day: string = '', service: string = '', location: string = '') => {
    return fetcher<DetailResponse<Order[]>>(`${BACKEND_URL}/order/user/${userId}?page=${page}&pageSize=${pageSize}&day=${day}&service=${service}&location=${location}`);
};

// Get Transaction list by user ID
export const getTransactionListByUserIdApi = (userId: string, page: number = 1, pageSize: number = 3) => {
    return fetcher<DetailResponse<Transaction[]>>(`${BACKEND_URL}/transaction/user/${userId}?page=${page}&pageSize=${pageSize}`);
}
