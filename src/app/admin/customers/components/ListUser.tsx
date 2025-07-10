'use client';
import { User } from "@/type/user";
import { Table, Input, DatePicker, Avatar, Dropdown, Button, Card } from "antd";
import { useState } from "react";
import NotificationModal from "@/components/Modal";
import dayjs, { Dayjs } from "dayjs";
import { UserOutlined, EllipsisOutlined, EyeOutlined, StopOutlined, StarOutlined, CrownOutlined, TrophyOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";


const rankUser = [
    {
        rank: 0,
        name: "Mới",
        icon: <UserOutlined />
    },
    {
        rank: 1,
        name: "Đồng",
        icon: <StarOutlined />
    },
    {
        rank: 2,
        name: "Bạc",
        icon: <TrophyOutlined />
    },
    {
        rank: 3,
        name: "Vàng",
        icon: <CrownOutlined />
    },
    {
        rank: 4,
        name: "Kim Cương",
        icon: <ThunderboltOutlined />
    }
]

function getColumns(
    searchCustomerName: string, setSearchCustomerName: (v: string) => void,
    searchAddress: string, setSearchAddress: (v: string) => void,
    searchCustomerCode: string, setSearchCustomerCode: (v: string) => void,
    searchCreatedAt: Dayjs | null, setSearchCreatedAt: (v: Dayjs | null) => void,
    setOpen: (open: boolean) => void,
    setMessage: (message: string) => void,
    setUserIdToDelete: (userId: string) => void,
    router: ReturnType<typeof useRouter>
) {

    return [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            render: (_: unknown, __: User, index: number) => index + 1,
            width: 60,
        },
        {
            title: (
                <div>
                    Mã khách hàng
                    <Input
                        placeholder="Search code"
                        allowClear
                        value={searchCustomerCode}
                        onChange={e => setSearchCustomerCode(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 120, marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: "customerCode",
            key: "customerCode",
            width: 160,
        },
        {
            title: (
                <div>
                    Ngày tạo
                    <DatePicker
                        allowClear
                        value={searchCreatedAt}
                        onChange={setSearchCreatedAt}
                        size="small"
                        style={{ marginTop: 8, width: 140, marginLeft: 8 }}
                        format="DD/MM/YYYY"
                        placeholder="Search date"
                    />
                </div>
            ),
            dataIndex: "createdAt",
            key: "createdAt",
            width: 180,
            render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
        },
        {
            title: (
                <div>
                    Khách hàng
                    <Input
                        placeholder="Search name/phone"
                        allowClear
                        value={searchCustomerName}
                        onChange={e => setSearchCustomerName(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                    />
                </div>
            ),
            key: "customer",
            width: 280,
            render: (_: unknown, record: User) => (
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
                            {record.customerName}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {record.phoneNumber}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div>
                    Hạng
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
            dataIndex: "rank",
            key: "rank",
            render: (rank: number) => {
                const rankInfo = rankUser.find(r => r.rank === rank);
                if (!rankInfo) return null;
                return (
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 12px',
                            borderRadius: 12,
                            color: '#fff',
                            fontWeight: 500,
                            fontSize: 12,
                            minWidth: 80,
                            justifyContent: 'center'
                        }}
                    >
                        {rankInfo.icon}
                        {rankInfo.name}
                    </span>
                );
            },
            width: 120,
        },
        {
            title: (
                <div>
                    Địa chỉ
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
            title: "Hành động",
            key: "action",
            width: 80,
            render: (_: unknown, record: User) => {
                const items = [
                    {
                        key: 'detail',
                        label: 'Chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => {
                            router.push(`/admin/customers/${record.id}`);
                        }
                    },
                    {
                        key: 'disable',
                        label: 'Vô hiệu hóa',
                        icon: <StopOutlined />,
                        onClick: () => {
                            setUserIdToDelete(record.id);
                            setMessage(`Bạn có chắc chắn muốn vô hiệu hóa khách hàng "${record.customerName}"?`);
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

interface ListUserProps {
    data: User[];
}

export default function ListUser({ data }: ListUserProps) {
    const router = useRouter();
    const [searchCustomerName, setSearchCustomerName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchCustomerCode, setSearchCustomerCode] = useState("");
    const [searchCreatedAt, setSearchCreatedAt] = useState<Dayjs | null>(null);

    const filteredData = data.filter((user) => {
        const nameMatch = (user.customerName + user.phoneNumber).toLowerCase().includes(searchCustomerName.toLowerCase());
        const addressMatch = user.address.toLowerCase().includes(searchAddress.toLowerCase());
        const codeMatch = user.customerCode?.toLowerCase().includes(searchCustomerCode.toLowerCase());
        const createdAtMatch = searchCreatedAt
            ? dayjs(user.createdAt).isSame(searchCreatedAt, "day")
            : true;
        return nameMatch && addressMatch && codeMatch && createdAtMatch;
    });

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [userIdToDelete, setUserIdToDelete] = useState<string>();

    const handleOk = () => {
        try {
            //delete user logic here
            console.log(`User ${userIdToDelete} deleted successfully`);
        } catch (error) {
            console.error("Error deleting user:", error);
            setUserIdToDelete(undefined);
        } finally {
            setMessage("");
            setOpen(false);
            setUserIdToDelete(undefined);
        }
    };

    return (
        <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
            <NotificationModal open={open} setOpen={setOpen} message={message} onOk={handleOk} />
            <Table<User>
                rowKey="id"
                size="small"
                pagination={{
                    pageSize: 8,
                    position: ["bottomCenter"],
                }}
                columns={getColumns(
                    searchCustomerName, setSearchCustomerName,
                    searchAddress, setSearchAddress,
                    searchCustomerCode, setSearchCustomerCode,
                    searchCreatedAt, setSearchCreatedAt,
                    setOpen, setMessage, setUserIdToDelete,
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
        </Card>
    );
}
