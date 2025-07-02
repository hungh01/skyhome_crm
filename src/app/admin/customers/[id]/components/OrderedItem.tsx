import { Card, Typography, Tag, Space, Avatar } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, CalendarOutlined, CreditCardOutlined } from '@ant-design/icons';
import { Order } from '@/app/type/order';

const { Title, Text } = Typography;

interface props {
    order: Order
}

export default function OrderedItem({ order }: props) {

    return (
        <Card
            style={{
                borderRadius: 12,
                border: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                margin: '8px 0'
            }}
            styles={{
                body: { padding: 16 }
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <Title level={5} style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>
                    {order.serviceName}
                </Title>
                <Tag color="green" style={{ borderRadius: 8, padding: '2px 8px', border: 'none', fontSize: 11 }}>
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
                            VN
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