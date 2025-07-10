export interface OptionalService {
    id: string;
    name: string;
    description?: string;
    status: boolean;
    basePrice: number;
}