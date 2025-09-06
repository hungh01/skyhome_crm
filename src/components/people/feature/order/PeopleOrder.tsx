import React, { useState, useCallback, useMemo } from 'react';
import { DatePicker, Space, Pagination, Empty } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { Order } from '@/type/order/order';
import OrderedItem from './OrderedItem';
import OrderDetail from './OrderDetail';
import { Pagination as PaginationType } from '@/type/other/pagination';

interface PeopleOrderProps {
    orders: Order[];
    pagination: PaginationType;
    setPage: (page: number) => void;
    day: string;
    setDay: (day: string) => void;
}

// Constants for styling
const STYLES = {
    container: {
        padding: 24,
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 0 40px rgba(0,0,0,0.07)'
    },
    filterContainer: {
        marginBottom: 24,
        width: '100%'
    },
    filterItem: {
        flex: 1,
        minWidth: 200
    },
    orderItem: {
        cursor: 'pointer',
        transition: 'transform 0.2s ease',
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 24
    },
    emptyState: {
        padding: '40px 24px',
        textAlign: 'center' as const
    }
} as const;

// Filter component for better organization
const OrderFilters: React.FC<{
    day: string;
    setDay: (day: string) => void;
}> = ({ day, setDay }) => {
    const handleDateChange = useCallback((date: unknown) => {
        setDay(date ? (date as dayjs.Dayjs).format('YYYY-MM-DD') : '');
    }, [setDay]);

    return (
        <Space direction="horizontal" size={16} style={STYLES.filterContainer}>
            <DatePicker
                placeholder="Chọn ngày"
                style={STYLES.filterItem}
                onChange={handleDateChange}
                value={day ? dayjs(day) : null}
                prefix={<CalendarOutlined />}
                allowClear
            />
        </Space>
    );
};

// Order list component
const OrderList: React.FC<{
    orders: Order[];
    onOrderClick: (order: Order) => void;
}> = ({ orders, onOrderClick }) => {
    const handleOrderClick = useCallback((order: Order) => {
        onOrderClick(order);
    }, [onOrderClick]);

    return (
        <>
            {orders.map(order => (
                <div
                    key={order._id}
                    style={STYLES.orderItem}
                    onClick={() => handleOrderClick(order)}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <OrderedItem order={order} />
                </div>
            ))}
        </>
    );
};

// Pagination component
const OrderPagination: React.FC<{
    pagination: PaginationType;
    onPageChange: (page: number) => void;
}> = ({ pagination, onPageChange }) => (
    <div style={STYLES.paginationContainer}>
        <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onChange={onPageChange}
            showSizeChanger={false}
        />
    </div>
);

// Empty state component
const EmptyOrderState: React.FC = () => (
    <div style={STYLES.emptyState}>
        <Empty
            description="Không có đơn hàng nào"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
    </div>
);

export default function PeopleOrder({
    orders,
    pagination,
    setPage,
    day,
    setDay,
}: PeopleOrderProps) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    // Memoized handlers
    const handleOrderClick = useCallback((order: Order) => {
        setSelectedOrder(order);
        setDetailModalOpen(true);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setDetailModalOpen(false);
        setSelectedOrder(null);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setPage(page);
    }, [setPage]);

    // Memoized computed values
    const hasOrders = useMemo(() => orders && orders.length > 0, [orders]);

    return (
        <div style={STYLES.container}>
            {/* Order Detail Modal */}
            <OrderDetail
                open={detailModalOpen}
                onClose={handleCloseDetail}
                order={selectedOrder}
            />

            {/* Filters */}
            <OrderFilters
                day={day}
                setDay={setDay}
            />

            {/* Content */}
            {hasOrders ? (
                <>
                    <OrderList
                        orders={orders}
                        onOrderClick={handleOrderClick}
                    />
                    <OrderPagination
                        pagination={pagination}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <EmptyOrderState />
            )}
        </div>
    );
}