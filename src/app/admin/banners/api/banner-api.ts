import { DetailResponse } from "@/type/detailResponse/detailResponse"
import { Banner, BannerRequest } from "@/app/admin/banners/type/banner"
import { BANNER_URL } from "../constants/api"
import { fetcher, FormDatafetcher } from "@/api/fetcher-api"
import { UploadFile } from "antd"



export const getAllBanners = (page: number, pageSize: number, search: string, type: string | undefined, status: boolean | undefined) => {
    return fetcher<DetailResponse<Banner[]>>(`${BANNER_URL}?page=${page}&pageSize=${pageSize}&search=${search}&type=${type || ""}&status=${status !== undefined ? status : ""}`)
}

export const createBanner = (data: BannerRequest) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'imageUrl' && value instanceof File) {
            formData.append('image', value);
        }
        if (value !== undefined && value !== null && key !== 'imageUrl') {
            formData.append(key, value as string);
        }
    });
    return FormDatafetcher<DetailResponse<Banner>>(`${BANNER_URL}`, {
        method: 'POST',
        body: formData
    });
}

export const updateBanner = (id: string, data: BannerRequest) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
        if (key === 'imageUrl' && value && value instanceof File) {
            formData.append('image', value);
        }
        if (value !== undefined && value !== null && key !== 'imageUrl') {
            formData.append(key, value as string);
        }
    });
    return FormDatafetcher<DetailResponse<Banner>>(`${BANNER_URL}/${id}`, {
        method: 'PATCH',
        body: formData
    });
}