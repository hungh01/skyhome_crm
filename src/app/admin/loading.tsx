// src/app/loading.tsx
"use client";

import { Spin } from "antd";

export default function Loading() {
    return (
        <div
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.8)",
            }}
        >
            <Spin size="large" tip="Đang tải..." fullscreen />
        </div>
    );
}
