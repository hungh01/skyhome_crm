export interface ServicePack {
    id: string;
    name: string;
    numberOfPeople: number;
    durationTime: number;
    description: string;
    image: string; // Optional image field
    price: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
}