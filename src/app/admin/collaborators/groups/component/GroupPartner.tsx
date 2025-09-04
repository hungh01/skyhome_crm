'use client';

import { Table, Input, Avatar, Rate, Dropdown, Button, Tag, Card, Select } from "antd";
import { useState } from "react";
import NotificationModal from "@/components/Modal";
import AddMemberModal from "./AddMemberModal";

import { UserOutlined, EllipsisOutlined, StopOutlined, TeamOutlined, RightOutlined, PlusOutlined, PauseCircleOutlined, CheckCircleOutlined, EditOutlined } from "@ant-design/icons";
import { Group } from "@/type/user/collaborator/group";
import { deleteMemberOfGroup, updateGroupStatus, deleteGroup } from "@/api/user/collaborator-group-api";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { notify } from "@/components/Notification";
import { Pagination } from "@/type/other/pagination";

const statusOptions = [
    { label: "Tất cả", value: "" },
    { label: "Chờ xử lý", value: "pending" },
    { label: "Đã duyệt", value: "approved" },
    { label: "Từ chối", value: "rejected" },
    { label: "Đã liên hệ", value: "contacted" },
    { label: "Đã hoàn thành kiểm tra", value: "test_completed" },
    { label: "Đã lên lịch phỏng vấn", value: "interview_scheduled" },
    { label: "Hoạt động", value: "active" },
    { label: "Không hoạt động", value: "inactive" }
];



// const status = [
//     { label: "Chờ xử lý", value: "pending" },
//     { label: "Đã duyệt", value: "approved" },
//     { label: "Từ chối", value: "rejected" },
//     { label: "Đã liên hệ", value: "contacted" },
//     { label: "Đã hoàn thành kiểm tra", value: "test_completed" },
//     { label: "Đã lên lịch phỏng vấn", value: "interview_scheduled" }

// ];


function getColumns(
    searchName: string, setSearchName: (v: string) => void,
    searchAddress: string, setSearchAddress: (v: string) => void,
    statusFilter: string, setStatusFilter: (v: string) => void,
    setOpen: (open: boolean) => void,
    setMessage: (message: string) => void,
    setPartnerIdToDelete: (userId: string) => void,
    setActionType: (actionType: 'delete-member' | 'delete-group' | 'update-status' | null) => void,
    setStatusToUpdate: (status: 'active' | 'inactive' | 'restricted') => void,
    onEditGroup: (group: Group) => void
) {

    return [
        Table.EXPAND_COLUMN,
        {
            title: (<div style={{ textAlign: 'center' }}>STT</div>),
            dataIndex: "stt",
            key: "stt",
            render: (_: unknown, __: Group, index: number) => index + 1,
            width: 60,
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Thông tin nhóm
                    <br />
                    <Input
                        placeholder="Search name/phone"
                        allowClear
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                    />
                </div>
            ),
            key: "collaborator",
            width: 280,
            render: (_: unknown, record: Group) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={50}
                        src={record.leaderId?.userId?.image}
                        icon={<UserOutlined />}
                        style={{
                            flexShrink: 0,
                            border: '2px solid #f0f0f0'
                        }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontWeight: 'bold',
                            fontSize: '14px',
                            marginBottom: 4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            Nhóm: {record.name}
                        </div>
                        <div style={{
                            fontWeight: 500,
                            fontSize: '14px',
                            marginBottom: 4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {record.leaderId?.userId?.fullName || 'Chưa có nhóm trưởng'}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {record.leaderId?.userId?.phone || 'Chưa cập nhật'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Rate
                                disabled
                                value={record.leaderId?.commissionRate}
                                style={{ fontSize: '12px' }}
                            />
                            <span style={{
                                fontSize: '12px',
                                color: '#666',
                                fontWeight: 500
                            }}>
                                {record.leaderId?.commissionRate}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Mô tả
                    {/* <br />
                    <Input
                        placeholder="Search address"
                        allowClear
                        value={searchAddress}
                        onChange={e => setSearchAddress(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                    /> */}
                </div>
            ),
            dataIndex: "description",
            key: "description",
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Số thành viên
                </div>
            ),
            dataIndex: "memberTotal",
            render: (_: unknown, record: Group) => (
                <div style={{ textAlign: 'center' }}>
                    {record.memberIds?.length || 0}
                </div>
            ),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Dịch vụ
                    <br />
                    <Input
                        placeholder="Search address"
                        allowClear
                        value={searchAddress}
                        onChange={e => setSearchAddress(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: "serviceType",
            render: (_: unknown, record: Group) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                    {record.serviceType && record.serviceType.length > 0 ? (
                        record.serviceType.map(service => (
                            <span
                                key={service._id}
                                style={{
                                    fontSize: 11,
                                    padding: '2px 6px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 4,
                                    background: '#f5f5f5',
                                    margin: 0,
                                    display: 'inline-block',
                                    minWidth: 0,
                                    textAlign: 'center',
                                }}
                            >
                                {service.name}
                            </span>
                        ))
                    ) : (
                        <span style={{ fontSize: 11, color: '#aaa' }}>-</span>
                    )}
                </div>
            ),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Khu vực
                    <br />
                    <Input
                        placeholder="Search address"
                        allowClear
                        value={searchAddress}
                        onChange={e => setSearchAddress(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: "areas",
            render: (_: unknown, record: Group) => (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
                    {record.areas && record.areas.length > 0 ? (
                        record.areas.map(area => (
                            <span
                                key={area.code}
                                style={{
                                    fontSize: 11,
                                    padding: '2px 6px',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 4,
                                    background: '#f5f5f5',
                                    margin: 0,
                                    display: 'inline-block',
                                    minWidth: 0,
                                    textAlign: 'center',
                                }}
                            >
                                {area.code}
                            </span>
                        ))
                    ) : (
                        <span style={{ fontSize: 11, color: '#aaa' }}>-</span>
                    )}
                </div>
            ),
        },


        {
            title: (
                <div style={{ textAlign: 'center', minWidth: 110 }}>
                    Đánh giá
                    <br />
                </div>
            ),
            dataIndex: "commissionRate",
            key: "commissionRate",
            render: (_: unknown, record: Group) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Rate disabled value={record.commissionRate} style={{ fontSize: '14px' }} />
                    {/* <span style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>
                        {record.commissionRate}
                    </span> */}
                </div>
            ),
        },

        {
            title: (
                <div style={{ textAlign: 'center', minWidth: 110 }}>
                    Trạng thái nhóm
                    <br />
                    <Select
                        placeholder="Lọc trạng thái"
                        allowClear
                        value={statusFilter || undefined}
                        onChange={setStatusFilter}
                        size="small"
                        style={{ marginTop: 8, width: 140 }}
                        options={statusOptions}
                    />
                </div>
            ),
            dataIndex: "status",
            key: "status",
            render: (_: unknown, record: Group) => {
                let color = "default";
                let label = "";
                switch (record.status) {
                    case "pending":
                        color = "orange";
                        label = "Chờ xử lý";
                        break;
                    case "approved":
                        color = "green";
                        label = "Đã duyệt";
                        break;
                    case "rejected":
                        color = "red";
                        label = "Từ chối";
                        break;
                    case "contacted":
                        color = "blue";
                        label = "Đã liên hệ";
                        break;
                    case "test_completed":
                        color = "cyan";
                        label = "Đã hoàn thành kiểm tra";
                        break;
                    case "interview_scheduled":
                        color = "purple";
                        label = "Đã lên lịch phỏng vấn";
                        break;
                    case "active":
                        color = "green";
                        label = "Hoạt động";
                        break;
                    case "inactive":
                        color = "red";
                        label = "Không hoạt động";
                        break;
                    case "restricted":
                        color = "orange";
                        label = "Bị hạn chế";
                        break;
                    default:
                        color = "default";
                        label = "Không xác định";
                }
                return (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tag color={color} style={{ fontSize: 12, fontWeight: 500 }}>
                            {label}
                        </Tag>
                    </div>
                );
            },
        },

        {
            title: "",
            key: "action",
            width: 80,
            render: (_: unknown, record: Group) => {
                const items = [
                    {
                        key: 'edit',
                        label: 'Chỉnh sửa',
                        icon: <EditOutlined />,
                        onClick: () => {
                            onEditGroup(record);
                        }
                    },
                    {
                        key: 'inactive',
                        label: 'Ngưng hoạt động',
                        icon: <StopOutlined style={{ color: 'red' }} />,
                        onClick: () => {
                            setPartnerIdToDelete(record._id);
                            setActionType('update-status');
                            setStatusToUpdate('inactive');
                            setMessage(`Bạn có chắc chắn muốn ngưng hoạt động nhóm này "${record.name}"?`);
                            setOpen(true);
                        },
                        hidden: record.status === 'inactive'
                    },
                    {
                        key: 'restrict',
                        label: 'Hạn chế',
                        icon: <PauseCircleOutlined style={{ color: 'orange' }} />,
                        onClick: () => {
                            setPartnerIdToDelete(record._id);
                            setActionType('update-status');
                            setStatusToUpdate('restricted');
                            setMessage(`Bạn có chắc chắn muốn đưa nhóm "${record.name}" vào trạng thái hạn chế?`);
                            setOpen(true);
                        },
                        hidden: record.status === 'restricted'
                    },
                    {
                        key: 'active',
                        label: 'Kích hoạt',
                        icon: <CheckCircleOutlined style={{ color: 'green' }} />,
                        onClick: () => {
                            setPartnerIdToDelete(record._id);
                            setActionType('update-status');
                            setStatusToUpdate('active');
                            setMessage(`Bạn có chắc chắn muốn đưa nhóm "${record.name}" vào trạng thái hoạt động?`);
                            setOpen(true);
                        },
                        hidden: record.status === 'active'
                    },
                    {
                        key: 'delete',
                        label: 'Xoá',
                        danger: true,
                        onClick: () => {
                            setPartnerIdToDelete(record._id);
                            setActionType('delete-group');
                            setMessage(`Bạn có chắc chắn muốn xoá nhóm "${record.name}"?`);
                            setOpen(true);
                        }
                    }
                ];
                return (
                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={<EllipsisOutlined />}
                            style={{
                                border: 'none',
                                boxShadow: 'none'
                            }}
                        />
                    </Dropdown>
                );
            },
        }
    ];
}

const onChange = () => { };

interface PartnerListProps {
    data: Group[];
    pagination: Pagination | { page: 1, total: 1, pageSize: 1, totalPages: 1 };
    setData: React.Dispatch<React.SetStateAction<DetailResponse<Group[]> | undefined>>;
    onEditGroup: (group: Group) => void;
}

export default function GroupPartner({ data, setData, pagination, onEditGroup }: PartnerListProps) {

    const [searchName, setSearchName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [partnerIdToDelete, setPartnerIdToDelete] = useState<string>();
    const [currentGroupId, setCurrentGroupId] = useState<string>();

    // Add member modal states
    const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [actionType, setActionType] = useState<'delete-member' | 'delete-group' | 'update-status' | null>(null);
    const [statusToUpdate, setStatusToUpdate] = useState<string | null>(null);

    const handleAddMemberClick = (group: Group) => {
        setSelectedGroup(group);
        setAddMemberModalOpen(true);
    };


    const handleDelMemberOk = async () => {
        try {
            if (!actionType) {
                console.error("No action type specified");
                return;
            }

            if (actionType === 'delete-member') {
                if (!partnerIdToDelete || !currentGroupId) {
                    console.error("No user ID or group ID provided for member deletion");
                    return;
                }

                const res = await deleteMemberOfGroup(currentGroupId, partnerIdToDelete);

                if (res && 'success' in res && res.success) {
                    // Update local state: remove member from the group's memberIds
                    setData(prevData => {
                        if (prevData && 'data' in prevData) {
                            return {
                                ...prevData,
                                data: prevData.data.map(group => {
                                    if (group._id === currentGroupId) {
                                        return {
                                            ...group,
                                            memberIds: group.memberIds?.filter(member => member._id !== partnerIdToDelete) || []
                                        };
                                    }
                                    return group;
                                })
                            };
                        }
                        return prevData;
                    });

                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Xoá thành viên thành công',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Xoá thành viên không thành công',
                    });
                }
            } else if (actionType === 'update-status') {
                if (!partnerIdToDelete || !statusToUpdate) {
                    console.error("No group ID or status provided for status update");
                    return;
                }

                const res = await updateGroupStatus(partnerIdToDelete, statusToUpdate as 'active' | 'inactive' | 'restricted');

                if (res && 'success' in res && res.success) {
                    // Update local state: update group status
                    setData(prevData => {
                        if (prevData && 'data' in prevData) {
                            return {
                                ...prevData,
                                data: prevData.data.map(group => {
                                    if (group._id === partnerIdToDelete) {
                                        return {
                                            ...group,
                                            status: statusToUpdate
                                        };
                                    }
                                    return group;
                                })
                            };
                        }
                        return prevData;
                    });

                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Cập nhật trạng thái nhóm thành công',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Cập nhật trạng thái nhóm không thành công',
                    });
                }
            } else if (actionType === 'delete-group') {
                if (!partnerIdToDelete) {
                    console.error("No group ID provided for group deletion");
                    return;
                }

                const res = await deleteGroup(partnerIdToDelete);

                if (res && 'success' in res && res.success) {
                    // Update local state: remove group from data
                    setData(prevData => {
                        if (prevData && 'data' in prevData) {
                            return {
                                ...prevData,
                                data: prevData.data.filter(group => group._id !== partnerIdToDelete)
                            };
                        }
                        return prevData;
                    });

                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Xoá nhóm thành công',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Xoá nhóm không thành công',
                    });
                }
            }

        } catch (error) {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi thực hiện thao tác',
            });
            console.error("Error performing action:", error);
        } finally {
            setMessage("");
            setOpen(false);
            setPartnerIdToDelete(undefined);
            setCurrentGroupId(undefined);
            setActionType(null);
            setStatusToUpdate(null);
        }
    };

    const expandedRowRender = (record: Group) => {
        const members = record.memberIds;

        return (
            <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TeamOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontWeight: 600, fontSize: '16px' }}>
                        Thành viên nhóm {record.name}
                    </span>
                    <Tag color="blue">{members.length} thành viên</Tag>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        style={{ margin: 0, backgroundColor: '#447D9B', borderColor: '#1890ff' }}
                        onClick={() => handleAddMemberClick(record)}
                    >
                        Thêm thành viên
                    </Button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                    {members.map((member) => (
                        <div
                            key={member._id}
                            style={{
                                padding: '8px',
                                backgroundColor: '#fff',
                                borderRadius: '6px',
                                border: '1px solid #e8e8e8',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <Avatar size={40} icon={<UserOutlined />} />
                            <div style={{ flex: 1, position: 'relative' }}>
                                <Button
                                    type="text"
                                    size="small"
                                    danger
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        zIndex: 1,
                                        padding: 0,
                                        lineHeight: 1,
                                    }}
                                    icon={<span style={{ fontWeight: 'bold', fontSize: 16 }}>×</span>}
                                    onClick={() => {
                                        setPartnerIdToDelete(member._id);
                                        setCurrentGroupId(record._id);
                                        setActionType('delete-member');
                                        setMessage(`Bạn có chắc chắn muốn xoá thành viên "${member.userId.fullName}"?`);
                                        setOpen(true);
                                    }}
                                />
                                <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>
                                    {member.userId.fullName}
                                </div>
                                <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                                    {member.userId.phone}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Rate
                                        disabled
                                        value={member.commissionRate}
                                        style={{ fontSize: '12px' }}
                                    />
                                    <span style={{ fontSize: '12px', color: '#666' }}>
                                        {member.commissionRate}
                                    </span>
                                    <Tag
                                        color={member.status === 'inactive' ? 'orange' : 'green'}
                                        style={{ fontSize: '10px' }}
                                    >
                                        {member.status === 'inactive' ? 'Tạm dừng' : 'Hoạt động'}
                                    </Tag>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {members.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#999',
                        fontSize: '14px'
                    }}>
                        Nhóm này chưa có thành viên nào
                    </div>
                )}
            </div>
        );
    };

    return (
        <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
            <NotificationModal open={open} setOpen={setOpen} message={message} onOk={handleDelMemberOk} />
            <div style={{ width: '100%', overflowX: 'auto' }}>
                <Table<Group>
                    rowKey="_id"
                    size="small"
                    scroll={{ x: 'max-content' }}
                    pagination={{
                        current: pagination.page,
                        total: pagination.total,
                        pageSize: pagination.pageSize,
                        position: ['bottomCenter'],
                    }}
                    columns={getColumns(
                        searchName, setSearchName,
                        searchAddress, setSearchAddress,
                        statusFilter, setStatusFilter,
                        setOpen, setMessage, setPartnerIdToDelete,
                        setActionType, setStatusToUpdate,
                        onEditGroup
                    )}
                    dataSource={data}
                    onChange={onChange}
                    showSorterTooltip={{ target: 'sorter-icon' }}
                    rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
                    expandable={{
                        expandedRowRender,
                        expandIcon: ({ expanded, onExpand, record }) => (
                            <Button
                                type="text"
                                size="small"
                                icon={<RightOutlined />}
                                onClick={(e) => onExpand(record, e)}
                                style={{
                                    color: expanded ? '#1890ff' : '#666',
                                    transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'all 0.2s'
                                }}
                            />
                        ),
                        rowExpandable: (record) => (record.memberIds?.length || 0) >= 0,
                    }}
                    className="ant-table-small"
                />
            </div>
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
            `}</style>

            {selectedGroup && (
                <AddMemberModal
                    open={addMemberModalOpen}
                    setOpen={setAddMemberModalOpen}
                    groupId={selectedGroup._id}
                    groupName={selectedGroup.name}
                    existingMemberIds={selectedGroup.memberIds?.map(member => member._id) || []}
                    setData={setData}
                />
            )}
        </Card>
    );
}


