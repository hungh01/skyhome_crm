import { mockOrdersDashboard } from "@/api/dashboard/mock-ordersDashboard";
import { Card, Table } from "antd";

export default function OrderList() {
    const recentOrders = mockOrdersDashboard;

    return (
        <Card title="Lịch sử đơn hàng">
            <Table
                dataSource={recentOrders}
                //columns={columns}
                pagination={false}
                rowKey="id"
            />
        </Card>
    );
}