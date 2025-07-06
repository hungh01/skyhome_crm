import { Avatar, Button, Card, Space, Table, Tag, Typography } from "antd";
import { useRouter } from "next/navigation";
import {
    UserOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { mockOrdersDashboard } from "@/api/dashboard/mock-ordersDashboard";

const { Text } = Typography;

const statusConfig = {
    'Hoàn thành': { color: 'success', icon: <CheckCircleOutlined /> },
    'Đang thực hiện': { color: 'processing', icon: <ClockCircleOutlined /> },
    'Đang chờ': { color: 'default', icon: <ClockCircleOutlined /> },
    'Đã hủy': { color: 'error', icon: <ClockCircleOutlined /> },
};

const orderColumns = [
    {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        render: (_: any, __: any, index: number) => index + 1,
    },
    {
        title: 'Mã đơn',
        dataIndex: 'id',
        key: 'id',
        render: (text: string) => <Text code>{text}</Text>,
    },
    {
        title: 'Thời gian',
        dataIndex: 'time',
        key: 'time',
        render: (time: string) => (
            <Text>{dayjs(time).format('HH:mm DD/MM/YYYY')}</Text>
        ),
    },
    {
        title: 'Khách hàng',
        dataIndex: 'userId',
        key: 'userId',
        render: (text: string) => (
            <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                {text}
            </Space>
        ),
    },
    {
        title: 'Dịch vụ',
        dataIndex: 'serviceName',
        key: 'serviceName',
    },
    {
        title: 'Thời gian làm việc',
        dataIndex: 'workingTime',
        key: 'workingTime',
        render: (workingTime: string) => (
            <Text>{dayjs(workingTime).format('HH:mm DD/MM/YYYY')}</Text>
        ),
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'address',
        key: 'address',
        render: (address: string) => (
            <Text>{address}</Text>
        ),
    },
    {
        title: 'CTV',
        dataIndex: 'ctv',
        key: 'ctv',
        render: (_: any, record: any) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar
                    size={50}
                    src={record.image}
                    icon={<UserOutlined />}
                    style={{
                        flexShrink: 0,
                        border: '2px solid #f0f0f0'
                    }}
                />
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
    },
    {
        title: 'Số tiền',
        dataIndex: 'price',
        key: 'price',
        render: (price: string) => (
            <Text strong style={{ color: '#52c41a' }}>
                {parseFloat(price).toLocaleString()} VND
            </Text>
        ),
    },
    {
        title: 'Trạng thái',
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
            />
        </Card>
    );
}