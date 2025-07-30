'use client';
import { User } from "@/type/user/user";
import { Table, Input, DatePicker, Avatar, Dropdown, Button, Card, message, Alert } from "antd";
import { useState, useEffect, useCallback } from "react";
import NotificationModal from "@/components/Modal";
import { Dayjs } from "dayjs";
import { UserOutlined, EllipsisOutlined, EyeOutlined, StopOutlined, StarOutlined, CrownOutlined, TrophyOutlined, ThunderboltOutlined, ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { UserService, UserFilters } from "@/api/user/userService";

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
    setModalMessage: (message: string) => void,
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
            dataIndex: "customerCode",
            key: "customerCode",
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
                <div style={{ textAlign: 'center' }}>
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
            width: 200,
            render: (address: string) => (
                <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 180
                }}>
                    {address}
                </div>
            ),
        },
        {
            title: (<div style={{ textAlign: 'center' }}>Thao tác</div>),
            key: "action",
            width: 100,
            render: (_: unknown, record: User) => {
                const items = [
                    {
                        key: 'view',
                        label: 'Xem chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => router.push(`/admin/customers/${record.id}`)
                    },
                    {
                        key: 'delete',
                        label: 'Xóa khách hàng',
                        icon: <StopOutlined />,
                        onClick: () => {
                            setModalMessage(`Bạn có chắc chắn muốn xóa khách hàng ${record.customerName}?`);
                            setUserIdToDelete(record.id);
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

interface ListUserWithAPIProps {
    title?: string;
}

export default function ListUserWithAPI({ title }: ListUserWithAPIProps) {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchCustomerName, setSearchCustomerName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchCustomerCode, setSearchCustomerCode] = useState("");
    const [searchCreatedAt, setSearchCreatedAt] = useState<Dayjs | null>(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 8,
        total: 0,
    });

    const [open, setOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [userIdToDelete, setUserIdToDelete] = useState<string>();

    // Fetch users from API
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const filters: UserFilters = {
                page: pagination.current,
                pageSize: pagination.pageSize,
            };

            // Add search filters
            if (searchCustomerName) filters.search = searchCustomerName;
            if (searchCustomerCode) filters.code = searchCustomerCode;
            if (searchAddress) filters.address = searchAddress;
            if (searchCreatedAt) filters.createdAt = searchCreatedAt.format('YYYY-MM-DD');

            const response = await UserService.getUsers(filters);
            setUsers(response.data);
            setPagination(prev => ({
                ...prev,
                total: response.pagination.total,
            }));
        } catch (err) {
            console.error('Error fetching users:', err);
            const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu từ API. Sử dụng dữ liệu mẫu.';
            setError(errorMessage);

            // Fallback to mock data
            const mockUsers = UserService.getMockUsers();
            setUsers(mockUsers);
            setPagination(prev => ({
                ...prev,
                total: mockUsers.length,
            }));
        } finally {
            setLoading(false);
        }
    }, [searchCustomerName, searchCustomerCode, searchAddress, searchCreatedAt]);

    // Fetch users when component mounts or filters change
    useEffect(() => {
        fetchUsers();
    }, [searchCustomerName, searchCustomerCode, searchAddress, searchCreatedAt]);

    const handleTableChange = (newPagination: { current?: number; pageSize?: number }) => {
        const newCurrent = newPagination.current || 1;
        const newPageSize = newPagination.pageSize || 8;

        setPagination(prev => ({
            ...prev,
            current: newCurrent,
            pageSize: newPageSize,
        }));

        // Immediately fetch users with new pagination
        const fetchWithNewPagination = async () => {
            setLoading(true);
            setError(null);
            try {
                const filters: UserFilters = {
                    page: newCurrent,
                    pageSize: newPageSize,
                };
                if (searchCustomerName) filters.search = searchCustomerName;
                if (searchCustomerCode) filters.code = searchCustomerCode;
                if (searchAddress) filters.address = searchAddress;
                if (searchCreatedAt) filters.createdAt = searchCreatedAt.format('YYYY-MM-DD');

                const response = await UserService.getUsers(filters);
                setUsers(response.data);
                setPagination(prev => ({ ...prev, total: response.pagination.total }));
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu từ API. Sử dụng dữ liệu mẫu.';
                setError(errorMessage);
                const mockUsers = UserService.getMockUsers();
                setUsers(mockUsers);
                setPagination(prev => ({ ...prev, total: mockUsers.length }));
            } finally {
                setLoading(false);
            }
        };

        fetchWithNewPagination();
    };

    const handleRefresh = () => {
        fetchUsers();
        message.success('Đã làm mới dữ liệu');
    };

    const handleOk = () => {
        try {
            //delete user logic here
            console.log(`User ${userIdToDelete} deleted successfully`);
            message.success('Xóa khách hàng thành công');
            fetchUsers(); // Refresh the list
        } catch (error) {
            console.error("Error deleting user:", error);
            message.error('Có lỗi xảy ra khi xóa khách hàng');
            setUserIdToDelete(undefined);
        } finally {
            setModalMessage("");
            setOpen(false);
            setUserIdToDelete(undefined);
        }
    };

    return (
        <Card title={title || "Danh sách khách hàng"} style={{ borderRadius: 12, overflow: 'hidden' }}>
            <NotificationModal open={open} setOpen={setOpen} message={modalMessage} onOk={handleOk} />

            {error && (
                <Alert
                    message="Lỗi API"
                    description={error}
                    type="warning"
                    showIcon
                    style={{ marginBottom: 16 }}
                    action={
                        <Button size="small" onClick={handleRefresh}>
                            Thử lại
                        </Button>
                    }
                />
            )}

            <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    loading={loading}
                >
                    Làm mới
                </Button>
            </div>

            <Table<User>
                rowKey="id"
                size="small"
                loading={loading}
                pagination={{
                    ...pagination,
                    position: ["bottomCenter"],
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} khách hàng`,
                }}
                columns={getColumns(
                    searchCustomerName, setSearchCustomerName,
                    searchAddress, setSearchAddress,
                    searchCustomerCode, setSearchCustomerCode,
                    searchCreatedAt, setSearchCreatedAt,
                    setOpen, setModalMessage, setUserIdToDelete,
                    router
                )}
                dataSource={users}
                onChange={handleTableChange}
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