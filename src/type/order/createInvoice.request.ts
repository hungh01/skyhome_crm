export interface CreateInvoice {
    serviceId: string;
    optionalService: string[];
    promotions: string[];
    paymentMethod: string;
}