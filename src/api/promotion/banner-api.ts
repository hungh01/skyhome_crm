import { DetailResponse } from "@/type/detailResponse/detailResponse"
import { fetcher } from "../fetcher-api"

import { BACKEND_URL } from "@/common/api"

interface Banner {
    _id: string;
    name: string;
    position: string;
    type: string;
    publishDate: string;
    status: boolean;
    linkId: string;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}


export const getAllBanners = () => {
    return fetcher<DetailResponse<Banner[]>>(`${BACKEND_URL}/banner`)
}