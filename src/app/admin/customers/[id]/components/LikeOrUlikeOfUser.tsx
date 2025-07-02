import { mockFavoritePartners } from "@/app/api/mock-favorite-partner";
import { Card, Row, Col, Avatar, Rate, Tag, Typography, Space, Empty, Pagination, Segmented } from 'antd';
import { UserOutlined, HeartFilled, DislikeFilled, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { FavoritePartner } from '@/app/type/favorite-partner';
import { useState, useMemo } from 'react';
import FavoritePartnerDetail from "./detail-components/FavoritePartnerDetail";

const { Text, Title } = Typography;

interface UserOrderProps {
    userId: string;
}

const PAGE_SIZE = 8;

const getGenderIcon = (sex: string) =>
    sex.toLowerCase() === 'male'
        ? <ManOutlined style={{ color: '#1890ff' }} />
        : <WomanOutlined style={{ color: '#ff85c0' }} />;

const getGenderColor = (sex: string) =>
    sex.toLowerCase() === 'male' ? '#1890ff' : '#ff85c0';

export default function LikeOrUlikeOfUser({ userId }: UserOrderProps) {
    const [status, setStatus] = useState(true);
    const [selectedPartner, setSelectedPartner] = useState<FavoritePartner | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const userFavoritePartners = useMemo(
        () => mockFavoritePartners.filter(partner => partner.like === status),
        [status]
    );

    const currentPartners = useMemo(
        () => userFavoritePartners.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
        [userFavoritePartners, currentPage]
    );

    const handleDeletePartner = (partnerId: string) => {
        // Your delete logic here
        console.log('Deleting partner:', partnerId);
    };

    const handlePageChange = (page: number) => setCurrentPage(page);

    if (userFavoritePartners.length === 0) {
        return (
            <Empty
                description="No favorite partners found for this user"
                style={{ padding: '40px 20px' }}
            />
        );
    }

    return (
        <div style={{ padding: 16 }}>
            <FavoritePartnerDetail
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                partner={selectedPartner}
                onDelete={handleDeletePartner}
            />

            <div style={{ marginBottom: 20 }}>
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
                    onChange={value => {
                        setStatus(value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <Row gutter={[16, 16]}>
                {currentPartners.map(partner => (
                    <Col xs={24} sm={12} md={8} lg={6} key={partner.id}>
                        <Card
                            hoverable
                            styles={{ body: { padding: 16 } }}
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
                            <div style={{ textAlign: 'center', marginBottom: 12 }}>
                                <Avatar
                                    size={64}
                                    icon={<UserOutlined />}
                                    style={{
                                        backgroundColor: getGenderColor(partner.sex),
                                        marginBottom: 8
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                                    <Title level={5} style={{ margin: 0, fontSize: 16 }}>
                                        {partner.name}
                                    </Title>
                                    {partner.like
                                        ? <HeartFilled style={{ color: '#ff4d4f', fontSize: 16 }} />
                                        : <DislikeFilled style={{ color: '#8c8c8c', fontSize: 16 }} />
                                    }
                                </div>
                            </div>

                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Space>
                                        {getGenderIcon(partner.sex)}
                                        <Text style={{ fontSize: 13 }}>
                                            {partner.sex.charAt(0).toUpperCase() + partner.sex.slice(1)}
                                        </Text>
                                    </Space>
                                    <Text style={{ fontSize: 13, color: '#666' }}>
                                        Age: {partner.age}
                                    </Text>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Rate disabled defaultValue={partner.rate} style={{ fontSize: 14 }} />
                                    <Text strong style={{ fontSize: 14 }}>
                                        {partner.rate}
                                    </Text>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: 8 }}>
                                    <Tag
                                        color={partner.like ? 'success' : 'error'}
                                        icon={partner.like ? <HeartFilled /> : <DislikeFilled />}
                                        style={{ borderRadius: 16, padding: '4px 12px' }}
                                    >
                                        {partner.like ? 'Liked' : 'Disliked'}
                                    </Tag>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            {userFavoritePartners.length > PAGE_SIZE && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                    <Pagination
                        current={currentPage}
                        total={userFavoritePartners.length}
                        pageSize={PAGE_SIZE}
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
