import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { fetcher } from "../fetcher-api";
import { Order } from "@/type/order/order";
import { ErrorResponse } from "@/type/error";
import { BACKEND_URL } from "@/common/api";



export const getOrders = () => {
    return fetcher<DetailResponse<Order[]> | ErrorResponse>(`${BACKEND_URL}/order_manager`, {
        method: 'GET',
    });
};