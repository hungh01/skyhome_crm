import { BACKEND_URL } from "@/common/api"
import { fetcher } from "../fetcher-api"
import { CouponListResponse } from "@/type/promotion/coupon-list-response"
import { Coupon } from "@/type/promotion/coupon"

// API for managing coupons in the promotion system
export const couponListApi = (page: number = 1, pageSize: number = 10, code: string, status: string, promotionType: string, startDate: string, endDate: string) => {
    return fetcher<CouponListResponse>(`${BACKEND_URL}/coupon?page=${page}&pageSize=${pageSize}&code=${code}&status=${status}&promotionType=${promotionType}&startDate=${startDate}&endDate=${endDate}`)
}

export const addCouponApi = (data: Coupon) => {
    return fetcher(`${BACKEND_URL}/coupon`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export const updateCouponApi = (id: string, data: Coupon) => {
    return fetcher(`${BACKEND_URL}/coupon/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
}