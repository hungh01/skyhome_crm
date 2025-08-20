'use client';
import { Button, Card } from "antd";
import ServiceList from "./components/ServiceCategoryList";

import { useRouter } from "next/navigation";

export default function ServicesPage() {
    const router = useRouter();

    return (
        <div style={{ padding: 24 }}>
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <h1 style={{ margin: 0 }}>
                            Quản lý dịch vụ
                        </h1>
                        <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                            Quản lý và điều chỉnh dịch vụ trong hệ thống, bao gồm thông tin dịch vụ, giá cả, mô tả và các tùy chọn khác.
                        </p>
                    </div>
                    <Button type="primary" onClick={() => router.push("/admin/services/create")}>+ Thêm dịch vụ</Button>
                </div>
            </Card>
            <ServiceList />
        </div>
    );
}