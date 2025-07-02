'use client';

import React from 'react';
import {
    Modal,
    Descriptions,
    Tag,
    Typography,
    Space,
    Button,
    message,
    Avatar,
    Rate,
    Popconfirm
} from 'antd';
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

function getGenderIcon(sex: string) {
    return sex.toLowerCase() === 'male'
        ? <ManOutlined style={{ color: '#1890ff' }} />
        : <WomanOutlined style={{ color: '#ff85c0' }} />;
}

function getGenderColor(sex: string) {
    return sex.toLowerCase() === 'male' ? '#1890ff' : '#ff85c0';
}

function getRatingColor(rate: number) {
    if (rate >= 4.5) return '#52c41a';
    if (rate >= 4.0) return '#faad14';
    if (rate >= 3.5) return '#fa8c16';
    return '#ff4d4f';
}

function getRatingText(rate: number) {
    if (rate >= 4.5) return 'Excellent';
    if (rate >= 4.0) return 'Very Good';
    if (rate >= 3.5) return 'Good';
    return 'Needs Improvement';
}

function getLikeTag(partner: FavoritePartner) {
    return (
        <Tag
            color={partner.like ? 'success' : 'default'}
            icon={partner.like ? <HeartFilled /> : <HeartOutlined />}
            style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '16px' }}
        >
            {partner.like ? 'Liked' : 'Not Liked'}
        </Tag>
    );
}

function getPreferenceStatus(partner: FavoritePartner) {
    return (
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
                {partner.like
                    ? 'This partner is in your favorites list'
                    : 'This partner is not in your favorites'}
            </Text>
        </Space>
    );
}

export default function FavoritePartnerDetail({
    open,
    onClose,
    partner,
    onDelete
}: FavoritePartnerDetailProps) {
    if (!partner) return null;

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
                    {partner.like
                        ? <HeartFilled style={{ color: '#ff4d4f' }} />
                        : <HeartOutlined style={{ color: '#d9d9d9' }} />}
                    <Title level={4} style={{ margin: 0 }}>
                        Chi tiết đối tác
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
                        Xoá khỏi danh sách
                    </Button>
                </Popconfirm>,
                <Button key="close" onClick={onClose}>
                    Đóng
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
                        {getLikeTag(partner)}
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
                            Mã đối tác
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
                            Mã khách hàng
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
                            Họ và tên đối tác
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
                            Giới tính
                        </Space>
                    }
                >
                    <Tag
                        color={partner.sex.toLowerCase() === 'male' ? 'blue' : 'magenta'}
                        style={{ fontSize: '14px', padding: '4px 12px' }}
                    >
                        {partner.sex.charAt(0).toUpperCase() + partner.sex.slice(1)}
                    </Tag>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <CalendarOutlined />
                            Tuổi
                        </Space>
                    }
                >
                    <Text style={{ fontSize: '16px' }}>
                        {partner.age}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            <StarOutlined />
                            Đánh giá
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
                            {getRatingText(partner.rate)}
                        </Text>
                    </Space>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            {partner.like ? <HeartFilled /> : <HeartOutlined />}
                            Trạng thái đối tác
                        </Space>
                    }
                >
                    {getPreferenceStatus(partner)}
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
                        <strong>Note:</strong> Thông tin đối tác được quản lý bởi hệ thống.
                        Xóa khỏi mục yêu thích sẽ không xóa tài khoản của đối tác.
                    </Text>
                </Space>
            </div>
        </Modal>
    );
}
