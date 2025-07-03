'use client';

import React, { useState } from 'react';
import { List, Avatar, Rate, Typography, Card, Pagination, Space, Tag, Empty } from 'antd';
import { UserOutlined, CalendarOutlined, MessageOutlined } from '@ant-design/icons';
import { Review } from "@/type/review";

const { Text, Paragraph } = Typography;

interface ReviewsProps {
    reviews: Review[];
}

export default function Reviews({ reviews }: ReviewsProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;
    // Safety check for reviews data
    const safeReviews = reviews || [];

    // Calculate pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentReviews = safeReviews.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (dateStr: string) => {
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', {
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

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return '#52c41a';
        if (rating >= 4.0) return '#faad14';
        if (rating >= 3.0) return '#fa8c16';
        return '#ff4d4f';
    };

    const getRatingText = (rating: number) => {
        if (rating >= 4.5) return 'Excellent';
        if (rating >= 4.0) return 'Very Good';
        if (rating >= 3.0) return 'Good';
        if (rating >= 2.0) return 'Fair';
        return 'Poor';
    };

    if (safeReviews.length === 0) {
        return (
            <Card style={{ marginTop: 12 }}>
                <Empty
                    description="No reviews available for this partner"
                    style={{ padding: '20px 10px' }}
                />
            </Card>
        );
    }

    return (
        <div style={{ marginTop: 12 }}>
            <Card
                title={
                    <Space size="small">
                        <MessageOutlined />
                        <span>Customer Reviews ({safeReviews.length})</span>
                    </Space>
                }
                style={{ borderRadius: 6 }}
                size="small"
            >
                <List
                    itemLayout="vertical"
                    dataSource={currentReviews}
                    size="small"
                    renderItem={(review: Review) => (
                        <List.Item
                            key={review.id}
                            style={{
                                padding: '12px',
                                marginBottom: '8px',
                                backgroundColor: '#fafafa',
                                borderRadius: '6px',
                                border: '1px solid #f0f0f0'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                                <Avatar
                                    size={36}
                                    icon={<UserOutlined />}
                                    style={{
                                        backgroundColor: '#1890ff',
                                        flexShrink: 0
                                    }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    {/* Header with rating and date */}
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        marginBottom: 6
                                    }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                                <Rate
                                                    disabled
                                                    value={review.rating}
                                                    style={{ fontSize: '14px' }}
                                                />
                                                <Text
                                                    strong
                                                    style={{
                                                        color: getRatingColor(review.rating),
                                                        fontSize: '14px'
                                                    }}
                                                >
                                                    {review.rating}/5
                                                </Text>
                                                <Tag
                                                    color={getRatingColor(review.rating)}
                                                    style={{ margin: 0, fontSize: '11px', padding: '2px 4px' }}
                                                >
                                                    {getRatingText(review.rating)}
                                                </Tag>
                                            </div>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: '11px' }}
                                                code
                                            >
                                                Customer ID: {review.userId}
                                            </Text>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                <CalendarOutlined style={{ color: '#888', fontSize: '11px' }} />
                                                <Text type="secondary" style={{ fontSize: '11px' }}>
                                                    {formatDate(review.createdAt)}
                                                </Text>
                                            </div>
                                            {review.updatedAt !== review.createdAt && (
                                                <Text type="secondary" style={{ fontSize: '10px' }}>
                                                    Updated: {formatDate(review.updatedAt)}
                                                </Text>
                                            )}
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    <Paragraph
                                        style={{
                                            marginBottom: 0,
                                            fontSize: '13px',
                                            lineHeight: '1.4',
                                            color: '#333'
                                        }}
                                        ellipsis={{
                                            rows: 2,
                                            expandable: true,
                                            symbol: 'Show more'
                                        }}
                                    >
                                        {review.comment}
                                    </Paragraph>

                                    {/* Review ID for admin reference */}
                                    <div style={{ marginTop: 6, paddingTop: 6, borderTop: '1px solid #e8e8e8' }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: '10px' }}
                                            code
                                        >
                                            Review ID: {review.id}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </List.Item>
                    )}
                />

                {/* Pagination */}
                {safeReviews.length > pageSize && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                        <Pagination
                            current={currentPage}
                            total={safeReviews.length}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            size="small"
                        />
                    </div>
                )}
            </Card>
        </div>
    );
}