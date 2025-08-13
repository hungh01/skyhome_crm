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
import { FavoriteCollaborator } from '@/type/favorite-partner';
import Image from 'next/image';

const { Text, Title } = Typography;

interface FavoritecollaboratorDetailProps {
    open: boolean;
    onClose: () => void;
    collaborator: FavoriteCollaborator | null;
    onDelete?: (collaboratorId: string) => void;
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

function getLikeTag(collaborator: FavoriteCollaborator) {
    return (
        <Tag
            color={collaborator.liked ? 'success' : 'default'}
            icon={collaborator.liked ? <HeartFilled /> : <HeartOutlined />}
            style={{ fontSize: '14px', padding: '4px 12px', borderRadius: '16px' }}
        >
            {collaborator.liked ? 'Liked' : 'Not Liked'}
        </Tag>
    );
}

function getPreferenceStatus(collaborator: FavoriteCollaborator) {
    return (
        <Space direction="vertical" size="small">
            <Tag
                color={collaborator.liked ? 'success' : 'error'}
                icon={collaborator.liked ? <HeartFilled /> : <HeartOutlined />}
                style={{
                    fontSize: '14px',
                    padding: '6px 12px',
                    borderRadius: '6px'
                }}
            >
                {collaborator.liked ? 'LIKED' : 'NOT LIKED'}
            </Tag>
            <Text type="secondary" style={{ fontSize: '12px' }}>
                {collaborator.liked
                    ? 'This collaborator is in your favorites list'
                    : 'This collaborator is not in your favorites'}
            </Text>
        </Space>
    );
}

export default function FavoritecollaboratorDetail({
    open,
    onClose,
    collaborator,
    onDelete
}: FavoritecollaboratorDetailProps) {
    if (!collaborator) return null;

    const handleDelete = () => {
        if (onDelete) {
            onDelete(collaborator._id);
            message.success('collaborator removed from favorites successfully');
            onClose();
        }
    };

    return (
        <Modal
            title={
                <Space>
                    {collaborator.liked
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
                    title="Remove collaborator"
                    description="Are you sure you want to remove this collaborator from favorites?"
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
            {/* collaborator Avatar and Basic Info */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Avatar
                    size={100}
                    icon={collaborator.image ? <Image src={collaborator.image} alt={collaborator.collaboratorName} /> : <UserOutlined />}
                    style={{
                        backgroundColor: getGenderColor(collaborator.gender),
                        marginBottom: '16px',
                        border: '4px solid #fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                />
                <div>
                    <Title level={3} style={{ margin: '8px 0 4px 0' }}>
                        {collaborator.collaboratorName}
                    </Title>
                    <Space>
                        {getLikeTag(collaborator)}
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
                        text: collaborator._id,
                        onCopy: () => message.success('collaborator ID copied to clipboard')
                    }}>
                        {collaborator._id}
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
                        {collaborator.collaboratorName}
                    </Text>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            {getGenderIcon(collaborator.gender)}
                            Giới tính
                        </Space>
                    }
                >
                    <Tag
                        color={collaborator.gender.toLowerCase() === 'male' ? 'blue' : 'magenta'}
                        style={{ fontSize: '14px', padding: '4px 12px' }}
                    >
                        {collaborator.gender.charAt(0).toUpperCase() + collaborator.gender.slice(1)}
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
                        {collaborator.age}
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
                                value={collaborator.rate}
                                style={{ fontSize: '18px' }}
                            />
                            <Text
                                strong
                                style={{
                                    fontSize: '18px',
                                    color: getRatingColor(collaborator.rate),
                                    marginLeft: '8px'
                                }}
                            >
                                {collaborator.rate}/5.0
                            </Text>
                        </Space>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {getRatingText(collaborator.rate)}
                        </Text>
                    </Space>
                </Descriptions.Item>

                <Descriptions.Item
                    label={
                        <Space>
                            {collaborator.liked ? <HeartFilled /> : <HeartOutlined />}
                            Trạng thái đối tác
                        </Space>
                    }
                >
                    {getPreferenceStatus(collaborator)}
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
