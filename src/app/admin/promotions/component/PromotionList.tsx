'use client';
import { Card, Table, Tag, Avatar, Space, Button } from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { PictureOutlined, EditOutlined } from "@ant-design/icons";

dayjs.extend(isBetween);

// Define the type for a promotion

import type { ColumnsType } from 'antd/es/table';

import { Promotion } from "@/type/promotion/promotion";

import { usePromotionList } from "../hooks/usePromotionList";
import { usePromotionContext } from "../provider/promotions-provider";

export default function PromotionList() {

    const { setPage, handleEditPromotion } = usePromotionContext();
    const { data, loading: listLoading } = usePromotionList();



    const columns: ColumnsType<Promotion> = [
        {
            title: <span style={{}}>STT</span>,
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: "center" as const,
            render: (_: unknown, __: Promotion, idx: number) => idx + 1,
        },
        {
            title: <span style={{}}>Mã Khuyến Mãi </span>,
            dataIndex: "code",
            key: "code",
            render: (code: string, record: Promotion) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{code}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>{record.description}</div>
                </div>
            ),
            width: 220,
        },
        {
            title: <span style={{}}>Ngày Tạo</span>,
            dataIndex: "createdAt",
            key: "createdAt",
            width: 140,
            render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: <span style={{}}>Hình Thức </span>,
            dataIndex: "promotionType",
            key: "promotionType",
            width: 90,
        },
        {
            title: <span style={{}}>Hình Ảnh <span style={{ fontSize: 14, marginLeft: 4 }}></span></span>,
            dataIndex: "imageUrl",
            key: "imageUrl",
            align: "center" as const,
            width: 80,
            render: (img: string | null) => img ? <Avatar shape="square" src={img} size={48} /> : <Avatar shape="square" icon={<PictureOutlined />} size={48} style={{ background: '#f5f5f5', color: '#aaa' }} />,
        },
        {
            title: <span style={{}}>Khu Vực </span>,
            dataIndex: "applicableAreas",
            key: "applicableAreas",
            width: 100,
            render: (areas: string[]) => (
                <Space>
                    {areas.length > 0 ? areas.map(area => <Tag key={area} style={{ fontWeight: 500 }}>{area}</Tag>) : <Tag style={{ fontWeight: 500 }}>Toàn quốc</Tag>}
                </Space>
            ),
        },
        {
            title: <span style={{}}>Trạng Thái </span>,
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (_: undefined, promotion: Promotion) => {
                const dateNow = dayjs();
                const startAt = promotion.startAt ? dayjs(promotion.startAt) : null;
                const endAt = promotion.endAt ? dayjs(promotion.endAt) : null;

                let status = 0; // 0: Không xác định, 1: Đang diễn ra, 2: Đã kết thúc, 3: Chưa bắt đầu

                if (startAt && endAt) {
                    if (dateNow.isBefore(startAt)) {
                        status = 0; // Chưa bắt đầu
                    } else if (dateNow.isBetween(startAt, endAt, null, '[]')) {
                        status = 1; // Đang diễn ra
                    } else if (dateNow.isAfter(endAt)) {
                        status = 2; // Đã kết thúc
                    }
                }

                return (
                    <div style={{ fontWeight: 500 }}>
                        {status === 1
                            ? <Tag color="#52c41a">Đang diễn ra</Tag>
                            : status === 2
                                ? <Tag color="#ff4d4f">Đã kết thúc</Tag>
                                : status === 0
                                    ? <Tag color="#1890ff">Chưa bắt đầu</Tag>
                                    : <Tag color="#fafafa">Không xác định</Tag>}
                    </div>
                )
            }
        },
        {
            title: <span>Sử Dụng</span>,
            dataIndex: "limitCount",
            align: "center" as const,
            width: 80,
            render: (_: unknown, promotion: Promotion) => {
                return (
                    <div style={{ fontWeight: 500 }}>
                        {promotion.countUse} / {promotion.limitCount ? promotion.limitCount : '∞'}
                    </div>
                )
            }
        },
        {
            title: <span style={{}}>Hẹn Bắt Đầu </span>,
            dataIndex: "startAt",
            key: "startAt",
            width: 140,
            render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: <span style={{}}>Hẹn Kết Thúc </span>,
            dataIndex: "endAt",
            key: "endAt",
            width: 140,
            render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: <span style={{}}>Thao tác</span>,
            key: "actions",
            width: 100,
            align: "center" as const,
            render: (_: unknown, record: Promotion) => (
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEditPromotion(record)}
                    size="small"
                >
                    Sửa
                </Button>
            ),
        },
    ];

    return (
        <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={data?.data || []}
                bordered={false}
                size="middle"
                loading={listLoading}
                rowClassName={(_: Promotion, idx: number) => idx % 2 === 1 ? "ant-table-row-striped" : ""}
                style={{ borderRadius: 12 }}
                pagination={{
                    pageSize: data?.pagination?.pageSize || 5,
                    current: data?.pagination?.page || 1,
                    total: data?.pagination?.total || 0,
                    position: ["bottomCenter"],
                    onChange: (page) => {
                        setPage(page);
                    }
                }}
            />
        </Card>
    );
}