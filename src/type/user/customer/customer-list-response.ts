import { Pagination } from "@/type/other/pagination";

import { Customer } from "./customer";

export interface UserListResponse {
    data: Customer[];
    pagination: Pagination;
}