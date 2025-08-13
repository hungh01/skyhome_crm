
import { Card, Row, Col, Avatar, Rate, Tag, Typography, Space, Empty, Pagination, Segmented } from 'antd';
import { UserOutlined, HeartFilled, DislikeFilled, ManOutlined, WomanOutlined } from '@ant-design/icons';
import { FavoriteCollaborator } from '@/type/favorite-partner';

import FavoritePartnerDetail from "./detail-components/FavoritePartnerDetail";

import { DetailResponse } from '@/type/detailResponse/detailResponse';
import { useState } from 'react';
import Image from 'next/image';

const { Text, Title } = Typography;

interface props {
    userFavoriteCollaborators: DetailResponse<FavoriteCollaborator[]>;
    page: number;
    setPage: (page: number) => void;
    status: 'liked' | 'disliked';
    setStatus: (status: 'liked' | 'disliked') => void;
}

const PAGE_SIZE = 8;

const getGenderIcon = (sex: string) =>
    sex.toLowerCase() === 'male'
        ? <ManOutlined style={{ color: '#1890ff' }} />
        : <WomanOutlined style={{ color: '#ff85c0' }} />;

const getGenderColor = (sex: string) =>
    sex.toLowerCase() === 'male' ? '#1890ff' : '#ff85c0';

export default function LikeOrUlikeOfUser({ userFavoriteCollaborators, page, setPage, status, setStatus }: props) {
    const [selectedCollaborator, setSelectedCollaborator] = useState<FavoriteCollaborator | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const handlePageChange = (page: number) => setPage(page);

    if (userFavoriteCollaborators.data.length === 0) {
        return (
            <Empty
                description="No favorite collaborators found for this user"
                style={{ padding: '40px 20px' }}
            />
        );
    }

    const handleDeleteFavoriteCollaborator = async () => {
        // const result = await deleteFavoriteCollaboratorApi(customerId, collaboratorId);
        // if (result.success) {
        //     setPage(1);
        //     setSelectedCollaborator(null);
        // }
    }

    return (
        <div style={{ padding: 16 }}>
            <FavoritePartnerDetail
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                collaborator={selectedCollaborator}
                onDelete={handleDeleteFavoriteCollaborator}
            />

            <div style={{ marginBottom: 20 }}>
                <Segmented<'liked' | 'disliked'>
                    options={[
                        {
                            label: (
                                <Space>
                                    <HeartFilled style={{ color: '#ff4d4f' }} />
                                    Like
                                </Space>
                            ),
                            value: 'liked'
                        },
                        {
                            label: (
                                <Space>
                                    <DislikeFilled style={{ color: '#8c8c8c' }} />
                                    Dislike
                                </Space>
                            ),
                            value: 'disliked'
                        }
                    ]}
                    value={status}
                    onChange={value => {
                        setStatus(value);
                        setPage(1);
                    }}
                />
            </div>

            <Row gutter={[16, 16]}>
                {userFavoriteCollaborators.data.map(collaborator => (
                    <Col xs={24} sm={12} md={8} lg={6} key={collaborator._id}>
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
                                setSelectedCollaborator(collaborator);
                                setDetailModalOpen(true);
                            }}
                        >
                            <div style={{ textAlign: 'center', marginBottom: 12 }}>
                                <Avatar
                                    size={64}
                                    icon={collaborator.image ? <Image src={collaborator.image} alt={collaborator.collaboratorName} /> : <UserOutlined />}
                                    style={{
                                        backgroundColor: getGenderColor(collaborator.gender),
                                        marginBottom: 8
                                    }}
                                />
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                                    <Title level={5} style={{ margin: 0, fontSize: 16 }}>
                                        {collaborator.collaboratorName}
                                    </Title>
                                    {collaborator.liked
                                        ? <HeartFilled style={{ color: '#ff4d4f', fontSize: 16 }} />
                                        : <DislikeFilled style={{ color: '#8c8c8c', fontSize: 16 }} />
                                    }
                                </div>
                            </div>

                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Space>
                                        {getGenderIcon(collaborator.gender)}
                                        <Text style={{ fontSize: 13 }}>
                                            {collaborator.gender.charAt(0).toUpperCase() + collaborator.gender.slice(1)}
                                        </Text>
                                    </Space>
                                    <Text style={{ fontSize: 13, color: '#666' }}>
                                        Age: {collaborator.age}
                                    </Text>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Rate disabled defaultValue={collaborator.rate} style={{ fontSize: 14 }} />
                                    <Text strong style={{ fontSize: 14 }}>
                                        {collaborator.rate}
                                    </Text>
                                </div>

                                <div style={{ textAlign: 'center', marginTop: 8 }}>
                                    <Tag
                                        color={collaborator.liked ? 'success' : 'error'}
                                        icon={collaborator.liked ? <HeartFilled /> : <DislikeFilled />}
                                        style={{ borderRadius: 16, padding: '4px 12px' }}
                                    >
                                        {collaborator.liked ? 'Liked' : 'Disliked'}
                                    </Tag>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <Pagination
                    current={page}
                    total={userFavoriteCollaborators.pagination?.total}
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

        </div>
    );
}
