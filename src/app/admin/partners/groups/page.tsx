'use client';

import { mockGroups } from "@/api/user/mock-leader";
import GroupPartner from "./component/GroupPartner";
import { Button } from "antd";
import AddGroupModal from "./component/AddGroupModal";
import { useState } from "react";

export default function LeadersPage() {
    const data = mockGroups;
    const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);

    return (
        <>
            {/* Header */}
            <AddGroupModal open={openCreateGroupModal} setOpen={setOpenCreateGroupModal} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", margin: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <h1 style={{ margin: 0 }}>
                            👥 Quản lý nhóm
                        </h1>
                        <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                            Quản lý và theo dõi tất cả các nhóm, cộng tác viên trong hệ thống
                        </p>
                    </div>
                    <Button type="primary"
                        onClick={() => setOpenCreateGroupModal(true)}
                    >+ Thêm nhóm</Button>
                </div>
                <hr style={{ width: "100%", border: "1px solid #e8e8e8", marginTop: "8px" }} />
            </div>

            {/* Content */}
            <GroupPartner data={data} />
        </>
    );
}