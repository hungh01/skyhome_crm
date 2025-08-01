"use client";
import { useState, useEffect } from "react";
import { Card, Table, Typography, Input, Tag, Avatar, Space, Row, Col, DatePicker, Button, Modal } from "antd";
import dayjs from "dayjs";
import { SearchOutlined, PictureOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons";
import CreatePromotion from "./CreatePromotion";

const { Title } = Typography;

// Define the type for a promotion


import type { ColumnsType } from 'antd/es/table';
import { Coupon } from "@/type/promotion/coupon";
import { addCouponApi, couponListApi, updateCouponApi } from "@/api/promotion/coupons-api";
import { CouponListResponse } from "@/type/promotion/coupon-list-response";
import { notify } from "@/components/Notification";

export default function CouponList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [type, setType] = useState<string | undefined>(undefined);
    const [data, setData] = useState<CouponListResponse>();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Coupon | null>(null);

    const [dateRange, setDateRange] = useState<[string | null, string | null] | null>(null);

    const handleEditPromotion = (promotion: Coupon): void => {
        setEditingPromotion(promotion);
        setShowCreateModal(true);
    };

    const handleCloseModal = (): void => {
        setShowCreateModal(false);
        setEditingPromotion(null);
    };

    const columns: ColumnsType<Coupon> = [
        {
            title: <span style={{}}>STT</span>,
            dataIndex: "stt",
            key: "stt",
            width: 60,
            align: "center" as const,
            render: (_: unknown, __: Coupon, idx: number) => idx + 1,
        },
        {
            title: <span style={{}}>Mã Khuyến Mãi </span>,
            dataIndex: "code",
            key: "code",
            render: (code: string, record: Coupon) => (
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
                    {areas.map(area => <Tag key={area} style={{ fontWeight: 500 }}>{area}</Tag>)}
                </Space>
            ),
        },
        {
            title: <span style={{}}>Trạng Thái </span>,
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status: number) => <div style={{ fontWeight: 500 }}>
                {status === 0
                    ? <Tag color="#fbbd00">Sắp diễn ra</Tag>
                    : status === 1
                        ? <Tag color="#52c41a">Đang diễn ra</Tag>
                        : status === 2
                            ? <Tag color="#ff4d4f">Đã kết thúc</Tag>
                            : <Tag color="#fafafa">Không xác định</Tag>}
            </div>,
        },
        {
            title: <span style={{}}>Sử Dụng</span>,
            dataIndex: "maxUsage",
            key: "maxUsage",
            align: "center" as const,
            width: 80,
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
            render: (_: unknown, record: Coupon) => (
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

    useEffect(() => {
        const fetchData = async () => {
            const response = await couponListApi(page, 10, search, status || "", type || "", dateRange ? dateRange[0] as string : "", dateRange ? dateRange[1] as string : "");
            if (response) {
                console.log("Fetched data:", response);
                setData(response);
            }
        };
        fetchData();
    }, [page, search, status, type, dateRange]);


    async function handleSavePromotion(coupon: Coupon) {
        if (coupon._id) {
            // Update existing promotion
            const { _id, ...rest } = coupon;
            const updateData = await updateCouponApi(_id, rest);
            if (updateData && data) {
                setData({
                    ...data,
                    data: data.data.map(item => item._id === coupon._id ? { ...item, ...rest } : item)
                });
                if (!updateData) {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Cập nhật khuyến mãi thất bại, vui lòng thử lại!',
                    });
                }
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Cập nhật khuyến mãi thành công!',
                });
            }
        } else {
            // Create new promotion
            const newData = await addCouponApi(coupon);
            if (newData && data) {
                setData({
                    ...data,
                    data: [...data.data, newData],
                    pagination: {
                        ...data.pagination,
                        total: data.pagination.total + 1
                    }
                });
                if (!newData) {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Tạo khuyến mãi thất bại, vui lòng thử lại!',
                    });
                } else {
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Tạo khuyến mãi thành công!',
                    });
                }
            }
        }
    };

    console.log("CouponList data:", data);

    return (
        <div style={{ padding: 24 }}>
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <Row gutter={[16, 12]} align="middle" justify="space-between">
                    <Col xs={24} sm={12} md={8} style={{ textAlign: 'left' }}>
                        <Title level={2} style={{ margin: 0 }}>
                            Chương trình khuyến mãi
                        </Title>

                        <Button
                            type="primary"
                            style={{ marginTop: 8 }}
                            icon={<PlusOutlined />}
                            onClick={() => setShowCreateModal(true)}
                        >
                            Thêm mới
                        </Button>
                    </Col>
                    <Col xs={24} sm={12} md={16}>
                        <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Input
                                allowClear
                                prefix={<SearchOutlined />}
                                placeholder="Tìm kiếm theo mã khuyến mãi"
                                style={{ width: 200, borderRadius: 8 }}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <Input
                                allowClear
                                placeholder="Trạng thái"
                                style={{ width: 140 }}
                                value={status}
                                onChange={e => setStatus(e.target.value)}
                            />
                            <Input
                                allowClear
                                placeholder="Hình thức"
                                style={{ width: 120 }}
                                value={type}
                                onChange={e => setType(e.target.value)}
                            />
                            <DatePicker.RangePicker
                                allowClear
                                format="YYYY-MM-DD"
                                style={{ width: 240 }}
                                placeholder={["Ngày tạo từ", "Đến"]}
                                value={dateRange && (dateRange[0] || dateRange[1])
                                    ? [dateRange[0] ? dayjs(dateRange[0]) : null, dateRange[1] ? dayjs(dateRange[1]) : null]
                                    : null}
                                onChange={(dates, dateStrings) => {
                                    if (!dateStrings[0] && !dateStrings[1]) {
                                        setDateRange(null);
                                    } else {
                                        setDateRange([
                                            dateStrings[0] || null,
                                            dateStrings[1] || null
                                        ]);
                                    }
                                }}
                            />
                        </Space>
                    </Col>
                </Row>
            </Card>
            <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={data?.data || []}
                    bordered={false}
                    size="middle"
                    rowClassName={(_: Coupon, idx: number) => idx % 2 === 1 ? "ant-table-row-striped" : ""}
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

            <Modal
                title={editingPromotion ? "Chỉnh sửa chương trình khuyến mãi" : "Tạo chương trình khuyến mãi mới"}
                open={showCreateModal}
                onCancel={handleCloseModal}
                footer={null}
                width={1000}
                style={{ top: 20 }}
            >
                <CreatePromotion
                    handleCloseModal={handleCloseModal}
                    onSuccess={handleSavePromotion}
                    initialData={editingPromotion || undefined}
                />
            </Modal>
        </div>
    );
}