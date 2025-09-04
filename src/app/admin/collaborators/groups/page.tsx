'use client';


import GroupPartner from "./component/GroupPartner";
import { Button, Card, Spin } from "antd";
import AddGroupModal from "./component/AddGroupModal";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { getCollaboratorGroups } from "@/api/user/collaborator-group-api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Group } from "@/type/user/collaborator/group";

export default function LeadersPage() {
    const [data, setData] = useState<DetailResponse<Group[]>>();
    const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
    const [openEditGroupModal, setOpenEditGroupModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | undefined>();
    const [loading, setLoading] = useState(false);

    //filter group list
    const [searchName, setSearchName] = useState("");
    const [debouncedSearchName, setDebouncedSearchName] = useState("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);

    // Debounce timer ref
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced search effect
    useEffect(() => {
        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer
        debounceTimerRef.current = setTimeout(() => {
            setDebouncedSearchName(searchName);
            setPage(1); // Reset to first page when search changes
        }, 500); // 500ms delay

        // Cleanup function
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchName]);

    // Create stable string representations for arrays to avoid useEffect dependency issues
    const selectedAreasString = useMemo(() => selectedAreas.join(','), [selectedAreas]);
    const selectedServicesString = useMemo(() => selectedServices.join(','), [selectedServices]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // Ensure arrays are never undefined/null
            const areasParam = selectedAreas || [];
            const servicesParam = selectedServices || [];

            const res = await getCollaboratorGroups(page, 10, debouncedSearchName, areasParam, servicesParam, statusFilter);
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
    }, [page, debouncedSearchName, selectedAreasString, selectedServicesString, statusFilter]);

    const handleEditGroup = (group: Group) => {
        setEditingGroup(group);
        setOpenEditGroupModal(true);
    };

    const handleCloseEditModal = () => {
        setOpenEditGroupModal(false);
        setEditingGroup(undefined);
    };

    // Handle immediate search for filter changes that should trigger instant search
    const handleFilterChange = useCallback(() => {
        setPage(1); // Reset to first page when filters change
        // Clear debounce timer and search immediately for filter changes
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        setDebouncedSearchName(searchName);
    }, [searchName]);

    // Trigger immediate search when non-text filters change
    useEffect(() => {
        handleFilterChange();
    }, [selectedAreas, selectedServices, statusFilter]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                searchName={searchName}
                setSearchName={setSearchName}
                selectedAreas={selectedAreas}
                setSelectedAreas={setSelectedAreas}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                setPage={setPage}
                isSearching={searchName !== debouncedSearchName}
            />
        </div>
    );
}