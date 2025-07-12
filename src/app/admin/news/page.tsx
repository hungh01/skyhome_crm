'use client';
import { Button, Card } from "antd";
import { useRouter } from "next/navigation";


export default function News() {


    const router = useRouter();
    return (
        <div style={{ padding: 24 }}>
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <h1 style={{ margin: 0 }}>
                            Quản lý bài viết
                        </h1>
                        <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                            Quản lý và điều chỉnh các bài viết trong hệ thống, bao gồm tiêu đề, nội dung, hình ảnh và các tùy chọn khác.
                        </p>
                    </div>
                    <Button type="primary" onClick={() => router.push("/admin/services/")}>+ Thêm bài viết</Button>
                </div>
            </Card>
        </div>
    );
}