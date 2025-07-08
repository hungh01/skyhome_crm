'use client';
import { mockUsers } from "@/api/mock-userlist";
import ListUser from "./components/ListUser";
import { Button } from "antd";
import { useState } from "react";
import CreateUser from "./components/CreateUser";

const users = mockUsers;

export default function CustomersPage() {

    const [open, setOpen] = useState(false);

    return (
        <>
            <CreateUser open={open} setOpen={setOpen} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", margin: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
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
                <hr style={{ width: "100%", border: "1px solid #e8e8e8", marginTop: "8px" }} />
            </div>


            <ListUser data={users} />
        </>
    );
}