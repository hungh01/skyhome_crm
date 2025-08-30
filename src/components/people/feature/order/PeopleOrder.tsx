import { useState } from "react";
import { DatePicker, Input, Space, Pagination as AntPagination, Select } from "antd";
import dayjs from "dayjs";
import { Order } from "@/type/order";
import OrderedItem from "./OrderedItem";
import OrderDetail from "./OrderDetail";
import { Pagination as PaginationType } from "@/type/other/pagination";

interface UserOrderProps {
    orders: Order[];
    pagination: PaginationType;
    setPage: (page: number) => void;
    day: string;
    setDay: (day: string) => void;
    service: string;
    setService: (service: string) => void;
    location: string;
    setLocation: (location: string) => void;
}


export default function PeopleOrder({ orders, pagination, setPage, day, setDay, service, setService, location, setLocation }: UserOrderProps) {

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    if (!orders || orders.length === 0) {
        return <div style={{ padding: 24, background: "#fff", borderRadius: 16, boxShadow: "0 0 40px rgba(0,0,0,0.07)" }}>Không có đơn hàng nào.</div>;
    }


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
                    onChange={date => setDay(date ? date.format("YYYY-MM-DD") : "")}
                    value={day ? dayjs(day) : null}
                />
                <Select
                    placeholder="Tên dịch vụ"
                    style={{ flex: 1, minWidth: 200 }}
                    value={service || undefined}
                    // options={mockServices.map(service => ({
                    //     label: service.name,
                    //     value: service.name,
                    // }))}
                    onChange={setService}
                    allowClear
                    showSearch={false}
                />
                <Input
                    placeholder="Địa chỉ"
                    style={{ flex: 1 }}
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    allowClear
                />
            </Space>
            {orders && orders.length > 0 ? (
                <>
                    {orders.map(order => (
                        <div
                            key={order._id}
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
                        <AntPagination
                            current={pagination.page}
                            total={pagination.total}
                            pageSize={pagination.pageSize}
                            onChange={(page) => {
                                setPage(page);
                            }}
                            showSizeChanger={false}
                            showQuickJumper={false}
                        />
                    </div>
                </>
            ) : (
                <></>
            )}
        </div>
    );
}