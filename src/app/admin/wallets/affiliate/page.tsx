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
    Avatar,
    Badge,
} from 'antd';
import {
    UserOutlined,
    DownloadOutlined,
    FilterOutlined,
    DollarOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    WalletOutlined,
    CalendarOutlined,
    TeamOutlined,
    CrownOutlined,
    GiftOutlined,
    BankOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { AffiliateTransaction, AffiliateFilter } from '@/type/affiliate-wallet';
import { mockAffiliateTransactions } from '@/api/mock-affiliate-wallet';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const typeLabels = {
    commission: 'Hoa hồng',
    bonus: 'Thưởng',
    withdrawal: 'Rút tiền',
    refund: 'Hoàn trả'
};

const levelLabels = {
    bronze: 'Đồng',
    silver: 'Bạc',
    gold: 'Vàng',
    platinum: 'Bạch kim',
    diamond: 'Kim cương'
};

const levelColors = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2',
    diamond: '#b9f2ff'
};

const paymentMethodLabels = {
    bank_transfer: 'Chuyển khoản',
    e_wallet: 'Ví điện tử',
    cash: 'Tiền mặt',
    crypto: 'Tiền mã hóa'
};

export default function AffiliateWalletsPage() {

    const transactions = mockAffiliateTransactions;

    const [filters, setFilters] = useState<AffiliateFilter>({
        type: 'all',
        status: 'all',
        affiliateLevel: 'all',
        paymentMethod: 'all'
    });

    // Filter transactions based on current filters
    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            // Type filter
            if (filters.type && filters.type !== 'all' && transaction.type !== filters.type) {
                return false;
            }

            // Status filter
            if (filters.status && filters.status !== 'all' && transaction.status !== filters.status) {
                return false;
            }

            // Affiliate level filter
            if (filters.affiliateLevel && filters.affiliateLevel !== 'all' && transaction.affiliateLevel !== filters.affiliateLevel) {
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
        const commission = filteredTransactions
            .filter(t => t.type === 'commission' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const bonus = filteredTransactions
            .filter(t => t.type === 'bonus' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const withdrawal = filteredTransactions
            .filter(t => t.type === 'withdrawal' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const refund = filteredTransactions
            .filter(t => t.type === 'refund' && t.status === 'completed')
            .reduce((sum, t) => sum + t.amount, 0);

        const pending = filteredTransactions
            .filter(t => (t.status === 'pending' || t.status === 'processing'))
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            totalCommission: commission,
            totalBonus: bonus,
            totalWithdrawal: withdrawal,
            totalRefund: refund,
            netAmount: commission + bonus - withdrawal - refund,
            transactionCount: filteredTransactions.length,
            pendingAmount: pending,
            completedAmount: commission + bonus + withdrawal + refund
        };
    }, [filteredTransactions]);

    const handleFilterChange = (key: keyof AffiliateFilter, value: string | string[] | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            type: 'all',
            status: 'all',
            affiliateLevel: 'all',
            paymentMethod: 'all'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getTypeIcon = (type: string) => {
        const iconMap = {
            commission: <DollarOutlined style={{ color: '#52c41a' }} />,
            bonus: <GiftOutlined style={{ color: '#1890ff' }} />,
            withdrawal: <BankOutlined style={{ color: '#ff4d4f' }} />,
            refund: <ArrowDownOutlined style={{ color: '#faad14' }} />
        };
        return iconMap[type as keyof typeof iconMap] || <DollarOutlined />;
    };

    const columns: ColumnsType<AffiliateTransaction> = [
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
            width: 100,
            render: (type: string) => (
                <Tag icon={getTypeIcon(type)} color={
                    type === 'commission' ? 'green' :
                        type === 'bonus' ? 'blue' :
                            type === 'withdrawal' ? 'red' : 'orange'
                }>
                    {typeLabels[type as keyof typeof typeLabels]}
                </Tag>
            )
        },
        {
            title: 'Affiliate',
            dataIndex: 'affiliateName',
            key: 'affiliateName',
            width: 200,
            render: (name: string, record: AffiliateTransaction) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar
                        size="small"
                        icon={<UserOutlined />}
                        style={{ backgroundColor: levelColors[record.affiliateLevel] }}
                    />
                    <div>
                        <div style={{ fontWeight: 500 }}>{name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                ID: {record.affiliateId}
                            </Text>
                            <Tag
                                color={record.affiliateLevel === 'diamond' ? 'cyan' :
                                    record.affiliateLevel === 'platinum' ? 'purple' :
                                        record.affiliateLevel === 'gold' ? 'gold' :
                                            record.affiliateLevel === 'silver' ? 'default' : 'orange'}
                                icon={record.affiliateLevel === 'diamond' ? <CrownOutlined /> : undefined}
                                style={{ fontSize: '11px' }}
                            >
                                {levelLabels[record.affiliateLevel]}
                            </Tag>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            render: (description: string, record: AffiliateTransaction) => (
                <div>
                    <Tooltip title={description}>
                        <Text>{description}</Text>
                    </Tooltip>
                    {record.orderId && (
                        <div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Đơn hàng: {record.orderId}
                            </Text>
                        </div>
                    )}
                    {record.customerName && (
                        <div>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                                Khách hàng: {record.customerName}
                            </Text>
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            key: 'amount',
            width: 130,
            align: 'right',
            render: (amount: number, record: AffiliateTransaction) => (
                <div>
                    <Text
                        strong
                        style={{
                            color: record.type === 'withdrawal' || record.type === 'refund' ? '#ff4d4f' : '#52c41a',
                            fontSize: '14px'
                        }}
                    >
                        {record.type === 'withdrawal' || record.type === 'refund' ? '-' : '+'}{formatCurrency(amount)}
                    </Text>
                    {record.commissionRate && (
                        <div>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                                Tỷ lệ: {record.commissionRate}%
                            </Text>
                        </div>
                    )}
                </div>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const statusConfig = {
                    completed: { color: 'success', text: 'Hoàn thành' },
                    pending: { color: 'warning', text: 'Chờ xử lý' },
                    processing: { color: 'processing', text: 'Đang xử lý' },
                    cancelled: { color: 'error', text: 'Đã hủy' }
                };
                const config = statusConfig[status as keyof typeof statusConfig];
                return <Badge status={config.color as "success" | "processing" | "default" | "error" | "warning"} text={config.text} />;
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
            title: 'Người xử lý',
            dataIndex: 'processedBy',
            key: 'processedBy',
            width: 120,
            render: (processedBy: string, record: AffiliateTransaction) => (
                <div>
                    {processedBy ? (
                        <>
                            <Text>{processedBy}</Text>
                            {record.processedAt && (
                                <div>
                                    <Text type="secondary" style={{ fontSize: '11px' }}>
                                        {dayjs(record.processedAt).format('DD/MM HH:mm')}
                                    </Text>
                                </div>
                            )}
                        </>
                    ) : (
                        <Text type="secondary">Chưa xử lý</Text>
                    )}
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        <TeamOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                        Quản lý thu chi Affiliate
                    </Title>
                    <Space>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={() => console.log('Export')}
                        >
                            Xuất báo cáo
                        </Button>
                    </Space>
                </div>
            </div>

            {/* Summary Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng hoa hồng"
                            value={filteredSummary.totalCommission}
                            formatter={(value) => formatCurrency(Number(value))}
                            prefix={<DollarOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Tổng thưởng"
                            value={filteredSummary.totalBonus}
                            formatter={(value) => formatCurrency(Number(value))}
                            prefix={<GiftOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Đã rút"
                            value={filteredSummary.totalWithdrawal}
                            formatter={(value) => formatCurrency(Number(value))}
                            prefix={<BankOutlined style={{ color: '#ff4d4f' }} />}
                            valueStyle={{ color: '#ff4d4f' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Số dư ròng"
                            value={filteredSummary.netAmount}
                            formatter={(value) => formatCurrency(Number(value))}
                            prefix={<WalletOutlined style={{ color: filteredSummary.netAmount >= 0 ? '#52c41a' : '#ff4d4f' }} />}
                            valueStyle={{ color: filteredSummary.netAmount >= 0 ? '#52c41a' : '#ff4d4f' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Additional Stats */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Chờ xử lý"
                            value={filteredSummary.pendingAmount}
                            formatter={(value) => formatCurrency(Number(value))}
                            prefix={<CalendarOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14', fontSize: '18px' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Đã hoàn thành"
                            value={filteredSummary.completedAmount}
                            formatter={(value) => formatCurrency(Number(value))}
                            prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a', fontSize: '18px' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card size="small">
                        <Statistic
                            title="Số giao dịch"
                            value={filteredSummary.transactionCount}
                            prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff', fontSize: '18px' }}
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
                                {Object.entries(typeLabels).map(([key, label]) => (
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
                                <Option value="processing">Đang xử lý</Option>
                                <Option value="cancelled">Đã hủy</Option>
                            </Select>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                Cấp độ Affiliate
                            </Text>
                            <Select
                                style={{ width: '100%' }}
                                value={filters.affiliateLevel}
                                onChange={(value) => handleFilterChange('affiliateLevel', value)}
                                placeholder="Chọn cấp độ"
                            >
                                <Option value="all">Tất cả</Option>
                                {Object.entries(levelLabels).map(([key, label]) => (
                                    <Option key={key} value={key}>{label}</Option>
                                ))}
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
            <Card title={`Danh sách giao dịch Affiliate (${filteredTransactions.length})`}>
                <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} giao dịch`,
                    }}
                    scroll={{ x: 1400 }}
                    bordered
                    size="small"
                />
            </Card>
        </div>
    );
}