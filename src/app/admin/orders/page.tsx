'use client';

import { Card, Typography } from 'antd';

import OrderList from './components/OrderList';

const { Title } = Typography;

export default function OrdersPage() {
    return (
        <div style={{
            padding: 24,
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            boxSizing: 'border-box'
        }}>
            {/* Header */}
            <Card style={{
                marginBottom: 16,
                borderRadius: 12,
                width: '100%',
                maxWidth: '100%',
                boxSizing: 'border-box'
            }}>
                <Title level={2} style={{ margin: 0 }}>
                    Quản lý đơn hàng
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