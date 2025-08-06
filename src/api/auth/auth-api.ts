import { BACKEND_URL } from "@/common/api";
import { fetcher } from "../fetcher-api";

export const loginApi = (phone: string, password: string) => {
    return fetcher<{ success: string }>(`${BACKEND_URL}/user/login`, {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
    });
}

export const logOutApi = () => {
    return fetcher<{ message: string }>(`${BACKEND_URL}/user/logout`, {
        method: 'POST',
    });
}