
import { Equipment } from "@/type/services/equipmemt";
import { OptionalService } from "@/type/services/optional";
import { Service } from "@/type/services/services";


// Update Service interface as requested


// Mock optional services
export const mockOptionalServices: OptionalService[] = [
    {
        _id: 'opt1',
        serviceName: 'Làm sạch sofa',
        servicePrice: 300000,
        serviceDescription: 'Dịch vụ làm sạch sofa chuyên nghiệp',
        serviceStatus: 'available',
        serviceImage: 'https://picsum.photos/seed/1/400/300',
    },
    {
        _id: 'opt2',
        serviceName: 'Làm sạch rèm cửa',
        servicePrice: 200000,
        serviceDescription: 'Dịch vụ làm sạch rèm cửa chuyên nghiệp',
        serviceStatus: 'available',
        serviceImage: 'https://picsum.photos/seed/2/400/300',
    },
    {
        _id: 'opt3',
        serviceName: 'Khử khuẩn không khí',
        servicePrice: 150000,
        serviceDescription: 'Dịch vụ khử khuẩn không khí chuyên nghiệp',
        serviceStatus: 'available',
        serviceImage: 'https://picsum.photos/seed/3/400/300',
    },
];

export const mockEquipment: Equipment[] = [
    { _id: 'eq1', equipmentName: 'Máy hút bụi', equipmentPrice: 50000, equipmentDescription: 'Máy hút bụi công suất cao', equipmentStatus: 'available', equipmentImage: 'https://picsum.photos/seed/4/400/300' },
    { _id: 'eq2', equipmentName: 'Chổi cọ', equipmentPrice: 20000, equipmentDescription: 'Chổi cọ vệ sinh', equipmentStatus: 'available', equipmentImage: 'https://picsum.photos/seed/5/400/300' },
    { _id: 'eq3', equipmentName: 'Nước tẩy rửa chuyên dụng', equipmentPrice: 30000, equipmentDescription: 'Nước tẩy rửa chuyên dụng cho vệ sinh', equipmentStatus: 'available', equipmentImage: 'https://picsum.photos/seed/6/400/300' },
    { _id: 'eq4', equipmentName: 'Khăn lau microfiber', equipmentPrice: 15000, equipmentDescription: 'Khăn lau microfiber siêu thấm', equipmentStatus: 'available', equipmentImage: 'https://picsum.photos/seed/7/400/300' },
    { _id: 'eq5', equipmentName: 'Máy phun áp lực', equipmentPrice: 100000, equipmentDescription: 'Máy phun áp lực mạnh mẽ', equipmentStatus: 'available', equipmentImage: 'https://picsum.photos/seed/8/400/300' },
    { _id: 'eq6', equipmentName: 'Dụng cụ vệ sinh máy lạnh', equipmentPrice: 80000, equipmentDescription: 'Dụng cụ vệ sinh máy lạnh chuyên dụng', equipmentStatus: 'available', equipmentImage: 'https://picsum.photos/seed/9/400/300' },
];

const getRandomImage = () => `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/400/300`;

// Create mock services according to new Service interface
export const mockServices: Service[] = [
    {
        _id: 'sp1',
        name: '1 giờ',
        image: getRandomImage(),
        status: true,
        numberOfPeople: 1,
        durationMinutes: 60,
        price: 100000 * 1 + mockEquipment.reduce((sum, eq) => sum + eq.equipmentPrice, 0),
        equipments: [mockEquipment[0], mockEquipment[1], mockEquipment[2], mockEquipment[3]],
        optionalServices: mockOptionalServices,
    },
    {
        _id: 'sp2',
        name: '2 giờ',
        image: getRandomImage(),
        status: true,
        numberOfPeople: 1,
        durationMinutes: 120,
        price: 100000 * 2 + mockEquipment.reduce((sum, eq) => sum + eq.equipmentPrice, 0),
        equipments: [mockEquipment[0], mockEquipment[1], mockEquipment[2], mockEquipment[3], mockEquipment[4]],
        optionalServices: mockOptionalServices,
    },
    {
        _id: 'sp3',
        name: '3 giờ',
        image: getRandomImage(),
        status: true,
        numberOfPeople: 1,
        durationMinutes: 180,
        price: 100000 * 3 + mockEquipment.reduce((sum, eq) => sum + eq.equipmentPrice, 0),
        equipments: [mockEquipment[5], mockEquipment[2]],
        optionalServices: mockOptionalServices,
    },
    {
        _id: 'sp4',
        name: 'Vệ sinh máy giặt',
        image: getRandomImage(),
        status: true,
        numberOfPeople: 1,
        durationMinutes: 60,
        price: 180000,
        equipments: [mockEquipment[2], mockEquipment[3]],
        optionalServices: mockOptionalServices,
    },
    {
        _id: 'sp5',
        name: 'Vệ sinh máy nóng lạnh',
        image: getRandomImage(),
        status: false,
        numberOfPeople: 1,
        durationMinutes: 75,
        price: 220000,
        equipments: [mockEquipment[2], mockEquipment[3], mockEquipment[5]],
        optionalServices: mockOptionalServices,
    },
];

export const mockBusinessServices: Service[] = [
    {
        _id: '6',
        name: 'Dịch vụ bảo trì văn phòng',
        image: getRandomImage(),
        status: true,
        numberOfPeople: 2,
        durationMinutes: 180,
        price: 800000,
        equipments: [mockEquipment[0], mockEquipment[1], mockEquipment[2], mockEquipment[3]],
    },
    {
        _id: '7',
        name: 'Dịch vụ bảo trì thiết bị',
        image: getRandomImage(),
        status: false,
        numberOfPeople: 2,
        durationMinutes: 300,
        price: 1200000,
        equipments: [mockEquipment[4], mockEquipment[5]],
    },
    {
        _id: '8',
        name: 'Dịch vụ bảo trì hệ thống điện',
        image: getRandomImage(),
        status: true,
        numberOfPeople: 2,
        durationMinutes: 240,
        price: 1500000,
        equipments: [],
    },
    {
        _id: '9',
        name: 'Dịch vụ bảo trì hệ thống nước',
        image: getRandomImage(),
        status: true,
        numberOfPeople: 2,
        durationMinutes: 200,
        price: 1300000,
        equipments: [mockEquipment[4]],
    },
    {
        _id: '10',
        name: 'Dịch vụ bảo trì hệ thống điều hòa',
        image: getRandomImage(),
        status: false,
        numberOfPeople: 2,
        durationMinutes: 360,
        price: 2000000,
        equipments: [mockEquipment[5], mockEquipment[2]],
    },
];
