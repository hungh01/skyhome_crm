'use client';
import { User } from "@/type/user/user";
import { Table, Input, DatePicker, Avatar, Dropdown, Button, Card } from "antd";
import { useEffect, useState } from "react";
import NotificationModal from "@/components/Modal";
import { UserOutlined, EllipsisOutlined, EyeOutlined, StopOutlined, StarOutlined, CrownOutlined, TrophyOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { customerListApi } from "@/api/user/customer-api";
import { CustomerListResponse } from "@/type/user/customer/customer-list-respone";
import { PAGE_SIZE } from "@/common/page-size";


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
    searchCreatedAt: string, setSearchCreatedAt: (v: string) => void,
    searchCustomerRank: string, setSearchCustomerRank: (v: string) => void,
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
                        value={searchCustomerCode}
                        onChange={e => setSearchCustomerCode(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 120, marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: "_id",
            key: "_id",
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
                <div key={record._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                    <Input
                        placeholder="Search address"
                        allowClear
                        value={searchCustomerRank}
                        onChange={e => setSearchCustomerRank(e.target.value)}
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
                            router.push(`/admin/customers/${record._id}`);
                        }
                    },
                    {
                        key: 'disable',
                        label: 'Vô hiệu hóa',
                        icon: <StopOutlined />,
                        onClick: () => {
                            setUserIdToDelete(record._id);
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

export default function ListUser() {
    const router = useRouter();
    const [data, setData] = useState<CustomerListResponse>();
    const [searchCustomerName, setSearchCustomerName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchCustomerCode, setSearchCustomerCode] = useState("");
    const [searchCreatedAt, setSearchCreatedAt] = useState("");
    const [searchCustomerRank, setSearchCustomerRank] = useState("");
    const [page, setPage] = useState(1);

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [userIdToDelete, setUserIdToDelete] = useState<string>();


    useEffect(() => {
        const fetchCustomers = async () => {
            const res = await customerListApi(
                page,
                PAGE_SIZE,
                searchCustomerCode,
                searchCreatedAt,
                searchCustomerName,
                searchCustomerRank,
                searchAddress,
            );
            if (res) {
                setData(res);
            } else {
                console.error("Failed to fetch customers:", res);
            }
        };
        fetchCustomers();
    }, [
        page,
        searchCustomerName,
        searchAddress,
        searchCustomerCode,
        searchCustomerRank,
        searchCreatedAt // Always include the variable itself, not a conditional expression
    ]);

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
                rowKey="_id"
                size="small"
                pagination={{
                    pageSize: PAGE_SIZE,
                    current: page,
                    total: data?.pagination.total,
                    onChange: (page) => setPage(page),
                    position: ["bottomCenter"],
                }}
                columns={getColumns(
                    searchCustomerName, setSearchCustomerName,
                    searchAddress, setSearchAddress,
                    searchCustomerCode, setSearchCustomerCode,
                    searchCreatedAt, setSearchCreatedAt,
                    searchCustomerRank, setSearchCustomerRank,
                    setOpen, setMessage, setUserIdToDelete,
                    router
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
            `}</style>
        </Card>
    );
}
