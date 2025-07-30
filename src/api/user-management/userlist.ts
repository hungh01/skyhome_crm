import { BACKEND_URL } from "@/common/api";
import { User } from "@/type/user";

export interface UserListResponse {
    success: boolean;
    data?: User[];
    message?: string;
}

export const userListApi = async (): Promise<UserListResponse> => {
    const response = await fetch(`${BACKEND_URL}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    }); 
    return response.json();
}