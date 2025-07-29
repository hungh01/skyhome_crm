
export interface User {
    _id?: string;
    id?: string;
    phone: string;
    fullName: string;
    rank: string;
    status?: number;
    otpCode?: string;
    otpExpiresAt?: Date;
    role: 'admin' | 'staff' | 'user' | 'ctv';
    address?: string;
    age?: number;
    gender?: number; // 0: Male, 1: Female, 2: Other
    referralCode?: string;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}


