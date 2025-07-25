import { BACKEND_URL } from "@/common/api";

export const totalUserApi = async (): Promise<{ totalCustomer: number }> => {
    const response = await fetch(`${BACKEND_URL}/users/total`, {
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