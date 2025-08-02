export interface Transaction {
    _id: string;
    orderId: string;
    subtotal: number;
    promotionAmount: number;
    promotionName: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: string;
    vatAmount: number;
    vatRate: number;
    createdAt: string;
    orderType: string;
    orderStatus: string;
    orderAddress: string;
    userId: string;
    userFullName: string;
    userPhone: string;
}