import Password from "antd/es/input/Password";

export interface User {
    id: string;
    customerName: string;
    customerCode: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    referralCode: string;
    phoneNumber: string;
    dateOfBirth: string;
    cardHolderName: string;
    bankName: string;
    bankAccountNumber: string;
    address: string;
    createdAt: string;
    image: string;
}


