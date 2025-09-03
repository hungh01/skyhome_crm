'use client';

import React from 'react';
import { Modal, Descriptions, Tag, Typography, Space, Button, message, Rate } from 'antd';
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
    UserOutlined,
    StarOutlined,
    MessageOutlined,
    PictureOutlined
} from '@ant-design/icons';
import { Order } from '@/type/order/order';
import { OptionalService } from '@/type/services/optional';
import { Promotion } from '@/type/promotion/promotion';

const { Text, Title } = Typography;

interface OrderDetailProps {
    open: boolean;
    onClose: () => void;
    order: Order | null;
}

// Status Configuration
const STATUS_CONFIG = {
    done: { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoàn thành' },
    completed: { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoàn thành' },
    pending: { color: 'processing', icon: <ClockCircleOutlined />, text: 'Chờ xử lý' },
    confirm: { color: 'processing', icon: <ExclamationCircleOutlined />, text: 'Đã xác nhận' },
    doing: { color: 'warning', icon: <SyncOutlined spin />, text: 'Đang thực hiện' },
    'in-progress': { color: 'warning', icon: <SyncOutlined spin />, text: 'Đang thực hiện' },
    cancel: { color: 'error', icon: <CloseCircleOutlined />, text: 'Đã hủy' },
    cancelled: { color: 'error', icon: <CloseCircleOutlined />, text: 'Đã hủy' },
} as const;

const DEFAULT_STATUS = { color: 'default', icon: <ClockCircleOutlined />, text: 'Không xác định' };

// Payment Method Configuration
const PAYMENT_METHODS = {
    online: { icon: <CreditCardOutlined />, label: 'Thanh toán online' },
    card: { icon: <CreditCardOutlined />, label: 'Thẻ tín dụng' },
    cash: { icon: <DollarOutlined />, label: 'Tiền mặt' },
} as const;

// Utility Functions
const copyToClipboard = async (text: string, label: string) => {
    try {
        await navigator.clipboard.writeText(text);
        message.success(`${label} đã được sao chép`);
    } catch {
        message.error('Không thể sao chép vào clipboard');
    }
};

const formatDateTime = (dateStr: string) => {
    try {
        return new Date(dateStr).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return dateStr;
    }
};

const formatCurrency = (amount?: number) => {
    return amount ? `${amount.toLocaleString('vi-VN')} VND` : '0 VND';
};

const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status.toLowerCase() as keyof typeof STATUS_CONFIG] || DEFAULT_STATUS;
};

const getPaymentMethodConfig = (method: string) => {
    return PAYMENT_METHODS[method?.toLowerCase() as keyof typeof PAYMENT_METHODS] || PAYMENT_METHODS.card;
};

// Component for consistent description items
const DescriptionItem: React.FC<{
    label: React.ReactNode;
    children: React.ReactNode;
}> = ({ label, children }) => (
    <Descriptions.Item label={label}>{children}</Descriptions.Item>
);

// Card wrapper component for consistent styling
const InfoCard: React.FC<{
    children: React.ReactNode;
    backgroundColor?: string;
    borderColor?: string;
    style?: React.CSSProperties;
}> = ({ children, backgroundColor = '#f8f9fa', borderColor = '#dee2e6', style = {} }) => (
    <div style={{
        background: backgroundColor,
        padding: '12px',
        borderRadius: '8px',
        border: `1px solid ${borderColor}`,
        ...style
    }}>
        {children}
    </div>
);

// Sub-components 
const CustomerInfo = ({ order }: { order: Order }) => (
    <InfoCard backgroundColor="#f8f9ff" borderColor="#e6f0ff">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                    👤 {order.customerName}
                </Text>
                <Tag color="blue">
                    ID: {typeof order.customerId === 'object' ? order.customerId.code || order.customerId._id : order.customerId || 'N/A'}
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
    </InfoCard>
);

const ServiceInfo = ({ order }: { order: Order }) => (
    <InfoCard>
        <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
            🛠️ {order.serviceId?.name || 'Không có thông tin dịch vụ'}
        </Text>
    </InfoCard>
);

const OptionalServices = ({ services }: { services: OptionalService[] }) => (
    <InfoCard backgroundColor="#fff7e6" borderColor="#ffd591">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {services.map((service: OptionalService, index: number) => (
                <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0'
                }}>
                    <Text>➕ {service.name || `Dịch vụ ${index + 1}`}</Text>
                    {service.price && (
                        <Tag color="orange">{formatCurrency(service.price)}</Tag>
                    )}
                </div>
            ))}
        </Space>
    </InfoCard>
);

const PromotionInfo = ({ promotions }: { promotions: Promotion[] }) => (
    <InfoCard backgroundColor="#f6ffed" borderColor="#b7eb8f">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {promotions.map((promotion: Promotion, index: number) => (
                <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0'
                }}>
                    <Text>🎁 {promotion.title || promotion.code || `Khuyến mãi ${index + 1}`}</Text>
                    {promotion.discountValue && (
                        <Tag color="green">
                            {promotion.discountType === 'percent'
                                ? `-${promotion.discountValue}%`
                                : `-${formatCurrency(promotion.discountValue)}`
                            }
                        </Tag>
                    )}
                </div>
            ))}
        </Space>
    </InfoCard>
);

const AddressInfo = ({ order }: { order: Order }) => (
    <InfoCard backgroundColor="#fff7e6" borderColor="#ffd591">
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Text strong>📍 {order.address}</Text>
            {(order.lat && order.lng) && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        Tọa độ: {order.lat}, {order.lng}
                    </Text>
                    <Button
                        type="link"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(`${order.lat}, ${order.lng}`, 'Tọa độ')}
                    >
                        Copy tọa độ
                    </Button>
                </div>
            )}
        </Space>
    </InfoCard>
);

const WorkTimeInfo = ({ order }: { order: Order }) => (
    <Space direction="vertical" size="small">
        <Text strong>📅 Bắt đầu: {formatDateTime(order.dateWork)}</Text>
        <Text strong>📅 Kết thúc: {formatDateTime(order.endDateWork)}</Text>
        {order.checkInTime && <Text>⏰ Check-in: {order.checkInTime}</Text>}
        {order.checkOutTime && <Text>⏰ Check-out: {order.checkOutTime}</Text>}
    </Space>
);

const PricingDetails = ({ order }: { order: Order }) => (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Phí ban đầu:</Text>
            <Text strong>{formatCurrency(order.initialFee)}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Phí cuối cùng:</Text>
            <Text strong>{formatCurrency(order.finalFee)}</Text>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Phí nền tảng:</Text>
            <Text>{formatCurrency(order.platformFee)}</Text>
        </div>
        {order.totalDiscount && order.totalDiscount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Giảm giá:</Text>
                <Text style={{ color: '#52c41a' }}>-{formatCurrency(order.totalDiscount)}</Text>
            </div>
        )}
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #f0f0f0',
            paddingTop: '8px'
        }}>
            <Text strong>Tổng cộng:</Text>
            <Text strong style={{ color: '#52c41a', fontSize: '16px' }}>
                {formatCurrency(order.totalFee)}
            </Text>
        </div>
    </Space>
);

const CollaboratorInfo = ({ order }: { order: Order }) => {
    const hasCollaborator = order.collaboratorId || order.collaboratorName || order.collaboratorPhone;

    if (!hasCollaborator) {
        return (
            <InfoCard backgroundColor="#fff2e8" borderColor="#ffd591">
                <div style={{ textAlign: 'center' }}>
                    <Text type="secondary">⚠️ Chưa có cộng tác viên được phân công</Text>
                </div>
            </InfoCard>
        );
    }

    return (
        <InfoCard backgroundColor="#f6ffed" borderColor="#b7eb8f">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {order.collaboratorName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                            👨‍💼 {order.collaboratorName}
                        </Text>
                        {order.collaboratorGroupId && (
                            <Tag color="green">Nhóm: {order.collaboratorGroupId}</Tag>
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
                            ID: {typeof order.collaboratorId === 'object' ?
                                order.collaboratorId.code || order.collaboratorId._id :
                                order.collaboratorId || 'N/A'}
                        </Tag>
                    )}
                </div>
            </Space>
        </InfoCard>
    );
};

const ReviewInfo = ({ order }: { order: Order }) => {
    if (!order.rating && !order.comment && (!order.images || order.images.length === 0)) {
        return null;
    }

    return (
        <InfoCard backgroundColor="#f8f9fa" borderColor="#dee2e6">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {order.rating && (
                    <div>
                        <Text strong style={{ marginRight: 8 }}>Đánh giá:</Text>
                        <Rate disabled value={order.rating} style={{ fontSize: 14 }} />
                        <Text style={{ marginLeft: 8 }}>({order.rating}/5 sao)</Text>
                    </div>
                )}
                {order.comment && (
                    <div>
                        <MessageOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                        <Text>{order.comment}</Text>
                    </div>
                )}
                {order.images && order.images.length > 0 && (
                    <div>
                        <PictureOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                        <Text>{order.images.length} hình ảnh đánh giá</Text>
                    </div>
                )}
            </Space>
        </InfoCard>
    );
};

export default function OrderDetail({ open, onClose, order }: OrderDetailProps) {
    if (!order) return null;

    const statusConfig = getStatusConfig(order.status);
    const paymentConfig = getPaymentMethodConfig(order.paymentMethod);

    return (
        <Modal
            title={
                <Space>
                    <ShoppingCartOutlined style={{ color: '#1890ff' }} />
                    <Title level={4} style={{ margin: 0 }}>Chi tiết đơn hàng</Title>
                </Space>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>Đóng</Button>
            ]}
            width={700}
            styles={{ body: { padding: '24px' } }}
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
                <DescriptionItem label={<Space><ShoppingCartOutlined />Mã đơn hàng</Space>}>
                    <Text code copyable={{
                        text: order.idView || order._id,
                        onCopy: () => copyToClipboard(order.idView || order._id, 'Mã đơn hàng')
                    }}>
                        {order.idView || order._id}
                    </Text>
                </DescriptionItem>

                <DescriptionItem label={<Space><UserOutlined />Thông tin khách hàng</Space>}>
                    <CustomerInfo order={order} />
                </DescriptionItem>

                <DescriptionItem label={<Space><HomeOutlined />Dịch vụ chính</Space>}>
                    <ServiceInfo order={order} />
                </DescriptionItem>

                {order.optionalService && order.optionalService.length > 0 && (
                    <DescriptionItem label={<Space><HomeOutlined />Dịch vụ bổ sung</Space>}>
                        <OptionalServices services={order.optionalService} />
                    </DescriptionItem>
                )}

                {order.promotions && order.promotions.length > 0 && (
                    <DescriptionItem label={<Space><DollarOutlined />Khuyến mãi áp dụng</Space>}>
                        <PromotionInfo promotions={order.promotions} />
                    </DescriptionItem>
                )}

                <DescriptionItem label={<Space><HomeOutlined />Địa chỉ làm việc</Space>}>
                    <AddressInfo order={order} />
                </DescriptionItem>

                <DescriptionItem label={<Space><CalendarOutlined /><ClockCircleOutlined />Thời gian làm việc</Space>}>
                    <WorkTimeInfo order={order} />
                </DescriptionItem>

                <DescriptionItem label={<Space>{paymentConfig.icon}Phương thức thanh toán</Space>}>
                    <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                        {paymentConfig.label}
                    </Tag>
                </DescriptionItem>

                <DescriptionItem label={<Space><DollarOutlined />Chi phí chi tiết</Space>}>
                    <PricingDetails order={order} />
                </DescriptionItem>

                <DescriptionItem label={<Space>{statusConfig.icon}Trạng thái đơn hàng</Space>}>
                    <Tag
                        color={statusConfig.color}
                        icon={statusConfig.icon}
                        style={{ fontSize: '14px', padding: '6px 12px', borderRadius: '6px' }}
                    >
                        {statusConfig.text}
                    </Tag>
                </DescriptionItem>

                <DescriptionItem label={<Space><UserOutlined />Thông tin cộng tác viên</Space>}>
                    <CollaboratorInfo order={order} />
                </DescriptionItem>

                <DescriptionItem label={<Space><CalendarOutlined />Ngày tạo đơn</Space>}>
                    <Text type="secondary">{formatDateTime(order.createdAt)}</Text>
                </DescriptionItem>

                <DescriptionItem label={<Space><CalendarOutlined />Ngày cập nhật cuối</Space>}>
                    <Text type="secondary">{formatDateTime(order.updatedAt)}</Text>
                </DescriptionItem>

                {order.note && (
                    <DescriptionItem label={<Space><ExclamationCircleOutlined />Ghi chú</Space>}>
                        <Text>{order.note}</Text>
                    </DescriptionItem>
                )}

                <DescriptionItem label={<Space><StarOutlined />Đánh giá khách hàng</Space>}>
                    <ReviewInfo order={order} />
                </DescriptionItem>
            </Descriptions>

            <InfoCard
                backgroundColor="#f0f9ff"
                borderColor="#bae7ff"
                style={{ marginTop: '24px' }}
            >
                <Space>
                    <ExclamationCircleOutlined style={{ color: '#1890ff' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <strong>Ghi chú:</strong> Thông tin đơn hàng này được bảo mật và chỉ có nhân viên được ủy quyền mới được phép truy cập.
                    </Text>
                </Space>
            </InfoCard>
        </Modal>
    );
}
