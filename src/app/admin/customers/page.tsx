'use client';
import { mockUsers } from "@/api/mock-userlist";
import ListUser from "./components/ListUser";
import { Button, Card } from "antd";
import { useState } from "react";
import CreateUser from "./components/CreateUser";

const users = mockUsers;

export default function CustomersPage() {

    const [open, setOpen] = useState(false);

    return (
        <>
            <CreateUser open={open} setOpen={setOpen} />
            <div style={{ padding: 24 }}>
                <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                            <h1 style={{ margin: 0 }}>
                                👥 Quản lý khách hàng
                            </h1>
                            <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                                Quản lý và theo dõi khách hàng trong hệ thống, bao gồm thông tin cá nhân, lịch sử giao dịch và các hoạt động khác.
                            </p>
                        </div>
                        <Button type="primary" onClick={() => setOpen(true)}>+ Thêm khách hàng</Button>
                    </div>
                </Card>

                <ListUser data={users} />
            </div>

        </>
    );
}