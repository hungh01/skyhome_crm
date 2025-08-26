
export interface Customer {
    _id: string;
    joinedAt: string;
    status: number;
    rank: string;
    totalPoints: number;
    code: string;
    referralCode: string;
    userId: {
        _id: string;
        fullName: string;
        phone: string;
        address: string;
        birthDate: string;
        age: number;
        gender: number;
        createdAt: string;
    };
}