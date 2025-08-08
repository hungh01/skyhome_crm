export interface Order {
    transactionId: {
        _id: string;
        code: string;
        paymentMethod: string;
        status: string;
    }[];
    _id: string;
    type: string;
    customerId: {
        _id: string;
        code: string;
    };
    serviceId: {
        _id: string;
        name: string;
        description: string;
        price: number;
    }[];
    totalPrice: number;
    address: string;
    collaboratorId: {
        _id: string;
        code: string;
    };
    checkInTime: string;
    checkOutTime: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}