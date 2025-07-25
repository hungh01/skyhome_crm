import { BACKEND_URL } from "@/common/api";

export const loginApi = async (phone: string, password: string): Promise<{ success: string }> => {
    const response = await fetch(`${BACKEND_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ phone, password }),
    });
    return response.json();
}