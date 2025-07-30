import { Pagination } from "@/type/other/pagination";
import { User } from "@/type/user/user";

export interface CustomerListResponse {
    data: User[];
    pagination: Pagination;
}