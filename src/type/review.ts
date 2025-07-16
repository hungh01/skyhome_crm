
interface People {
    id: string;
    name: string;
    image: string;
    phone: string;
}

export interface Review {
    id: string;
    user: People;
    partner: People;
    orderId: string;
    rating: number;
    comment: string;
    status: 'received' | 'viewed' | 'responded';
    createdAt: string;
    updatedAt: string;
}