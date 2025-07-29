import { BACKEND_URL } from "@/common/api";
import { TopCTV } from "@/type/dashboard/topCTV";
import { ViewState } from "@/type/dashboard/viewState";


export const topCTVApi = async (type: ViewState): Promise<TopCTV[]> => {
    const response = await fetch(`${BACKEND_URL}/ctv/top?type=${type}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch recent orders');
    }
    return await response.json();
}