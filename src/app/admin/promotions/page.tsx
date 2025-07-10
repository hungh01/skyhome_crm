"use client";
import { useState, useMemo } from "react";
import { Card, Table, Typography, Input, Tag, Avatar, Space, Row, Col, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { SearchOutlined, PictureOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Mock data
const mockPromotions = [
    {
        id: 1,
        code: "SONTESTING50K",
        description: "Giảm giá 2.5%, tối đa 50.000 đ đơn từ 500.000 đ cho dịch vụ Vệ sinh máy lạnh",
        createdAt: "13/03/2025 09:02:44",
        type: "CTKM",
        image: null,
        region: "Toàn quốc",
        status: "Đang diễn ra",
        statusColor: "#69b1ff",
        regionColor: "#bfbfbf",
        usage: 0,
        start: "12/03/2025 07:00:00",
        end: "01/01/2026 06:59:59",
    },
    {
        id: 2,
        code: "KM50K12",
        description: "Giảm giá 0 đ cho dịch vụ Giúp việc theo giờ",
        createdAt: "03/01/2025 14:18:38",
        type: "Mã KM",
        image: null,
        region: "Toàn quốc",
        status: "Sắp diễn ra",
        statusColor: "#ffe58f",
        regionColor: "#bfbfbf",
        usage: 0,
        start: "04/01/2025 07:00:00",
        end: "06/01/2025 06:59:59",
    },
    {
        id: 3,
        code: "KM100K",
        description: "Giảm giá 100.000 đ cho dịch vụ Giúp việc theo giờ",
        createdAt: "03/01/2025 14:14:56",
        type: "Mã KM",
        image: null,
        region: "Toàn quốc",
        status: "Sắp diễn ra",
        statusColor: "#ffe58f",
        regionColor: "#bfbfbf",
        usage: 0,
        start: "10/01/2025 07:00:00",
        end: "12/01/2025 06:59:59",
    },
    {
        id: 4,
        code: "KMCUASON",
        description: "Giảm giá 16.900 đ cho dịch vụ Giúp việc theo giờ",
        createdAt: "03/01/2025 13:15:24",
        type: "Mã KM",
        image: null,
        region: "Toàn quốc",
        status: "Đang diễn ra",
        statusColor: "#69b1ff",
        regionColor: "#bfbfbf",
        usage: 0,
        start: "05/01/2025 07:00:00",
        end: "11/01/2025 06:59:59",
    },
    {
        id: 5,
        code: "VNPAY",
        description: "Tài trợ khuyến mãi này: VNPGUVI25",
        createdAt: "27/12/2024 13:53:16",
        type: "Mã KM",
        image: null,
        region: "Toàn quốc",
        status: "Đang diễn ra",
        statusColor: "#69b1ff",
        regionColor: "#bfbfbf",
        usage: 0,
        start: "27/12/2024 07:00:00",
        end: "01/04/2025 06:59:59",
    },
];

// Define the type for a promotion
interface Promotion {
    id: number;
    code: string;
    description: string;
    createdAt: string;
    type: string;
    image: string | null;
    region: string;
    status: string;
    statusColor: string;
    regionColor: string;
    usage: number;
    start: string;
    end: string;
}

import type { ColumnsType } from 'antd/es/table';

const columns: ColumnsType<Promotion> = [
    {
        title: <span style={{}}>STT</span>,
        dataIndex: "stt",
        key: "stt",
        width: 60,
        align: "center" as const,
        render: (_: unknown, __: Promotion, idx: number) => idx + 1,
    },
    {
        title: <span style={{}}>Mã Khuyến Mãi </span>,
        dataIndex: "code",
        key: "code",
        render: (code: string, record: Promotion) => (
            <div>
                <div style={{ fontWeight: 600 }}>{code}</div>
                <div style={{ color: '#888', fontSize: 13 }}>{record.description}</div>
            </div>
        ),
        width: 220,
    },
    {
        title: <span style={{}}>Ngày Tạo</span>,
        dataIndex: "createdAt",
        key: "createdAt",
        width: 140,
    },
    {
        title: <span style={{}}>Hình Thức </span>,
        dataIndex: "type",
        key: "type",
        width: 90,
    },
    {
        title: <span style={{}}>Hình Ảnh <span style={{ fontSize: 14, marginLeft: 4 }}></span></span>,
        dataIndex: "image",
        key: "image",
        align: "center" as const,
        width: 80,
        render: (img: string | null) => img ? <Avatar shape="square" src={img} size={48} /> : <Avatar shape="square" icon={<PictureOutlined />} size={48} style={{ background: '#f5f5f5', color: '#aaa' }} />,
    },
    {
        title: <span style={{}}>Khu Vực </span>,
        dataIndex: "region",
        key: "region",
        width: 100,
        render: (region: string, record: Promotion) => <Tag color={record.regionColor} style={{ fontWeight: 500 }}>{region}</Tag>,
    },
    {
        title: <span style={{}}>Trạng Thái </span>,
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status: string, record: Promotion) => <Tag color={record.statusColor} style={{ fontWeight: 500 }}>{status}</Tag>,
    },
    {
        title: <span style={{}}>Sử Dụng</span>,
        dataIndex: "usage",
        key: "usage",
        align: "center" as const,
        width: 80,
    },
    {
        title: <span style={{}}>Hẹn Bắt Đầu </span>,
        dataIndex: "start",
        key: "start",
        width: 140,
    },
    {
        title: <span style={{}}>Hẹn Kết Thúc </span>,
        dataIndex: "end",
        key: "end",
        width: 140,
    },
];

export default function PromotionsPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [type, setType] = useState<string | undefined>(undefined);
    // Use string for date range to avoid moment dependency
    const [dateRange, setDateRange] = useState<[string | null, string | null] | null>(null);

    // Unique status and type values for dropdowns
    const statusOptions = Array.from(new Set(mockPromotions.map(p => p.status)));
    const typeOptions = Array.from(new Set(mockPromotions.map(p => p.type)));

    const filtered = useMemo(() => {
        return mockPromotions.filter(p => {
            const matchCode = !search || p.code.toLowerCase().includes(search.toLowerCase());
            const matchStatus = !status || p.status === status;
            const matchType = !type || p.type === type;
            let matchDate = true;
            if (dateRange && (dateRange[0] || dateRange[1])) {
                // Parse createdAt as DD/MM/YYYY HH:mm:ss
                const [day, month, yearAndTime] = p.createdAt.split("/");
                const [year, time] = yearAndTime.split(" ");
                const date = new Date(`${year}-${month}-${day}T${time}`);
                if (dateRange[0]) {
                    const from = new Date(dateRange[0]);
                    if (date < from) matchDate = false;
                }
                if (dateRange[1]) {
                    const to = new Date(dateRange[1]);
                    // Add 1 day to include the end date
                    to.setDate(to.getDate() + 1);
                    if (date >= to) matchDate = false;
                }
            }
            return matchCode && matchStatus && matchType && matchDate;
        });
    }, [search, status, type, dateRange]);

    return (
        <div style={{ padding: 24 }}>
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <Row gutter={[16, 12]} align="middle" justify="space-between">
                    <Col xs={24} sm={12} md={8} style={{ textAlign: 'left' }}>
                        <Title level={2} style={{ margin: 0 }}>
                            Chương trình khuyến mãi
                        </Title>
                        <Typography.Text type="secondary">
                            Quản lý và theo dõi các chương trình khuyến mãi trong hệ thống.
                        </Typography.Text>
                        <Text style={{ fontWeight: 500, fontSize: 16, display: 'block', marginTop: 8 }}>
                            Tổng: <span style={{ fontWeight: 700 }}>{filtered.length}</span>
                        </Text>
                    </Col>
                    <Col xs={24} sm={12} md={16}>
                        <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Input
                                allowClear
                                prefix={<SearchOutlined />}
                                placeholder="Tìm kiếm theo mã khuyến mãi"
                                style={{ width: 200, borderRadius: 8 }}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <Select
                                allowClear
                                placeholder="Trạng thái"
                                style={{ width: 140 }}
                                value={status}
                                onChange={v => setStatus(v)}
                                options={statusOptions.map(s => ({ value: s, label: s }))}
                            />
                            <Select
                                allowClear
                                placeholder="Hình thức"
                                style={{ width: 120 }}
                                value={type}
                                onChange={v => setType(v)}
                                options={typeOptions.map(t => ({ value: t, label: t }))}
                            />
                            <DatePicker.RangePicker
                                allowClear
                                format="YYYY-MM-DD"
                                style={{ width: 240 }}
                                placeholder={["Ngày tạo từ", "Đến"]}
                                value={dateRange && (dateRange[0] || dateRange[1])
                                    ? [dateRange[0] ? dayjs(dateRange[0]) : null, dateRange[1] ? dayjs(dateRange[1]) : null]
                                    : null}
                                onChange={(dates, dateStrings) => {
                                    if (!dateStrings[0] && !dateStrings[1]) {
                                        setDateRange(null);
                                    } else {
                                        setDateRange([
                                            dateStrings[0] || null,
                                            dateStrings[1] || null
                                        ]);
                                    }
                                }}
                            />
                        </Space>
                    </Col>
                </Row>
            </Card>
            <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
                <Table
                    columns={columns}
                    dataSource={filtered}
                    rowKey="id"
                    bordered={false}
                    size="middle"
                    rowClassName={(_: Promotion, idx: number) => idx % 2 === 1 ? "ant-table-row-striped" : ""}
                    style={{ borderRadius: 12 }}
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        showQuickJumper: false,
                        position: ["bottomCenter"],
                    }}
                />
            </Card>
        </div>
    );
}