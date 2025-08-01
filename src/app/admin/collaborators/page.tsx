'use client';

import { Button, Card, Form } from "antd";
import { useState } from "react";
import CreatePeople from "@/components/people/CreatePeople";
import CollaboratorList from "./components/CollaboratorList";


export default function CollaboratorsPage() {

    const [open, setOpen] = useState(false);

    const [form] = Form.useForm();


    const handleFinish = (values: unknown) => {
        console.log("Form submit values:", values);
        setOpen(false);
        form.resetFields();
    };

    return (
        <div style={{ padding: 24 }}>
            <CreatePeople form={form} open={open} setOpen={setOpen} handleFinish={handleFinish} />
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <h1 style={{ margin: 0 }}>
                            Quản lý cộng tác viên
                        </h1>
                        <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                            Quản lý và theo dõi cộng tác viên trong hệ thống, bao gồm thông tin cá nhân, lịch sử giao dịch và các hoạt động khác.
                        </p>
                    </div>
                    <Button type="primary" onClick={() => setOpen(true)}>+ Thêm CTV</Button>
                </div>
            </Card>
            <CollaboratorList />
        </div>
    );
}
