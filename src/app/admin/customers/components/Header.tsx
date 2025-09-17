'use client';
import { Button, Card } from "antd";
import { useCustomerContext } from "../provider/customer-provider";


export default function Header() {
    const { setOpen } = useCustomerContext();
    return (
        <Card style={{ marginBottom: 16, borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <h1 style={{ margin: 0 }}>
                        Quản lý khách hàng
                    </h1>
                    <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                        Quản lý và theo dõi khách hàng trong hệ thống, bao gồm thông tin cá nhân, lịch sử giao dịch và các hoạt động khác.
                    </p>
                </div>
                <Button type="primary" onClick={() => setOpen(true)}>+ Thêm khách hàng</Button>
            </div>
        </Card>
    );
}