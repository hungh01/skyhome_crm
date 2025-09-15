"use client";
import { Table, Tag, Avatar, Button, Switch } from "antd";
import { EditOutlined } from "@ant-design/icons";




import type { ColumnsType } from 'antd/es/table';

import { useBannerContext } from "../provider/banner-provider";
import { Banner } from "@/app/admin/banners/type/banner";
import { bannerTypes } from "../constants/banner-filter";
import { useBannerList } from "../hooks/useBannerList";

export default function BannerList() {

    const {
        handleEditBanner
    } = useBannerContext();

    const { data, loading } = useBannerList();

    const columns: ColumnsType<Banner> = [
        {
            title: <span style={{}}>STT</span>,
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: "center" as const,
            render: (_: unknown, __: Banner, idx: number) => idx + 1,
        },
        {
            title: <span style={{}}>Tên</span>,
            dataIndex: "name",
            key: "name",
            render: (name: string) => (
                <div style={{ fontWeight: 600 }}>{name}</div>
            ),
            width: 280,
        },
        {
            title: <span style={{}}>Loại banner</span>,
            dataIndex: "type",
            key: "type",
            width: 120,
            render: (type: string) => {

                const typeInfo = bannerTypes.find(t => t.value === type);
                let color = '#108ee9';
                if (typeInfo) color = typeInfo.color;
                return <Tag color={color}>{typeInfo?.label}</Tag>;
            },
        },
        {
            title: <span style={{}}>Vị trí</span>,
            dataIndex: "position",
            key: "position",
            width: 80,
            align: "center" as const,
            render: (position: string) => (
                <span style={{
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px',
                    display: 'inline',
                    padding: '2px 8px',
                    fontSize: 12,
                    whiteSpace: 'nowrap'
                }}>
                    {position}
                </span>
            ),
        },
        {
            title: <span style={{}}>Link ID</span>,
            dataIndex: "linkId",
            key: "linkId",
            width: 200,
            render: (linkId: string | null, record: Banner) => (
                <div style={{ fontSize: 12, color: '#666' }}>
                    {linkId || record.imageUrl || '-'}
                </div>
            ),
        },
        {
            title: <span style={{}}>Hình ảnh</span>,
            dataIndex: "url",
            key: "url",
            align: "center" as const,
            width: 120,
            render: (url: string) => (
                <Avatar
                    shape="square"
                    src={url}
                    size={64}
                    style={{ objectFit: 'cover' }}
                />
            ),
        },
        {
            title: <span style={{}}>Thời gian đăng bài</span>,
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (createdAt: string) => (
                <div style={{ fontSize: 12, color: '#666' }}>
                    {createdAt}
                </div>
            ),
        },
        {
            title: <span style={{}}>Trạng thái</span>,
            dataIndex: "status",
            key: "status",
            width: 100,
            align: "center" as const,
            render: (status: boolean) => (
                <Switch
                    checked={status}
                    size="small"
                />
            ),
        },
        {
            title: <span style={{}}>Thao tác</span>,
            key: "actions",
            width: 100,
            align: "center" as const,
            render: (_: unknown, record: Banner) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEditBanner(record)}
                    size="small"
                >
                    Sửa
                </Button>
            ),
        },
    ];


    return (
        <Table
            columns={columns}
            dataSource={Array.isArray(data?.data) ? data.data : []}
            loading={loading}
            rowKey="_id"
            bordered={false}
            size="middle"
            rowClassName={(_: Banner, idx: number) => idx % 2 === 1 ? "ant-table-row-striped" : ""}
            style={{ borderRadius: 12 }}
            pagination={{
                current: data?.pagination?.page || 1,
                pageSize: data?.pagination?.pageSize || 10,
                total: data?.pagination?.total || 0,
                position: ["bottomCenter"],
            }}
        />
    );
}
