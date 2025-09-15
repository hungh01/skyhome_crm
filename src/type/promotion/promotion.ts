import { Area } from "../area/area";
import { ServiceCategory } from "../services/service-category";


export interface CreatePromotion {
    title: string;
    code: string;
    description: string;
    shortDescription: string;
    thumbnail?: string;
    background?: string;
    idCustomer?: string[];
    isIdCustomer?: boolean;
    idGroupCustomer?: string[];
    isIdGroupCustomer?: boolean;
    startAt?: string;
    endAt?: string;
    isLimitCount?: boolean;
    limitCount?: number;
    countUse?: number;
    serviceApply: string[];
    promotionType: 'voucher' | 'promotion';
    applicableAreas?: string[];
    discountType: 'percent' | 'amount';
    discountValue: number;
    minOrderValue?: number;
    maxDiscountValue?: number;
    status?: number;
}



export interface ResponsePromotion extends Omit<CreatePromotion, 'serviceApply' | 'applicableAreas'> {
    _id: string | undefined;
    serviceApply: ServiceCategory[];
    applicableAreas: Area[];
}




export type UpdatePromotion = Partial<CreatePromotion> & {
    _id?: string;
};

export interface Promotion {
    _id: string;
    title: string;
    code: string;
    description: string;
    shortDescription: string;
    thumbnail: string;
    background: string;
    idCustomer: string[];
    isIdCustomer: boolean;
    idGroupCustomer: string[];
    isIdGroupCustomer: boolean;
    startAt: string;
    endAt: string;
    isLimitCount: boolean;
    limitCount: number;
    countUse: number;
    serviceApply: string[];
    promotionType: 'voucher' | 'promotion';
    applicableAreas: string[];
    discountType: 'percent' | 'amount';
    discountValue: number;
    minOrderValue: number;
    maxDiscountValue: number;
    status: number;
    createdAt: string;
    updatedAt: string;
};