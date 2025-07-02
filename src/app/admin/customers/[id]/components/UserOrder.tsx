import { useState, useMemo, useCallback } from "react";
import { DatePicker, Input, Space, Pagination, Select } from "antd";
import dayjs from "dayjs";
import { Order } from "@/app/type/order";
import OrderedItem from "./OrderedItem";
import { mockOrders } from "@/app/api/moc-orderlist";
import OrderDetail from "./detail-components/OrderDetail";
import { mockServices } from "@/app/api/mock-services";

interface UserOrderProps {
    userId: string;
}

const PAGE_SIZE = 3;

export default function UserOrder({ userId }: UserOrderProps) {
    const [filters, setFilters] = useState({
        day: "",
        service: "",
        location: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    const handleFilterChange = useCallback(
        (key: keyof typeof filters) => (value: string) => {
            setFilters(prev => ({ ...prev, [key]: value }));
            setCurrentPage(1);
        },
        []
    );

    const filteredOrders = useMemo(() => {
        return mockOrders.filter(order => {
            const matchDay = filters.day ? order.date === filters.day : true;
            const matchService = filters.service
                ? order.serviceName.toLowerCase().includes(filters.service.toLowerCase())
                : true;
            const matchLocation = filters.location
                ? order.address.toLowerCase().includes(filters.location.toLowerCase())
                : true;
            return matchDay && matchService && matchLocation;
        });
    }, [filters]);

    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * PAGE_SIZE;
        return filteredOrders.slice(startIndex, startIndex + PAGE_SIZE);
    }, [filteredOrders, currentPage]);

    return (
        <div style={{ padding: 24, background: "#fff", borderRadius: 16, boxShadow: "0 0 40px rgba(0,0,0,0.07)" }}>
            <OrderDetail
                open={detailModalOpen}
                onClose={() => setDetailModalOpen(false)}
                order={selectedOrder}
            />
            <Space direction="horizontal" size={16} style={{ marginBottom: 24, width: "100%" }}>
                <DatePicker
                    placeholder="Chọn ngày"
                    style={{ flex: 1 }}
                    onChange={date => handleFilterChange("day")(date ? date.format("YYYY-MM-DD") : "")}
                    value={filters.day ? dayjs(filters.day) : null}
                />
                <Select
                    placeholder="Tên dịch vụ"
                    style={{ flex: 1, minWidth: 200 }}
                    value={filters.service || undefined}
                    options={mockServices.map(service => ({
                        label: service.name,
                        value: service.name,
                    }))}
                    onChange={handleFilterChange("service")}
                    allowClear
                    showSearch={false}
                />
                <Input
                    placeholder="Địa chỉ"
                    style={{ flex: 1 }}
                    value={filters.location}
                    onChange={e => handleFilterChange("location")(e.target.value)}
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
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
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