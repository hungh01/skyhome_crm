import { BACKEND_URL } from "@/common/api";
import { Revenue } from "@/type/dashboard/revenue";


export const revenueDashboardApi = async (type: 'weekly' | 'monthly' | 'annual'): Promise<Revenue[]> => {
    const response = await fetch(`${BACKEND_URL}/order/revenue?type=${type}`, {
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