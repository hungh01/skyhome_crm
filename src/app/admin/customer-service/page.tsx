"use client";
import { Card, Table, Typography, Progress, Row, Col, Space, Rate, Avatar, Tag } from "antd";
import { mockReviews } from "@/api/mock-reviews";
import { mockUsers } from "@/api/mock-userlist";
import { mockPartners } from "@/api/mock-partner";
import { User } from "@/type/user";
import { Partner } from "@/type/partner";

const { Title, Text } = Typography;

function getUser(userId: string): User | undefined {
    return mockUsers.find(u => u.id === userId);
}
function getPartner(partnerId: string): Partner | undefined {
    return mockPartners.find(p => p.id === partnerId);
}

const ratingLevels = [5, 4, 3, 2, 1];
const total = mockReviews.length;
const ratingStats = ratingLevels.map(level => {
    const count = mockReviews.filter(r => r.rating === level).length;
    return { level, count, percent: total ? Math.round((count / total) * 100) : 0 };
});

const columns = [
    {
        title: "Người đánh giá",
        dataIndex: "userId",
        key: "userId",
        render: (userId: string) => {
            const user = getUser(userId);
            return user ? (
                <Space>
                    <Avatar src={user.image} />
                    <span>{user.customerName}</span>
                </Space>
            ) : <Text type="secondary">N/A</Text>;
        }
    },
    {
        title: "Đối tác",
        dataIndex: "partnerId",
        key: "partnerId",
        render: (partnerId: string) => {
            const partner = getPartner(partnerId);
            return partner ? (
                <Space>
                    <Avatar src={partner.image} />
                    <span>{partner.name}</span>
                </Space>
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

export default function CustomerServicePage() {
    return (
        <div style={{ padding: 24 }}>
            <Title level={2} style={{ marginBottom: 16 }}>Quản lý đánh giá & xếp hạng</Title>
            <Row gutter={24} style={{ marginBottom: 32 }}>
                <Col xs={24} md={12} lg={8}>
                    <Card title="Tổng quan đánh giá" variant="borderless">
                        <div style={{ marginBottom: 16 }}>
                            <Text strong>Tổng số đánh giá: </Text>
                            <Tag color="blue" style={{ fontSize: 16 }}>{total}</Tag>
                        </div>
                        {ratingStats.map(stat => (
                            <div key={stat.level} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                                <Rate disabled value={stat.level} style={{ fontSize: 18 }} />
                                <span style={{ width: 40, textAlign: "right", marginLeft: 8 }}>{stat.count}</span>
                                <Progress percent={stat.percent} size="small" style={{ flex: 1, margin: "0 12px" }} showInfo={false} />
                                <span style={{ width: 40, textAlign: "right" }}>{stat.percent}%</span>
                            </div>
                        ))}
                    </Card>
                </Col>
                <Col xs={24} md={12} lg={16}>
                    <Card title="Danh sách đánh giá" variant="borderless">
                        <Table
                            dataSource={mockReviews}
                            columns={columns}
                            rowKey="id"
                            pagination={{ pageSize: 8 }}
                            bordered
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
}