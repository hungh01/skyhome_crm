import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { fetcher } from "../fetcher-api";
import { Order } from "@/type/order/order";
import { ErrorResponse } from "@/type/error";
import { BACKEND_URL } from "@/common/api";


// get orders with all filter
export const getOrders = (
    page: number,
    orderSearch: string,
    createdAtStart: string,
    createdAtEnd: string,
    customerSearch: string,
    serviceSearch: string,
    dateWorkStart: string,
    dateWorkEnd: string,
    collaboratorSearch: string,
    paymentMethodSearch: string,
    statusSearch: string
) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", "10");
    params.append("idView", orderSearch);
    params.append("createdAtStart", createdAtStart);
    params.append("createdAtEnd", createdAtEnd);
    params.append("customer", customerSearch);
    params.append("service", serviceSearch);
    params.append("dateWorkStart", dateWorkStart);
    params.append("dateWorkEnd", dateWorkEnd);
    params.append("collaborator", collaboratorSearch);
    params.append("paymentMethod", paymentMethodSearch);
    params.append("status", statusSearch);

    console.log(params.toString());
    return fetcher<DetailResponse<Order[]> | ErrorResponse>
        (`${BACKEND_URL}/order_manager?${params.toString()}`, {
            method: 'GET'
        });
};
