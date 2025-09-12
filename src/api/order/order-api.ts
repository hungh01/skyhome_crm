import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { fetcher } from "../fetcher-api";
import { Order } from "@/type/order/order";
import { ErrorResponse } from "@/type/error";
import { BACKEND_URL } from "@/common/api";
import { Invoice } from "@/type/order/invoice";
import { CreateInvoice } from "@/type/order/createInvoice.request";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { CreateOrder } from "@/type/order/createOrder.request";


// get orders with all filter
export const getOrders = (
    page: number,
    orderSearch: string,
    createdAtStart: string,
    createdAtEnd: string,
    statusSearch: string
) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("pageSize", "10");
    params.append("search", orderSearch);
    params.append("createdAtStart", createdAtStart);
    params.append("createdAtEnd", createdAtEnd);
    params.append("status", statusSearch);

    console.log(params.toString());
    return fetcher<DetailResponse<Order[]> | ErrorResponse>
        (`${BACKEND_URL}/order_manager?${params.toString()}`, {
            method: 'GET'
        });
};

export const getOrderById = (orderId: string) => {
    return fetcher<DetailResponse<Order> | ErrorResponse>
        (`${BACKEND_URL}/order_manager/${orderId}`, {
            method: 'GET'
        });
}


export const getCaculateInvoice = (data: CreateInvoice) => {
    return fetcher<DetailResponse<Invoice> | ErrorResponse>
        (`${BACKEND_URL}/order_manager/calculate-fee`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
};

export const createOrderApi = (data: CreateOrder) => {
    return fetcher<DetailResponse<Order> | ErrorResponse>
        (`${BACKEND_URL}/order_manager`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
};

export const updateOrderStatus = (orderId: string, status: string, idStaff: string) => {
    return fetcher<DetailResponse<Order> | ErrorResponse>
        (`${BACKEND_URL}/order_manager/${orderId}/${status}`, {
            method: 'PATCH',
            body: JSON.stringify({ idStaff })
        });
};

export const getCollaboratorForOrder = (orderId: string) => {
    return fetcher<DetailResponse<Collaborator[]> | ErrorResponse>
        (`${BACKEND_URL}/order_manager/${orderId}/collaboratorfororder`, {
            method: 'GET'
        });
};

export const assignCollaboratorToOrder = (orderId: string, collaboratorId: string, staffId: string, tranfernote: string) => {
    return fetcher<DetailResponse<Order> | ErrorResponse>
        (`${BACKEND_URL}/order_manager/${orderId}/assign-collaborator`, {
            method: 'PATCH',
            body: JSON.stringify({ idCollaborator: collaboratorId, idStaff: staffId, tranfernote })
        });
};