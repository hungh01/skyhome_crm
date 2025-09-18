import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { fetcher } from "../fetcher-api";
import { BACKEND_URL } from "@/common/api";
import { Group } from "@/type/user/collaborator/group";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { Area } from "@/type/area/area";
import { ServiceCategory } from "@/type/services/service-category";


export const getCollaboratorGroups = async (page: number = 1, pageSize: number = 10, searchName: string = "", selectedAreas: string[] = [], selectedServices: string[] = [], statusFilter: string = "") => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (searchName) {
        params.append('searchName', searchName);
    }
    if (selectedAreas.length > 0) {
        for (const selectedArea of selectedAreas) {
            params.append('areas', selectedArea);
        }

    }
    if (selectedServices.length > 0) {
        for (const selectedService of selectedServices) {
            params.append('serviceTypes', selectedService);
        }
    }
    if (statusFilter) {
        params.append('status', statusFilter);
    }

    const url = `${BACKEND_URL}/collaborator_group_manager?${params.toString()}`;
    return await fetcher<DetailResponse<Group[]>>(url);
};

export const getServiceCategories = async () => {
    return await fetcher<DetailResponse<ServiceCategory[]>>(`${BACKEND_URL}/service_category_manager`);
};

export const getAreas = async () => {
    return await fetcher<DetailResponse<Area[]>>(`${BACKEND_URL}/area_manager`);
};

export const getMembersForGroup = async (serviceCategories: string[], areas: string[], groupId: string) => {
    const params = new URLSearchParams();

    if (serviceCategories.length > 0) {
        serviceCategories.forEach(serviceCategory => params.append('serviceTypes', serviceCategory));
    }
    if (areas.length > 0) {
        areas.forEach(area => params.append('areas', area));
    }

    if (groupId) {
        params.append('groupId', groupId);
    }

    const queryString = params.toString();
    const url = queryString ? `${BACKEND_URL}/collaborator_group_manager/members?${queryString}` : `${BACKEND_URL}/collaborator_group_manager/members`;

    return await fetcher<DetailResponse<Collaborator[]>>(url);
};

export const createCollaboratorGroup = async (data: {
    name: string;
    serviceType: string[];
    areas: string[];
    leaderId: string;
    memberIds: string[];
    description: string;
}) => {
    return await fetcher<DetailResponse<Group>>(`${BACKEND_URL}/collaborator_group_manager`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};


export const deleteMemberOfGroup = async (groupId: string, collaboratorId: string) => {
    return await fetcher<DetailResponse<{ success: boolean }>>(`${BACKEND_URL}/collaborator_group_manager/remove-collaborator`, {
        method: 'PATCH',
        body: JSON.stringify({ groupId, collaboratorId }),
    });
};

export const addMemberToGroup = async (groupId: string, memberIds: string[]) => {
    return await fetcher<DetailResponse<{ success: boolean }>>(`${BACKEND_URL}/collaborator_group_manager/members`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, memberIds }),
    });
};

// Update group status
export const updateGroupStatus = async (groupId: string, status: 'active' | 'inactive' | 'restricted') => {
    return await fetcher<DetailResponse<{ success: boolean }>>(`${BACKEND_URL}/collaborator_group_manager/${groupId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    });
};

// Update group
export const updateCollaboratorGroup = async (groupId: string, data: {
    name: string;
    serviceType: string[];
    areas: string[];
    leaderId: string;
    memberIds: string[];
    description: string;
}) => {
    return await fetcher<DetailResponse<Group>>(`${BACKEND_URL}/collaborator_group_manager/${groupId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
};

// Delete group
export const deleteGroup = async (groupId: string) => {
    return await fetcher<DetailResponse<{ success: boolean }>>(`${BACKEND_URL}/collaborator_group_manager/${groupId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};