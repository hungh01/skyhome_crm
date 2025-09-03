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
import { Order } from '@/type/order/order';

const { Text, Title } = Typography;

interface DetailOrderProps {
    open: boolean;
    onClose: () => void;
    order: Order | null;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'done':
        case 'completed':
            return 'success';
        case 'pending':
        case 'confirm':
            return 'processing';
        case 'cancel':
        case 'cancelled':
            return 'error';
        case 'doing':
        case 'in-progress':
            return 'warning';
        default:
            return 'default';
    }
};

const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
        case 'done':
        case 'completed':
            return <CheckCircleOutlined />;
        case 'pending':
            return <ClockCircleOutlined />;
        case 'confirm':
            return <ExclamationCircleOutlined />;
        case 'doing':
        case 'processing':
            return <SyncOutlined spin />;
        case 'cancel':
        case 'cancelled':
            return <CloseCircleOutlined />;
        default:
            return <ClockCircleOutlined />;
    }
};

const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'Chờ xử lý';
        case 'confirm':
            return 'Đã xác nhận';
        case 'doing':
            return 'Đang thực hiện';
        case 'done':
            return 'Hoàn thành';
        case 'cancel':
            return 'Đã hủy';
        default:
            return status.toUpperCase();
    }
};

const getPaymentMethodIcon = (method: string) => {

    if (!method) return <CreditCardOutlined />;
    switch (method.toLowerCase()) {
        case 'online':
        case 'card':
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
                            text: order.idView || order._id,
                            onCopy: () => copyToClipboard(order.idView || order._id, 'Order ID')
                        }}>
                            {order.idView || order._id}
                        </Text>
                    </Space>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <UserOutlined />
                            Thông tin khách hàng
                        </Space>
                    }
                >
                    <div style={{
                        background: '#f8f9ff',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e6f0ff'
                    }}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                                    � {order.customerName}
                                </Text>
                                <Tag color="blue" style={{ marginLeft: '8px' }}>
                                    ID: {typeof order.customerId.code === 'string' ? order.customerId.code : order.customerId?._id || 'N/A'}
                                </Tag>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text copyable={{ text: order.customerPhone }}>
                                    📞 {order.customerPhone}
                                </Text>
                                <Tag color={order.type === 'business' ? 'orange' : 'green'}>
                                    {order.type === 'business' ? '🏢 Doanh nghiệp' : '👨‍👩‍👧‍👦 Cá nhân'}
                                </Tag>
                            </div>
                        </Space>
                    </div>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <HomeOutlined />
                            Dịch vụ chính
                        </Space>
                    }
                >
                    <div style={{
                        background: '#f9f9f9',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #d9d9d9'
                    }}>
                        <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                            🛠️ {order.serviceId?.name || 'Không có thông tin dịch vụ'}
                        </Text>
                    </div>
                </DescriptionItem>

                {order.optionalService && order.optionalService.length > 0 && (
                    <DescriptionItem
                        label={
                            <Space>
                                <HomeOutlined />
                                Dịch vụ bổ sung
                            </Space>
                        }
                    >
                        <div style={{
                            background: '#fff7e6',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ffd591'
                        }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                {order.optionalService.map((service, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '4px 0'
                                    }}>
                                        <Text>
                                            ➕ {service.name || `Dịch vụ ${index + 1}`}
                                        </Text>
                                        {service.price && (
                                            <Tag color="orange">
                                                {service.price.toLocaleString('vi-VN')} VND
                                            </Tag>
                                        )}
                                    </div>
                                ))}
                            </Space>
                        </div>
                    </DescriptionItem>
                )}

                {order.promotions && order.promotions.length > 0 && (
                    <DescriptionItem
                        label={
                            <Space>
                                <DollarOutlined />
                                Khuyến mãi áp dụng
                            </Space>
                        }
                    >
                        <div style={{
                            background: '#f6ffed',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #b7eb8f'
                        }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                {order.promotions.map((promotion, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '4px 0'
                                    }}>
                                        <Text>
                                            🎁 {promotion.title || promotion.code || `Khuyến mãi ${index + 1}`}
                                        </Text>
                                        {promotion.discountValue && (
                                            <Tag color="green">
                                                {promotion.discountType === 'percent'
                                                    ? `-${promotion.discountValue}%`
                                                    : `-${promotion.discountValue?.toLocaleString('vi-VN')} VND`
                                                }
                                            </Tag>
                                        )}
                                    </div>
                                ))}
                            </Space>
                        </div>
                    </DescriptionItem>
                )}

                <DescriptionItem
                    label={
                        <Space>
                            <HomeOutlined />
                            Địa chỉ làm việc
                        </Space>
                    }
                >
                    <div style={{
                        background: '#fff7e6',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #ffd591'
                    }}>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text strong style={{ fontSize: '14px' }}>
                                📍 {order.address}
                            </Text>
                            {(order.lat && order.lng) && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        Tọa độ: {order.lat}, {order.lng}
                                    </Text>
                                    <Button
                                        type="link"
                                        size="small"
                                        icon={<CopyOutlined />}
                                        onClick={() => copyToClipboard(`${order.lat}, ${order.lng}`, 'Coordinates')}
                                    >
                                        Copy tọa độ
                                    </Button>
                                </div>
                            )}
                        </Space>
                    </div>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <CalendarOutlined />
                            <ClockCircleOutlined />
                            Ngày làm việc
                        </Space>
                    }
                >
                    <Space direction="vertical" size="small">
                        <Text strong>
                            📅 Bắt đầu: {formatCreatedUpdated(order.dateWork)}
                        </Text>
                        <Text strong>
                            📅 Kết thúc: {formatCreatedUpdated(order.endDateWork)}
                        </Text>
                        {order.checkInTime && (
                            <Text>⏰ Check-in: {order.checkInTime}</Text>
                        )}
                        {order.checkOutTime && (
                            <Text>⏰ Check-out: {order.checkOutTime}</Text>
                        )}
                    </Space>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            {getPaymentMethodIcon(order.paymentMethod || '')}
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
                            Chi phí chi tiết
                        </Space>
                    }
                >
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>Phí ban đầu:</Text>
                            <Text strong>{order.initialFee?.toLocaleString('vi-VN')} VND</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>Phí cuối cùng:</Text>
                            <Text strong>{order.finalFee?.toLocaleString('vi-VN')} VND</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>Phí nền tảng:</Text>
                            <Text>{order.platformFee?.toLocaleString('vi-VN')} VND</Text>
                        </div>
                        {order.totalDiscount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text>Giảm giá:</Text>
                                <Text style={{ color: '#52c41a' }}>-{order.totalDiscount?.toLocaleString('vi-VN')} VND</Text>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0', paddingTop: '8px' }}>
                            <Text strong>Tổng cộng:</Text>
                            <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                                {order.totalFee?.toLocaleString('vi-VN')} VND
                            </Text>
                        </div>
                    </Space>
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
                        {getStatusText(order.status)}
                    </Tag>
                </DescriptionItem>

                <DescriptionItem
                    label={
                        <Space>
                            <UserOutlined />
                            Thông tin cộng tác viên
                        </Space>
                    }
                >
                    {order.collaboratorId || order.collaboratorName || order.collaboratorPhone ? (
                        <div style={{
                            background: '#f6ffed',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #b7eb8f'
                        }}>
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                {order.collaboratorName && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                                            👨‍💼 {order.collaboratorName}
                                        </Text>
                                        {order.collaboratorGroupId && (
                                            <Tag color="green" style={{ marginLeft: '8px' }}>
                                                Nhóm: {order.collaboratorGroupId}
                                            </Tag>
                                        )}
                                    </div>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {order.collaboratorPhone && (
                                        <Text copyable={{ text: order.collaboratorPhone }}>
                                            📞 {order.collaboratorPhone}
                                        </Text>
                                    )}
                                    {order.collaboratorId && (
                                        <Tag color="cyan">
                                            ID: {typeof order.collaboratorId.code === 'string' ? order.collaboratorId.code : order.collaboratorId?._id || 'N/A'}
                                        </Tag>
                                    )}
                                </div>
                            </Space>
                        </div>
                    ) : (
                        <div style={{
                            background: '#fff2e8',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid #ffd591',
                            textAlign: 'center'
                        }}>
                            <Text type="secondary">
                                ⚠️ Chưa có cộng tác viên được phân công
                            </Text>
                        </div>
                    )}
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

                {order.note && (
                    <DescriptionItem
                        label={
                            <Space>
                                <ExclamationCircleOutlined />
                                Ghi chú
                            </Space>
                        }
                    >
                        <Text>{order.note}</Text>
                    </DescriptionItem>
                )}

                {order.rating && (
                    <DescriptionItem
                        label={
                            <Space>
                                <CheckCircleOutlined />
                                Đánh giá
                            </Space>
                        }
                    >
                        <Space>
                            <Text strong>⭐ {order.rating}/5</Text>
                            {order.comment && <Text type="secondary">&quot;{order.comment}&quot;</Text>}
                        </Space>
                    </DescriptionItem>
                )}
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
