'use client';

import { Table, Input, DatePicker, Avatar, Dropdown, Button, Card } from "antd";
import { UserOutlined, EllipsisOutlined, EyeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

import { PAGE_SIZE } from "@/common/page-size";
import { Customer } from "@/type/user/customer/customer";
import { useCustomerList } from "../hooks/use-customer-list";
import { useCustomerContext } from "../provider/customer-provider";


function getColumns(
    searchCustomerName: string, setSearchCustomerName: (v: string) => void,
    searchAddress: string, setSearchAddress: (v: string) => void,
    searchCustomerCode: string, setSearchCustomerCode: (v: string) => void,
    searchCreatedAt: string, setSearchCreatedAt: (v: string) => void,
    router: ReturnType<typeof useRouter>,
    loading: boolean = false
) {

    return [
        {
            title: (<div style={{ textAlign: 'center' }}>STT</div>),
            dataIndex: "stt",
            key: "stt",
            render: (_: unknown, __: Customer, index: number) => index + 1,
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
                        suffix={loading ? <LoadingOutlined /> : null}
                    />
                </div>
            ),
            dataIndex: "code",
            key: "code",
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
            dataIndex: "joinedAt",
            key: "joinedAt",
            width: 180,
            render: (joinedAt: string) => (
                <div style={{ textAlign: 'center' }}>
                    {new Date(joinedAt).toLocaleDateString()}
                </div>
            ),
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
                        suffix={loading ? <LoadingOutlined /> : null}
                    />
                </div>
            ),
            key: "customer",
            width: 280,
            render: (_: unknown, record: Customer) => (
                <div key={record._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={50}
                        src={undefined}
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
                            {record.userId?.fullName || 'Chưa cập nhật'}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {record.userId?.phone || 'Chưa cập nhật'}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Hạng
                </div>
            ),
            dataIndex: "rank",
            key: "rank",
            render: (rank: string) => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            minHeight: 28,
                            minWidth: 80,
                            padding: '4px 0',
                            borderRadius: 12,
                            color: '#fff',
                            fontWeight: 500,
                            fontSize: 12,
                            textAlign: 'center',
                        }}
                    >
                        <span style={{ width: '100%', textAlign: 'center', color: 'black', fontWeight: 'bold' }}>{rank}</span>
                    </div>
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
                        placeholder="Filter address"
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
            render: (_: unknown, record: Customer) => (
                <div style={{ textAlign: 'center', minWidth: 120 }}>
                    {record.userId?.address || 'Chưa cập nhật'}
                </div>
            ),
            width: 180,
        },
        {
            title: "",
            key: "action",
            width: 80,
            render: (_: unknown, record: Customer) => {
                const items = [
                    {
                        key: 'detail',
                        label: 'Chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => {
                            router.push(`/admin/customers/${record._id}`);
                        }
                    },
                    // {
                    //     key: 'disable',
                    //     label: 'Vô hiệu hóa',
                    //     icon: <StopOutlined />,
                    //     onClick: () => {
                    //         setUserIdToDelete(record._id);
                    //         setMessage(`Bạn có chắc chắn muốn vô hiệu hóa khách hàng "${record.userId?.fullName || 'người dùng này'}"?`);
                    //         setOpen(true);
                    //     }
                    // }
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


export default function ListUser() {
    const router = useRouter();
    const { page, setPage,
        searchCustomerName, setSearchCustomerName,
        searchAddress, setSearchAddress,
        searchCustomerCode, setSearchCustomerCode,
        searchCreatedAt, setSearchCreatedAt,
    } = useCustomerContext();
    const { data, loading } = useCustomerList();
    if (!data) {
        return (
            <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ padding: 16, textAlign: 'center' }}>
                    <p>Đang tải dữ liệu...</p>
                </div>
            </Card>
        );
    }

    return (
        <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
            <Table<Customer>
                rowKey="_id"
                size="small"
                loading={loading}
                pagination={{
                    pageSize: PAGE_SIZE,
                    current: page,
                    total: data?.pagination?.total,
                    onChange: (page) => setPage(page),
                    position: ["bottomCenter"],
                }}
                columns={getColumns(
                    searchCustomerName, setSearchCustomerName,
                    searchAddress, setSearchAddress,
                    searchCustomerCode, setSearchCustomerCode,
                    searchCreatedAt, setSearchCreatedAt,
                    router,
                    loading
                )}
                dataSource={data?.data}

                showSorterTooltip={{ target: 'sorter-icon' }}
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            />
        </Card>
    );
}
