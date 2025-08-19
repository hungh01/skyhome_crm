export interface OptionalService {
    _id: string;
    serviceName: string;
    servicePrice: number;
    serviceDescription?: string;
    serviceStatus?: string;
    serviceImage?: string;
}