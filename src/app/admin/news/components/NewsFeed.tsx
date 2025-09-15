"use client";
import { Table, Tag, Avatar, Space, Button, Switch, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";





import type { ColumnsType } from 'antd/es/table';

import { News } from "../type/news";
import { useNewsActions } from "../hooks/useNewsActions";
import { useNewsList } from "../hooks/useNewsList";



export default function NewsFeed() {
    const { handleToggleStatus, handleEditNews, handleDeleteNews } = useNewsActions();
    const { data } = useNewsList();


    const columns: ColumnsType<News> = [
        {
            title: <span style={{}}>STT</span>,
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: "center" as const,
            render: (_: unknown, __: News, idx: number) => idx + 1,
        },
        {
            title: <span style={{}}>Tiêu đề</span>,
            dataIndex: "title",
            key: "title",
            render: (title: string, record: News) => (
                <div>
                    <div style={{ fontWeight: 600, marginBottom: 4, color: '#1890ff' }}>
                        {title}
                    </div>
                    <div style={{ color: '#888', fontSize: 12 }}>
                        Tạo: {record.createdAt}
                    </div>
                </div>
            ),
            width: 250,
        },
        {
            title: <span style={{}}>Mô tả ngắn</span>,
            dataIndex: "description",
            key: "description",
            render: (description: string) => (
                <div style={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    color: '#666'
                }}>
                    {description}
                </div>
            ),
            width: 220,
        },
        {
            title: <span style={{}}>Link</span>,
            dataIndex: "link",
            key: "link",
            render: (link: string) => (
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: '#1890ff',
                        textDecoration: 'none',
                        fontSize: 12,
                        maxWidth: 150,
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {link}
                </a>
            ),
            width: 160,
        },
        {
            title: <span style={{}}>Loại</span>,
            dataIndex: "category",
            key: "category",
            width: 100,
            render: (category: string) => {
                let color = '#108ee9';
                switch (category) {
                    case 'promotion': color = '#f50'; break;
                    case 'news': color = '#87d068'; break;
                    case 'tips': color = '#2db7f5'; break;
                    case 'company': color = '#722ed1'; break;
                    default: color = '#108ee9';
                }
                return <Tag color={color}>{category}</Tag>;
            },
        },
        {
            title: <span style={{}}>Vị trí</span>,
            dataIndex: "position",
            key: "position",
            width: 80,
            align: "center" as const,
            render: (position: number) => (
                <span style={{
                    backgroundColor: '#f0f0f0',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 500
                }}>
                    {position}
                </span>
            ),
        },
        {
            title: <span style={{}}>Hình ảnh</span>,
            dataIndex: "image",
            key: "image",
            align: "center" as const,
            width: 100,
            render: (img: string) => (
                <Avatar
                    shape="square"
                    src={img}
                    size={48}
                    style={{ objectFit: 'cover' }}
                />
            ),
        },
        {
            title: <span style={{}}>Trạng thái</span>,
            dataIndex: "stautus",
            key: "status",
            width: 100,
            align: "center" as const,
            render: (status: boolean, record: News) => (
                <Switch
                    checked={status}
                    onChange={() => handleToggleStatus(record)}
                    size="small"
                />
            ),
        },
        {
            title: <span style={{}}>Thao tác</span>,
            key: "actions",
            width: 120,
            align: "center" as const,
            render: (_: unknown, record: News) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEditNews(record)}
                        size="small"
                        title="Chỉnh sửa"
                    />
                    <Popconfirm
                        title="Xóa tin tức"
                        description="Bạn có chắc chắn muốn xóa tin tức này?"
                        onConfirm={() => handleDeleteNews(record)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            size="small"
                            danger
                            title="Xóa"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={data.data}
                rowKey="id"
                bordered={false}
                size="middle"
                rowClassName={(_: News, idx: number) => idx % 2 === 1 ? "ant-table-row-striped" : ""}
                style={{ borderRadius: 12 }}
                pagination={{
                    pageSize: 10,
                    position: ["bottomCenter"],
                }}
            />
        </div>
    );
}