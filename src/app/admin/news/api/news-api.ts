import { fetcher } from "@/api/fetcher-api"
import { DetailResponse } from "@/type/detailResponse/detailResponse"

import { NEWS_URL } from "../constants/api"
import { News } from "../type/news"
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

export const saveImagePost = (data: FormData) => {
    return fetcher<DetailResponse<{ url: string }> | ErrorResponse>(`${NEWS_URL}/posts/upload-image`, {
        method: 'POST',
        body: data
    });
}