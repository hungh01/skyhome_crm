'use client';

import { Table, Input, DatePicker, Avatar, Rate, Select, Button, Card, Spin } from "antd";
import { useState } from "react";
import NotificationModal from "@/components/Modal";
import { UserOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { updateCollaboratorStatusApi } from "@/api/user/collaborator-api";
import { notify } from "@/components/Notification";

import { PAGE_SIZE } from "@/common/page-size";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { isDetailResponse } from "@/utils/response-handler";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ServiceCategory } from "@/type/services/service-category";
import { Area } from "@/type/area/area";
import { useCollaboratorContext } from "../provider/collaborator-provider";
import { useCollaboratorList } from "../hooks/use-collaborator-list";
import { useUpdateCollabStatus } from "../hooks/use-update-collab-status";
import Loading from "@/components/Loading";


function getColumns(
    searchName: string, handleSearchNameChange: (v: string) => void, isSearching: boolean,
    searchAreas: string[], setSearchAreas: (v: string[]) => void,
    //searchCode: string, setSearchCode: (v: string) => void,
    searchActiveDate: Dayjs | null, setSearchActiveDate: (v: Dayjs | null) => void,
    searchServices: string[], setSearchServices: (v: string[]) => void,
    statusFilter: string, setStatusFilter: (v: string) => void,
    setOpen: (open: boolean) => void,
    setMessage: (message: string) => void,
    setPartnerIdToUpdate: (userId: string) => void,
    setStatusToUpdate: (status: string | undefined) => void,
    router: ReturnType<typeof useRouter>,
    serviceCategories: ServiceCategory[],
    areas: Area[]
) {

    return [
        {
            title: (<div style={{ textAlign: 'center' }}>STT</div>),
            dataIndex: "stt",
            key: "stt",
            render: (_: unknown, __: Collaborator, index: number) => index + 1,
            width: 60,
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Ngày kích hoạt
                    <br />
                    <DatePicker
                        allowClear
                        value={searchActiveDate}
                        onChange={setSearchActiveDate}
                        size="small"
                        style={{ marginTop: 8, width: 140, marginLeft: 8 }}
                        format="DD/MM/YYYY"
                        placeholder="Search date"
                    />
                </div>
            ),
            dataIndex: "joinedAt",
            key: "joinedAt",
            width: 180,
            render: (joinedAt: string) => new Date(joinedAt).toLocaleDateString(),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Cộng tác viên
                    <br />
                    <Input
                        placeholder="Search name/phone"
                        allowClear
                        value={searchName}
                        onChange={e => handleSearchNameChange(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                        suffix={isSearching && <Spin size="small" />}
                    />
                </div>
            ),
            key: "collaborator",
            width: 280,
            render: (_: unknown, record: Collaborator) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#f5f5f5', padding: '8px 12px', borderRadius: 8 }}>
                    <Avatar
                        size={50}
                        src={record.userId.image ? record.userId.image : undefined}
                        icon={<UserOutlined />}
                        style={{
                            flexShrink: 0,
                            border: '2px solid #f0f0f0'
                        }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontWeight: 500,
                            fontSize: '14px',
                            marginBottom: 4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {record.userId.fullName}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {record.code}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {record.userId.phone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Rate
                                disabled
                                value={record.commissionRate}
                                style={{ fontSize: '12px' }}
                            />
                            <span style={{
                                fontSize: '12px',
                                color: '#666',
                                fontWeight: 500
                            }}>
                                {record.commissionRate}
                            </span>
                        </div>
                        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 4 }}>
                            {record.userId.status ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Khu vực
                    <br />
                    <Select
                        mode="multiple"
                        placeholder="Filter areas"
                        allowClear
                        value={searchAreas}
                        onChange={setSearchAreas}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                        options={areas.map(area => ({
                            label: ` ${area.code} (${area.ward ? (area.ward + ' - ') : ''}${area.city})`,
                            value: area._id
                        }))}
                        maxTagCount="responsive"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </div>
            ),
            dataIndex: "areas",
            key: "areas",
            render: (areas: { _id: string; ward: string; city: string; code: string }[]) => (
                <div style={{ fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {areas && Array.isArray(areas) && areas?.map((a) => `(${a.code})`).join(", ")}
                </div>
            ),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Dịch vụ đăng ký
                    <br />
                    <Select
                        mode="multiple"
                        placeholder="Filter services"
                        allowClear
                        value={searchServices}
                        onChange={setSearchServices}
                        size="small"
                        style={{ marginTop: 8, width: 160, marginLeft: 8 }}
                        options={serviceCategories.map(service => ({
                            label: service.name,
                            value: service._id
                        }))}
                        maxTagCount="responsive"
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </div>
            ),
            dataIndex: "serviceType",

            render: (services: ServiceCategory[]) => (
                <div>
                    {services?.map((s) => s.name).join(", ")}
                </div>
            ),
        },

        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Trạng thái
                    <br />
                    <Select
                        placeholder="Lọc trạng thái"
                        allowClear
                        value={statusFilter || undefined}
                        onChange={setStatusFilter}
                        size="small"
                        style={{ marginTop: 8, width: 140 }}
                        options={[
                            { label: "Tất cả", value: "" },
                            { label: "Chờ duyệt", value: "pending" },
                            { label: "Đã duyệt", value: "approved" },
                            { label: "Từ chối", value: "rejected" },
                            { label: "Đã liên hệ", value: "contacted" },
                            { label: "Hoàn thành test", value: "test_completed" },
                            { label: "Hẹn phỏng vấn", value: "interview_scheduled" },
                            { label: "Đang hoạt động", value: "active" },
                            { label: "Ngừng hoạt động", value: "inactive" }
                        ]}
                    />
                </div>
            ),
            dataIndex: "status",
            key: "status",
            render: (status: string, record: Collaborator) => {
                const statusMap: Record<string, { color: string; label: string }> = {
                    pending: { color: "#ffc107", label: "Chờ duyệt" },         // Vàng đậm - chờ xử lý
                    approved: { color: "#28a745", label: "Đã duyệt" },        // Xanh lá - thành công
                    rejected: { color: "#dc3545", label: "Từ chối" },         // Đỏ - từ chối
                    contacted: { color: "#6f42c1", label: "Đã liên hệ" },     // Tím - đã liên lạc
                    test_completed: { color: "#17a2b8", label: "Hoàn thành test" }, // Xanh cyan - hoàn thành bài test
                    interview_scheduled: { color: "#fd7e14", label: "Hẹn phỏng vấn" }, // Cam - đã lên lịch
                    active: { color: "#198754", label: "Đang hoạt động" },     // Xanh lá đậm - đang hoạt động
                    inactive: { color: "#6c757d", label: "Ngừng hoạt động" }, // Xám - tạm dừng
                };
                const s = statusMap[status] || { color: "#d9d9d9", label: status };

                const handleStatusChange = (newStatus: string) => {
                    setPartnerIdToUpdate(record._id);
                    setStatusToUpdate(newStatus);
                    setMessage(`Bạn có chắc chắn muốn thay đổi trạng thái của cộng tác viên "${record.userId.fullName}" thành "${statusMap[newStatus]?.label || newStatus}"?`);
                    setOpen(true);
                };

                return (
                    <Select
                        value={status}
                        onChange={handleStatusChange}
                        size="small"
                        style={{
                            width: 140,
                            borderRadius: 6
                        }}
                        className={`status-select status-${status}`}
                        variant="filled"
                        options={[
                            { label: "Chờ duyệt", value: "pending" },
                            { label: "Đã duyệt", value: "approved" },
                            { label: "Từ chối", value: "rejected" },
                            { label: "Đã liên hệ", value: "contacted" },
                            { label: "Hoàn thành test", value: "test_completed" },
                            { label: "Hẹn phỏng vấn", value: "interview_scheduled" },
                            { label: "Đang hoạt động", value: "active" },
                            { label: "Ngừng hoạt động", value: "inactive" }
                        ]}
                        styles={{
                            root: {
                                backgroundColor: s.color,
                                borderColor: s.color,
                                borderWidth: '1px',
                                borderStyle: 'solid',
                                color: 'white',
                                borderRadius: '6px'
                            },
                            popup: {
                                root: {
                                    backgroundColor: '#fff',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: '#d9d9d9',
                                    borderRadius: 8,
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }
                            }
                        }}
                    />
                );
            },
        },
        {
            title: "",
            key: "action",
            width: 120,
            render: (_: unknown, record: Collaborator) => (
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => router.push(`/admin/collaborators/${record._id}`)}
                    style={{ padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                    Chi tiết
                </Button>
            ),
        }
    ];
}

const onChange = () => { };

export default function CollaboratorList() {
    const router = useRouter();
    const {
        dataFilter,
        data,
        searchName,
        handleSearchNameChange,
        isSearching,
        page,
        setPage,
        searchAreas,
        setSearchAreas,
        searchActiveDate,
        setSearchActiveDate,
        searchServices,
        setSearchServices,
        statusFilter,
        setStatusFilter
    } = useCollaboratorContext();

    const { loading: listLoading } = useCollaboratorList();


    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [partnerIdToUpdate, setPartnerIdToUpdate] = useState<string>();
    const [statusToUpdate, setStatusToUpdate] = useState<string>();

    const { handleUpdateStatus, loading: createCollabLoading } = useUpdateCollabStatus();

    const finallyUpdate = () => {
        setMessage("");
        setOpen(false);
        setPartnerIdToUpdate(undefined);
        setStatusToUpdate(undefined);
    }

    if (listLoading || createCollabLoading) {
        return <Loading />;
    }

    return (
        <Card style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
            <NotificationModal open={open} setOpen={setOpen} message={message} onOk={() => handleUpdateStatus(partnerIdToUpdate, statusToUpdate, finallyUpdate)} />
            <Table<Collaborator>
                id="_id"
                rowKey="code"
                size="small"
                pagination={{
                    current: page,
                    onChange: (page) => setPage(page),
                    pageSize: PAGE_SIZE,
                    total: data?.pagination?.total || 0,
                    position: ['bottomCenter'],
                }}
                columns={getColumns(
                    searchName, handleSearchNameChange, isSearching,
                    searchAreas, setSearchAreas,
                    searchActiveDate, setSearchActiveDate,
                    searchServices, setSearchServices,
                    statusFilter, setStatusFilter,
                    setOpen, setMessage, setPartnerIdToUpdate,
                    setStatusToUpdate,
                    router,
                    dataFilter.services,
                    dataFilter.areas
                )}
                dataSource={data?.data}
                onChange={onChange}
                showSorterTooltip={{ target: 'sorter-icon' }}
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            />
        </Card>
    );
}
