export interface ListOrderDashboard {
    id: string;
    time: string; // ISO date string
    userId: string;
    serviceName: string;
    workingTime: string; // ISO date string
    address: string;
    ctv: string; // CTV id or name (if needed)
    ctvName: string; // CTV name
    ctvPhone: string; // CTV phone number
    image?: string; // Avatar image URL for CTV
    customerName: string;
    phoneNumber: string;
    price: string; // Price as string, e.g. "100000"
    status: string;
    paymentMethod: string; // e.g. "Tiền mặt", "Chuyển khoản", "Ví điện tử"
}



