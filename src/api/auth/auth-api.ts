
import { AUTH_URL } from "@/common/api";
import { fetcher } from "../fetcher-api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ErrorResponse } from "@/type/error";
import { User } from "@/type/user/user";

export const loginApi = (phone: string, password: string) => {
    return fetcher<DetailResponse<{ message: string, user: User }> | ErrorResponse>(`${AUTH_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
    });
}

export const logOutApi = () => {
    return fetcher<DetailResponse<{ message: string }> | ErrorResponse>(`${AUTH_URL}/logout`, {
        method: 'POST',
    });
}

