export interface Banner {
    _id: string;
    name: string;
    position: string;
    type: string;
    publishDate: string;
    status: boolean;
    linkId: string;
    imageUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export type BannerRequest = Partial<Banner>;