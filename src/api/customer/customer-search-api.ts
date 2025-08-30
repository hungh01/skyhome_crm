import { fetcher } from "@/api/fetcher-api";
import { BACKEND_URL } from "@/common/api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Customer } from "@/type/user/customer/customer";


// API để tìm kiếm khách hàng
export const searchCustomersApi = async (query: string = '', page: number = 1, pageSize: number = 50): Promise<DetailResponse<Customer[]>> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        if (query && query.trim()) {
            params.append('search', query.trim());
        }

        const response = await fetcher<DetailResponse<Customer[]>>(
            `${BACKEND_URL}/customer_manager?${params.toString()}`
        );

        return response;
    } catch (error) {
        console.error('Error searching customers:', error);
        return { data: [] };
    }
};

