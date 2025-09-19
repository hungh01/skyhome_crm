
import { Button, Card, DatePicker, Dropdown, Input, Select, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { debounce } from 'lodash';
import { useCallback } from "react";

import { EllipsisOutlined, EyeOutlined, StopOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { RangePicker } = DatePicker;

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from "react";
import NotificationModal from "@/components/Modal";
import { getOrders } from "@/api/order/order-api";
import { isDetailResponse } from "@/utils/response-handler";
import { Order } from "@/type/order/order";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ErrorResponse } from "@/type/error";
import { getStatusText } from "@/common/status/order-status";
import { useOrderList } from "../hooks/use-order-list";
import { useOrderContext } from "../provider/order-provider";

const statusConfig = {
    'done': { color: 'success', icon: <CheckCircleOutlined /> },
    'doing': { color: 'processing', icon: <ClockCircleOutlined /> },
    'confirm': { color: 'default', icon: <ClockCircleOutlined /> },
    'pending': { color: 'processing', icon: <ClockCircleOutlined /> }, // đổi icon thành ClockCircleOutlined
    'cancel': { color: 'error', icon: <ClockCircleOutlined /> },
};

function orderColumns(
    router: ReturnType<typeof useRouter>,
): ColumnsType<Order> {
    return [
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>STT</div>,
            dataIndex: 'index',
            key: 'index',
            render: (_: string, __: Order, index: number) => index + 1,
            align: 'center',
            width: 50,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Mã đơn</div>,
            dataIndex: 'idView',
            key: 'idView',
            render: (text: string) => <Text code>{text}</Text>,
            align: 'center',
            width: 150,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Ngày tạo</div>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (time: string) => (
                <Text>
                    {dayjs(time).format('HH:mm')}
                    <br />
                    {dayjs(time).format('DD/MM/YYYY')}
                </Text>
            ),
            align: 'center',
            width: 100,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Khách hàng</div>,
            dataIndex: 'customerName',
            render: (text: string, record: Order) => (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        fontWeight: 500,
                        fontSize: '11px',
                        marginBottom: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {record.customerName}
                    </div>
                    <div style={{
                        color: "#888",
                        fontSize: '10px',
                        marginBottom: 2
                    }}>
                        {record.customerPhone}
                    </div>
                </div>
            ),
            align: 'center',
            width: 120,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Dịch vụ</div>,
            key: 'serviceName',
            align: 'center',
            width: 140,
            // ellipsis: true,
            render: (record: Order) => (
                <div>
                    <Text strong>
                        {record?.serviceId?.name || ''} ({record?.serviceId.categoryId?.name || ''})
                    </Text>
                </div>
            )
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Ngày làm</div>,
            dataIndex: 'dateWork',
            key: 'dateWork',
            render: (dateWork: string) => (
                <Text>
                    {dayjs(dateWork).format('HH:mm')}
                    <br />
                    {dayjs(dateWork).format('DD/MM/YYYY')}
                </Text>
            ),
            align: 'center',
            width: 100,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Địa chỉ</div>,
            dataIndex: 'address',
            key: 'address',
            render: (address: string) => (
                <Text>{address}</Text>
            ),
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>CTV</div>,
            dataIndex: 'ctv',
            key: 'ctv',
            render: (_: string, record: Order) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontWeight: 500,
                            fontSize: '11px',
                            marginBottom: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {record.collaboratorName}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '10px',
                            marginBottom: 2
                        }}>
                            {record.collaboratorPhone}
                        </div>
                    </div>
                </div>
            ),
            align: 'center',
            width: 110,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Số tiền</div>,
            dataIndex: 'finalFee',
            key: 'finalFee',
            render: (finalFee: string, record: Order) => (
                <div>
                    <Text strong style={{ color: '#52c41a', fontSize: '11px' }}>
                        {parseFloat(finalFee).toLocaleString()}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '10px', color: '#888' }}>
                        by {record.paymentMethod}
                    </Text>
                </div>
            ),
            align: 'center',
            width: 100,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Trạng thái</div>,
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending'];
                return (
                    <Tag color={config.color} icon={config.icon} style={{ fontSize: '10px' }}>
                        {getStatusText(status)}
                    </Tag>
                );
            },
            align: 'center',
            width: 100,
        },
        {
            title: "Hành động",
            key: "action",
            width: 70,
            render: (_: unknown, record: Order) => {
                const items = [
                    {
                        key: 'detail',
                        label: 'Chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => {
                            router.push(`/admin/orders/${record._id}`);
                        }
                    },
                ];
                return (
                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={<EllipsisOutlined />}
                            style={{
                                border: 'none',
                                boxShadow: 'none'
                            }}
                        />
                    </Dropdown>
                );
            },
        }
    ];
}

export default function OrderList() {
    const router = useRouter();
    const { setPage } = useOrderContext();
    const { data, loading } = useOrderList();

    return (
        <div style={{
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Navigation Bar with Search Filters - Single Row */}
            {/* Table */}
            <Card style={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
                {/* <NotificationModal open={open} setOpen={setOpen} message={message} onOk={handleOk} /> */}
                <div style={{
                    width: '100%',
                    overflowX: 'auto'
                }}>
                    <Table
                        dataSource={isDetailResponse(data) ? data.data : []}
                        columns={
                            orderColumns(
                                router,
                            )}
                        rowKey="_id"
                        size="small"
                        className="small-font-table"
                        loading={loading}
                        pagination={{
                            current: isDetailResponse(data) ? data.pagination?.page : 1,
                            pageSize: isDetailResponse(data) ? data.pagination?.pageSize : 10,
                            total: isDetailResponse(data) ? data.pagination?.total : 0,
                            onChange: (page) => setPage(page),
                            position: ['bottomCenter'],
                        }}
                        scroll={{ x: 1200 }}
                        style={{
                            width: '100%',
                            minWidth: '1200px'
                        }}
                    />
                </div>
            </Card>
        </div>

    );
}