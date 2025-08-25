

export interface OptionalService {
    _id: string;
    name: string;
    price: number;
    description: string;
    durationMinutes: number;
    status: boolean;
    enable: boolean;
    isDeleted: boolean;
    type: 'equipment' | 'activity';
    serviceId: string;
}

export type UpdateOptionalService = Partial<OptionalService>;