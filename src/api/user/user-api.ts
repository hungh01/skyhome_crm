import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { fetcher } from "../fetcher-api";
import { User } from "@/type/user/user";
import { BACKEND_URL } from "@/common/api";


// Fetch user details by ID
export const userDetailApi = (id: string) => {
    return fetcher<DetailResponse<User>>(`${BACKEND_URL}/user/${id}`)
};


