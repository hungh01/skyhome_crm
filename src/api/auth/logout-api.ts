import { BACKEND_URL } from "@/common/api";

export const logOutApi = async (): Promise<{ message: string }> => {
    const response = await fetch(`${BACKEND_URL}/users/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    return response.json();
}