import React, { useMemo } from 'react';
import { Card, Typography, Tag, Space, Avatar, Rate, Image, Divider } from 'antd';
import {
    EnvironmentOutlined,
    ClockCircleOutlined,
    CalendarOutlined,
    StarOutlined,
    MessageOutlined,
    PictureOutlined
} from '@ant-design/icons';
import { Order } from '@/type/order/order';
import { formatDDMMYYYY, formatTime } from '@/utils/format-datetime';

const { Title, Text } = Typography;

interface OrderedItemProps {
    order: Order;
}

// Constants for styling
const STYLES = {
    card: {
        borderRadius: 12,
        border: '1px solid #e8e8e8',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        margin: '8px 0',
    },
    cardBody: { padding: 16 },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12
    },
    title: { margin: 0, fontWeight: 600, fontSize: 14 },
    tag: { borderRadius: 8, padding: '2px 8px', border: 'none', fontSize: 11 },
    icon: { fontSize: 14, marginRight: 6 },
    text: { color: '#666', fontSize: 12 },
    priceTitle: { margin: 0, color: '#faad14', fontWeight: 600, fontSize: 16 },
    reviewSection: { background: '#f8f9fa', padding: '12px', borderRadius: '8px' },
    reviewHeader: { display: 'flex', alignItems: 'center', marginBottom: '8px' },
    reviewText: { fontWeight: 500, fontSize: 12, color: '#333' },
    imageContainer: { display: 'flex', gap: '4px', flexWrap: 'wrap' },
    image: {
        objectFit: 'cover' as const,
        borderRadius: '4px',
        border: '1px solid #d9d9d9'
    },
    imageCounter: {
        width: 40,
        height: 40,
        borderRadius: '4px',
        border: '1px solid #d9d9d9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        fontSize: 10,
        color: '#666'
    }
} as const;

// Status configuration
const STATUS_CONFIG = {
    'pending': {
        label: 'Đang chờ làm',
        background: 'linear-gradient(to top left, #FFF8E1, #ffffff)',
        color: '#FFB300'
    },
    'doing': {
        label: 'Đang làm',
        background: 'linear-gradient(to top left, #E3F2FD, #ffffff)',
        color: '#2196F3'
    },
    'done': {
        label: 'Hoàn thành',
        background: 'linear-gradient(to top left, #E8F5E9, #ffffff)',
        color: '#43A047'
    },
    'cancel': {
        label: 'Đã hủy',
        background: 'linear-gradient(to top left, #FFEBEE, #ffffff)',
        color: '#E53935'
    }
} as const;

const DEFAULT_STATUS_CONFIG = {
    background: 'linear-gradient(to top left, #f5f5f5, #ffffff)',
    color: '#666666'
};

export default function OrderedItem({ order }: OrderedItemProps) {
    const statusConfig = useMemo(() => {
        return STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || DEFAULT_STATUS_CONFIG;
    }, [order.status]);

    const hasReview = useMemo(() => {
        return !!(order.rating || order.comment || (order.images && order.images.length > 0));
    }, [order.rating, order.comment, order.images]);

    const renderOrderInfo = () => (
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <InfoRow
                icon={<EnvironmentOutlined style={{ ...STYLES.icon, color: '#faad14' }} />}
                text={order.address}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <InfoRow
                    icon={<ClockCircleOutlined style={{ ...STYLES.icon, color: '#060402ff' }} />}
                    text={`${formatTime(order.dateWork)} to ${formatTime(order.endDateWork)}`}
                />
                <PaymentInfo order={order} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <InfoRow
                    icon={<CalendarOutlined style={{ ...STYLES.icon, color: '#faad14' }} />}
                    text={formatDDMMYYYY(order.dateWork)}
                />
                <Title level={5} style={STYLES.priceTitle}>
                    {order.totalPrice?.toLocaleString()} VNĐ
                </Title>
            </div>
        </Space>
    );

    const renderReviewSection = () => {
        if (!hasReview) return null;

        return (
            <>
                <Divider style={{ margin: '12px 0' }} />
                <div style={STYLES.reviewSection}>
                    <div style={STYLES.reviewHeader}>
                        <StarOutlined style={{ ...STYLES.icon, color: '#faad14' }} />
                        <Text style={STYLES.reviewText}>Đánh giá từ khách hàng</Text>
                    </div>

                    <ReviewRating rating={order.rating} />
                    <ReviewComment comment={order.comment} />
                    <ReviewImages images={order.images} />
                </div>
            </>
        );
    };

    return (
        <Card
            style={{
                ...STYLES.card,
                background: statusConfig.background
            }}
            styles={{ body: STYLES.cardBody }}
        >
            <div style={STYLES.header}>
                <Title level={5} style={STYLES.title}>
                    {order.serviceId?.name || 'Không có tên dịch vụ'}
                </Title>
                <Tag color={statusConfig.color} style={STYLES.tag}>
                    {order.status}
                </Tag>
            </div>

            {renderOrderInfo()}
            {renderReviewSection()}
        </Card>
    );
}

// Helper Components
const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        {icon}
        <Text style={STYLES.text}>{text}</Text>
    </div>
);

const PaymentInfo = ({ order }: { order: Order }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar style={{
            backgroundColor: '#1890ff',
            marginRight: 6,
            width: 20,
            height: 20,
            fontSize: 10
        }}>
            $
        </Avatar>
        <Text style={{ ...STYLES.text, fontWeight: 500 }}>
            {order.paymentMethod || 'Chưa có phương thức thanh toán'}
        </Text>
    </div>
);

const ReviewRating = ({ rating }: { rating?: number }) => {
    if (!rating) return null;

    return (
        <div style={{ marginBottom: '8px' }}>
            <Rate disabled value={rating} style={{ fontSize: 14 }} />
            <Text style={{ marginLeft: 8, fontSize: 12, color: '#666' }}>
                ({rating}/5 sao)
            </Text>
        </div>
    );
};

const ReviewComment = ({ comment }: { comment?: string }) => {
    if (!comment) return null;

    return (
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'flex-start' }}>
            <MessageOutlined style={{
                color: '#52c41a',
                fontSize: 14,
                marginRight: 6,
                marginTop: 2
            }} />
            <Text style={{ fontSize: 12, color: '#333', lineHeight: 1.4 }}>
                {comment}
            </Text>
        </div>
    );
};

const ReviewImages = ({ images }: { images?: string[] }) => {
    if (!images || images.length === 0) return null;

    const displayImages = images.slice(0, 3);
    const remainingCount = images.length - 3;

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <PictureOutlined style={{ ...STYLES.icon, color: '#1890ff' }} />
            <div style={STYLES.imageContainer}>
                {displayImages.map((image, index) => (
                    <Image
                        key={index}
                        width={40}
                        height={40}
                        src={image}
                        style={STYLES.image}
                        preview={{ mask: false }}
                        alt={`Review image ${index + 1}`}
                    />
                ))}
                {remainingCount > 0 && (
                    <div style={STYLES.imageCounter}>
                        +{remainingCount}
                    </div>
                )}
            </div>
        </div>
    );
};