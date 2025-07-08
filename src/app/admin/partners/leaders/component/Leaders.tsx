'use client';

import { Table, Input, Avatar, Rate, Select, Dropdown, Button } from "antd";
import { useState } from "react";
import NotificationModal from "@/components/Modal";

import { UserOutlined, EllipsisOutlined, EyeOutlined, StopOutlined } from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { Leader } from "@/type/user/leader";


const status = [
    { label: "Đang hoạt động", value: "active" },
    { label: "Tạm dừng", value: "paused" },
    { label: "Hạn chế", value: "inactive" }
]



function getColumns(
    searchName: string, setSearchName: (v: string) => void,
    searchAddress: string, setSearchAddress: (v: string) => void,
    searchGroupName: string, setSearchGroupName: (v: string) => void,
    searchStatus: string[], setSearchStatus: (v: string[]) => void,
    setOpen: (open: boolean) => void,
    setMessage: (message: string) => void,
    setPartnerIdToDelete: (userId: string) => void,
    router: ReturnType<typeof useRouter>
) {

    return [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            render: (_: unknown, __: Leader, index: number) => index + 1,
            width: 60,
        },
        {
            title: (
                <div>
                    Cộng tác viên
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
            render: (_: unknown, record: Leader) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={50}
                        src={record.image}
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
                            {record.name}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {record.phoneNumber}
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
                <div>
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
                <div>
                    Tên nhóm
                    <br />
                    <Input
                        placeholder="Search group name"
                        allowClear
                        value={searchGroupName}
                        onChange={e => setSearchGroupName(e.target.value)}
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
                <div>
                    Trạng thái hoạt động
                    <br />
                    <Select
                        mode="multiple"
                        placeholder="Filter status"
                        allowClear
                        value={searchStatus}
                        onChange={setSearchStatus}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                        options={status.map(status => ({
                            label: status.label,
                            value: status.value
                        }))}
                        maxTagCount="responsive"
                        showSearch={false}
                    />
                </div>
            ),
            dataIndex: "status",
            key: "status",
            render: (value: string) => {
                const found = status.find(s => s.value === value);
                return found ? found.label : value;
            },
        },

        {
            title: "Hành động",
            key: "action",
            width: 80,
            render: (_: unknown, record: Leader) => {
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
                            setMessage(`Bạn có chắc chắn muốn cấm cộng tác viên "${record.name}"?`);
                            setOpen(true);
                        }
                    },
                    {
                        key: 'delete',
                        label: 'Xoá',
                        danger: true,
                        onClick: () => {
                            setPartnerIdToDelete(record.id);
                            setMessage(`Bạn có chắc chắn muốn xoá cộng tác viên "${record.name}"?`);
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
    data: Leader[];
}

export default function Leaders({ data }: PartnerListProps) {
    const router = useRouter();

    const [searchName, setSearchName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchGroupName, setSearchGroupName] = useState("");
    const [searchStatus, setSearchStatus] = useState<string[]>([]);

    const safeData = data || [];

    const filteredData = safeData.filter((partner) => {
        const nameMatch = (partner.name + partner.phoneNumber).toLowerCase().includes(searchName.toLowerCase());
        const addressMatch = partner.address.toLowerCase().includes(searchAddress.toLowerCase());
        const groupNameMatch = partner.groupName.toLowerCase().includes(searchGroupName.toLowerCase());
        const statusMatch = searchStatus.length === 0 || searchStatus.includes(partner.status);
        return nameMatch && addressMatch && groupNameMatch && statusMatch;
    });


    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [partnerIdToDelete, setPartnerIdToDelete] = useState<string>();

    const handleOk = () => {
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

    return (
        <div style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
            <NotificationModal open={open} setOpen={setOpen} message={message} onOk={handleOk} />
            <Table<Leader>
                rowKey="id"
                size="small"
                pagination={{
                    pageSize: 5,
                }}
                columns={getColumns(
                    searchName, setSearchName,
                    searchAddress, setSearchAddress,
                    searchGroupName, setSearchGroupName,
                    searchStatus, setSearchStatus,
                    setOpen, setMessage, setPartnerIdToDelete,
                    router
                )}
                dataSource={filteredData}
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
            `}</style>
        </div>
    );
}
