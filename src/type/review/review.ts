

export interface Review {
    _id: string;
    customerId: {
        _id: string;
        code: string;
        userId: {
            _id: string;
            fullName: string;
            phone: string;
        };
    };
    orderId: {
        _id: string;
        totalPrice: number;
        status: string;
        createdAt: string;
    };
    collaboratorId: string;
    rating: number;
    comment: string;
    images: string[];
    createdAt: string;
}


export interface stat {
    rating: number;
    count: number;
}