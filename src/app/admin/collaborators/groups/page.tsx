'use client';

import { mockGroups } from "@/api/user-management/mock-leader";
import GroupPartner from "./component/GroupPartner";
import { Button, Card, Spin } from "antd";
import AddGroupModal from "./component/AddGroupModal";
import { useState } from "react";

export default function LeadersPage() {
    const data = mockGroups;
    const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
    const [loading, setLoading] = useState(false);
    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <Spin spinning={loading} fullscreen />
            <AddGroupModal open={openCreateGroupModal} setOpen={setOpenCreateGroupModal} setLoading={setLoading} />
            <Card style={{ marginBottom: 16, borderRadius: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <h1 style={{ margin: 0 }}>
                            Quản lý nhóm
                        </h1>
                        <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                            Quản lý và theo dõi tất cả các nhóm, cộng tác viên trong hệ thống
                        </p>
                    </div>
                    <Button type="primary"
                        onClick={() => setOpenCreateGroupModal(true)}
                    >+ Thêm nhóm</Button>
                </div>
            </Card>

            {/* Content */}
            <GroupPartner data={data} />
        </div>
    );
}