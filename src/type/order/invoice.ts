export interface CreateInvoice {
    serviceId: string;


    optionalService: {
        _id: string;
        code: string;
        price: number;
    }

    promotions: {
        _id: string;
        code: string;
        discountValue: number;
    }[]
}