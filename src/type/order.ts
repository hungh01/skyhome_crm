export interface Order {
    _id: string;
    userId: string;
    totalPrice: number;
    address: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    serviceName: string;
    paymentMethod: string;
}