"use client";
import { useState, useMemo } from "react";
import { Table, Typography, Input, Tag, Avatar, Space, Row, Col, Select, Button, Modal, Switch, Popconfirm } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title } = Typography;

const mockNews = [
    {
        id: 1,
        title: "Khuyến mãi đặc biệt dịch vụ dọn nhà cuối năm",
        description: "Giảm giá 30% cho tất cả dịch vụ dọn nhà trong tháng 12. Đặt lịch ngay để nhận ưu đãi hấp dẫn.",
        link: "https://guvi.vn/promotion/cleaning-service",
        type: "promotion",
        typeLabel: "Khuyến mãi",
        position: 1,
        image: "https://images.unsplash.com/photo-1558618047-3c8c99f99537?w=400&h=200&fit=crop",
        isActive: true,
        createdAt: "2025-01-10 14:30:00",
        updatedAt: "2025-01-10 14:30:00"
    },
    {
        id: 2,
        title: "Hướng dẫn bảo dưỡng thiết bị gia dụng",
        description: "Những mẹo hay để bảo dưỡng các thiết bị gia dụng giúp kéo dài tuổi thọ và tiết kiệm chi phí.",
        link: "https://guvi.vn/news/home-appliance-maintenance",
        type: "tips",
        typeLabel: "Mẹo hay",
        position: 2,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=200&fit=crop",
        isActive: true,
        createdAt: "2025-01-09 10:15:00",
        updatedAt: "2025-01-09 10:15:00"
    },
    {
        id: 3,
        title: "Ra mắt dịch vụ sửa chữa điện tử tại nhà",
        description: "GUVI chính thức ra mắt dịch vụ sửa chữa điện tử tại nhà với đội ngũ kỹ thuật viên chuyên nghiệp.",
        link: "https://guvi.vn/news/electronic-repair-service",
        type: "news",
        typeLabel: "Tin tức",
        position: 3,
        image: "https://images.unsplash.com/photo-1541518411618-a8b8cddc564d?w=400&h=200&fit=crop",
        isActive: true,
        createdAt: "2025-01-08 16:45:00",
        updatedAt: "2025-01-08 16:45:00"
    },
    {
        id: 4,
        title: "Chương trình đào tạo kỹ năng cho nhân viên",
        description: "GUVI tổ chức chương trình đào tạo nâng cao kỹ năng chuyên môn cho toàn bộ nhân viên.",
        link: "https://guvi.vn/news/staff-training-program",
        type: "company",
        typeLabel: "Công ty",
        position: 4,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=200&fit=crop",
        isActive: false,
        createdAt: "2025-01-07 11:20:00",
        updatedAt: "2025-01-07 11:20:00"
    },
    {
        id: 5,
        title: "Mở rộng phạm vi hoạt động ra các tỉnh thành",
        description: "GUVI chính thức mở rộng dịch vụ ra 10 tỉnh thành mới, phục vụ nhu cầu ngày càng tăng của khách hàng.",
        link: "https://guvi.vn/news/expansion-announcement",
        type: "news",
        typeLabel: "Tin tức",
        position: 5,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=200&fit=crop",
        isActive: true,
        createdAt: "2025-01-06 09:30:00",
        updatedAt: "2025-01-06 09:30:00"
    }
];

// Define the type for a news item
interface NewsItem {
    id: number;
    title: string;
    description: string;
    link: string;
    type: string;
    typeLabel: string;
    position: number;
    image: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

import type { ColumnsType } from 'antd/es/table';
import CreateNews from "./CreateNews";

export default function NewsFeed() {
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string | undefined>(undefined);
    const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

    const handleEditNews = (news: NewsItem): void => {
        setEditingNews(news);
        setShowCreateModal(true);
    };

    const handleCloseModal = (): void => {
        setShowCreateModal(false);
        setEditingNews(null);
    };

    const handleToggleStatus = (news: NewsItem): void => {
        // Here you would typically make an API call to update the news status
        console.log(`Toggle status for news ${news.id} to ${!news.isActive}`);
    };

    const handleDeleteNews = (news: NewsItem): void => {
        // Here you would typically make an API call to delete the news
        console.log(`Delete news ${news.id}`);
    };

    const columns: ColumnsType<NewsItem> = [
        {
            title: <span style={{}}>STT</span>,
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: "center" as const,
            render: (_: unknown, __: NewsItem, idx: number) => idx + 1,
        },
        {
            title: <span style={{}}>Tiêu đề</span>,
            dataIndex: "title",
            key: "title",
            render: (title: string, record: NewsItem) => (
                <div>
                    <div style={{ fontWeight: 600, marginBottom: 4, color: '#1890ff' }}>
                        {title}
                    </div>
                    <div style={{ color: '#888', fontSize: 12 }}>
                        Tạo: {record.createdAt}
                    </div>
                </div>
            ),
            width: 250,
        },
        {
            title: <span style={{}}>Mô tả ngắn</span>,
            dataIndex: "description",
            key: "description",
            render: (description: string) => (
                <div style={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: '#666'
                }}>
                    {description}
                </div>
            ),
            width: 220,
        },
        {
            title: <span style={{}}>Link</span>,
            dataIndex: "link",
            key: "link",
            render: (link: string) => (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: '#1890ff',
                        textDecoration: 'none',
                        fontSize: 12,
                        maxWidth: 150,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {link}
                </a>
            ),
            width: 160,
        },
        {
            title: <span style={{}}>Loại</span>,
            dataIndex: "type",
            key: "type",
            width: 100,
            render: (type: string, record: NewsItem) => {
                let color = '#108ee9';
                switch (type) {
                    case 'promotion': color = '#f50'; break;
                    case 'news': color = '#87d068'; break;
                    case 'tips': color = '#2db7f5'; break;
                    case 'company': color = '#722ed1'; break;
                    default: color = '#108ee9';
                }
                return <Tag color={color}>{record.typeLabel}</Tag>;
            },
        },
        {
            title: <span style={{}}>Vị trí</span>,
            dataIndex: "position",
            key: "position",
            width: 80,
            align: "center" as const,
            render: (position: number) => (
                <span style={{
                    backgroundColor: '#f0f0f0',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 500
                }}>
                    {position}
                </span>
            ),
        },
        {
            title: <span style={{}}>Hình ảnh</span>,
            dataIndex: "image",
            key: "image",
            align: "center" as const,
            width: 100,
            render: (img: string) => (
                <Avatar
                    shape="square"
                    src={img}
                    size={48}
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
            render: (isActive: boolean, record: NewsItem) => (
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
            width: 120,
            align: "center" as const,
            render: (_: unknown, record: NewsItem) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditNews(record)}
                        size="small"
                        title="Chỉnh sửa"
                    />
                    <Popconfirm
                        title="Xóa tin tức"
                        description="Bạn có chắc chắn muốn xóa tin tức này?"
                        onConfirm={() => handleDeleteNews(record)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            title="Xóa"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    // Unique type values for dropdown
    const typeOptions = Array.from(new Set(mockNews.map(news => news.typeLabel)));

    // Filter news based on search and filters
    const filteredNews = useMemo(() => {
        return mockNews.filter(news => {
            const matchesSearch = search === "" ||
                news.title.toLowerCase().includes(search.toLowerCase()) ||
                news.description.toLowerCase().includes(search.toLowerCase()) ||
                news.link.toLowerCase().includes(search.toLowerCase());

            const matchesType = type === undefined || news.typeLabel === type;
            const matchesStatus = isActive === undefined || news.isActive === isActive;

            return matchesSearch && matchesType && matchesStatus;
        });
    }, [search, type, isActive]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={4} style={{ margin: 0 }}>
                    Danh sách Tin tức ({filteredNews.length})
                </Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setShowCreateModal(true)}
                >
                    Tạo tin tức mới
                </Button>
            </div>

            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
                <Col xs={24} sm={12} md={8}>
                    <Input
                        placeholder="Tìm kiếm tin tức..."
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
                dataSource={filteredNews}
                rowKey="id"
                bordered={false}
                size="middle"
                rowClassName={(_: NewsItem, idx: number) => idx % 2 === 1 ? "ant-table-row-striped" : ""}
                style={{ borderRadius: 12 }}
                pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                }}
            />

            <Modal
                title={editingNews ? "Chỉnh sửa Tin tức" : "Tạo Tin tức mới"}
                open={showCreateModal}
                onCancel={handleCloseModal}
                footer={null}
                width={1000}
                style={{ top: 20 }}
            >
                <CreateNews
                    onSuccess={handleCloseModal}
                    initialData={editingNews || undefined}
                />
            </Modal>
        </div>
    );
}