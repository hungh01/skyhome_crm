import { BACKEND_URL } from "@/common/api";
import { ServiceOrder } from "@/type/dashboard/serviceOrder";

import { ViewState } from "@/type/dashboard/viewState";


export const serviceDashboardApi = async (type: ViewState): Promise<ServiceOrder[]> => {
    const response = await fetch(`${BACKEND_URL}/order/count-by-category?type=${type}`, {
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