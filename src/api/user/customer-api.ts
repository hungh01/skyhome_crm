import { fetcher } from "@/api/fetcher-api";
import { BACKEND_URL } from "@/common/api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ErrorResponse } from "@/type/error";
import { FavoriteCollaborator } from "@/type/favorite-partner";
import { Order } from "@/type/order";
import { Transaction } from "@/type/transaction";
import { Customer } from "@/type/user/customer/customer";
import { User } from "@/type/user/user";

// Fetch customer list with optional filters
export const customerListApi = (page: number = 1, pageSize: number = 10, code: string = '', createAt: string = '', search: string = '', rank: string = '', address: string = '') => {
    return fetcher<DetailResponse<Customer[]> | ErrorResponse>(`${BACKEND_URL}/customer_manager?page=${page}&pageSize=${pageSize}&code=${code}&createAt=${createAt}&search=${search}&rank=${rank}&address=${address}`)
}


// Create a new customer
export const createCustomerApi = (user: User) => {
    return fetcher<User | ErrorResponse>(`${BACKEND_URL}/customer_manager`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
}

// Update customer
export const updateCustomerApi = (user: User) => {
    return fetcher<User>(`${BACKEND_URL}/customer_manager/${user._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
};

// Get Order list by user ID
export const getOrderListByUserIdApi = (userId: string, page: number = 1, pageSize: number = 3, day: string = '', service: string = '', location: string = '') => {
    return fetcher<DetailResponse<Order[]>>(`${BACKEND_URL}/order_manager/customer/${userId}?page=${page}&pageSize=${pageSize}&day=${day}&service=${service}&location=${location}`);
};

// Get Transaction list by user ID
export const getTransactionListByUserIdApi = (userId: string, page: number = 1, pageSize: number = 3) => {
    return fetcher<DetailResponse<Transaction[]>>(`${BACKEND_URL}/customer_manager/${userId}/transactions?page=${page}&pageSize=${pageSize}`);
}

export const customerDetailApi = (id: string) => {
    return fetcher<DetailResponse<Customer>>(`${BACKEND_URL}/customer_manager/${id}`);
}

export const likeOrUlikeOfUserApi = (id: string, type: 'liked' | 'disliked', page: number, pageSize: number) => {
    return fetcher<DetailResponse<FavoriteCollaborator[]>>(`${BACKEND_URL}/customer_manager/${id}/liked-disliked?type=${type}&page=${page}&pageSize=${pageSize}`);
}