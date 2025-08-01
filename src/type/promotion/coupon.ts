export interface Coupon {
    _id?: string;

    code?: string;

    name?: string;

    description?: string;

    promotionType?: string;

    applicableAreas?: string[];

    discountType?: string;

    discountValue?: number;

    minOrderValue?: number;

    maxDiscountValue?: number;

    startAt?: Date;

    endAt?: Date;

    maxUsage?: number;

    imageUrl?: string;

    status?: number; // 0 = inactive, 1 = active, 2 = expired
}
