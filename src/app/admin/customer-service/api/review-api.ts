import { fetcher } from "@/api/fetcher-api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { stat } from "@/type/review/review";
import { REVIEW_URL } from "../constants/api";
import { Order } from "@/type/order/order";



export const getReviews = async (page: number, pageSize: number, rating?: number) => {

    return await fetcher<DetailResponse<Order[]>>(`${REVIEW_URL}?page=${page}&pageSize=${pageSize}&rating=${rating || ""}`);
}

export const getReviewStats = async () => {
    return await fetcher<DetailResponse<stat[]>>(`${REVIEW_URL}/stats`);
}