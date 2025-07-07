import { ListOrderDashboard } from "@/type/dashboard/listOrderDashboard";

export const mockOrdersDashboard: ListOrderDashboard[] = [
    {
        id: "1",
        time: "2024-06-10T09:00:00Z",
        userId: "Nguyen Van A",
        serviceName: "Vệ sinh theo giờ",
        workingTime: "2024-06-12T14:00:00Z",
        address: "123 Main St, District 1, HCMC",
        ctv: "ctv_001",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        customerName: "Nguyen Van A",
        phoneNumber: "0901234567",
        price: "150000",
        status: "Đã nhận",
        paymentMethod: "Tiền mặt"
    },
    {
        id: "2",
        time: "2024-06-11T10:30:00Z",
        userId: "Tran Thi B",
        serviceName: "Tổng vệ sinh",
        workingTime: "2024-06-13T09:00:00Z",
        address: "456 Le Loi, District 3, HCMC",
        ctv: "ctv_002",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
        customerName: "Tran Thi B",
        phoneNumber: "0912345678",
        price: "80000",
        status: "Hoàn thành",
        paymentMethod: "Momo"
    },
    {
        id: "3",
        time: "2024-06-12T08:15:00Z",
        userId: "Le Van C",
        serviceName: "Vệ sinh máy lạnh",
        workingTime: "2024-06-14T07:30:00Z",
        address: "789 Nguyen Trai, District 5, HCMC",
        ctv: "ctv_003",
        image: "https://randomuser.me/api/portraits/men/3.jpg",
        customerName: "Le Van C",
        phoneNumber: "0923456789",
        price: "200000",
        status: "Đang làm",
        paymentMethod: "VnPay"
    },
    {
        id: "4",
        time: "2024-06-13T11:45:00Z",
        userId: "Pham Thi D",
        serviceName: "Vệ sinh máy giặt",
        workingTime: "2024-06-15T16:00:00Z",
        address: "321 Tran Hung Dao, District 1, HCMC",
        ctv: "ctv_004",
        image: "https://randomuser.me/api/portraits/women/4.jpg",
        customerName: "Pham Thi D",
        phoneNumber: "0934567890",
        price: "350000",
        status: "Đã hủy",
        paymentMethod: "Tiền mặt"
    },
    {
        id: "5",
        time: "2024-06-14T13:20:00Z",
        userId: "Hoang Van E",
        serviceName: "Vệ sinh máy nóng lạnh",
        workingTime: "2024-06-16T10:00:00Z",
        address: "654 Vo Van Kiet, District 6, HCMC",
        ctv: "ctv_005",
        image: "https://randomuser.me/api/portraits/men/5.jpg",
        customerName: "Hoang Van E",
        phoneNumber: "0945678901",
        price: "120000",
        status: "Chờ làm",
        paymentMethod: "Momo"
    }
];