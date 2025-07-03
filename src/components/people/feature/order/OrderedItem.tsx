import { Card, Typography, Tag, Space, Avatar } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import { Order } from '@/type/order';

const { Title, Text } = Typography;

interface props {
    order: Order
}

export default function OrderedItem({ order }: props) {
    const getBackgroundByStatus = (status: string) => {
        switch (status) {
            case "Đang chờ làm":
                return "linear-gradient(to top left, #FFF8E1, #ffffff)";
            case "Đang làm":
                return "linear-gradient(to top left, #E3F2FD, #ffffff)";
            case "Hoàn thành":
                return "linear-gradient(to top left, #E8F5E9, #ffffff)";
            case "Đã hủy":
                return "linear-gradient(to top left, #FFEBEE, #ffffff)";
            default:
                return "linear-gradient(to top left, #f5f5f5, #ffffff)";
        }
    };

    const getBackgroundStatus = (status: string) => {
        switch (status) {
            case "Đang chờ làm":
                return "#FFB300";
            case "Đang làm":
                return "#2196F3";
            case "Hoàn thành":
                return "#43A047";
            case "Đã hủy":
                return "#E53935";
            default:
                return "#ffffff";
        }
    };

    return (
        <Card
            style={{
                borderRadius: 12,
                border: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                margin: '8px 0',
                background: getBackgroundByStatus(order.status)
            }}
            styles={{
                body: { padding: 16 }
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                    {order.serviceName}
                </Title>
                <Tag color={getBackgroundStatus(order.status)} style={{ borderRadius: 8, padding: '2px 8px', border: 'none', fontSize: 11 }}>
                    {order.status}
                </Tag>
            </div>

            <Space direction="vertical" size={8} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <EnvironmentOutlined style={{ color: '#faad14', fontSize: 14, marginRight: 6 }} />
                    <Text style={{ color: '#666', fontSize: 12 }}>{order.address}</Text>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ClockCircleOutlined style={{ color: '#faad14', fontSize: 14, marginRight: 6 }} />
                        <Text style={{ color: '#666', fontSize: 12 }}>{order.time}</Text>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            style={{
                                backgroundColor: '#1890ff',
                                marginRight: 6,
                                width: 20,
                                height: 20,
                                fontSize: 10
                            }}
                        >
                            $
                        </Avatar>
                        <Text style={{ color: '#666', fontWeight: 500, fontSize: 12 }}>{order.paymentMethod}</Text>
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarOutlined style={{ color: '#faad14', fontSize: 14, marginRight: 6 }} />
                        <Text style={{ color: '#666', fontSize: 12 }}>{order.date}</Text>
                    </div>
                    <Title level={5} style={{ margin: 0, color: '#faad14', fontWeight: 600, fontSize: 16 }}>
                        {order.price}
                    </Title>
                </div>
            </Space>
        </Card>
    );
}
