import { useState, useMemo, useCallback } from "react";
import { DatePicker, Input, Space, Pagination } from "antd";
import dayjs from "dayjs";
import { Order } from "@/app/type/order";
import OrderedItem from "./OrderedItem";
import { mockOrders } from "@/app/api/moc-orderlist";
import OrderDetail from "./detail-components/OrderDetail";

interface UserOrderProps {
    userId: string;
}

const PAGE_SIZE = 3;

export default function UserOrder({ userId }: UserOrderProps) {
    const [selectedDay, setSelectedDay] = useState<string>("");
    const [selectedService, setSelectedService] = useState<string>("");
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const handleFilterChange = useCallback(
        (setter: (value: string) => void) => (value: string) => {
            setter(value);
            setCurrentPage(1);
        },
        []
    );

    const filteredOrders = useMemo(() => {
        return mockOrders.filter(order => {
            const matchDay = selectedDay ? order.date === selectedDay : true;
            const matchService = selectedService
                ? order.serviceName.toLowerCase().includes(selectedService.toLowerCase())
                : true;
            const matchLocation = selectedLocation
                ? order.address.toLowerCase().includes(selectedLocation.toLowerCase())
                : true;
            return matchDay && matchService && matchLocation;
        });
    }, [selectedDay, selectedService, selectedLocation]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredOrders, currentPage]);

    return (
        <div style={{ padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 0 40px rgba(0,0,0,0.07)' }}>
            <OrderDetail
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                order={selectedOrder}
            />
            <Space direction="horizontal" size={16} style={{ marginBottom: 24, width: '100%' }}>
                <DatePicker
                    placeholder="Chọn ngày"
                    style={{ flex: 1 }}
                    onChange={date => handleFilterChange(setSelectedDay)(date ? date.format('YYYY-MM-DD') : '')}
                    value={selectedDay ? dayjs(selectedDay) : null}
                />
                <Input
                    placeholder="Tên dịch vụ"
                    style={{ flex: 1 }}
                    value={selectedService}
                    onChange={e => handleFilterChange(setSelectedService)(e.target.value)}
                    allowClear
                />
                <Input
                    placeholder="Địa chỉ"
                    style={{ flex: 1 }}
                    value={selectedLocation}
                    onChange={e => handleFilterChange(setSelectedLocation)(e.target.value)}
                    allowClear
                />
            </Space>
            {paginatedOrders.length > 0 ? (
                <>
                    {paginatedOrders.map(order => (
                        <div
                            key={order.id}
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setSelectedOrder(order);
                                setDetailModalOpen(true);
                            }}
                        >
                            <OrderedItem order={order} />
                        </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                        <Pagination
                            current={currentPage}
                            total={filteredOrders.length}
                            pageSize={PAGE_SIZE}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                            showQuickJumper={false}
                        />
                    </div>
                </>
            ) : (
                <p>Không có đơn hàng nào cho người dùng này.</p>
            )}
        </div>
    );
}