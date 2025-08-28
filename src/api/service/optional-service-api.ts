import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { fetcher } from "../fetcher-api";
import { OptionalService } from "@/type/services/optional";
import { BACKEND_URL } from "@/common/api";

export const updateOptionalService = (serviceId: string, data: Partial<OptionalService>) => {
    return fetcher<DetailResponse<OptionalService>>(`${BACKEND_URL}/optional_service_manager/${serviceId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
};

export const createOptionalService = (data: Partial<OptionalService>) => {
    return fetcher<DetailResponse<OptionalService>>(`${BACKEND_URL}/optional_service_manager`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
};

export const getOptionalService = (serviceId: string) => {
    return fetcher<DetailResponse<OptionalService[]>>(`${BACKEND_URL}/optional_service_manager?serviceId=${serviceId}`);
};