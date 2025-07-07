import { Button, Card, Space, Table, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { mockOrdersDashboard } from "@/api/dashboard/mock-ordersDashboard";
import type { ColumnsType } from 'antd/es/table';
import { ListOrderDashboard } from "@/type/dashboard/listOrderDashboard";

const { Text } = Typography;



const statusConfig = {
    'Hoàn thành': { color: 'success', icon: <CheckCircleOutlined /> },
    'Đang thực hiện': { color: 'processing', icon: <ClockCircleOutlined /> },
    'Đang chờ': { color: 'default', icon: <ClockCircleOutlined /> },
    'Đã hủy': { color: 'error', icon: <ClockCircleOutlined /> },
};

const orderColumns: ColumnsType<ListOrderDashboard> = [
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>STT</div>,
        dataIndex: 'index',
        key: 'index',
        render: (_: string, __: ListOrderDashboard, index: number) => index + 1,
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Mã đơn</div>,
        dataIndex: 'id',
        key: 'id',
        render: (text: string) => <Text code>{text}</Text>,
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Thời gian</div>,
        dataIndex: 'time',
        key: 'time',
        render: (time: string) => (
            <Text>{dayjs(time).format('HH:mm DD/MM/YYYY')}</Text>
        ),
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Khách hàng</div>,
        dataIndex: 'userId',
        key: 'userId',
        render: (text: string) => (
            <Space>
                {text}
            </Space>
        ),
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Dịch vụ</div>,
        dataIndex: 'serviceName',
        key: 'serviceName',
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Thời gian <br /> làm việc</div>,
        dataIndex: 'workingTime',
        key: 'workingTime',
        render: (workingTime: string) => (
            <Text>{dayjs(workingTime).format('HH:mm DD/MM/YYYY')}</Text>
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
        dataIndex: 'ctv',
        key: 'ctv',
        render: (_: string, record: ListOrderDashboard) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* <Avatar
                    size={50}
                    src={record.image}
                    icon={<UserOutlined />}
                    style={{
                        flexShrink: 0,
                        border: '2px solid #f0f0f0'
                    }}
                /> */}
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
                        {record.phoneNumber}
                    </div>
                </div>
            </div>
        ),
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Số tiền (VNĐ)</div>,
        dataIndex: 'price',
        key: 'price',
        render: (price: string) => (
            <Text strong style={{ color: '#52c41a' }}>
                {parseFloat(price).toLocaleString()}
            </Text>
        ),
        align: 'center',
    },
    {
        title: <div style={{ textAlign: 'center', width: '100%' }}>Trạng thái</div>,
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
            const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Đang chờ'];
            return (
                <Tag color={config.color} icon={config.icon}>
                    {status}
                </Tag>
            );
        },
        align: 'center',
    },
];

export default function NearByOrder() {
    const router = useRouter();
    const recentOrders = mockOrdersDashboard;

    return (
        <Card title="Đơn hàng gần đây"
            extra={
                <Button type="link"
                    onClick={() => router.push('/admin/orders')}
                >
                    Xem tất cả
                </Button>
            }
        >
            <Table
                rowKey="id"
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