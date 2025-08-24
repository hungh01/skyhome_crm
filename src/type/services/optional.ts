export interface OptionalService {
    _id: string;
    name: string;
    price: number;
    durationMinutes?: number;
    description?: string;
    status: string;
    image?: string;
}