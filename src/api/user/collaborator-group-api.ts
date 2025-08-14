import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { fetcher } from "../fetcher-api";
import { BACKEND_URL } from "@/common/api";
import { Group } from "@/type/user/collaborator/group";


export const getCollaboratorGroups = async (page: number = 1, pageSize: number = 10) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const url = `${BACKEND_URL}/collaborator-groups?${params.toString()}`;
    return await fetcher<DetailResponse<Group[]>>(url);
};

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

export const createCollaboratorGroup = async (data: {
    name: string;
    services: string[];
    areas: string[];
    leaderId: string;
    members: string[];
    description: string;
}) => {
    return await fetcher<DetailResponse<{ _id: string }>>(`${BACKEND_URL}/collaborator-groups`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};


export const deleteMemberOfGroup = async (groupId: string, memberId: string) => {
    return await fetcher<DetailResponse<{ success: boolean }>>(`${BACKEND_URL}/collaborator-groups/remove-collaborator`, {
        method: 'PATCH',
        body: JSON.stringify({ groupId, memberId }),
    });
};

export const addMemberToGroup = async (groupId: string, memberIds: string[]) => {
    return await fetcher<DetailResponse<{ success: boolean }>>(`${BACKEND_URL}/collaborator-groups/add-members`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, memberIds }),
    });
};