
export interface CreateOrder {
    type: 'business' | 'personal';
    customerId: string;
    customerName: string;
    customerPhone: string;
    lat?: number;
    lng?: number;
    address: string;
    dateWork: string;
    endDateWork: string;
    serviceId: string;
    optionalService?: {
        _id: string;
        name: string;
        price: number;
        durationMinutes: number;
    }[];
    collaboratorId?: string;
    collaboratorName?: string;
    collaboratorPhone?: string;
    collaboratorGroupId?: string;
    refundMoney?: number;
    promotions?: PromotionInOrder[];
    note?: string;
    paymentMethod: 'cash' | 'card' | 'momo' | 'vnpay';
    bankCode?: string;
    initialFee: number;
    finalFee: number;
    totalFee: number;
    platformFee: number;
    workShiftDeposit: number;
    remainingShiftDeposit: number;
    shiftIncome: number;
    netIncome: number;
    totalDiscount: number;
    totalTime: number;
}

export interface PromotionInOrder {
    _id: string;
    name: string;
    discountValue: number;
}