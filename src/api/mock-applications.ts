import { CtvApplication, ApplicationStats } from "@/type/application";

export const mockApplications: CtvApplication[] = [
    {
        id: "1",
        stt: 1,
        ctvCode: "CTV0102580",
        createdDate: "15/07/2025",
        createdTime: "14:48:21",
        name: "PHẠM THỊ HƯƠNG",
        phone: "0366144329",
        rating: 5,
        area: "Hà Nội",
        serviceType: "Dịch vụ dọn dẹp",
        status: "contacted",
        avatar: "/user.png"
    },
    {
        id: "2",
        stt: 2,
        ctvCode: "CTV7403147",
        createdDate: "15/07/2025",
        createdTime: "11:00:44",
        name: "LA THỊ YẾN LINH",
        phone: "0937045884",
        rating: 5,
        area: "Bình Dương",
        serviceType: "Dịch vụ dọn dẹp",
        status: "processing",
        avatar: "/user.png"
    },
    {
        id: "3",
        stt: 3,
        ctvCode: "CTV7903484",
        createdDate: "15/07/2025",
        createdTime: "10:41:47",
        name: "TRẦN THỊ BÍCH THỦY",
        phone: "0938671359",
        rating: 5,
        area: "Hồ Chí Minh",
        serviceType: "Dịch vụ dọn dẹp",
        status: "contacted",
        avatar: "/user.png"
    },
    {
        id: "4",
        stt: 4,
        ctvCode: "CTV0102579",
        createdDate: "14/07/2025",
        createdTime: "21:13:13",
        name: "NGUYỄN KIM YẾN",
        phone: "0947295358",
        rating: 5,
        area: "Hà Nội",
        serviceType: "Dịch vụ dọn dẹp",
        status: "contacted",
        avatar: "/user.png"
    },
    {
        id: "5",
        stt: 5,
        ctvCode: "CTV0102578",
        createdDate: "14/07/2025",
        createdTime: "20:45:32",
        name: "NGUYỄN THỊ THANH",
        phone: "0912345678",
        rating: 5,
        area: "Hà Nội",
        serviceType: "Dịch vụ dọn dẹp",
        status: "contacted",
        avatar: "/user.png"
    },
    {
        id: "6",
        stt: 6,
        ctvCode: "CTV0102577",
        createdDate: "14/07/2025",
        createdTime: "19:22:15",
        name: "HOÀNG VĂN MINH",
        phone: "0987654321",
        rating: 4,
        area: "Đà Nẵng",
        serviceType: "Dịch vụ dọn dẹp",
        status: "pending",
        avatar: "/user.png"
    },
    {
        id: "7",
        stt: 7,
        ctvCode: "CTV0102576",
        createdDate: "14/07/2025",
        createdTime: "18:10:44",
        name: "LÊ THỊ MAI",
        phone: "0901234567",
        rating: 5,
        area: "Hồ Chí Minh",
        serviceType: "Dịch vụ dọn dẹp",
        status: "approved",
        avatar: "/user.png"
    },
    {
        id: "8",
        stt: 8,
        ctvCode: "CTV0102575",
        createdDate: "14/07/2025",
        createdTime: "17:35:28",
        name: "PHẠM VĂN NAM",
        phone: "0912345679",
        rating: 4,
        area: "Cần Thơ",
        serviceType: "Dịch vụ dọn dẹp",
        status: "rejected",
        avatar: "/user.png"
    },
    {
        id: "9",
        stt: 9,
        ctvCode: "CTV0102574",
        createdDate: "14/07/2025",
        createdTime: "16:20:11",
        name: "VŨ THỊ HỒNG",
        phone: "0987654322",
        rating: 5,
        area: "Hải Phòng",
        serviceType: "Dịch vụ dọn dẹp",
        status: "processing",
        avatar: "/user.png"
    },
    {
        id: "10",
        stt: 10,
        ctvCode: "CTV0102573",
        createdDate: "14/07/2025",
        createdTime: "15:45:33",
        name: "NGUYỄN VĂN DŨNG",
        phone: "0901234568",
        rating: 4,
        area: "Bình Dương",
        serviceType: "Dịch vụ dọn dẹp",
        status: "pending",
        avatar: "/user.png"
    }
];

export const mockApplicationStats: ApplicationStats = {
    total: 4178,
    pending: 1043,
    processing: 0,
    approved: 2732,
    rejected: 0,
    contacted: 403
};

export const mockAreas = [
    "Hà Nội",
    "Hồ Chí Minh",
    "Đà Nẵng",
    "Bình Dương",
    "Cần Thơ",
    "Hải Phòng"
];

export const mockServiceTypes = [
    "Dịch vụ dọn dẹp",
    "Dịch vụ giặt ủi",
    "Dịch vụ nấu ăn",
    "Dịch vụ chăm sóc trẻ em",
    "Dịch vụ khác"
];
