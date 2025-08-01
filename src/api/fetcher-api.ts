
export async function fetcher<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {}),
        },
        credentials: 'include', // giữ lại để gửi cookie nếu cần
        ...options,
    });


    return response.json();
}
