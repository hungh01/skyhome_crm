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
    return fetcher<DetailResponse<News> | ErrorResponse>(`${NEWS_URL}`, {
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export const updateNews = (newsId: number, data: NewsRequest) => {
    return fetcher<DetailResponse<News> | ErrorResponse>(`${NEWS_URL}/${newsId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    })
}