import { Pagination } from "../other/pagination";
import { Coupon } from "./coupon";

export interface CouponListResponse {
    data: Coupon[];
    pagination: Pagination;
}