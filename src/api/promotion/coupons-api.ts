import { BACKEND_URL } from "@/common/api"
import { fetcher } from "../fetcher-api"
import { DetailResponse } from "@/type/detailResponse/detailResponse"
import { Promotion, UpdatePromotion } from "@/type/promotion/promotion"

// API for managing coupons in the promotion system
export const couponListApi = (page: number = 1, pageSize: number = 10, code: string, status: string, promotionType: string, startDate: string, endDate: string) => {
    return fetcher<DetailResponse<Promotion[]>>(`${BACKEND_URL}/coupon?page=${page}&pageSize=${pageSize}&code=${code}&status=${status}&promotionType=${promotionType}&startDate=${startDate}&endDate=${endDate}`)
}

export const addCouponApi = (data: UpdatePromotion): Promise<Promotion> => {
    return fetcher(`${BACKEND_URL}/coupon`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export const updateCouponApi = (id: string, data: UpdatePromotion) => {
    return fetcher(`${BACKEND_URL}/coupon/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
}