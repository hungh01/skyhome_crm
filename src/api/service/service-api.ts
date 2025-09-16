import { BACKEND_URL } from "@/common/api";
import { fetcher } from "../fetcher-api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Service, ServiceRequest } from "@/type/services/services";


export const getPersonalServices = () => {
    return fetcher<DetailResponse<Service[]>>(`${BACKEND_URL}/service_manager/findbytype?type=personal`);
};

export const getBusinessServices = () => {
    return fetcher<DetailResponse<Service[]>>(`${BACKEND_URL}/service_manager/findbytype?type=business`);
};


export const getServicesByCategoryId = (categoryId: string) => {
    return fetcher<DetailResponse<Service[]>>(`${BACKEND_URL}/service_manager?categoryId=${categoryId}`);
};

export const updateService = (serviceId: string, data: Partial<ServiceRequest>) => {
    return fetcher<DetailResponse<Service>>(`${BACKEND_URL}/service_manager/${serviceId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
};

export const createService = (data: Partial<ServiceRequest>) => {
    return fetcher<DetailResponse<Service>>(`${BACKEND_URL}/service_manager`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
};
