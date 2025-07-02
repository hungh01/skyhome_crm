export interface Transaction {
    id: string;
    userId: string;
    message: string;
    paymentMethod: string;
    bankName: string;
    bankAccountNumber: string;
    price: string;
    status: string;
    createdAt: string;
}