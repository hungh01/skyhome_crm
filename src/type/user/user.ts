export interface User {
    _id: string;
    fullName: string;
    customerCode: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    referralCode: string;
    phone: string;
    dateOfBirth: string;
    cardHolderName: string;
    bankName: string;
    bankAccountNumber: string;
    address: string;
    createdAt: string;
    image: string;
    rank: number
}


