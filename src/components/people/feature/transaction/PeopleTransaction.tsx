'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Timeline, Typography, Tag, Pagination, Empty } from 'antd';
import {
    CreditCardOutlined,
    BankOutlined,
    WalletOutlined,
    DollarOutlined
} from '@ant-design/icons';
import TransactionDetail from './TransactionDetail';
import { Transaction } from '@/type/transaction/transaction';
import type { Pagination as PaginationType } from '@/type/other/pagination';

const { Text, Title } = Typography;

interface PeopleTransactionProps {
    trans: Transaction[];
    pagination: PaginationType;
    setPage: (page: number) => void;
}

// Configuration for payment methods
const PAYMENT_METHOD_CONFIG = {
    vnpay: { icon: <WalletOutlined style={{ color: '#1890ff' }} />, label: 'VNPay' },
    momo: { icon: <WalletOutlined style={{ color: '#1890ff' }} />, label: 'MoMo' },
    'bank transfer': { icon: <BankOutlined style={{ color: '#52c41a' }} />, label: 'Chuyển khoản' },
    banking: { icon: <BankOutlined style={{ color: '#52c41a' }} />, label: 'Ngân hàng' },
    'credit card': { icon: <CreditCardOutlined style={{ color: '#722ed1' }} />, label: 'Thẻ tín dụng' },
} as const;

const DEFAULT_PAYMENT_METHOD = {
    icon: <DollarOutlined style={{ color: '#faad14' }} />,
    label: 'Khác'
};

// Configuration for transaction status
const STATUS_CONFIG = {
    done: { name: 'Thành công', color: 'green' },
    completed: { name: 'Thành công', color: 'green' },
    success: { name: 'Thành công', color: 'green' },
    'thành công': { name: 'Thành công', color: 'green' },
    pending: { name: 'Đang xử lý', color: 'orange' },
    'đang xử lý': { name: 'Đang xử lý', color: 'orange' },
    processing: { name: 'Đang xử lý', color: 'blue' },
    failed: { name: 'Thất bại', color: 'red' },
    'thất bại': { name: 'Thất bại', color: 'red' },
    cancel: { name: 'Đã hủy', color: 'gray' },
    cancelled: { name: 'Đã hủy', color: 'gray' },
    refund: { name: 'Hoàn tiền', color: 'purple' },
    'hoàn tiền': { name: 'Hoàn tiền', color: 'purple' },
} as const;

const DEFAULT_STATUS = { name: 'Không xác định', color: 'blue' };

// Styling constants
const STYLES = {
    container: {
        padding: 24,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 0 40px rgba(0,0,0,0.07)',
    },
    timelineItem: {
        marginLeft: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        padding: '8px',
        borderRadius: '8px',
    },
    timelineItemHover: {
        backgroundColor: '#f5f5f5',
        transform: 'translateX(4px)',
    },
    timelineHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    leftContent: {
        flex: 1,
    },
    rightContent: {
        textAlign: 'right' as const,
        minWidth: '120px',
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 24,
    },
    emptyState: {
        textAlign: 'center' as const,
        padding: 40,
    },
} as const;

// Utility functions
const getPaymentMethodConfig = (method: string) => {
    const normalizedMethod = method.toLowerCase();
    return PAYMENT_METHOD_CONFIG[normalizedMethod as keyof typeof PAYMENT_METHOD_CONFIG] || DEFAULT_PAYMENT_METHOD;
};

const getStatusConfig = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    return STATUS_CONFIG[normalizedStatus as keyof typeof STATUS_CONFIG] || DEFAULT_STATUS;
};

const formatCurrency = (amount: number | undefined | null) => {
    if (typeof amount !== 'number') return '0';
    return amount.toLocaleString('vi-VN');
};

const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateString;
    }
};

// Sub-components
const TransactionItem: React.FC<{
    transaction: Transaction;
    onClick: (transaction: Transaction) => void;
}> = ({ transaction, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const statusConfig = getStatusConfig(transaction.status);

    const handleClick = useCallback(() => {
        onClick(transaction);
    }, [transaction, onClick]);

    const itemStyle = {
        ...STYLES.timelineItem,
        ...(isHovered ? STYLES.timelineItemHover : {})
    };

    return (
        <div
            style={itemStyle}
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={STYLES.timelineHeader}>
                <div style={STYLES.leftContent}>
                    <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>
                        {transaction.title || 'Giao dịch'}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 2 }}>
                        Mã: {transaction.idView || transaction._id}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatDate(transaction.createdAt)}
                    </Text>
                </div>
                <div style={STYLES.rightContent}>
                    <Text
                        strong
                        style={{
                            fontSize: 14,
                            color: (transaction.money || 0) < 0 ? '#ff4d4f' : '#52c41a',
                            display: 'block',
                            marginBottom: 4
                        }}
                    >
                        {formatCurrency(transaction.money)} VND
                    </Text>
                    <Tag color={statusConfig.color} style={{ fontSize: 11, marginBottom: 4 }}>
                        {statusConfig.name}
                    </Tag>
                    <Text type="secondary" style={{ fontSize: 11, display: 'block' }}>
                        {getPaymentMethodConfig(transaction.paymentIn || '').label}
                    </Text>
                </div>
            </div>
        </div>
    );
};

const TransactionTimeline: React.FC<{
    transactions: Transaction[];
    onTransactionClick: (transaction: Transaction) => void;
}> = ({ transactions, onTransactionClick }) => {
    const timelineItems = useMemo(() =>
        transactions.map((transaction) => ({
            dot: getPaymentMethodConfig(transaction.paymentIn || '').icon,
            children: (
                <TransactionItem
                    key={transaction._id}
                    transaction={transaction}
                    onClick={onTransactionClick}
                />
            ),
        })),
        [transactions, onTransactionClick]
    );

    return <Timeline mode="left" items={timelineItems} style={{ marginTop: 16 }} />;
};

const TransactionPagination: React.FC<{
    pagination: PaginationType;
    onPageChange: (page: number) => void;
}> = ({ pagination, onPageChange }) => (
    <div style={STYLES.paginationContainer}>
        <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onChange={onPageChange}
        />
    </div>
);

const EmptyTransactionState: React.FC = () => (
    <div style={STYLES.emptyState}>
        <Empty
            description="Không có giao dịch nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
    </div>
);

export default function PeopleTransaction({
    trans,
    pagination,
    setPage
}: PeopleTransactionProps) {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Memoized handlers
    const handleTransactionClick = useCallback((transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setModalOpen(false);
        setSelectedTransaction(null);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
    }, [setPage]);

    // Memoized computed values
    const hasTransactions = useMemo(() => trans && trans.length > 0, [trans]);

    return (
        <div style={STYLES.container}>
            {/* Transaction Detail Modal */}
            <TransactionDetail
                trans={selectedTransaction}
                open={modalOpen}
                onClose={handleCloseModal}
            />

            {/* Header */}
            <Title level={4} style={{ marginBottom: 24 }}>
                Lịch sử giao dịch
            </Title>

            {/* Content */}
            {hasTransactions ? (
                <>
                    <TransactionTimeline
                        transactions={trans}
                        onTransactionClick={handleTransactionClick}
                    />
                    <TransactionPagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <EmptyTransactionState />
            )}
        </div>
    );
}