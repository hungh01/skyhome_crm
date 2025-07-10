import { Button } from "antd";
import ServiceList from "../components/ServicesList";
import { mockBusinessServices } from "@/api/mock-services";

export default function BusinessServicesPage() {
    const services = mockBusinessServices;
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", margin: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <h1 style={{ margin: 0 }}>
                            🏢 Quản lý dịch vụ doanh nghiệp
                        </h1>
                        <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                            Quản lý và điều chỉnh dịch vụ doanh nghiệp trong hệ thống, bao gồm thông tin dịch vụ, giá cả, mô tả và các tùy chọn khác.
                        </p>
                    </div>
                    <Button type="primary" >+ Thêm dịch vụ</Button>
                </div>
                <hr style={{ width: "100%", border: "1px solid #e8e8e8", marginTop: "8px" }} />
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}>
                <ServiceList services={services} />
            </div>
        </>
    );
}