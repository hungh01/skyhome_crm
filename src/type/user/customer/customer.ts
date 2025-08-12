
export interface Customer {
    _id: string;
    joinedAt: string;
    status: number;
    rank: string;
    totalPoints: number;
    code: string;
    userId: {
        _id: string;
        fullName: string;
        phone: string;
        address: string;
        age: number;
        gender: number;
        createdAt: string;
    };
}