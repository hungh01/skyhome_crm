import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { fetcher, FormDatafetcher } from "../fetcher-api";
import { CreateServiceCategory, ServiceCategory } from "@/type/services/service-category";
import { BACKEND_URL } from "@/common/api";




export const getServiceCategory = (type?: string) => {
    const res = fetcher<DetailResponse<ServiceCategory[]>>(`${BACKEND_URL}/service_category_manager?type=${type ?? ''}`);
    res.then(response => {
        if (response.data) {
            response.data.forEach(item => {
                if (typeof item.percentPlatformFee === 'number') {
                    item.percentPlatformFee = item.percentPlatformFee * 100;
                }
            });
        }
    });
    return res;
};



export const updateServiceCategory = (id: string, data: Partial<CreateServiceCategory>) => {
    const formData = new FormData();
    if (data.percentPlatformFee !== undefined) {
        formData.append('percentPlatformFee', String(Number(data.percentPlatformFee) / 100));
    }
    Object.entries(data).forEach(([key, value]) => {
        if (key !== 'percentPlatformFee' && value !== undefined && value !== null) {
            if (key === 'thumbNail' && value instanceof File) {
                formData.append('thumbNail', value);
            } else {
                formData.append(key, value as string);
            }
        }
    });
    return FormDatafetcher<DetailResponse<ServiceCategory>>(`${BACKEND_URL}/service_category_manager/${id}`, {
        method: 'PATCH',
        body: formData,
    });
};

export const createServiceCategory = (data: Partial<CreateServiceCategory>) => {
    const formData = new FormData();
    if (data.percentPlatformFee !== undefined) {
        formData.append('percentPlatformFee', String(Number(data.percentPlatformFee) / 100));
    }
    Object.entries(data).forEach(([key, value]) => {
        if (key !== 'percentPlatformFee' && value !== undefined && value !== null) {
            if (key === 'thumbNail' && value instanceof File) {
                formData.append('thumbNail', value);
            } else {
                formData.append(key, value as string);
            }
        }
    });

    return FormDatafetcher<DetailResponse<ServiceCategory>>(`${BACKEND_URL}/service_category_manager`, {
        method: 'POST',
        body: formData,
    });
};

