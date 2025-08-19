import { BACKEND_URL } from "@/common/api";
import { fetcher } from "../fetcher-api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Service } from "@/type/services/services";


export const getPersonalServices = () => {
    return fetcher<DetailResponse<Service[]>>(`${BACKEND_URL}/service?type=personal`);
};

export const getBusinessServices = () => {
    return fetcher<DetailResponse<Service[]>>(`${BACKEND_URL}/service?type=business`);
};