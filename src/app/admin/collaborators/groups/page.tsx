'use client';


import GroupPartner from "./component/GroupPartner";
import { Button, Card, Spin } from "antd";
import AddGroupModal from "./component/AddGroupModal";
import { useEffect, useState } from "react";
import { getCollaboratorGroups } from "@/api/user/collaborator-group-api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Group } from "@/type/user/collaborator/group";

export default function LeadersPage() {
    const [data, setData] = useState<DetailResponse<Group[]>>();
    const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
    const [openEditGroupModal, setOpenEditGroupModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | undefined>();
    const [loading, setLoading] = useState(false);
    console.log("editingGroup", editingGroup)
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getCollaboratorGroups();
            if ('data' in res) {
                setData(res);
            } else {
                setData({ data: [] });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditGroup = (group: Group) => {
        setEditingGroup(group);
        setOpenEditGroupModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditGroupModal(false);
        setEditingGroup(undefined);
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <Spin spinning={loading} fullscreen />

            {/* Create Group Modal */}
            <AddGroupModal
                open={openCreateGroupModal}
                setOpen={setOpenCreateGroupModal}
                setLoading={setLoading}
                mode="create"
                onSuccess={() => {
                    fetchData();
                }}
            />

            {/* Edit Group Modal */}
            <AddGroupModal
                open={openEditGroupModal}
                setOpen={handleCloseEditModal}
                setLoading={setLoading}
                mode="edit"
                editGroup={editingGroup}
                onSuccess={() => {
                    fetchData();
                }}
            />
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
            <GroupPartner
                data={data?.data ?? []}
                pagination={data?.pagination ?? { page: 1, total: 1, pageSize: 1, totalPages: 1 }}
                setData={setData}
                onEditGroup={handleEditGroup}
            />
        </div>
    );
}