import { BACKEND_URL } from "@/common/api";
import { ListOrderDashboard } from "@/type/dashboard/listOrderDashboard";

export const recentOrdersApi = async (): Promise<ListOrderDashboard[]> => {
    const response = await fetch(`${BACKEND_URL}/order/recent`, {
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