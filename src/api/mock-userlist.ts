import { User } from "@/type/user/user";


export const mockUsers: User[] = [
    {
        _id: '1',
        fullName: 'Nguyễn Văn A',
        customerCode: 'KH001',
        age: 28,
        gender: 1,
        referralCode: 'GT123',
        phone: '0901234567',
        dateOfBirth: '1996-01-15',
        address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
        createdAt: '2025-07-01',
        image: 'https://randomuser.me/api/portraits/men/1.jpg',
        status: 1,
    },
    {
        _id: '2',
        fullName: 'Trần Thị B',
        customerCode: 'KH002',
        age: 32,
        gender: 0,
        referralCode: 'GT456',
        phone: '0912345678',
        dateOfBirth: '1992-03-22',
        address: '456 Đường Nguyễn Huệ, Quận 1, TP.HCM',
        createdAt: '2025-07-02',
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
        status: 1,
    },
    {
        _id: '3',
        fullName: 'Lê Văn C',
        customerCode: 'KH003',
        age: 25,
        gender: 1,
        referralCode: 'GT789',
        phone: '0923456789',
        dateOfBirth: '1999-07-10',
        address: '789 Đường Trần Hưng Đạo, Quận 5, TP.HCM',
        createdAt: '2025-07-03',
        image: 'https://randomuser.me/api/portraits/men/3.jpg',
        status: 1,
    },
    {
        _id: '4',
        fullName: 'Phạm Thị D',
        customerCode: 'KH004',
        age: 29,
        gender: 0,
        referralCode: 'GT321',
        phone: '0934567890',
        dateOfBirth: '1995-11-05',
        address: '321 Đường Cách Mạng Tháng 8, Quận 10, TP.HCM',
        createdAt: '2025-07-04',
        image: 'https://randomuser.me/api/portraits/women/4.jpg',
        status: 1,
    },
    {
        _id: '5',
        fullName: 'Hoàng Văn E',
        customerCode: 'KH005',
        age: 30,
        gender: 2,
        referralCode: 'GT654',
        phone: '0945678901',
        dateOfBirth: '1994-05-20',
        address: '654 Đường Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
        createdAt: '2025-07-05',
        image: 'https://randomuser.me/api/portraits/men/5.jpg',
        status: 1,
    }
];
