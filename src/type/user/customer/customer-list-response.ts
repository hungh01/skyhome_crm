import { Pagination } from "@/type/other/pagination";
import { User } from "@/type/user/user";

export interface UserListResponse {
    data: User[];
    pagination: Pagination;
}