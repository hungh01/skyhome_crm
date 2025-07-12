"use client";

import { Card, Typography } from "antd";
import NewsFeed from "./components/NewsFeed";

const { Title } = Typography;

export default function News() {
    return (
        <div style={{ padding: 24 }}>
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                            Quản lý Tin tức
                        </Title>
                        <p style={{ color: '#666', margin: '8px 0 0 0' }}>
                            Quản lý các tin tức, bài viết và thông báo hiển thị trên ứng dụng
                        </p>
                    </div>
                </div>
            </Card>
            <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <NewsFeed />
            </Card>
        </div>
    );
}