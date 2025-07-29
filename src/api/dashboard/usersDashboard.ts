import { BACKEND_URL } from "@/common/api";
import { DashboardUser } from "@/type/dashboard/dasboardUser";
import { ViewState } from "@/type/dashboard/viewState";


export const usersDashboardApi = async (type: ViewState): Promise<DashboardUser[]> => {
    const response = await fetch(`${BACKEND_URL}/order/user-type-count?type=${type}`, {
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