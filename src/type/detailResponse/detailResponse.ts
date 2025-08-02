import { Pagination } from "../other/pagination";

export interface DetailResponse<T> {
    data: T;
    pagination?: Pagination;
}