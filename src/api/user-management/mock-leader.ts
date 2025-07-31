// Adjust the import path as needed

import { Group } from "@/type/user/collaborator/group";

export const mockGroups: Group[] = [
    {
        id: 'group-1',
        leader: 'Nguyen Van A',
        phoneLeader: '0901234567',
        imageLeader: 'https://randomuser.me/api/portraits/men/1.jpg',
        groupName: 'Alpha Team',
        rate: 4.8,
        address: '123 Le Loi, District 1, HCMC',
        memberActive: 1,
        memberTotal: 2,
        members: [
            {
                id: 'partner-1',
                image: 'https://randomuser.me/api/portraits/men/11.jpg',
                code: 'P001',
                activeDate: '2023-01-15',
                name: 'Tran Thi B',
                phoneNumber: '0912345678',
                rate: 4.7,
                address: '456 Nguyen Trai, District 5, HCMC',
                sex: 'female',
                age: 28,
                services: [
                    { id: 'svc-1', name: 'Cleaning' },
                    { id: 'svc-2', name: 'Cooking' }
                ],
                status: 'active',
                createdAt: '2023-01-10'
            },
            {
                id: 'partner-2',
                image: 'https://randomuser.me/api/portraits/men/12.jpg',
                code: 'P002',
                activeDate: '2023-02-10',
                name: 'Le Van C',
                phoneNumber: '0923456789',
                rate: 4.5,
                address: '789 Tran Hung Dao, District 3, HCMC',
                sex: 'male',
                age: 32,
                services: [
                    { id: 'svc-3', name: 'Gardening' }
                ],
                status: 'inactive',
                createdAt: '2023-02-01'
            }
        ]
    },
    {
        id: 'group-2',
        leader: 'Pham Thi D',
        phoneLeader: '0934567890',
        imageLeader: 'https://randomuser.me/api/portraits/women/2.jpg',
        groupName: 'Beta Group',
        rate: 4.6,
        address: '321 Hai Ba Trung, District 3, HCMC',
        memberActive: 1,
        memberTotal: 1,
        members: [
            {
                id: 'partner-3',
                image: 'https://randomuser.me/api/portraits/women/13.jpg',
                code: 'P003',
                activeDate: '2023-03-05',
                name: 'Nguyen Van E',
                phoneNumber: '0945678901',
                rate: 4.9,
                address: '654 Vo Van Tan, District 3, HCMC',
                sex: 'male',
                age: 29,
                services: [
                    { id: 'svc-4', name: 'Babysitting' }
                ],
                status: 'active',
                createdAt: '2023-03-01'
            }
        ]
    }
];

// Example Service interface for completeness
export interface Service {
    id: string;
    name: string;
}