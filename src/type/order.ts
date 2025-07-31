export interface Order {
    id: string;
    serviceName: string;
    address: string;
    time: string;
    date: string;
    paymentMethod: string;
    price: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    collaboratorId?: string;
}