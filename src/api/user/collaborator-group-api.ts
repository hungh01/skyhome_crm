import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { fetcher } from "../fetcher-api";
import { BACKEND_URL } from "@/common/api";


export const getServices = async () => {
    return await fetcher<DetailResponse<{ _id: string, name: string }[]>>(`${BACKEND_URL}/service`);
};

export const getAreas = async () => {
    return await fetcher<DetailResponse<{ _id: string, code: string }[]>>(`${BACKEND_URL}/area`);
};

export const getCollaborators = async (services: string[], areas: string[]) => {
    const params = new URLSearchParams();

    if (services.length > 0) {
        services.forEach(service => params.append('services', service));
    }
    if (areas.length > 0) {
        areas.forEach(area => params.append('areas', area));
    }

    const queryString = params.toString();
    const url = queryString ? `${BACKEND_URL}/collaborator-groups/members?${queryString}` : `${BACKEND_URL}/collaborator-groups/members`;

    return await fetcher<DetailResponse<{ _id: string, code: string, fullName: string }[]>>(url);
};
