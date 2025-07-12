"use client";
import { useState, useMemo } from "react";
import { Table, Typography, Input, Tag, Avatar, Row, Col, Select, Button, Modal, Switch } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";


const { Title } = Typography;

const mockBanners = [
    // Promotion for Skyhome
    {
        id: 6,
        name: "Skyhome - Ưu đãi mùa hè: Giảm 20% cho dịch vụ dọn nhà!",
        type: "promotion",
        typeLabel: "Khuyến mãi",
        position: 'web-banner',
        linkId: "skyhome-summer2025",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=200&fit=crop",
        isActive: true,
        url: "https://skyhome.vn/khuyen-mai",
        createdAt: "2025-06-01 08:00:00",
        updatedAt: "2025-06-01 08:00:00"
    },
    // More Skyhome banners
    {
        id: 7,
        name: "Skyhome - Đặt lịch dọn nhà, nhận quà hấp dẫn!",
        type: "promotion",
        typeLabel: "Khuyến mãi",
        position: 'web-banner',
        linkId: "skyhome-booking2025",
        image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=400&h=200&fit=crop",
        isActive: true,
        url: "https://skyhome.vn/dat-lich",
        createdAt: "2025-06-10 09:00:00",
        updatedAt: "2025-06-10 09:00:00"
    },
    {
        id: 8,
        name: "Skyhome - Dịch vụ vệ sinh chuyên nghiệp cho căn hộ của bạn",
        type: "service",
        typeLabel: "Dịch vụ",
        position: 'app-banner',
        linkId: "skyhome-cleaning2025",
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=400&h=200&fit=crop",
        isActive: true,
        url: null,
        createdAt: "2025-06-15 10:30:00",
        updatedAt: "2025-06-15 10:30:00"
    },
    {
        id: 9,
        name: "Skyhome - Liên kết ưu đãi đối tác ngân hàng",
        type: "url",
        typeLabel: "Liên kết",
        position: "app-banner",
        linkId: null,
        image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=200&fit=crop",
        isActive: true,
        url: "https://skyhome.vn/doi-tac",
        createdAt: "2025-06-20 14:00:00",
        updatedAt: "2025-06-20 14:00:00"
    },
    {
        id: 10,
        name: "Skyhome - Đăng ký thành viên, nhận voucher 50K",
        type: "promotion",
        typeLabel: "Khuyến mãi",
        position: "app-banner",
        linkId: "skyhome-member2025",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=200&fit=crop",
        isActive: true,
        url: "https://skyhome.vn/dang-ky",
        createdAt: "2025-06-25 12:00:00",
        updatedAt: "2025-06-25 12:00:00"
    }
];

// Define the type for a banner
interface Banner {
    id: number;
    name: string;
    type: string;
    typeLabel: string;
    position: string;
    linkId: string | null;
    image: string;
    isActive: boolean;
    url: string | null;
    createdAt: string;
    updatedAt: string;
}

import type { ColumnsType } from 'antd/es/table';
import CreateBanner from "./CreateBanner";

export default function BannerList() {
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string | undefined>(undefined);
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    const handleEditBanner = (banner: Banner): void => {
        setEditingBanner(banner);
        setShowCreateModal(true);
    };

    const handleCloseModal = (): void => {
        setShowCreateModal(false);
        setEditingBanner(null);
    };

    const handleToggleStatus = (banner: Banner): void => {
        // Here you would typically make an API call to update the banner status
        console.log(`Toggle status for banner ${banner.id} to ${!banner.isActive}`);
    };

    const columns: ColumnsType<Banner> = [
        {
            title: <span style={{}}>STT</span>,
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: "center" as const,
            render: (_: unknown, __: Banner, idx: number) => idx + 1,
        },
        {
            title: <span style={{}}>Tên</span>,
            dataIndex: "name",
            key: "name",
            render: (name: string, record: Banner) => (
                <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{name}</div>
                    <div style={{ color: '#888', fontSize: 12 }}>
                        Tạo: {record.createdAt}
                    </div>
                </div>
            ),
            width: 300,
        },
        {
            title: <span style={{}}>Type link</span>,
            dataIndex: "type",
            key: "type",
            width: 120,
            render: (type: string, record: Banner) => {
                let color = '#108ee9';
                if (type === 'promotion') color = '#87d068';
                if (type === 'url') color = '#f50';
                return <Tag color={color}>{record.typeLabel}</Tag>;
            },
        },
        {
            title: <span style={{}}>Vị trí</span>,
            dataIndex: "position",
            key: "position",
            width: 80,
            align: "center" as const,
            render: (position: string) => (
                <span style={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    display: 'inline',
                    padding: '2px 8px',
                    fontSize: 12,
                    whiteSpace: 'nowrap'
                }}>
                    {position}
                </span>
            ),
        },
        {
            title: <span style={{}}>Link ID</span>,
            dataIndex: "linkId",
            key: "linkId",
            width: 200,
            render: (linkId: string | null, record: Banner) => (
                <div style={{ fontSize: 12, color: '#666' }}>
                    {linkId || record.url || '-'}
                </div>
            ),
        },
        {
            title: <span style={{}}>Hình ảnh</span>,
            dataIndex: "image",
            key: "image",
            align: "center" as const,
            width: 120,
            render: (img: string) => (
                <Avatar
                    shape="square"
                    src={img}
                    size={64}
                    style={{ objectFit: 'cover' }}
                />
            ),
        },
        {
            title: <span style={{}}>Trạng thái</span>,
            dataIndex: "isActive",
            key: "isActive",
            width: 100,
            align: "center" as const,
            render: (isActive: boolean, record: Banner) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleToggleStatus(record)}
                    size="small"
                />
            ),
        },
        {
            title: <span style={{}}>Thao tác</span>,
            key: "actions",
            width: 100,
            align: "center" as const,
            render: (_: unknown, record: Banner) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEditBanner(record)}
                    size="small"
                >
                    Sửa
                </Button>
            ),
        },
    ];

    // Unique type values for dropdown
    const typeOptions = Array.from(new Set(mockBanners.map(b => b.typeLabel)));

    // Filter banners based on search and filters
    const filteredBanners = useMemo(() => {
        return mockBanners.filter(banner => {
            const matchesSearch = search === "" ||
                banner.name.toLowerCase().includes(search.toLowerCase()) ||
                (banner.linkId && banner.linkId.toLowerCase().includes(search.toLowerCase())) ||
                (banner.url && banner.url.toLowerCase().includes(search.toLowerCase()));

            const matchesType = type === undefined || banner.typeLabel === type;
            const matchesStatus = isActive === undefined || banner.isActive === isActive;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [search, type, isActive]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>
                    Danh sách Banner ({filteredBanners.length})
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setShowCreateModal(true)}
                >
                    Tạo Banner mới
                </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8}>
                    <Input
                        placeholder="Tìm kiếm banner..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        allowClear
                    />
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Lọc theo loại"
                        value={type}
                        onChange={setType}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        {typeOptions.map(option => (
                            <Select.Option key={option} value={option}>
                                {option}
                            </Select.Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Select
                        placeholder="Lọc theo trạng thái"
                        value={isActive}
                        onChange={setIsActive}
                        allowClear
                        style={{ width: '100%' }}
                    >
                        <Select.Option value={true}>Hoạt động</Select.Option>
                        <Select.Option value={false}>Tạm ngừng</Select.Option>
                    </Select>
                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={filteredBanners}
                rowKey="id"
                bordered={false}
                size="middle"
                rowClassName={(_: Banner, idx: number) => idx % 2 === 1 ? "ant-table-row-striped" : ""}
                style={{ borderRadius: 12 }}
                pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                }}
            />

            <Modal
                title={editingBanner ? "Chỉnh sửa Banner" : "Tạo Banner mới"}
                open={showCreateModal}
                onCancel={handleCloseModal}
                footer={null}
                width={1000}
                style={{ top: 20 }}
            >
                <CreateBanner
                    onSuccess={handleCloseModal}
                    initialData={editingBanner || undefined}
                />
            </Modal>
        </div>
    );
}
