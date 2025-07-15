"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Tabs,
    Input,
    Select,
    Table,
    Avatar,
    Tag,
    Button,
    Dropdown,
    Typography,
    Badge
} from "antd";
import { SearchOutlined, MoreOutlined, StarFilled } from "@ant-design/icons";
import { CtvApplication, ApplicationFilters } from "@/type/application";
import {
    mockApplications,
    mockApplicationStats,
    mockAreas,
} from "@/api/mock-applications";
import styles from "./applications.module.scss";

const { Option } = Select;
const { Text } = Typography;

export default function ApplicationsPage() {

    const [filteredApplications, setFilteredApplications] = useState<CtvApplication[]>(mockApplications);
    const [filters, setFilters] = useState<ApplicationFilters>({});

    const [activeTab, setActiveTab] = useState("all");

    const applications = mockApplications;
    // Filter applications based on current filters
    useEffect(() => {
        let filtered = [...applications];

        // Filter by tab status
        if (activeTab !== "all") {
            filtered = filtered.filter(app => app.status === activeTab);
        }

        // Filter by search
        if (filters.search) {
            filtered = filtered.filter(app =>
                app.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
                app.phone.includes(filters.search!) ||
                app.ctvCode.toLowerCase().includes(filters.search!.toLowerCase())
            );
        }

        // Filter by area
        if (filters.area) {
            filtered = filtered.filter(app => app.area === filters.area);
        }

        // Filter by service type
        if (filters.serviceType) {
            filtered = filtered.filter(app => app.serviceType === filters.serviceType);
        }

        setFilteredApplications(filtered);
    }, [applications, filters, activeTab]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'processing': return 'blue';
            case 'approved': return 'green';
            case 'rejected': return 'red';
            case 'contacted': return 'gold';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Chưa xử lý';
            case 'processing': return 'Đang xử lý';
            case 'approved': return 'Đã liên hệ';
            case 'rejected': return 'Từ chối';
            case 'contacted': return 'Đã liên hệ';
            default: return status;
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };


    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 60,
            align: 'center' as const
        },
        {
            title: 'Mã CTV',
            dataIndex: 'ctvCode',
            key: 'ctvCode',
            width: 120,
            render: (text: string) => (
                <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    {text}
                </Text>
            )
        },
        {
            title: 'Ngày tạo',
            key: 'createdDate',
            width: 100,
            render: (record: CtvApplication) => (
                <div>
                    <div>{record.createdDate}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        {record.createdTime}
                    </div>
                </div>
            )
        },
        {
            title: 'Công tác viên',
            key: 'ctv',
            width: 200,
            render: (record: CtvApplication) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className={styles.ctvInfo}>
                    <Avatar
                        src={record.avatar}
                        size={32}
                        style={{ backgroundColor: '#f56a00' }}
                    >
                        {record.name.charAt(0)}
                    </Avatar>
                    <div>
                        <div style={{ fontWeight: 500, color: '#1890ff' }}>
                            {record.name}
                        </div>
                        <div style={{ fontSize: 12, color: '#666' }}>
                            {record.phone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <StarFilled style={{ color: '#faad14', fontSize: 12 }} />
                            <span style={{ fontSize: 12 }}>{record.rating}</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Khu vực',
            dataIndex: 'area',
            key: 'area',
            width: 120
        },
        {
            title: 'Dịch vụ đăng ký',
            dataIndex: 'serviceType',
            key: 'serviceType',
            width: 150
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 120,
            render: (record: CtvApplication) => (
                <Tag
                    color={getStatusColor(record.status)}
                    style={{
                        borderRadius: 12,
                        fontWeight: 500,
                        fontSize: 12,
                        padding: '2px 12px'
                    }}
                >
                    {getStatusText(record.status)}
                </Tag>
            )
        },
        {
            title: '',
            key: 'actions',
            width: 60,
            render: () => (
                <Dropdown
                    menu={{
                        items: [
                            {
                                key: 'approve',
                                label: 'Phê duyệt'
                            },
                            {
                                key: 'reject',
                                label: 'Từ chối'
                            },
                            {
                                key: 'contact',
                                label: 'Liên hệ'
                            }
                        ]
                    }}
                    trigger={['click']}
                >
                    <Button
                        type="text"
                        icon={<MoreOutlined />}
                        style={{ transform: 'rotate(90deg)' }}
                    />
                </Dropdown>
            )
        }
    ];

    const tabItems = [
        {
            key: 'all',
            label: (
                <span>
                    Tất cả{' '}
                    <Badge count={mockApplicationStats.total} style={{ backgroundColor: '#1890ff' }} />
                </span>
            )
        },
        {
            key: 'processing',
            label: (
                <span>
                    Chưa xử lý{' '}
                    <Badge count={mockApplicationStats.pending} style={{ backgroundColor: '#fa8c16' }} />
                </span>
            )
        },
        {
            key: 'test',
            label: (
                <span>
                    Hoàn thành test{' '}
                    <Badge count={0} style={{ backgroundColor: '#52c41a' }} />
                </span>
            )
        },
        {
            key: 'contacted',
            label: (
                <span>
                    Đã liên hệ{' '}
                    <Badge count={mockApplicationStats.approved} style={{ backgroundColor: '#52c41a' }} />
                </span>
            )
        },
        {
            key: 'scheduled',
            label: (
                <span>
                    Hẹn phỏng vấn{' '}
                    <Badge count={0} style={{ backgroundColor: '#722ed1' }} />
                </span>
            )
        },
        {
            key: 'completed',
            label: (
                <span>
                    Hoàn thành{' '}
                    <Badge count={0} style={{ backgroundColor: '#13c2c2' }} />
                </span>
            )
        },
        {
            key: 'rejected',
            label: (
                <span>
                    Từ chối{' '}
                    <Badge count={mockApplicationStats.contacted} style={{ backgroundColor: '#ff4d4f' }} />
                </span>
            )
        }
    ];

    return (
        <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
            <Card style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                        Danh sách hồ sơ ứng viên
                    </h2>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    style={{ marginBottom: 24 }}
                    className={styles.statusTabs}
                />

                {/* Filters */}
                <div className={styles.filterSection}>
                    <div style={{
                        display: 'flex',
                        gap: 16,
                        flexWrap: 'wrap'
                    }}>
                        <Select
                            placeholder="Tất cả khu vực"
                            style={{ width: 200 }}
                            allowClear
                            value={filters.area}
                            onChange={(value) => handleFilterChange('area', value)}
                        >
                            {mockAreas.map(area => (
                                <Option key={area} value={area}>{area}</Option>
                            ))}
                        </Select>

                        <Input
                            placeholder="Tìm kiếm theo Tên công tác viên/ Số điện thoại công tác viên"
                            prefix={<SearchOutlined />}
                            style={{ width: 400 }}
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>
                </div>

                {/* Stats Summary */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16
                }}>
                    <Text style={{ fontWeight: 500 }}>
                        Tổng: {filteredApplications.length}
                    </Text>
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredApplications}
                    rowKey="id"

                    pagination={{
                        pageSize: 10,
                        position: ['bottomCenter'],
                    }}
                    scroll={{ x: 1200 }}
                    size="small"
                    className={styles.applicationsTable}
                />
            </Card>
        </div>
    );
}