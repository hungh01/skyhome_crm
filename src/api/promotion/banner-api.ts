import { DetailResponse } from "@/type/detailResponse/detailResponse"
import { fetcher } from "../fetcher-api"
import { Banner } from "@/type/promotion/banner"
import { BACKEND_URL } from "@/common/api"


export const getAllBanners = () => {
    return fetcher<DetailResponse<Banner[]>>(`${BACKEND_URL}/banner`)
}