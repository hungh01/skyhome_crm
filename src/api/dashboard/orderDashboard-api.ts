import { BACKEND_URL } from "@/common/api";
import { ListOrderDashboard } from "@/type/dashboard/listOrderDashboard";

export const orderDashboardApi = async (): Promise<ListOrderDashboard> => {
    const response = await fetch(`${BACKEND_URL}/order/revenue`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',

        },
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch order dashboard data');
    }
    return await response.json();
}