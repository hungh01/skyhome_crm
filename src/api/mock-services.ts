import { Service, Equipment, OptionalService } from "../type/services";
// Mock optional services
const mockOptionalServices: OptionalService[] = [
    {
        id: 'opt1',
        name: 'Làm sạch sofa',
        basePrice: 300000,
        status: true,
        description: 'Dịch vụ làm sạch sofa chuyên sâu',
    },
    {
        id: 'opt2',
        name: 'Làm sạch rèm cửa',
        basePrice: 200000,
        status: true,
        description: 'Dịch vụ làm sạch rèm cửa các loại',
    },
    {
        id: 'opt3',
        name: 'Khử khuẩn không khí',
        basePrice: 150000,
        status: false,
        description: 'Dịch vụ phun khử khuẩn không khí',
    },
];

const mockEquipment: Equipment[] = [
    { id: 'eq1', name: 'Máy hút bụi', price: 50000, status: true, description: 'Máy hút bụi công suất cao' },
    { id: 'eq2', name: 'Chổi cọ', price: 20000, status: true, description: 'Chổi cọ đa năng' },
    { id: 'eq3', name: 'Nước tẩy rửa chuyên dụng', price: 30000, status: true, description: 'Dung dịch tẩy rửa an toàn' },
    { id: 'eq4', name: 'Khăn lau microfiber', price: 15000, status: true, description: 'Khăn lau siêu thấm hút' },
    { id: 'eq5', name: 'Máy phun áp lực', price: 100000, status: false, description: 'Máy phun áp lực cao cấp' },
    { id: 'eq6', name: 'Dụng cụ vệ sinh máy lạnh', price: 80000, status: true, description: 'Bộ dụng cụ chuyên dụng' },
];

const getRandomImage = () => `https://picsum.photos/seed/${Math.floor(Math.random() * 10000)}/400/300`;

const mockServicePacks = [
    {
        id: 'sp1',
        name: '1 giờ',
        numberOfPeople: 1,
        durationTime: 30,
        description: 'Gói dịch vụ vệ sinh nhanh trong 1 giờ',
        image: getRandomImage(),
        price: 100000 * 1 + mockEquipment.reduce((sum, eq) => sum + eq.price, 0),
        status: true,
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2023-10-01T00:00:00Z',
    },
    {
        id: 'sp2',
        name: '2 giờ',
        numberOfPeople: 1,
        durationTime: 60, // in minutes
        description: 'Gói dịch vụ vệ sinh tiêu chuẩn trong 2 giờ',
        image: getRandomImage(),
        price: 100000 * 2 + mockEquipment.reduce((sum, eq) => sum + eq.price, 0),
        status: true,
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2023-10-01T00:00:00Z',
    },
    {
        id: 'sp3',
        name: '3 giờ',
        numberOfPeople: 1,
        durationTime: 120, // in minutes
        description: 'Gói dịch vụ vệ sinh chuyên sâu trong 3 giờ',
        image: getRandomImage(),
        price: 100000 * 3 + mockEquipment.reduce((sum, eq) => sum + eq.price, 0),
        status: true,
        createdAt: '2023-10-01T00:00:00Z',
        updatedAt: '2023-10-01T00:00:00Z',
    },
];



export const mockServices: Service[] = [
    {
        id: '1',
        name: 'Vệ sinh theo giờ',
        status: true,
        description: 'Dịch vụ vệ sinh nhà cửa theo giờ, linh hoạt theo nhu cầu khách hàng',
        basePrice: 150000,
        estimatedTime: 120,
        category: 'personal',
        servicePacks: mockServicePacks,
        equipment: [mockEquipment[0], mockEquipment[1], mockEquipment[2], mockEquipment[3]],
        optionalServices: mockOptionalServices,
    },
    {
        id: '2',
        name: 'Tổng vệ sinh',
        status: false,
        description: 'Dịch vụ tổng vệ sinh toàn bộ nhà cửa, làm sạch từ trong ra ngoài',
        basePrice: 500000,
        estimatedTime: 240,
        category: 'personal',
        servicePacks: mockServicePacks,
        equipment: [mockEquipment[0], mockEquipment[1], mockEquipment[2], mockEquipment[3], mockEquipment[4]],
        optionalServices: mockOptionalServices,
    },
    {
        id: '3',
        name: 'Vệ sinh máy lạnh',
        status: true,
        description: 'Dịch vụ vệ sinh và bảo dưỡng máy lạnh chuyên nghiệp',
        basePrice: 200000,
        estimatedTime: 90,
        category: 'personal',
        servicePacks: mockServicePacks,
        equipment: [mockEquipment[5], mockEquipment[2]],
        optionalServices: mockOptionalServices,
    },
    {
        id: '4',
        name: 'Vệ sinh máy giặt',
        status: true,
        description: 'Dịch vụ vệ sinh máy giặt, khử mùi và vi khuẩn',
        basePrice: 180000,
        estimatedTime: 60,
        category: 'personal',
        servicePacks: mockServicePacks,
        equipment: [mockEquipment[2], mockEquipment[3]],
        optionalServices: mockOptionalServices,
    },
    {
        id: '5',
        name: 'Vệ sinh máy nóng lạnh',
        status: false,
        description: 'Dịch vụ vệ sinh và bảo dưỡng máy nóng lạnh',
        basePrice: 220000,
        estimatedTime: 75,
        category: 'personal',
        servicePacks: mockServicePacks,
        equipment: [mockEquipment[2], mockEquipment[3], mockEquipment[5]],
        optionalServices: mockOptionalServices,
    },
];

export const mockBusinessServices: Service[] = [
    {
        id: '6',
        name: 'Dịch vụ bảo trì văn phòng',
        status: true,
        description: 'Dịch vụ bảo trì và vệ sinh văn phòng định kỳ',
        basePrice: 800000,
        estimatedTime: 180,
        category: 'business',
        servicePacks: mockServicePacks,
        equipment: [mockEquipment[0], mockEquipment[1], mockEquipment[2], mockEquipment[3]]
    },
    {
        id: '7',
        name: 'Dịch vụ bảo trì thiết bị',
        status: false,
        description: 'Dịch vụ bảo trì các thiết bị văn phòng và công nghiệp',
        basePrice: 1200000,
        estimatedTime: 300,
        category: 'business',
        servicePacks: mockServicePacks,
        equipment: [mockEquipment[4], mockEquipment[5]]
    },
    {
        id: '8',
        name: 'Dịch vụ bảo trì hệ thống điện',
        status: true,
        description: 'Dịch vụ kiểm tra và bảo trì hệ thống điện',
        basePrice: 1500000,
        estimatedTime: 240,
        category: 'business',
        servicePacks: mockServicePacks,
        equipment: []
    },
    {
        id: '9',
        name: 'Dịch vụ bảo trì hệ thống nước',
        status: true,
        description: 'Dịch vụ kiểm tra và bảo trì hệ thống cấp thoát nước',
        basePrice: 1300000,
        estimatedTime: 200,
        category: 'business',
        servicePacks: mockServicePacks,
        equipment: [mockEquipment[4]]
    },
    {
        id: '10',
        name: 'Dịch vụ bảo trì hệ thống điều hòa',
        status: false,
        description: 'Dịch vụ bảo trì hệ thống điều hòa tập trung',
        basePrice: 2000000,
        estimatedTime: 360,
        category: 'business',
        servicePacks: mockServicePacks,
        equipment: [mockEquipment[5], mockEquipment[2]]
    },
];

export { mockEquipment };