'use client';

import React, { useState, useMemo } from 'react';
import {
    Card,
    Table,
    Button,
    Space,
    Tag,
    Typography,
    Row,
    Col,
    Select,
    DatePicker,
    Statistic,
    Tooltip,
} from 'antd';
import {
    PlusOutlined,
    DownloadOutlined,
    FilterOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { WalletTransaction, WalletFilter } from '@/type/wallet';
import { mockWalletTransactions } from '@/api/mock-wallet';
import CreateTransactionModal from './components/CreateTransactionModal';
import { exportToExcel, generateTransactionId } from './utils/walletUtils';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const categoryLabels = {
    equipment: 'Thiết bị',
    maintenance: 'Bảo trì',
    purchase: 'Mua sắm',
    repair: 'Sửa chữa',
    rental: 'Cho thuê',
    other: 'Khác'
};

const paymentMethodLabels = {
    cash: 'Tiền mặt',
    bank_transfer: 'Chuyển khoản',
    credit_card: 'Thẻ tín dụng',
    other: 'Khác'
};

export default function WalletsPage() {
    const [transactions, setTransactions] = useState<WalletTransaction[]>(mockWalletTransactions);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [filters, setFilters] = useState<WalletFilter>({
        type: 'all',
        category: 'all',
        status: 'all',
        paymentMethod: 'all'
    });

    // Filter transactions based on current filters
    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            // Type filter
            if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
                return false;
            }

            // Category filter
            if (filters.category && filters.category !== 'all' && transaction.category !== filters.category) {
                return false;
            }

            // Status filter
            if (filters.status && filters.status !== 'all' && transaction.status !== filters.status) {
                return false;
            }

            // Payment method filter
            if (filters.paymentMethod && filters.paymentMethod !== 'all' && transaction.paymentMethod !== filters.paymentMethod) {
                return false;
            }

            // Date range filter
            if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
                const transactionDate = dayjs(transaction.date);
                const startDate = dayjs(filters.dateRange[0]);
                const endDate = dayjs(filters.dateRange[1]);
                if (!(transactionDate.isAfter(startDate, 'day') || transactionDate.isSame(startDate, 'day')) ||
                    !(transactionDate.isBefore(endDate, 'day') || transactionDate.isSame(endDate, 'day'))) {
                    return false;
                }
            }

            return true;
        });
    }, [transactions, filters]);

    // Calculate filtered summary
    const filteredSummary = useMemo(() => {
        const income = filteredTransactions
            .filter(t => t.type === 'income' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = filteredTransactions
            .filter(t => t.type === 'expense' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalIncome: income,
            totalExpense: expense,
            balance: income - expense,
            transactionCount: filteredTransactions.length
        };
    }, [filteredTransactions]);

    const handleFilterChange = (key: keyof WalletFilter, value: string | string[] | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            type: 'all',
            category: 'all',
            status: 'all',
            paymentMethod: 'all'
        });
    };

    const handleCreateTransaction = (newTransaction: Omit<WalletTransaction, 'id'>) => {
        const transaction: WalletTransaction = {
            ...newTransaction,
            id: generateTransactionId()
        };
        setTransactions(prev => [transaction, ...prev]);
        setShowCreateModal(false);
    };

    const handleExport = () => {
        exportToExcel(filteredTransactions, `wallet-transactions-${dayjs().format('YYYY-MM-DD')}`);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            currency: 'VND'
        }).format(amount);
    };



    const columns: ColumnsType<WalletTransaction> = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'id',
            key: 'id',
            width: 120,
            render: (id: string) => (
                <Text code strong>{id}</Text>
            )
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (type: 'income' | 'expense') => (
                <Tag
                    color={type === 'income' ? 'green' : 'red'}
                    icon={type === 'income' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                >
                    {type === 'income' ? 'Thu' : 'Chi'}
                </Tag>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 100,
            render: (category: string) => (
                <Tag color="blue">
                    {categoryLabels[category as keyof typeof categoryLabels]}
                </Tag>
            )
        },
        {
            title: 'Thiết bị',
            dataIndex: 'equipmentName',
            key: 'equipmentName',
            width: 200,
            render: (equipmentName: string, record: WalletTransaction) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

                    <div>
                        <div style={{ fontWeight: 500 }}>{equipmentName}</div>
                        {record.equipmentId && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                ID: {record.equipmentId}
                            </Text>
                        )}
                    </div>
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (description: string) => (
                <Tooltip title={description}>
                    <Text>{description}</Text>
                </Tooltip>
            )
        },
        {
            title: 'Số tiền (VNĐ)',
            dataIndex: 'amount',
            key: 'amount',
            width: 130,
            align: 'right',
            render: (amount: number, record: WalletTransaction) => (
                <Text
                    strong
                    style={{
                        color: record.type === 'income' ? '#52c41a' : '#ff4d4f',
                        fontSize: '14px'
                    }}
                >
                    {record.type === 'income' ? '+' : '-'}{formatCurrency(amount)}
                </Text>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => {
                const statusConfig = {
                    completed: { color: 'success', text: 'Hoàn thành' },
                    pending: { color: 'warning', text: 'Chờ xử lý' },
                    cancelled: { color: 'error', text: 'Đã hủy' }
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Tag color={config.color}>{config.text}</Tag>;
            }
        },
        {
            title: 'Phương thức',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            width: 120,
            render: (method: string) => (
                <Text>{paymentMethodLabels[method as keyof typeof paymentMethodLabels]}</Text>
            )
        },
        {
            title: 'Ngày giao dịch',
            dataIndex: 'date',
            key: 'date',
            width: 150,
            render: (date: string) => (
                <div>
                    <div>{dayjs(date).format('DD/MM/YYYY')}</div>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {dayjs(date).format('HH:mm')}
                    </Text>
                </div>
            )
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 120,
            render: (createdBy: string) => (
                <Text>{createdBy}</Text>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <Card style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        <WalletOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        Quản lý thu chi thiết bị
                    </Title>
                    <Space>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setShowCreateModal(true)}
                        >
                            Thêm giao dịch
                        </Button>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleExport}
                        >
                            Xuất Excel
                        </Button>
                    </Space>
                </div>
            </Card>

            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px', textAlign: 'center' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng thu"
                            value={filteredSummary.totalIncome}
                            formatter={(value) => formatCurrency(Number(value))}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng chi"
                            value={filteredSummary.totalExpense}
                            formatter={(value) => formatCurrency(Number(value))}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Số dư"
                            value={filteredSummary.balance}
                            formatter={(value) => formatCurrency(Number(value))}
                            valueStyle={{ color: filteredSummary.balance >= 0 ? '#52c41a' : '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Số giao dịch"
                            value={filteredSummary.transactionCount}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filter Card */}
            <Card
                title={
                    <Space>
                        <FilterOutlined />
                        <span>Bộ lọc</span>
                    </Space>
                }
                style={{ marginBottom: '24px' }}
                extra={
                    <Button size="small" onClick={clearFilters}>
                        Xóa bộ lọc
                    </Button>
                }
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                Loại giao dịch
                            </Text>
                            <Select
                                style={{ width: '100%' }}
                                value={filters.type}
                                onChange={(value) => handleFilterChange('type', value)}
                                placeholder="Chọn loại"
                            >
                                <Option value="all">Tất cả</Option>
                                <Option value="income">Thu</Option>
                                <Option value="expense">Chi</Option>
                            </Select>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                Danh mục
                            </Text>
                            <Select
                                style={{ width: '100%' }}
                                value={filters.category}
                                onChange={(value) => handleFilterChange('category', value)}
                                placeholder="Chọn danh mục"
                            >
                                <Option value="all">Tất cả</Option>
                                {Object.entries(categoryLabels).map(([key, label]) => (
                                    <Option key={key} value={key}>{label}</Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                Trạng thái
                            </Text>
                            <Select
                                style={{ width: '100%' }}
                                value={filters.status}
                                onChange={(value) => handleFilterChange('status', value)}
                                placeholder="Chọn trạng thái"
                            >
                                <Option value="all">Tất cả</Option>
                                <Option value="completed">Hoàn thành</Option>
                                <Option value="pending">Chờ xử lý</Option>
                                <Option value="cancelled">Đã hủy</Option>
                            </Select>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                Phương thức thanh toán
                            </Text>
                            <Select
                                style={{ width: '100%' }}
                                value={filters.paymentMethod}
                                onChange={(value) => handleFilterChange('paymentMethod', value)}
                                placeholder="Chọn phương thức"
                            >
                                <Option value="all">Tất cả</Option>
                                {Object.entries(paymentMethodLabels).map(([key, label]) => (
                                    <Option key={key} value={key}>{label}</Option>
                                ))}
                            </Select>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                Khoảng thời gian
                            </Text>
                            <RangePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                onChange={(dates) => {
                                    const dateRange = dates ? [
                                        dates[0]?.toISOString() || '',
                                        dates[1]?.toISOString() || ''
                                    ] : undefined;
                                    handleFilterChange('dateRange', dateRange);
                                }}
                                placeholder={['Từ ngày', 'Đến ngày']}
                            />
                        </div>
                    </Col>
                </Row>
            </Card>

            {/* Table */}
            <Card title={`Danh sách giao dịch (${filteredTransactions.length})`}>
                <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    rowKey="id"
                    pagination={{
                        pageSize: 5,
                        position: ['bottomCenter'],
                    }}
                    scroll={{ x: 1200 }}
                    bordered
                    size="small"
                />
            </Card>

            {/* Create Transaction Modal */}
            <CreateTransactionModal
                visible={showCreateModal}
                onCancel={() => setShowCreateModal(false)}
                onSubmit={handleCreateTransaction}

            />
        </div>
    );
}