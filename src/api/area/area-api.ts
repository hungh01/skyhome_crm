import { DetailResponse } from "@/type/detailResponse/detailResponse"
import { fetcher } from "../fetcher-api"
import { Area } from "@/type/area/area"
import { BACKEND_URL } from "@/common/api"



export const getAreas = () => {
    return fetcher<DetailResponse<Area[]>>(`${BACKEND_URL}/area_manager`)
}