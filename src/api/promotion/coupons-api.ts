import { BACKEND_URL } from "@/common/api"
import { fetcher } from "../fetcher-api"
import { DetailResponse } from "@/type/detailResponse/detailResponse"
import { Promotion, UpdatePromotion } from "@/type/promotion/promotion"

// API for managing coupons in the promotion system
export const couponListApi = (page: number = 1, pageSize: number = 10, code: string, status: string, promotionType: string, startDate: string, endDate: string) => {
    return fetcher<DetailResponse<Promotion[]>>(`${BACKEND_URL}/promotion_manager?page=${page}&pageSize=${pageSize}&code=${code}&status=${status}&promotionType=${promotionType}&startDate=${startDate}&endDate=${endDate}`)
}

export const addCouponApi = (data: UpdatePromotion): Promise<DetailResponse<Promotion>> => {
    return fetcher<DetailResponse<Promotion>>(`${BACKEND_URL}/promotion_manager`, {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export const updateCouponApi = (id: string, data: UpdatePromotion): Promise<DetailResponse<Promotion>> => {
    return fetcher<DetailResponse<Promotion>>(`${BACKEND_URL}/promotion_manager/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
}