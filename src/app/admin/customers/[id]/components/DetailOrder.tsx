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

const DetailOrder: React.FC<DetailOrderProps> = ({ open, onClose, order }) => {
    if (!order) return null;

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
        navigator.clipboard.writeText(text).then(() => {
            message.success(`${label} copied to clipboard`);
        }).catch(() => {
            message.error('Failed to copy to clipboard');
        });
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

    return (
        <Modal
            title={
                <Space>
                    <ShoppingCartOutlined style={{ color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>
                        Order Details
                    </Title>
                </Space>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
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
                <Descriptions.Item
                    label={
                        <Space>
                            <ShoppingCartOutlined />
                            Order ID
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
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <HomeOutlined />
                            Service Name
                        </Space>
                    }
                >
                    <Text strong style={{ fontSize: '16px' }}>
                        {order.serviceName}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <HomeOutlined />
                            Service Address
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
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <CalendarOutlined />
                            <ClockCircleOutlined />
                            Scheduled Date & Time
                        </Space>
                    }
                >
                    <Space direction="vertical" size="small">
                        <Text strong>
                            {formatDateTime(order.date, order.time)}
                        </Text>
                    </Space>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            {getPaymentMethodIcon(order.paymentMethod)}
                            Payment Method
                        </Space>
                    }
                >
                    <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                        {order.paymentMethod}
                    </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <DollarOutlined />
                            Total Price
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
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            {getStatusIcon(order.status)}
                            Order Status
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
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <UserOutlined />
                            Customer ID
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
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <CalendarOutlined />
                            Created At
                        </Space>
                    }
                >
                    <Text type="secondary">
                        {formatCreatedUpdated(order.createdAt)}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <CalendarOutlined />
                            Last Updated
                        </Space>
                    }
                >
                    <Text type="secondary">
                        {formatCreatedUpdated(order.updatedAt)}
                    </Text>
                </Descriptions.Item>
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
                        <strong>Security Note:</strong> This order information is confidential and should only be accessed by authorized personnel.
                    </Text>
                </Space>
            </div>
        </Modal>
    );
};

export default DetailOrder;
