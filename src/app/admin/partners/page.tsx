'use client';

import { Button, Form } from "antd";
import { useState } from "react";
import { mockPartners } from "@/api/mock-partner";
import CreatePeople from "@/components/people/CreatePeople";
import PartnerList from "./components/PartnerList";

const partners = mockPartners;

export default function PartnersPage() {

    const [open, setOpen] = useState(false);

    const [form] = Form.useForm();

    const handleDelete = (id: string) => {
        // call-api logic to disable partner by id
        console.log(`Partner with ID ${id} deleted successfully`);
    };

    const handleFinish = (values: unknown) => {
        // handle form submission-callapi logic here
        console.log("Form submit values:", values);
        setOpen(false);
        form.resetFields();
    };

    return (
        <>
            <CreatePeople form={form} open={open} setOpen={setOpen} handleFinish={handleFinish} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", margin: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <h1>Danh sách CTV</h1>
                    <Button type="primary" onClick={() => setOpen(true)}>+ Thêm CTV</Button>
                </div>
                <hr style={{ width: "100%", border: "1px solid #e8e8e8", marginTop: "8px" }} />
            </div>
            <PartnerList data={partners} pathname="partners" handleDelete={handleDelete} />
        </>
    );
}


