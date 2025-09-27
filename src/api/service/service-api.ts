import { BACKEND_URL } from "@/common/api";
import { fetcher, FormDatafetcher } from "../fetcher-api";
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


export const updateService = (id: string, data: Partial<ServiceRequest>) => {
    // Accepts either object or FormData
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (key === 'thumbNail' && value instanceof File) {
                formData.append('thumbNail', value);
            } else {
                formData.append(key, value as any);
            }
        }
    });
    return FormDatafetcher<DetailResponse<Service>>(`${BACKEND_URL}/service_manager/${id}`, {
        method: 'PATCH',
        body: formData,
    });
};




export const createService = (data: Partial<ServiceRequest>) => {
    console.log('Creating service with data:', data);
    let formData: FormData;
    if (data instanceof FormData) {
        formData = data;
    } else {
        formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'thumbNail' && value instanceof File) {
                    formData.append('thumbNail', value);
                } else {
                    formData.append(key, value as any);
                }
            }
        });
    }
    return FormDatafetcher<DetailResponse<Service>>(`${BACKEND_URL}/service_manager`, {
        method: 'POST',
        body: formData,
    });
};
