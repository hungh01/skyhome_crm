"use client";

import { Card, Typography } from "antd";
import BannerList from "./components/BannerList";

const { Title } = Typography;

export default function BannersPage() {
    return (
        <div style={{ padding: '24px' }}>
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                            Quản lý Banner
                        </Title>
                        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
                            Quản lý các banner quảng cáo, liên kết và hình ảnh hiển thị trên ứng dụng
                        </p>
                    </div>
                </div>
            </Card>

            <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <BannerList />
            </Card>
        </div>
    );
}