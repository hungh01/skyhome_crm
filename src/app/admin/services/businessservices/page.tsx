import { Card } from "antd";
import ServiceList from "../components/ServicesList";
import { mockBusinessServices } from "@/api/mock-services";

export default function BusinessServicesPage() {
    const services = mockBusinessServices;
    return (
        <div style={{ padding: 24 }}>
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <h1 style={{ margin: 0 }}>
                            Quản lý dịch vụ doanh nghiệp
                        </h1>
                        <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                            Quản lý và điều chỉnh dịch vụ doanh nghiệp trong hệ thống, bao gồm thông tin dịch vụ, giá cả, mô tả và các tùy chọn khác.
                        </p>
                    </div>
                </div>
            </Card>
            <ServiceList services={services} />

        </div>
    );
}