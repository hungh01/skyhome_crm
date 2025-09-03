'use client';

import React, { useMemo } from 'react';
import { Transaction } from "@/type/transaction/transaction";
import { Modal, Descriptions, Tag, Typography, Space, Divider } from "antd";
import {
    CreditCardOutlined,
    BankOutlined,
    WalletOutlined,
    DollarOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface TransactionDetailProps {
    trans: Transaction | null;
    open: boolean;
    onClose: () => void;
}

// Configuration for payment methods
const PAYMENT_METHOD_CONFIG = {
    vnpay: { icon: <WalletOutlined style={{ color: "#1890ff", fontSize: 16 }} />, label: 'VNPay' },
    momo: { icon: <WalletOutlined style={{ color: "#1890ff", fontSize: 16 }} />, label: 'MoMo' },
    'bank transfer': { icon: <BankOutlined style={{ color: "#52c41a", fontSize: 16 }} />, label: 'Chuyển khoản' },
    banking: { icon: <BankOutlined style={{ color: "#52c41a", fontSize: 16 }} />, label: 'Ngân hàng' },
    'credit card': { icon: <CreditCardOutlined style={{ color: "#722ed1", fontSize: 16 }} />, label: 'Thẻ tín dụng' },
} as const;

const DEFAULT_PAYMENT_METHOD = {
    icon: <DollarOutlined style={{ color: "#faad14", fontSize: 16 }} />,
    label: 'Khác'
};

// Configuration for transaction status
const STATUS_CONFIG = {
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
} as const;

const DEFAULT_STATUS = { name: 'Không xác định', color: 'blue' };

// Styling constants
const STYLES = {
    modalContent: {
        padding: "16px 0",
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: 24,
    },
    amountTitle: {
        margin: 0,
    },
    additionalInfo: {
        marginTop: 24,
        padding: 16,
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
    },
    noteText: {
        fontSize: 12,
    },
    descriptionsStyle: {
        label: { fontWeight: 600, width: "30%" },
        content: { color: "#666" },
    },
} as const;

// Utility functions
const getPaymentMethodConfig = (method: string) => {
    const normalizedMethod = method?.toLowerCase() || '';
    return PAYMENT_METHOD_CONFIG[normalizedMethod as keyof typeof PAYMENT_METHOD_CONFIG] || DEFAULT_PAYMENT_METHOD;
};

const getStatusConfig = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || '';
    return STATUS_CONFIG[normalizedStatus as keyof typeof STATUS_CONFIG] || DEFAULT_STATUS;
};

const formatCurrency = (amount: number | undefined | null) => {
    if (typeof amount !== 'number') return '0';
    return amount.toLocaleString('vi-VN');
};

const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
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

const getTransactionType = (amount: number | undefined | null) => {
    return (amount || 0) < 0 ? "Hoàn tiền" : "Thanh toán";
};

const getAmountColor = (amount: number | undefined | null) => {
    return (amount || 0) < 0 ? "#ff4d4f" : "#52c41a";
};

// Sub-components
const TransactionHeader: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
    <div style={STYLES.header}>
        <Title
            level={3}
            style={{
                ...STYLES.amountTitle,
                color: getAmountColor(transaction.money),
            }}
        >
            {formatCurrency(transaction.money)} VND
        </Title>
        <Text type="secondary">{getTransactionType(transaction.money)}</Text>
    </div>
);

const TransactionInfo: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const statusConfig = getStatusConfig(transaction.status);
    const paymentConfig = getPaymentMethodConfig(transaction.paymentIn);

    return (
        <Descriptions
            column={1}
            styles={STYLES.descriptionsStyle}
        >
            <Descriptions.Item label="Mã giao dịch">
                <Text copyable>{transaction._id}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Mã hiển thị">
                <Text copyable>{transaction.idView}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Tiêu đề">
                <Text>{transaction.title || 'Không có tiêu đề'}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Loại giao dịch">
                <Tag color="blue">{transaction.kindTransaction || 'Không xác định'}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Kiểu giao dịch">
                <Tag color="purple">{transaction.typeTransaction || 'Không xác định'}</Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái">
                <Tag color={statusConfig.color} style={{ borderRadius: 12 }}>
                    {statusConfig.name}
                </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Số tiền giao dịch">
                <Text strong>{formatCurrency(transaction.money)} VND</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Ghi chú chuyển khoản">
                <Text>{transaction.transferNote || 'Không có ghi chú'}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Thời gian xác nhận">
                <Text>{formatDate(transaction.dateVerify) || 'Chưa xác nhận'}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Thời gian tạo">
                <Text>{formatDate(transaction.createdAt)}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Phương thức thanh toán">
                <Space>
                    {paymentConfig.icon}
                    <Text>{paymentConfig.label}</Text>
                </Space>
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={statusConfig.color}>{statusConfig.name}</Tag>
            </Descriptions.Item>
        </Descriptions>
    );
};

const OrderInfo: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    if (!transaction.idOrder) {
        return (
            <Descriptions column={1} styles={STYLES.descriptionsStyle}>
                <Descriptions.Item label="Thông tin đơn hàng">
                    <Text type="secondary">Không có thông tin đơn hàng</Text>
                </Descriptions.Item>
            </Descriptions>
        );
    }

    return (
        <Descriptions column={1} styles={STYLES.descriptionsStyle}>
            <Descriptions.Item label="Địa chỉ đơn hàng">
                <Text>{transaction.idOrder.address || 'Không có địa chỉ'}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="ID đơn hàng">
                <Text copyable>{transaction.idOrder.idView}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Loại đơn hàng">
                <Text>{transaction.idOrder.type || 'Không xác định'}</Text>
            </Descriptions.Item>

            <Descriptions.Item label="Trạng thái đơn hàng">
                <Text>{transaction.idOrder.status || 'Không xác định'}</Text>
            </Descriptions.Item>
        </Descriptions>
    );
};

const StaffInfo: React.FC<{ transaction: Transaction }> = ({ transaction }) => (
    <Descriptions column={1} styles={STYLES.descriptionsStyle}>
        <Descriptions.Item label="Người tạo giao dịch">
            <Text>{transaction.idStaffCreated || 'Không xác định'}</Text>
        </Descriptions.Item>

        <Descriptions.Item label="Người xác nhận giao dịch">
            <Text>{transaction.idStaffVerify || 'Chưa xác nhận'}</Text>
        </Descriptions.Item>
    </Descriptions>
);

const CustomerInfo: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    if (!transaction.idCustomer) {
        return (
            <Descriptions column={1} styles={STYLES.descriptionsStyle}>
                <Descriptions.Item label="Thông tin khách hàng">
                    <Text type="secondary">Không có thông tin khách hàng</Text>
                </Descriptions.Item>
            </Descriptions>
        );
    }

    return (
        <Descriptions column={1} styles={STYLES.descriptionsStyle}>
            <Descriptions.Item label="Người dùng">
                <Space>
                    <Text strong>{transaction.idCustomer.userId?.fullName || 'Không có tên'}</Text>
                    <Text>({transaction.idCustomer.userId?.phone || 'Không có SĐT'})</Text>
                </Space>
            </Descriptions.Item>

            <Descriptions.Item label="ID người dùng">
                <Text copyable>{transaction.idCustomer.code || transaction.idCustomer._id}</Text>
            </Descriptions.Item>
        </Descriptions>
    );
};

const AdditionalInfo: React.FC = () => (
    <div style={STYLES.additionalInfo}>
        <Text type="secondary" style={STYLES.noteText}>
            <strong>Lưu ý:</strong> Thông tin giao dịch được mã hóa và bảo mật theo
            tiêu chuẩn ngân hàng. Vui lòng liên hệ bộ phận hỗ trợ nếu có bất kỳ
            thắc mắc nào.
        </Text>
    </div>
);

export default function TransactionDetail({ trans, open, onClose }: TransactionDetailProps) {
    // Memoized modal title
    const modalTitle = useMemo(() => {
        if (!trans) return "Chi tiết giao dịch";
        const paymentConfig = getPaymentMethodConfig(trans.paymentIn);
        return (
            <Space>
                {paymentConfig.icon}
                <span>Chi tiết giao dịch</span>
            </Space>
        );
    }, [trans]);

    if (!trans) return null;

    return (
        <Modal
            title={modalTitle}
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            destroyOnHidden
        >
            <div style={STYLES.modalContent}>
                {/* Transaction Header */}
                <TransactionHeader transaction={trans} />

                <Divider />

                {/* Transaction Details */}
                <TransactionInfo transaction={trans} />

                <Divider orientation="left">Thông tin đơn hàng</Divider>
                <OrderInfo transaction={trans} />

                <Divider orientation="left">Thông tin nhân viên</Divider>
                <StaffInfo transaction={trans} />

                <Divider orientation="left">Thông tin khách hàng</Divider>
                <CustomerInfo transaction={trans} />

                {/* Additional Info */}
                <AdditionalInfo />
            </div>
        </Modal>
    );
}
