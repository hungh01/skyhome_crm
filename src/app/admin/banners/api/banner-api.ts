import { DetailResponse } from "@/type/detailResponse/detailResponse"
import { Banner, BannerRequest } from "@/app/admin/banners/type/banner"
import { BANNER_URL } from "../constants/api"
import { fetcher } from "@/api/fetcher-api"



export const getAllBanners = (page: number, pageSize: number, search: string, type: string | undefined, status: boolean | undefined) => {
    return fetcher<DetailResponse<Banner[]>>(`${BANNER_URL}?page=${page}&pageSize=${pageSize}&search=${search}&type=${type || ""}&status=${status !== undefined ? status : ""}`)
}

export const createBanner = (data: BannerRequest) => {
    return fetcher<DetailResponse<Banner>>(`${BANNER_URL}`, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

export const updateBanner = (id: number, data: BannerRequest) => {
    return fetcher<DetailResponse<Banner>>(`${BANNER_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
}