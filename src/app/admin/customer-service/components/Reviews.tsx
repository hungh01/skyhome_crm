
import { Review } from "@/type/review";
import { Avatar, Card, Col, Progress, Rate, Row, Table, Tag, Typography, Button } from "antd";
import { useState, useEffect } from "react";

const { Text } = Typography;

interface ReviewsProps {
    reviews: Review[];
}

const columns = [
    {
        title: "Người đánh giá",
        dataIndex: "user",
        key: "user",
        render: (user: { image?: string; name?: string; phone?: string }) => {
            return user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={50}
                        src={user.image}
                        //icon={<UserOutlined />}
                        style={{
                            flexShrink: 0,
                            border: '2px solid #f0f0f0'
                        }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontWeight: 500,
                            fontSize: '14px',
                            marginBottom: 4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {user.name}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {user.phone}
                        </div>
                    </div>
                </div>
            ) : <Text type="secondary">N/A</Text>;
        }
    },
    {
        title: "CTV",
        dataIndex: "partner",
        key: "partner",
        render: (partner: { image?: string; name?: string; phone: string }) => {
            return partner ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={50}
                        src={partner.image}
                        style={{
                            flexShrink: 0,
                            border: '2px solid #f0f0f0'
                        }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontWeight: 500,
                            fontSize: '14px',
                            marginBottom: 4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {partner.name}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {partner.phone}
                        </div>
                    </div>
                </div>
            ) : <Text type="secondary">N/A</Text>;
        }
    },
    {
        title: "Mã đơn hàng",
        dataIndex: "orderId",
        key: "orderId",
        render: (orderId: string) => {
            return orderId ? (
                <Text strong>{orderId}</Text>
            ) : <Text type="secondary">N/A</Text>;
        }
    },
    {
        title: "Số sao",
        dataIndex: "rating",
        key: "rating",
        render: (rating: number) => <Rate disabled value={rating} />,
        align: "center" as const,
    },
    {
        title: "Nhận xét",
        dataIndex: "comment",
        key: "comment",
        render: (comment: string) => <Text>{comment}</Text>,
    },
    {
        title: "Ngày đánh giá",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: string) => <Text type="secondary">{new Date(date).toLocaleString("vi-VN")}</Text>,
        width: 160,
    },
];

const ratingLevels = [5, 4, 3, 2, 1];


export default function Reviews({ reviews }: ReviewsProps) {
    const [selectedRating, setSelectedRating] = useState<number | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    // Check if screen is mobile size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Filter reviews based on selected rating
    const filteredReviews = selectedRating
        ? reviews.filter(review => review.rating === selectedRating)
        : reviews;

    // Calculate stats based on provided reviews prop instead of mockReviews
    const total = reviews.length;
    const ratingStats = ratingLevels.map(level => {
        const count = reviews.filter(r => r.rating === level).length;
        return { level, count, percent: total ? Math.round((count / total) * 100) : 0 };
    });

    return (
        <Row gutter={24} style={{ marginBottom: 32 }}>
            <Col xs={24}>
                <Card title="Tổng quan đánh giá" variant="borderless">
                    <div style={{ marginBottom: 24 }}>
                        <Text strong>Tổng số đánh giá: </Text>
                        <Tag color="blue" style={{ fontSize: 16 }}>{total}</Tag>
                        {selectedRating && (
                            <Button
                                size="small"
                                style={{ marginLeft: 16 }}
                                onClick={() => setSelectedRating(null)}
                            >
                                Hiển thị tất cả
                            </Button>
                        )}
                    </div>

                    {/* Horizontal rating overview */}
                    <Row
                        gutter={[8, 12]}
                        style={{ justifyContent: "center", display: "flex" }}
                    >
                        {ratingStats.map(stat => (
                            <Col
                                key={stat.level}
                                xs={12}
                                sm={8}
                                md={6}
                                lg={4}
                                xl={4}
                                style={{ display: 'flex', justifyContent: 'center' }}
                            >
                                <Card
                                    size="small"
                                    style={{
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        border: selectedRating === stat.level ? '2px solid #1890ff' : '1px solid #d9d9d9',
                                        backgroundColor: selectedRating === stat.level ? '#f0f8ff' : '#ffffff',
                                        width: '100%',
                                        maxWidth: isMobile ? 120 : 180,
                                        minWidth: isMobile ? 100 : 150,
                                        padding: isMobile ? '8px 4px' : '12px 8px'
                                    }}
                                    onClick={() => setSelectedRating(selectedRating === stat.level ? null : stat.level)}
                                    hoverable
                                >
                                    <Rate
                                        disabled
                                        value={stat.level}
                                        style={{
                                            fontSize: isMobile ? 12 : 16,
                                            marginBottom: isMobile ? 4 : 8
                                        }}
                                    />
                                    <div style={{
                                        fontSize: isMobile ? 18 : 24,
                                        fontWeight: 'bold',
                                        color: '#1890ff',
                                        marginBottom: isMobile ? 2 : 4
                                    }}>
                                        {stat.count}
                                    </div>
                                    <div style={{
                                        fontSize: isMobile ? 10 : 12,
                                        color: '#666',
                                        lineHeight: 1.2
                                    }}>
                                        {isMobile ? `${stat.percent}%` : `${stat.percent}% của tổng số`}
                                    </div>
                                    <Progress
                                        percent={stat.percent}
                                        size="small"
                                        style={{ marginTop: isMobile ? 4 : 8 }}
                                        showInfo={false}
                                        strokeColor="#1890ff"
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card>
            </Col>
            <Col xs={24}>
                <Card
                    title={
                        <div>
                            Danh sách đánh giá
                            {selectedRating && (
                                <Tag color="blue" style={{ marginLeft: 8 }}>
                                    {selectedRating} sao ({filteredReviews.length} đánh giá)
                                </Tag>
                            )}
                        </div>
                    }
                    variant="borderless"
                >
                    <Table
                        dataSource={filteredReviews}
                        columns={columns}
                        rowKey="id"
                        pagination={{ pageSize: 8 }}
                        bordered
                    />
                </Card>
            </Col>

        </Row>

    )
}