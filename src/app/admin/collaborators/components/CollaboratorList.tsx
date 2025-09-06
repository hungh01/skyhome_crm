'use client';

import { Table, Input, DatePicker, Avatar, Rate, Select, Button, Card, Spin } from "antd";
import { useEffect, useState, useRef, useCallback } from "react";
import dayjs, { Dayjs } from "dayjs";
import { debounce } from "lodash";
import NotificationModal from "@/components/Modal";
import { UserOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { collaboratorListApi, updateCollaboratorStatusApi } from "@/api/user/collaborator-api";
import { notify } from "@/components/Notification";

import { PAGE_SIZE } from "@/common/page-size";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { isDetailResponse } from "@/utils/response-handler";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ServiceCategory } from "@/type/services/service-category";
import { Area } from "@/type/area/area";
import { getServiceCategory } from "@/api/service/service-categories-api";
import { getAreas } from "@/api/area/area-api";


function getColumns(
    searchName: string, handleSearchNameChange: (v: string) => void, isSearching: boolean,
    searchAreas: string[], setSearchAreas: (v: string[]) => void,
    //searchCode: string, setSearchCode: (v: string) => void,
    searchActiveDate: Dayjs | null, setSearchActiveDate: (v: Dayjs | null) => void,
    searchServices: string[], setSearchServices: (v: string[]) => void,
    statusFilter: string, setStatusFilter: (v: string) => void,
    setOpen: (open: boolean) => void,
    setMessage: (message: string) => void,
    setPartnerIdToDelete: (userId: string) => void,
    setActionType: (actionType: 'disable' | 'change-status' | null) => void,
    setStatusToUpdate: (status: string | null) => void,
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
                    setPartnerIdToDelete(record._id);
                    setActionType('change-status');
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

    const [page, setPage] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [debouncedSearchName, setDebouncedSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchAreas, setSearchAreas] = useState<string[]>([]);
    //const [searchCode, setSearchCode] = useState("");
    const [searchActiveDate, setSearchActiveDate] = useState<Dayjs | null>(null);
    const [searchServices, setSearchServices] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState("");

    // Create debounced function using lodash
    const debouncedSetSearchName = useCallback(
        debounce((value: string) => {
            setDebouncedSearchName(value);
            setPage(1); // Reset to first page when search changes
            setIsSearching(false); // End loading when debounce completes
        }, 500), // 500ms delay
        []
    );

    // Handle search name change
    const handleSearchNameChange = useCallback((value: string) => {
        setSearchName(value);
        if (value === "") {
            // If clearing the search, immediately update and stop loading
            setDebouncedSearchName("");
            setIsSearching(false);
            setPage(1);
        } else if (value !== debouncedSearchName) {
            setIsSearching(true); // Start loading when user types
        }
        debouncedSetSearchName(value);
    }, [debouncedSetSearchName, debouncedSearchName]);

    const [data, setData] = useState<DetailResponse<Collaborator[]> | null>(null);

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [partnerIdToDelete, setPartnerIdToDelete] = useState<string>();
    const [actionType, setActionType] = useState<'disable' | 'change-status' | null>(null);
    const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);


    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);

    useEffect(() => {
        const fetchServiceCategories = async () => {
            const response = await getServiceCategory();
            if (isDetailResponse(response)) {
                setServiceCategories(response.data);
            } else {
                console.error("Failed to fetch service categories:", response);
            }
        };

        const fetchAreas = async () => {
            const response = await getAreas();
            if (isDetailResponse(response)) {
                setAreas(response.data);
            } else {
                console.error("Failed to fetch areas:", response);
            }
        };
        Promise.all([fetchServiceCategories(), fetchAreas()]);
    }, []);

    useEffect(() => {
        const fetchCollaborators = async () => {
            // Convert arrays to comma-separated strings for API if needed
            const response = await collaboratorListApi(page, PAGE_SIZE, searchActiveDate ? dayjs(searchActiveDate).format('YYYY-MM-DD') : '', debouncedSearchName, searchAreas, searchServices, statusFilter);
            if (isDetailResponse(response)) {
                setData(response);
            } else {
                console.error("Failed to fetch collaborators:", response);
            }
        };

        fetchCollaborators();
    }, [page, debouncedSearchName, searchAreas, searchActiveDate, searchServices, statusFilter]);

    const handleDelete = (id: string) => {
        // call-api logic to disable partner by id
        console.log(`Partner with ID ${id} deleted successfully`);
    };

    const handleOk = async () => {
        try {
            if (!partnerIdToDelete) {
                console.error("No user ID provided for action");
                return;
            }

            if (actionType === 'change-status' && statusToUpdate) {
                // Call API to update status
                const response = await updateCollaboratorStatusApi(partnerIdToDelete, statusToUpdate);

                if (isDetailResponse(response)) {
                    // Update local state
                    setData(prevData => {
                        if (prevData && 'data' in prevData) {
                            return {
                                ...prevData,
                                data: prevData.data.map(collaborator =>
                                    collaborator._id === partnerIdToDelete
                                        ? { ...collaborator, status: statusToUpdate }
                                        : collaborator
                                )
                            };
                        }
                        return prevData;
                    });
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Cập nhật trạng thái thành công',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Cập nhật trạng thái không thành công',
                    });
                }
            } else if (actionType === 'disable') {
                // Call API to disable collaborator
                handleDelete(partnerIdToDelete);
            }
        } catch (error) {
            console.error("Error performing action:", error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi thực hiện thao tác',
            });
        } finally {
            setMessage("");
            setOpen(false);
            setPartnerIdToDelete(undefined);
            setActionType(null);
            setStatusToUpdate(null);
        }
    };

    return (
        <Card style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
            <NotificationModal open={open} setOpen={setOpen} message={message} onOk={handleOk} />
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
                    setOpen, setMessage, setPartnerIdToDelete,
                    setActionType, setStatusToUpdate,
                    router,
                    serviceCategories,
                    areas
                )}
                dataSource={data?.data}
                onChange={onChange}
                showSorterTooltip={{ target: 'sorter-icon' }}
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            />
            <style jsx>{`
                :global(.table-row-light) {
                    background-color: #ffffff !important;
                }
                :global(.table-row-dark) {
                    background-color: #fafafa !important;
                }
                :global(.table-row-light:hover),
                :global(.table-row-dark:hover) {
                    background-color: #e6f7ff !important;
                }
                :global(.status-select .ant-select-selector) {
                    border-radius: 6px !important;
                    font-weight: 500 !important;
                    font-size: 12px !important;
                    padding: 0 8px !important;
                    min-height: 28px !important;
                    color: white !important;
                    border: none !important;
                    text-align: center !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                :global(.status-select .ant-select-selection-item) {
                    color: white !important;
                    font-weight: 500 !important;
                    text-align: center !important;
                    width: 100% !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                :global(.status-select .ant-select-arrow) {
                    color: white !important;
                }
                :global(.status-select:hover .ant-select-selector) {
                    opacity: 0.8 !important;
                }
                /* Dynamic status colors */
                :global(.status-pending .ant-select-selector) {
                    background-color: #ffc107 !important;
                    border-color: #ffc107 !important;
                }
                :global(.status-approved .ant-select-selector) {
                    background-color: #28a745 !important;
                    border-color: #28a745 !important;
                }
                :global(.status-rejected .ant-select-selector) {
                    background-color: #dc3545 !important;
                    border-color: #dc3545 !important;
                }
                :global(.status-contacted .ant-select-selector) {
                    background-color: #6f42c1 !important;
                    border-color: #6f42c1 !important;
                }
                :global(.status-test_completed .ant-select-selector) {
                    background-color: #17a2b8 !important;
                    border-color: #17a2b8 !important;
                }
                :global(.status-interview_scheduled .ant-select-selector) {
                    background-color: #fd7e14 !important;
                    border-color: #fd7e14 !important;
                }
                :global(.status-active .ant-select-selector) {
                    background-color: #198754 !important;
                    border-color: #198754 !important;
                }
                :global(.status-inactive .ant-select-selector) {
                    background-color: #6c757d !important;
                    border-color: #6c757d !important;
                }
            `}</style>
        </Card>
    );
}
