export interface Banner {
    _id: number;
    name: string;
    position: string;
    type: string;
    publishDate: string;
    status: boolean;
    linkId: string;
    url: string | null;
    createdAt: string;
    updatedAt: string;
}

export type BannerRequest = Partial<Banner>;