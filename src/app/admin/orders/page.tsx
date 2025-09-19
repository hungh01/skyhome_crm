'use client';

import { Card, Typography } from 'antd';

import OrderList from './components/order-list';
import Header from './components/header';
import { OrderProvider } from './provider/order-provider';

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
            <OrderProvider>
                {/* Header */}
                <Header />
                {/* Content */}
                <OrderList />
            </OrderProvider>
        </div>
    );
}