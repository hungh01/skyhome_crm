export interface Promotion {
    _id: string;
    title: string;
    code: string;
    description: string;
    shortDescription: string;
    thumbnail?: string;
    background?: string;
    idCustomer: string[];
    isIdCustomer: boolean;
    idGroupCustomer: string[];
    isIdGroupCustomer: boolean;
    startAt?: string;
    endAt?: string;
    isLimitCount: boolean;
    limitCount: number;
    countUse: number;
    serviceApply: string[];
    promotionType: 'voucher' | 'promotion';
    applicableAreas?: string[];
    discountType: 'percent' | 'amount';
    discountValue: number;
    minOrderValue: number;
    maxDiscountValue?: number;
    status: number;
    isDeleted: boolean;
}

export type UpdatePromotion = Partial<Promotion>;