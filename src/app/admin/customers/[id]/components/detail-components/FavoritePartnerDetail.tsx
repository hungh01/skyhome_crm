'use client';

import React from 'react';
import { Modal, Descriptions, Tag, Typography, Space, Button, message, Avatar, Rate, Popconfirm } from 'antd';
import {
    UserOutlined,
    HeartFilled,
    HeartOutlined,
    ManOutlined,
    WomanOutlined,
    StarOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { FavoritePartner } from '@/app/type/favorite-partner';

const { Text, Title } = Typography;

interface FavoritePartnerDetailProps {
    open: boolean;
    onClose: () => void;
    partner: FavoritePartner | null;
    onDelete?: (partnerId: string) => void;
}

const FavoritePartnerDetail: React.FC<FavoritePartnerDetailProps> = ({
    open,
    onClose,
    partner,
    onDelete
}) => {
    if (!partner) return null;

    const getGenderIcon = (sex: string) => {
        return sex.toLowerCase() === 'male' ?
            <ManOutlined style={{ color: '#1890ff' }} /> :
            <WomanOutlined style={{ color: '#ff85c0' }} />;
    };

    const getGenderColor = (sex: string) => {
        return sex.toLowerCase() === 'male' ? '#1890ff' : '#ff85c0';
    };

    const getRatingColor = (rate: number) => {
        if (rate >= 4.5) return '#52c41a';
        if (rate >= 4.0) return '#faad14';
        if (rate >= 3.5) return '#fa8c16';
        return '#ff4d4f';
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(partner.id);
            message.success('Partner removed from favorites successfully');
            onClose();
        }
    };

    return (
        <Modal
            title={
                <Space>
                    {partner.like ?
                        <HeartFilled style={{ color: '#ff4d4f' }} /> :
                        <HeartOutlined style={{ color: '#d9d9d9' }} />
                    }
                    <Title level={4} style={{ margin: 0 }}>
                        Partner Details
                    </Title>
                </Space>
            }
            open={open}
            onCancel={onClose}
            footer={[
                <Popconfirm
                    key="delete"
                    title="Remove Partner"
                    description="Are you sure you want to remove this partner from favorites?"
                    onConfirm={handleDelete}
                    okText="Yes, Remove"
                    cancelText="Cancel"
                    okType="danger"
                    icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                >
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        disabled={!onDelete}
                    >
                        Remove from Favorites
                    </Button>
                </Popconfirm>,
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
            width={600}
            styles={{
                body: { padding: '24px' }
            }}
        >
            {/* Partner Avatar and Basic Info */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Avatar
                    size={100}
                    icon={<UserOutlined />}
                    style={{
                        backgroundColor: getGenderColor(partner.sex),
                        marginBottom: '16px',
                        border: '4px solid #fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                />
                <div>
                    <Title level={3} style={{ margin: '8px 0 4px 0' }}>
                        {partner.name}
                    </Title>
                    <Space>
                        <Tag
                            color={partner.like ? 'success' : 'default'}
                            icon={partner.like ? <HeartFilled /> : <HeartOutlined />}
                            style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '16px' }}
                        >
                            {partner.like ? 'Liked' : 'Not Liked'}
                        </Tag>
                    </Space>
                </div>
            </div>

            <Descriptions
                bordered
                column={1}
                size="middle"
                styles={{
                    label: {
                        fontWeight: 600,
                        backgroundColor: '#fafafa',
                        width: '140px'
                    }
                }}
            >
                <Descriptions.Item
                    label={
                        <Space>
                            <UserOutlined />
                            Partner ID
                        </Space>
                    }
                >
                    <Text code copyable={{
                        text: partner.id,
                        onCopy: () => message.success('Partner ID copied to clipboard')
                    }}>
                        {partner.id}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <UserOutlined />
                            User ID
                        </Space>
                    }
                >
                    <Text code copyable={{
                        text: partner.userId,
                        onCopy: () => message.success('User ID copied to clipboard')
                    }}>
                        {partner.userId}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <UserOutlined />
                            Full Name
                        </Space>
                    }
                >
                    <Text strong style={{ fontSize: '16px' }}>
                        {partner.name}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            {getGenderIcon(partner.sex)}
                            Gender
                        </Space>
                    }
                >
                    <Space>
                        <Tag
                            color={partner.sex.toLowerCase() === 'male' ? 'blue' : 'magenta'}
                            style={{ fontSize: '14px', padding: '4px 12px' }}
                        >
                            {partner.sex.charAt(0).toUpperCase() + partner.sex.slice(1)}
                        </Tag>
                    </Space>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <CalendarOutlined />
                            Age
                        </Space>
                    }
                >
                    <Text style={{ fontSize: '16px' }}>
                        {partner.age} years old
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <StarOutlined />
                            Rating
                        </Space>
                    }
                >
                    <Space direction="vertical" size="small">
                        <Space>
                            <Rate
                                disabled
                                value={partner.rate}
                                style={{ fontSize: '18px' }}
                            />
                            <Text
                                strong
                                style={{
                                    fontSize: '18px',
                                    color: getRatingColor(partner.rate),
                                    marginLeft: '8px'
                                }}
                            >
                                {partner.rate}/5.0
                            </Text>
                        </Space>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {partner.rate >= 4.5 ? 'Excellent' :
                                partner.rate >= 4.0 ? 'Very Good' :
                                    partner.rate >= 3.5 ? 'Good' : 'Needs Improvement'}
                        </Text>
                    </Space>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            {partner.like ? <HeartFilled /> : <HeartOutlined />}
                            Preference Status
                        </Space>
                    }
                >
                    <Space direction="vertical" size="small">
                        <Tag
                            color={partner.like ? 'success' : 'error'}
                            icon={partner.like ? <HeartFilled /> : <HeartOutlined />}
                            style={{
                                fontSize: '14px',
                                padding: '6px 12px',
                                borderRadius: '6px'
                            }}
                        >
                            {partner.like ? 'LIKED' : 'NOT LIKED'}
                        </Tag>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {partner.like ?
                                'This partner is in your favorites list' :
                                'This partner is not in your favorites'
                            }
                        </Text>
                    </Space>
                </Descriptions.Item>
            </Descriptions>

            <div style={{
                marginTop: '24px',
                padding: '16px',
                backgroundColor: '#f6ffed',
                borderRadius: '8px',
                border: '1px solid #b7eb8f'
            }}>
                <Space>
                    <ExclamationCircleOutlined style={{ color: '#52c41a' }} />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        <strong>Note:</strong> Partner information is managed by the system.
                        Removing from favorites will not delete the partner's account.
                    </Text>
                </Space>
            </div>
        </Modal>
    );
};

export default FavoritePartnerDetail;
