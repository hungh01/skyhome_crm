'use client';
import { User } from "@/type/user";
import { Table, Input, DatePicker, Avatar, Dropdown, Button, Card, Select, SelectProps } from "antd";
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
    searchRank: number | null, setSearchRank: (v: number | null) => void,
    searchReferralCode: string, setSearchReferralCode: (v: string) => void,
    searchCreatedAt: Dayjs | null, setSearchCreatedAt: (v: Dayjs | null) => void,
    setOpen: (open: boolean) => void,
    setMessage: (message: string) => void,
    setUserIdToDelete: (userId: string) => void,
    router: ReturnType<typeof useRouter>
) {

    return [
        {
            title: (<div style={{ textAlign: 'center' }}>STT</div>),
            dataIndex: "stt",
            key: "stt",
            render: (_: unknown, __: User, index: number) => index + 1,
            width: 60,
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Mã khách hàng
                    <Input
                        placeholder="Search code"
                        allowClear
                        value={searchReferralCode}
                        onChange={e => setSearchReferralCode(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 120, marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: "referralCode",
            key: "referralCode",
            width: 160,
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Ngày tạo
                    <br />
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
                <div style={{ textAlign: 'center' }}>
                    Khách hàng
                    <br />
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
                            {record.fullName}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {record.phone}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Hạng
                    <br />
                    <Select
                        placeholder="Search rank"
                        allowClear
                        value={searchRank}
                        onChange={(value) => setSearchRank(value as number | null)}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                    >
                        {rankUser.map(r => (
                            <Select.Option key={r.rank} value={r.rank}>
                                {r.name}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            ),
            dataIndex: "rank",
            key: "rank",
            render: (rank: number) => {
                const rankInfo = rankUser.find(r => r.rank === rank);
                if (!rankInfo) return null;
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {rankInfo.icon}
                        <span>{rankInfo.name}</span>
                    </div>
                );
            },
            width: 120,
        },
        
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Mã giới thiệu
                </div>
            ),
            dataIndex: "referralCode",
            key: "referralCode",
            width: 120,
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
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
            title: "",
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
                            setUserIdToDelete(record.id || record._id || '');
                            setMessage(`Bạn có chắc chắn muốn vô hiệu hóa khách hàng "${record.fullName}"?`);
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
    const [searchReferralCode, setSearchReferralCode] = useState("");
    const [searchCreatedAt, setSearchCreatedAt] = useState<Dayjs | null>(null);
    const [searchRank, setSearchRank] = useState<number | null>(null);
    const filteredData = data.filter((user) => {
        const nameMatch = ((user.fullName || '') + (user.phone || '')).toLowerCase().includes(searchCustomerName.toLowerCase());
        const addressMatch = (user.address || '').toLowerCase().includes(searchAddress.toLowerCase());
        const codeMatch = (user.referralCode || '').toLowerCase().includes(searchReferralCode.toLowerCase());
        const rankMatch = searchRank !== null ? user.rank === searchRank : true;
        const createdAtMatch = searchCreatedAt
            ? dayjs(user.createdAt).isSame(searchCreatedAt, "day")
            : true;
        return nameMatch && addressMatch && codeMatch && rankMatch && createdAtMatch;
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
                    searchRank, setSearchRank,
                    searchReferralCode, setSearchReferralCode,
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
