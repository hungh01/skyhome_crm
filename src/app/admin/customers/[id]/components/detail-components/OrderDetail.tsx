'use client';

import React from 'react';
import { Modal, Descriptions, Tag, Typography, Space, Button, message } from 'antd';
import {
    ShoppingCartOutlined,
    HomeOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    CreditCardOutlined,
    DollarOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
    CloseCircleOutlined,
    CopyOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Order } from '@/app/type/order';

const { Text, Title } = Typography;

interface DetailOrderProps {
    open: boolean;
    onClose: () => void;
    order: Order | null;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed':
        case 'delivered':
            return 'success';
        case 'pending':
        case 'processing':
            return 'processing';
        case 'cancelled':
        case 'failed':
            return 'error';
        case 'in progress':
        case 'shipping':
            return 'warning';
        default:
            return 'default';
    }
};

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'completed':
        case 'delivered':
            return <CheckCircleOutlined />;
        case 'pending':
            return <ClockCircleOutlined />;
        case 'processing':
        case 'in progress':
            return <SyncOutlined spin />;
        case 'cancelled':
        case 'failed':
            return <CloseCircleOutlined />;
        default:
            return <ExclamationCircleOutlined />;
    }
};

const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
        case 'credit card':
        case 'debit card':
            return <CreditCardOutlined />;
        case 'cash':
            return <DollarOutlined />;
        default:
            return <CreditCardOutlined />;
    }
};

const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
        .then(() => message.success(`${label} copied to clipboard`))
        .catch(() => message.error('Failed to copy to clipboard'));
};

const formatDateTime = (dateStr: string, timeStr?: string) => {
    try {
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        return timeStr ? `${formattedDate} at ${timeStr}` : formattedDate;
    } catch {
        return timeStr ? `${dateStr} at ${timeStr}` : dateStr;
    }
};

const formatCreatedUpdated = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateStr;
    }
};

const DescriptionItem: React.FC<{
    label: React.ReactNode;
    children: React.ReactNode;
}> = ({ label, children }) => (
    <Descriptions.Item label={label}>{children}</Descriptions.Item>
);

export default function OrderDetail({ open, onClose, order }: DetailOrderProps) {
    if (!order) return null;

    return (
        <Modal
            title={
                <Space>
                    <ShoppingCartOutlined style={{ color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>
                        Chi tiết đơn hàng
                    </Title>
                </Space>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>
            ]}
            width={700}
            styles={{
                body: { padding: '24px' }
            }}
        >
            <Descriptions
                bordered
                column={1}
                size="middle"
                styles={{
                    label: {
                        fontWeight: 600,
                        backgroundColor: '#fafafa',
                        width: '180px'
                    }
                }}
            >
                <DescriptionItem
                    label={
                        <Space>
                            <ShoppingCartOutlined />
                            Mã đơn hàng
                        </Space>
                    }
                >
                    <Space>
                        <Text code copyable={{
                            text: order.id,
                            onCopy: () => copyToClipboard(order.id, 'Order ID')
                        }}>
                            {order.id}
                        </Text>
                    </Space>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <HomeOutlined />
                            Tên dịch vụ
                        </Space>
                    }
                >
                    <Text strong style={{ fontSize: '16px' }}>
                        {order.serviceName}
                    </Text>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <HomeOutlined />
                            Địa chỉ làm việc
                        </Space>
                    }
                >
                    <Space>
                        <Text>{order.address}</Text>
                        <Button
                            type="link"
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(order.address, 'Address')}
                        />
                    </Space>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <CalendarOutlined />
                            <ClockCircleOutlined />
                            Ngày & giờ
                        </Space>
                    }
                >
                    <Text strong>
                        {formatDateTime(order.date, order.time)}
                    </Text>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            {getPaymentMethodIcon(order.paymentMethod)}
                            Phương thức thanh toán
                        </Space>
                    }
                >
                    <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                        {order.paymentMethod}
                    </Tag>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <DollarOutlined />
                            Tổng tiền
                        </Space>
                    }
                >
                    <Text
                        strong
                        style={{
                            fontSize: '18px',
                            color: '#52c41a'
                        }}
                    >
                        {order.price}
                    </Text>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            {getStatusIcon(order.status)}
                            Trạng thái đơn hàng
                        </Space>
                    }
                >
                    <Tag
                        color={getStatusColor(order.status)}
                        icon={getStatusIcon(order.status)}
                        style={{
                            fontSize: '14px',
                            padding: '6px 12px',
                            borderRadius: '6px'
                        }}
                    >
                        {order.status.toUpperCase()}
                    </Tag>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <UserOutlined />
                            Mã khách hàng
                        </Space>
                    }
                >
                    <Space>
                        <Text code copyable={{
                            text: order.userId,
                            onCopy: () => copyToClipboard(order.userId, 'Customer ID')
                        }}>
                            {order.userId}
                        </Text>
                    </Space>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <CalendarOutlined />
                            Ngày tạo đơn
                        </Space>
                    }
                >
                    <Text type="secondary">
                        {formatCreatedUpdated(order.createdAt)}
                    </Text>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <CalendarOutlined />
                            Ngày cập nhật cuối
                        </Space>
                    }
                >
                    <Text type="secondary">
                        {formatCreatedUpdated(order.updatedAt)}
                    </Text>
                </DescriptionItem>
            </Descriptions>

            <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px',
                border: '1px solid #bae7ff'
            }}>
                <Space>
                    <ExclamationCircleOutlined style={{ color: '#1890ff' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <strong>Ghi chú:</strong> Thông tin đơn hàng này được bảo mật và chỉ có nhân viên được ủy quyền mới được phép truy cập.
                    </Text>
                </Space>
            </div>
        </Modal>
    );
}
