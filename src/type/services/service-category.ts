
export interface ServiceCategory {
    _id: string;
    name: string;
    status: boolean;
    type: 'personal' | 'business';
    percentPlatformFee: number;
    thumbNail: string;
}
