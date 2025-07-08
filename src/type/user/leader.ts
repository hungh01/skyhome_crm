export interface Leader {
    id: string;
    name: string;
    phoneNumber: string;
    image: string;
    rate: number;
    address: string;
    groupName: string;
    code: string;
    createdAt: string;
    status: 'active' | 'paused' | 'inactive';
}