import { BACKEND_URL } from "@/common/api";

export const loginApi = async (username: string, password: string): Promise<{ message: string }> => {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });
    return response.json();
}