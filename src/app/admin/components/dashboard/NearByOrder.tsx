'use client';
import { Button, Card, Table, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from "react";
import { recentOrdersApi } from "@/api/dashboard/dashboard-api";
import { Order } from "@/type/order/order";


const { Text } = Typography;

const statusConfig = {
    'done': { color: 'success', icon: <CheckCircleOutlined />, label: 'Hoàn thành' },
    'doing': { color: 'processing', icon: <ClockCircleOutlined />, label: 'Đang làm' },
    'confirm': { color: 'default', icon: <ClockCircleOutlined />, label: 'Chờ làm' },
    'pending': { color: 'processing', icon: <ClockCircleOutlined />, label: 'Đã nhận' },
    'cancel': { color: 'error', icon: <ClockCircleOutlined />, label: 'Đã hủy' },
};

const orderColumns: ColumnsType<Order> = [
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>STT</div>,
        dataIndex: 'index',
        key: 'index',
        render: (_: string, __: Order, index: number) => index + 1,
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Mã đơn</div>,
        dataIndex: 'idView',
        key: 'idView',
        render: (text: string) => <Text code>{text}</Text>,
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Thời gian</div>,
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
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Khách hàng</div>,
        dataIndex: 'customerName',
        render: (_: string, record: Order) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontWeight: 500,
                        fontSize: '14px',
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {record.customerName}
                    </div>
                    <div style={{
                        color: "#888",
                        fontSize: '12px',
                        marginBottom: 4
                    }}>
                        {record.customerPhone}
                    </div>
                </div>
            </div>
        ),
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Dịch vụ</div>,
        dataIndex: 'serviceName',
        key: 'serviceName',
        align: 'center',
        render: (_: string, record: Order) => (
            <div>
                <Text>
                    {record.serviceId ? record.serviceId.name : "Chưa xác định"}
                </Text>
                <Text style={{ display: 'block', color: '#888', fontSize: 11 }}>
                    {record.optionalService ? record.optionalService.map(item => item.name).join(', ') : "Không có dịch vụ"}
                </Text>
            </div>

        ),
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Thời gian <br /> làm việc</div>,
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
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Địa chỉ</div>,
        dataIndex: 'address',
        key: 'address',
        render: (address: string) => (
            <Text>{address}</Text>
        ),
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>CTV</div>,
        dataIndex: 'collaboratorName',
        render: (_: string, record: Order) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontWeight: 500,
                        fontSize: '14px',
                        marginBottom: 4,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {record.collaboratorName}
                    </div>
                    <div style={{
                        color: "#888",
                        fontSize: '12px',
                        marginBottom: 4
                    }}>
                        {record.collaboratorPhone}
                    </div>
                </div>
            </div>
        ),
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Số tiền (VNĐ)</div>,
        dataIndex: 'totalFee',
        key: 'totalFee',
        render: (totalFee: string, record: Order) => (
            <div>
                <Text type="secondary" style={{ fontSize: 11 }}>
                    {record.paymentMethod ? record.paymentMethod : "Chưa xác định"}
                </Text>
                <br />
                <Text strong style={{ color: '#52c41a' }}>
                    {parseFloat(totalFee).toLocaleString()}
                </Text>
                <br />
            </div>
        ),
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Trạng thái</div>,
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['confirm'];
            return (
                <Tag color={config.color} icon={config.icon}>
                    {config.label}
                </Tag>
            );
        },
        align: 'center',
    },
];

export default function NearByOrder() {
    const router = useRouter();
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                const res = await recentOrdersApi();
                const dataArray = 'data' in res && Array.isArray(res.data) ? res.data : [];
                if (Array.isArray(dataArray)) {
                    setRecentOrders(dataArray);
                } else {
                    setRecentOrders([]);
                }
            } catch (error) {
                console.error('Error fetching recent orders:', error);
            }
        };
        fetchRecentOrders();
    }, []);
    return (
        <Card title="Lịch sử đơn hàng"
            extra={
                <Button type="link"
                    onClick={() => router.push('/admin/orders')}
                >
                    Xem tất cả
                </Button>
            }
        >
            <Table
                rowKey="_id"
                columns={orderColumns}
                dataSource={recentOrders.slice(0, 5)}
                pagination={false}
                size="small"
                style={{
                    fontSize: '12px'
                }}
                className="small-font-table"
            />
            <style jsx>{`
                :global(.small-font-table .ant-table-tbody > tr > td),
                :global(.small-font-table .ant-table-thead > tr > th) {
                    font-size: 12px !important;
                }
                :global(.small-font-table .ant-typography) {
                    font-size: 12px !important;
                }
                :global(.small-font-table .ant-tag) {
                    font-size: 11px !important;
                }
            `}</style>
        </Card>
    );
}