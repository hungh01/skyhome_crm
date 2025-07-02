import { mockFavoritePartners } from "@/app/api/mock-favorite-partner";
import { Card, Row, Col, Avatar, Rate, Tag, Typography, Space, Empty, Pagination, Segmented } from 'antd';
import { UserOutlined, HeartFilled, HeartOutlined, ManOutlined, WomanOutlined, HeartTwoTone, DislikeFilled } from '@ant-design/icons';
import { FavoritePartner } from '@/app/type/favorite-partner';
import { useState } from 'react';
import FavoritePartnerDetail from "./detail-components/FavoritePartnerDetail";

const { Text, Title } = Typography;

interface UserOrderProps {
    userId: string;
}

export default function LikeOrUlikeOfUser({ userId }: UserOrderProps) {


    const [status, setStatus] = useState(true);

    const [selectedPartner, setSelectedPartner] = useState<FavoritePartner | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const handleDeletePartner = (partnerId: string) => {
        // Your delete logic here
        console.log('Deleting partner:', partnerId);
        // Update your data source
    };

    const userFavoritePartners = mockFavoritePartners
        .filter(partner => partner.like === status);
    //.filter(partner => partner.userId === userId);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8; // Show 8 partners per page (2 rows of 4)

    // Calculate pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentPartners = userFavoritePartners.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const getGenderIcon = (sex: string) => {
        return sex.toLowerCase() === 'male' ?
            <ManOutlined style={{ color: '#1890ff' }} /> :
            <WomanOutlined style={{ color: '#ff85c0' }} />;
    };

    const getGenderColor = (sex: string) => {
        return sex.toLowerCase() === 'male' ? '#1890ff' : '#ff85c0';
    };

    if (userFavoritePartners.length === 0) {
        return (
            <Empty
                description="No favorite partners found for this user"
                style={{ padding: '40px 20px' }}
            />
        );
    }

    return (
        <div style={{ padding: '16px' }}>
            <FavoritePartnerDetail
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                partner={selectedPartner}
                onDelete={handleDeletePartner}
            />
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
                <Segmented<boolean>
                    options={[
                        {
                            label: (
                                <Space>
                                    <HeartFilled style={{ color: '#ff4d4f' }} />
                                    Like
                                </Space>
                            ),
                            value: true
                        },
                        {
                            label: (
                                <Space>
                                    <DislikeFilled style={{ color: '#8c8c8c' }} />
                                    Dislike
                                </Space>
                            ),
                            value: false
                        }
                    ]}
                    value={status}
                    onChange={(value) => {
                        setStatus(value);
                        setCurrentPage(1); // Reset to first page when filter changes
                    }}
                />
            </div>

            <Row gutter={[16, 16]}>
                {currentPartners.map((partner: FavoritePartner) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={partner.id}>
                        <Card
                            hoverable
                            styles={{
                                body: { padding: '16px' }
                            }}
                            style={{
                                borderRadius: 12,
                                border: '1px solid #e8e8e8',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                height: '100%'
                            }}
                            onClick={() => {
                                setSelectedPartner(partner);
                                setDetailModalOpen(true);
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                                <Avatar
                                    size={64}
                                    icon={<UserOutlined />}
                                    style={{
                                        backgroundColor: getGenderColor(partner.sex),
                                        marginBottom: '8px'
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}>
                                    <Title level={5} style={{ margin: 0, fontSize: '16px' }}>
                                        {partner.name}
                                    </Title>
                                    {partner.like ?
                                        <HeartFilled style={{ color: '#ff4d4f', fontSize: '16px' }} /> :
                                        <DislikeFilled style={{ color: '#8c8c8c', fontSize: '16px' }} />
                                    }
                                </div>
                            </div>

                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Space>
                                        {getGenderIcon(partner.sex)}
                                        <Text style={{ fontSize: '13px' }}>
                                            {partner.sex.charAt(0).toUpperCase() + partner.sex.slice(1)}
                                        </Text>
                                    </Space>
                                    <Text style={{ fontSize: '13px', color: '#666' }}>
                                        Age: {partner.age}
                                    </Text>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Rate
                                        disabled
                                        defaultValue={partner.rate}
                                        style={{ fontSize: '14px' }}
                                    />
                                    <Text strong style={{ fontSize: '14px' }}>
                                        {partner.rate}
                                    </Text>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                                    <Tag
                                        color={partner.like ? 'success' : 'error'}
                                        icon={partner.like ? <HeartFilled /> : <DislikeFilled />}
                                        style={{ borderRadius: '16px', padding: '4px 12px' }}
                                    >
                                        {partner.like ? 'Liked' : 'Disliked'}
                                    </Tag>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            {userFavoritePartners.length > pageSize && (
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Pagination
                        current={currentPage}
                        total={userFavoritePartners.length}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showSizeChanger={false}


                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    />
                </div>
            )}
        </div>
    );
}