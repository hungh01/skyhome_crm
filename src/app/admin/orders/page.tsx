'use client';

import { Card, Typography } from 'antd';

import OrderList from './components/OrderList';

const { Title } = Typography;

export default function OrdersPage() {
    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <Title level={2} style={{ margin: 0 }}>
                    📦 Quản lý đơn hàng
                </Title>
                <Typography.Text type="secondary">
                    Quản lý và theo dõi tất cả các đơn hàng trong hệ thống
                </Typography.Text>
            </Card>

            {/* Content */}
            <OrderList />
        </div>
    );
}