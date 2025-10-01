import { UploadFile } from "antd";

export interface Banner {
    _id: string;
    name: string;
    position: string;
    type: string;
    publishDate: string;
    status: boolean;
    imageUrl: File | string | null;
    createdAt: string;
    updatedAt: string;
}

export type BannerRequest = Partial<Banner>;