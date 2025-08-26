export interface Banner {
    id: number;
    name: string;
    type: string;
    typeLabel: string;
    position: string;
    linkId: string | null;
    image: string;
    isActive: boolean;
    url: string | null;
    createdAt: string;
    updatedAt: string;
}