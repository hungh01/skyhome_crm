export interface ReviewResponse {
    stats: {
        total: number;
        liked: number;
        disliked: number;
    };
    likedCustomers: Array<{
        customerId: string;
        customerInfo: {
            fullName: string;
            phone: string;
        };
    }>;
    dislikedCustomers: Array<{
        customerId: string;
        customerInfo: {
            fullName: string;
            phone: string;
        };
    }>;
}