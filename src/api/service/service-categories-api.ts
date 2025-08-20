import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { fetcher } from "../fetcher-api";
import { ServiceCategory } from "@/type/services/service-category";
import { BACKEND_URL } from "@/common/api";




export const getServiceCategory = (type: string) => {
    const res = fetcher<DetailResponse<ServiceCategory[]>>(`${BACKEND_URL}/servicecategory?type=${type}`);
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


export const updateServiceCategory = (id: string, data: Partial<ServiceCategory>) => {
    // Convert percentPlatformFee back to decimal for the API
    if (data.percentPlatformFee) {
        data.percentPlatformFee = data.percentPlatformFee / 100;
    }
    return fetcher<DetailResponse<ServiceCategory>>(`${BACKEND_URL}/servicecategory/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
};