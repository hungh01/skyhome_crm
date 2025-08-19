import { fetcher } from "@/api/fetcher-api";
import { BACKEND_URL } from "@/common/api";

export interface CustomerSuggestion {
    _id: string;
    fullName: string;
    phone: string;
    address: string;
    email?: string;
}

export interface CustomerSearchResponse {
    data: CustomerSuggestion[];
    total: number;
}

// API để tìm kiếm khách hàng
export const searchCustomersApi = async (query: string = '', page: number = 1, pageSize: number = 50): Promise<CustomerSearchResponse> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        if (query && query.trim()) {
            params.append('search', query.trim());
        }

        const response = await fetcher<CustomerSearchResponse>(
            `${BACKEND_URL}/customers?${params.toString()}`
        );

        return response || { data: [], total: 0 };
    } catch (error) {
        console.error('Error searching customers:', error);
        return { data: [], total: 0 };
    }
};

// Mock data cho development (có thể xóa khi có API thật)
export const mockCustomers: CustomerSuggestion[] = [
    {
        _id: "cust001",
        fullName: "Nguyễn Văn A",
        phone: "0901234567",
        address: "123 Đường ABC, Quận 1, TP.HCM",
        email: "nguyenvana@email.com"
    },
    {
        _id: "cust002",
        fullName: "Trần Thị B",
        phone: "0987654321",
        address: "456 Đường XYZ, Quận 2, TP.HCM",
        email: "tranthib@email.com"
    },
    {
        _id: "cust003",
        fullName: "Lê Văn C",
        phone: "0912345678",
        address: "789 Đường DEF, Quận 3, TP.HCM",
        email: "levanc@email.com"
    },
    {
        _id: "cust004",
        fullName: "Phạm Thị D",
        phone: "0923456789",
        address: "321 Đường GHI, Quận 4, TP.HCM",
        email: "phamthid@email.com"
    },
    {
        _id: "cust005",
        fullName: "Hoàng Văn E",
        phone: "0934567890",
        address: "654 Đường JKL, Quận 5, TP.HCM",
        email: "hoangvane@email.com"
    }
];

// Mock API function để test
export const mockSearchCustomersApi = async (query: string = ''): Promise<CustomerSearchResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const filteredCustomers = query
        ? mockCustomers.filter(customer =>
            customer.fullName.toLowerCase().includes(query.toLowerCase()) ||
            customer.phone.includes(query) ||
            customer.address.toLowerCase().includes(query.toLowerCase())
        )
        : mockCustomers;

    return {
        data: filteredCustomers,
        total: filteredCustomers.length
    };
};
