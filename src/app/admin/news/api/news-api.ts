import { fetcher } from "@/api/fetcher-api"
import { DetailResponse } from "@/type/detailResponse/detailResponse"

import { NEWS_URL } from "../constants/api"
import { News, NewsRequest } from "../type/news"
import { ErrorResponse } from "@/type/error"




export const getAllNews = (page: number, pageSize: number, search: string, category: string | undefined, status: boolean | undefined) => {
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("pageSize", pageSize.toString());
    if (search) queryParams.append("search", search);
    if (category) queryParams.append("category", category);
    if (status !== undefined) queryParams.append("status", status.toString());

    return fetcher<DetailResponse<News[]>>(`${NEWS_URL}?${queryParams.toString()}`)
}

export const createNews = (data: NewsRequest) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'imageUrl' && value) {
            formData.append('image', value as File);
        }
        if (value !== undefined && value !== null && key !== 'imageUrl') {
            formData.append(key, value as string);
        }
    });
    return fetcher<DetailResponse<News> | ErrorResponse>(`${NEWS_URL}`, {
        method: 'POST',
        body: formData
    })
}

export const updateNews = (newsId: number, data: NewsRequest) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'imageUrl' && value) {
            formData.append('image', value as File);
        }
        if (value !== undefined && value !== null && key !== 'imageUrl') {
            formData.append(key, value as string);
        }
    });
    return fetcher<DetailResponse<News> | ErrorResponse>(`${NEWS_URL}/${newsId}`, {
        method: 'PATCH',
        body: formData
    })
}