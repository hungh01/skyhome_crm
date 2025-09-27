import { UploadFile } from "antd";

export interface ServiceCategory {
    _id: string;
    name: string;
    status: boolean;
    type: 'personal' | 'business';
    percentPlatformFee: number;
    thumbNail: string;
}


export interface CreateServiceCategory {
    name: string;
    status: boolean;
    type: 'personal' | 'business';
    percentPlatformFee: number;
    thumbNail?: File | null;
}