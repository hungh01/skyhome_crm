import { BACKEND_URL } from "@/common/api";

export const totalRevenueApi = async (): Promise<{ totalRevenue: number }> => {
    const response = await fetch(`${BACKEND_URL}/transaction/total`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch total users');
    }
    return await response.json();
}