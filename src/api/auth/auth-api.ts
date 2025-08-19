import { BACKEND_URL } from "@/common/api";
import { fetcher } from "../fetcher-api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ErrorResponse } from "@/type/error";

export const loginApi = (phone: string, password: string) => {
    return fetcher<DetailResponse<{ message: string, user: { id: string, phone: string } }> | ErrorResponse>(`${BACKEND_URL}/user/login`, {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
    });
}

export const logOutApi = () => {
    return fetcher<{ message: string }>(`${BACKEND_URL}/user/logout`, {
        method: 'POST',
    });
}