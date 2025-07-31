'use client';

import { Table, Input, Avatar, Rate, Select, Dropdown, Button, Tag, Card } from "antd";
import { useState } from "react";
import NotificationModal from "@/components/Modal";

import { UserOutlined, EllipsisOutlined, EyeOutlined, StopOutlined, TeamOutlined, RightOutlined } from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { Group } from "@/type/user/collaborator/group";



const status = [
    { label: "Đang hoạt động", value: "active" },
    { label: "Tạm dừng", value: "paused" },
    { label: "Hạn chế", value: "inactive" }
]



function getColumns(
    searchName: string, setSearchName: (v: string) => void,
    searchAddress: string, setSearchAddress: (v: string) => void,
    searchStatus: string[], setSearchStatus: (v: string[]) => void,
    setOpen: (open: boolean) => void,
    setMessage: (message: string) => void,
    setPartnerIdToDelete: (userId: string) => void,
    router: ReturnType<typeof useRouter>
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
                    Leader
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
            key: "partner",
            width: 280,
            render: (_: unknown, record: Group) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={50}
                        src={record.imageLeader}
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
                            {record.leader}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {record.phoneLeader}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Rate
                                disabled
                                value={record.rate}
                                style={{ fontSize: '12px' }}
                            />
                            <span style={{
                                fontSize: '12px',
                                color: '#666',
                                fontWeight: 500
                            }}>
                                {record.rate}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Tên nhóm
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
            dataIndex: "groupName",
            key: "groupName",
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Số thành viên
                </div>
            ),
            dataIndex: "memberTotal",
            key: "memberTotal",
            render: (_: unknown, record: Group) => (
                <div style={{ textAlign: 'center' }}>
                    {record.memberTotal}
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
            dataIndex: "address",
            key: "address",
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Đánh giá
                    <br />
                    <Select
                        mode="multiple"
                        allowClear
                        placeholder="Chọn trạng thái"
                        value={searchStatus}
                        onChange={setSearchStatus}
                        options={status}
                        style={{ width: 180, marginTop: 8 }}
                    />
                </div>
            ),
            dataIndex: "rate",
            key: "rate",
            render: (_: unknown, record: Group) => (
                <div style={{ alignItems: 'center', gap: 6, textAlign: 'center' }}>
                    <Rate disabled value={record.rate} style={{ fontSize: '14px' }} />
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: 500 }}>
                        {record.rate}
                    </span>
                </div>
            ),
        },

        {
            title: "",
            key: "action",
            width: 80,
            render: (_: unknown, record: Group) => {
                const items = [
                    {
                        key: 'detail',
                        label: 'Chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => {
                            router.push(`/admin/partners/${record.id}`);
                        }
                    },
                    {
                        key: 'edit',
                        label: 'Chỉnh sửa',
                        icon: <UserOutlined />,
                        onClick: () => {
                            router.push(`/admin/partners/${record.id}`);
                        }
                    },
                    {
                        key: 'disable',
                        label: 'Cấm',
                        icon: <StopOutlined />,
                        onClick: () => {
                            setPartnerIdToDelete(record.id);
                            setMessage(`Bạn có chắc chắn muốn cấm cộng tác viên "${record.groupName}"?`);
                            setOpen(true);
                        }
                    },
                    {
                        key: 'delete',
                        label: 'Xoá',
                        danger: true,
                        onClick: () => {
                            setPartnerIdToDelete(record.id);
                            setMessage(`Bạn có chắc chắn muốn xoá nhóm "${record.groupName}"?`);
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
}

export default function GroupPartner({ data }: PartnerListProps) {
    const router = useRouter();

    const [searchName, setSearchName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchStatus, setSearchStatus] = useState<string[]>([]);
    const safeData = data || [];

    const filteredData = safeData.filter((partner) => {
        const nameMatch = (partner.leader + partner.phoneLeader).toLowerCase().includes(searchName.toLowerCase());
        const addressMatch = partner.address.toLowerCase().includes(searchAddress.toLowerCase());
        return nameMatch && addressMatch;
    });

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [partnerIdToDelete, setPartnerIdToDelete] = useState<string>();

    const handleDelMemberOk = () => {
        try {
            if (!partnerIdToDelete) {
                console.error("No user ID provided for deletion");
                return;
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            setPartnerIdToDelete(undefined);
        } finally {
            setMessage("");
            setOpen(false);
            setPartnerIdToDelete(undefined);
        }
    };

    const expandedRowRender = (record: Group) => {
        const members = record.members;

        return (
            <div style={{ padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TeamOutlined style={{ color: '#1890ff' }} />
                    <span style={{ fontWeight: 600, fontSize: '16px' }}>
                        Thành viên nhóm {record.groupName}
                    </span>
                    <Tag color="blue">{members.length} thành viên</Tag>
                    <Button
                        type="primary"
                        style={{ margin: 0, backgroundColor: '#447D9B', borderColor: '#1890ff' }}

                    >
                        + Thêm thành viên
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
                                        setMessage(`Bạn có chắc chắn muốn xoá thành viên "${member.user.fullName}"?`);
                                        setOpen(true);
                                        // TODO: handle remove member logic here
                                        // e.g. show confirm modal or call API
                                    }}
                                />
                                <div style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>
                                    {member.user.fullName}
                                </div>
                                <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                                    {member.user.phone}
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
                                        color={member.status === 'active' ? 'green' : 'orange'}
                                        style={{ fontSize: '10px' }}
                                    >
                                        {member.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
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
            <Table<Group>
                rowKey="id"
                size="small"
                pagination={{
                    pageSize: 3,
                    position: ['bottomCenter'],
                }}
                columns={getColumns(
                    searchName, setSearchName,
                    searchAddress, setSearchAddress,

                    searchStatus, setSearchStatus,
                    setOpen, setMessage, setPartnerIdToDelete,
                    router
                )}
                dataSource={filteredData}
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
                    rowExpandable: (record) => record.memberTotal > 0,
                }}
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
            `}</style>
        </Card>
    );
}


