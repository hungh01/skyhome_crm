"use client";

import { useState, useEffect } from "react";
import {
    Card,
    Tabs,
    Input,
    Table,
    Tag,
    Space,
    Button,
    Typography,
    Badge,
    Dropdown
} from "antd";
import {
    SearchOutlined,
    MoreOutlined,
    CalendarOutlined,
    PlusOutlined,
    FilterOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Penalty, PenaltyFilters } from "@/type/penalty";
import {
    mockPenalties,
    mockPenaltyStats
} from "@/api/mock-penalties";
import styles from "./penalties.module.scss";
import CreatePenalty from "./components/CreatePenalty";

const { Text } = Typography;

export default function PenaltiesPage() {
    const [penalties, setPenalties] = useState<Penalty[]>(mockPenalties);
    const [filteredPenalties, setFilteredPenalties] = useState<Penalty[]>(mockPenalties);
    const [filters, setFilters] = useState<PenaltyFilters>({});
    const [activeTab, setActiveTab] = useState("all");
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

    // Filter penalties based on current filters
    useEffect(() => {
        let filtered = [...penalties];

        // Filter by tab status
        if (activeTab !== "all") {
            filtered = filtered.filter(penalty => penalty.status === activeTab);
        }

        // Filter by search
        if (filters.search) {
            filtered = filtered.filter(penalty =>
                penalty.staffName.toLowerCase().includes(filters.search!.toLowerCase()) ||
                penalty.staffPhone.includes(filters.search!) ||
                penalty.penaltyCode.toLowerCase().includes(filters.search!.toLowerCase()) ||
                penalty.orderCode.toLowerCase().includes(filters.search!.toLowerCase())
            );
        }

        // Filter by staff type
        if (filters.staffType) {
            filtered = filtered.filter(penalty => penalty.staffLevel === filters.staffType);
        }

        setFilteredPenalties(filtered);
    }, [penalties, filters, activeTab]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'processing': return 'blue';
            case 'completed': return 'green';
            case 'approved': return 'green';
            case 'cancelled': return 'red';
            case 'invalid': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Chờ duyệt';
            case 'processing': return 'Đang thực thi';
            case 'completed': return 'Hoàn thành';
            case 'approved': return 'Đã phê duyệt';
            case 'cancelled': return 'Đã hủy';
            case 'invalid': return 'Vô hiệu hóa';
            default: return status;
        }
    };

    const getViolationTypeColor = (type: string) => {
        switch (type) {
            case 'Phạt': return 'red';
            case 'Nhắc nhở': return 'orange';
            case 'Cảnh cáo': return 'yellow';
            case 'Tạm dừng': return 'purple';
            default: return 'default';
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleCreatePenalty = () => {
        setIsCreateModalVisible(true);
    };

    const handleCreateSubmit = (newPenalty: Penalty) => {
        // Update STT for new penalty
        const updatedPenalty = {
            ...newPenalty,
            stt: penalties.length + 1
        };

        setPenalties(prev => [updatedPenalty, ...prev]);
        setIsCreateModalVisible(false);
    };

    const handleCreateCancel = () => {
        setIsCreateModalVisible(false);
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
            title: 'Mã Lệnh Phạt',
            dataIndex: 'penaltyCode',
            key: 'penaltyCode',
            width: 140,
            render: (text: string) => (
                <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    {text}
                </Text>
            )
        },
        {
            title: 'Ngày Tạo',
            key: 'createdDate',
            width: 100,
            render: (record: Penalty) => (
                <div>
                    <div>{record.createdDate}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        {record.createdTime}
                    </div>
                </div>
            )
        },
        {
            title: 'Đối Tác',
            key: 'staff',
            width: 160,
            render: (record: Penalty) => (
                <div>
                    <div style={{ color: '#1890ff', fontWeight: 500 }}>
                        {record.staffName}
                    </div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        {record.staffPhone}
                    </div>
                </div>
            )
        },
        {
            title: 'Tạo Bởi',
            dataIndex: 'staffLevel',
            key: 'staffLevel',
            width: 100,
            render: (level: string) => (
                <Tag color="blue" style={{ fontSize: 12 }}>
                    {level}
                </Tag>
            )
        },
        {
            title: 'Số Tiền',
            dataIndex: 'amount',
            key: 'amount',
            width: 80,
            render: (amount: number) => (
                <Text style={{ fontWeight: 500 }}>
                    {amount > 0 ? `${amount.toLocaleString()} đ` : '0 đ'}
                </Text>
            )
        },
        {
            title: 'Mã Đơn Hàng',
            dataIndex: 'orderCode',
            key: 'orderCode',
            width: 140,
            render: (text: string) => (
                <Text style={{ color: '#1890ff', fontWeight: 500 }}>
                    {text}
                </Text>
            )
        },
        {
            title: 'Ngày Thực Thi',
            key: 'implementationDate',
            width: 100,
            render: (record: Penalty) => (
                <div>
                    <div>{record.implementationDate}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        {record.implementationTime}
                    </div>
                </div>
            )
        },
        {
            title: 'Loại Vi Phạm',
            dataIndex: 'violationType',
            key: 'violationType',
            width: 100,
            render: (type: string) => (
                <Tag
                    color={getViolationTypeColor(type)}
                    className={styles.violationTag}
                >
                    {type}
                </Tag>
            )
        },
        {
            title: 'Ngày Bắt Đầu',
            key: 'startDate',
            width: 100,
            render: (record: Penalty) => (
                <div>
                    <div>{record.startDate}</div>
                    {record.startTime && (
                        <div style={{ fontSize: 12, color: '#666' }}>
                            {record.startTime}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Ngày Kết Thúc',
            key: 'endDate',
            width: 100,
            render: (record: Penalty) => (
                <div>
                    <div>{record.endDate}</div>
                    {record.endTime && (
                        <div style={{ fontSize: 12, color: '#666' }}>
                            {record.endTime}
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Nội Dung',
            dataIndex: 'content',
            key: 'content',
            width: 150,
            render: (text: string) => (
                <div className={styles.contentCell}>
                    {text}
                </div>
            )
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            width: 120,
            render: (record: Penalty) => (
                <Tag
                    color={getStatusColor(record.status)}
                    className={styles.statusTag}
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
                                key: 'view',
                                label: 'Xem chi tiết'
                            },
                            {
                                key: 'edit',
                                label: 'Chỉnh sửa'
                            },
                            {
                                key: 'approve',
                                label: 'Phê duyệt'
                            },
                            {
                                key: 'cancel',
                                label: 'Hủy bỏ'
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
                    <Badge
                        count={mockPenaltyStats.total}
                        style={{ backgroundColor: '#8B5CF6' }}
                    />
                </span>
            )
        },
        {
            key: 'pending',
            label: (
                <span>
                    Chờ duyệt{' '}
                    <Badge
                        count={mockPenaltyStats.pending}
                        style={{ backgroundColor: '#fa8c16' }}
                    />
                </span>
            )
        },
        {
            key: 'processing',
            label: (
                <span>
                    Đang thực thi{' '}
                    <Badge
                        count={mockPenaltyStats.processing}
                        style={{ backgroundColor: '#1890ff' }}
                    />
                </span>
            )
        },
        {
            key: 'completed',
            label: (
                <span>
                    Hoàn thành{' '}
                    <Badge
                        count={mockPenaltyStats.completed}
                        style={{ backgroundColor: '#52c41a' }}
                    />
                </span>
            )
        },
        {
            key: 'cancelled',
            label: (
                <span>
                    Đã hủy{' '}
                    <Badge
                        count={mockPenaltyStats.cancelled}
                        style={{ backgroundColor: '#ff4d4f' }}
                    />
                </span>
            )
        },
        {
            key: 'invalid',
            label: (
                <span>
                    Bị ghi đè{' '}
                    <Badge
                        count={mockPenaltyStats.invalid}
                        style={{ backgroundColor: '#ff4d4f' }}
                    />
                </span>
            )
        },
        {
            key: 'expired',
            label: (
                <span>
                    Vô hiệu hóa{' '}
                    <Badge
                        count={mockPenaltyStats.expired}
                        style={{ backgroundColor: '#d9d9d9' }}
                    />
                </span>
            )
        }
    ];

    return (
        <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
            <Card style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 24 }}>
                    <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                        Quản lý lệnh phạt
                    </h2>
                </div>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    style={{ marginBottom: 24 }}
                    className={styles.penaltyTabs}
                />

                {/* Action Buttons */}
                <div style={{ marginBottom: 24 }} className={styles.actionButtons}>
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            style={{ backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' }}
                            onClick={handleCreatePenalty}
                        >
                            Tạo lệnh phạt
                        </Button>
                        <Button
                            icon={<CalendarOutlined />}
                            style={{ color: '#8B5CF6', borderColor: '#8B5CF6' }}
                        >
                            Thời gian
                            <span style={{ marginLeft: 8 }}>30 ngày trước</span>
                        </Button>
                        <Button
                            icon={<UserOutlined />}
                            style={{ color: '#8B5CF6', borderColor: '#8B5CF6' }}
                        >
                            Đối tượng phạt
                            <span style={{ marginLeft: 8 }}>Tất cả</span>
                        </Button>
                        <Button
                            icon={<FilterOutlined />}
                            style={{ color: '#8B5CF6', borderColor: '#8B5CF6' }}
                        >
                            Đối tượng tạo lệnh
                            <span style={{ marginLeft: 8 }}>Tất cả</span>
                        </Button>
                    </Space>
                </div>

                {/* Stats Summary */}
                <div className={styles.searchSection}>
                    <Text style={{ fontWeight: 500 }}>
                        Tổng: {filteredPenalties.length}
                    </Text>
                    <Input
                        placeholder="Tìm kiếm theo Mã giao dịch/ Số điện thoại/ Tên tài khoản nạp vào"
                        prefix={<SearchOutlined />}
                        style={{ width: 400 }}
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>

                {/* Table */}
                <Table
                    columns={columns}
                    dataSource={filteredPenalties}
                    rowKey="id"
                    pagination={{
                        total: filteredPenalties.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} mục`,
                        pageSizeOptions: ['10', '20', '50', '100']
                    }}
                    scroll={{ x: 1600 }}
                    size="middle"
                    className={styles.penaltiesTable}
                />
            </Card>

            {/* Create Penalty Modal */}
            <CreatePenalty
                visible={isCreateModalVisible}
                onClose={handleCreateCancel}
                onSubmit={handleCreateSubmit}
            />
        </div>
    );
}