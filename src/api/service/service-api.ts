import { BACKEND_URL } from "@/common/api";
import { fetcher } from "../fetcher-api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Service, ServiceRequest } from "@/type/services/services";


export const getPersonalServices = () => {
    return fetcher<DetailResponse<Service[]>>(`${BACKEND_URL}/service?type=personal`);
};

export const getBusinessServices = () => {
    return fetcher<DetailResponse<Service[]>>(`${BACKEND_URL}/service?type=business`);
};


export const getServicesByCategoryId = (categoryId: string) => {
    return fetcher<DetailResponse<Service[]>>(`${BACKEND_URL}/service?categoryId=${categoryId}`);
};

export const updateService = (serviceId: string, data: Partial<Service>) => {
    return fetcher<DetailResponse<Service>>(`${BACKEND_URL}/service/${serviceId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
};

export const createService = (data: Partial<ServiceRequest>) => {
    return fetcher<DetailResponse<Service>>(`${BACKEND_URL}/service`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
};
