'use client';

import { Button, Card, Form } from "antd";
import { useEffect, useState } from "react";
import CollaboratorList from "./components/CollaboratorList";
import CreateCollaborator from "./components/CreateCollaborator";
import { collaboratorAreasApi, collaboratorServicesApi, createCollaboratorApi } from "@/api/user/collaborator-api";
import { notify } from "@/components/Notification";
import { CollaboratorFormData } from "@/type/user/collaborator/collaborator";


export default function CollaboratorsPage() {

    const [open, setOpen] = useState(false);

    const [form] = Form.useForm();

    const [data, setData] = useState<{
        areas: { _id: string; ward: string; city: string; code: string }[];
        services: { _id: string; name: string }[];
    }>({
        areas: [],
        services: []
    });

    const handleFinish = async (values: CollaboratorFormData) => {
        try {
            const result = await createCollaboratorApi(values);
            if (result && !('error' in result)) {
                setOpen(false);
                form.resetFields();
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Tạo cộng tác viên thành công.',
                });
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: (result && 'message' in result ? result.message : 'Có lỗi xảy ra khi tạo cộng tác viên, vui lòng thử lại sau.'),
                });
            }
        } catch {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi tạo cộng tác viên, vui lòng thử lại sau.',
            });
        }
    };

    useEffect(() => {
        const fetchServicesAndAreas = async () => {
            try {
                const [areasRes, servicesRes] = await Promise.all([
                    collaboratorAreasApi(),
                    collaboratorServicesApi()
                ]);
                setData({
                    areas: Array.isArray(areasRes.data) ? areasRes.data : [],
                    services: Array.isArray(servicesRes.data) ? servicesRes.data : []
                });
            } catch (error) {
                console.error("Error fetching services or areas:", error);
                // Fallback về array rỗng nếu có lỗi
                setData({
                    areas: [],
                    services: []
                });
            }
        }
        fetchServicesAndAreas();
    }, []);


    return (
        <div style={{ padding: 24 }}>
            <CreateCollaborator form={form} open={open} setOpen={setOpen} handleFinish={handleFinish} areas={data.areas} services={data.services} />
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
