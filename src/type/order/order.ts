export interface Order {
    _id: string;
    idView: string;
    customerName: string;
    customerPhone: string;
    address: string;
    dateWork: string;
    collaboratorName: string;
    collaboratorPhone: string;
    paymentMethod: string;
    status: string;
    createdAt: string;
    serviceDetails: {
        name: string;
    };
    serviceCategoryDetails: {
        name: string;
    };
}