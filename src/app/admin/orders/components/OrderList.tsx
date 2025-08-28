
import { Button, Card, DatePicker, Dropdown, Input, Select, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";

import { EllipsisOutlined, EyeOutlined, StopOutlined } from "@ant-design/icons";

const { Text } = Typography;

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from "react";
import NotificationModal from "@/components/Modal";
import { getOrders } from "@/api/order/order-api";
import { isDetailResponse } from "@/utils/response-handler";
import { Order } from "@/type/order/order";

const statusConfig = {
    'Hoàn thành': { color: 'success', icon: <CheckCircleOutlined /> },
    'Đang làm': { color: 'processing', icon: <ClockCircleOutlined /> },
    'Chờ làm': { color: 'default', icon: <ClockCircleOutlined /> },
    'Đã nhận': { color: 'processing', icon: <ClockCircleOutlined /> }, // đổi icon thành ClockCircleOutlined
    'Đã hủy': { color: 'error', icon: <ClockCircleOutlined /> },
};

function orderColumns(
    setMessage: (v: string) => void,
    setOpen: (open: boolean) => void,
    setOrderIdToDelete: (userId: string) => void,
    router: ReturnType<typeof useRouter>,
): ColumnsType<Order> {
    return [
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>STT</div>,
            dataIndex: 'index',
            key: 'index',
            render: (_: string, __: Order, index: number) => index + 1,
            align: 'center',
            width: 50,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Mã đơn</div>,
            dataIndex: 'idView',
            key: 'idView',
            render: (text: string) => <Text code>{text}</Text>,
            align: 'center',
            width: 100,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Ngày tạo</div>,
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (time: string) => (
                <Text>
                    {dayjs(time).format('HH:mm')}
                    <br />
                    {dayjs(time).format('DD/MM/YYYY')}
                </Text>
            ),
            align: 'center',
            width: 100,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Khách hàng</div>,
            dataIndex: 'customerName',
            render: (text: string, record: Order) => (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        fontWeight: 500,
                        fontSize: '11px',
                        marginBottom: 2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {record.customerName}
                    </div>
                    <div style={{
                        color: "#888",
                        fontSize: '10px',
                        marginBottom: 2
                    }}>
                        {record.customerPhone}
                    </div>
                </div>
            ),
            align: 'center',
            width: 120,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Dịch vụ</div>,
            dataIndex: 'serviceName',
            key: 'serviceName',
            align: 'center',
            width: 140,
            ellipsis: true,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Ngày làm</div>,
            dataIndex: 'workingTime',
            key: 'workingTime',
            render: (workingTime: string) => (
                <Text>
                    {dayjs(workingTime).format('HH:mm')}
                    <br />
                    {dayjs(workingTime).format('DD/MM/YYYY')}
                </Text>
            ),
            align: 'center',
            width: 100,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Địa chỉ</div>,
            dataIndex: 'address',
            key: 'address',
            render: (address: string) => (
                <Text>{address}</Text>
            ),
            align: 'center',
            width: 120,
            ellipsis: true,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>CTV</div>,
            dataIndex: 'ctv',
            key: 'ctv',
            render: (_: string, record: Order) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                        <div style={{
                            fontWeight: 500,
                            fontSize: '11px',
                            marginBottom: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {record.collaboratorName}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '10px',
                            marginBottom: 2
                        }}>
                            {record.collaboratorPhone}
                        </div>
                    </div>
                </div>
            ),
            align: 'center',
            width: 110,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Số tiền</div>,
            dataIndex: 'price',
            key: 'price',
            render: (price: string,) => (
                <div>
                    <Text strong style={{ color: '#52c41a', fontSize: '11px' }}>
                        {parseFloat(price).toLocaleString()}
                    </Text>
                    <br />
                </div>
            ),
            align: 'center',
            width: 100,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>PT TT</div>,
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
            render: (paymentMethod: string) => (
                <div>
                    <Text style={{ fontSize: 10 }}>
                        {paymentMethod}
                    </Text>
                    <br />
                </div>
            ),
            align: 'center',
            width: 80,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Trạng thái</div>,
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['Chờ làm'];
                return (
                    <Tag color={config.color} icon={config.icon} style={{ fontSize: '10px' }}>
                        {status}
                    </Tag>
                );
            },
            align: 'center',
            width: 100,
        },
        {
            title: "Hành động",
            key: "action",
            width: 70,
            render: (_: unknown, record: Order) => {
                const items = [
                    {
                        key: 'detail',
                        label: 'Chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => {
                            router.push(`/admin/orders/${record._id}`);
                        }
                    },
                    {
                        key: 'disable',
                        label: 'Vô hiệu hóa',
                        icon: <StopOutlined />,
                        onClick: () => {
                            setOrderIdToDelete(record._id);
                            setMessage(`Bạn có chắc chắn muốn xoá đơn này: "${record.customerName}"?`);
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

export default function OrderList() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [orderIdToDelete, setOrderIdToDelete] = useState<string>();

    const [orders, setOrders] = useState<Order[]>([]);
    const [orderSearch, setOrderSearch] = useState("");
    const [orderDateSearch, setOrderDateSearch] = useState<string | undefined>(undefined);
    const [customerSearch, setCustomerSearch] = useState("");
    const [serviceSearch, setServiceSearch] = useState("");
    const [workingTimeSearch, setWorkingTimeSearch] = useState<string | undefined>(undefined);
    const [ctvSearch, setCtvSearch] = useState("");
    const [paymentMethodSearch, setPaymentMethodSearch] = useState("");
    const [statusSearch, setStatusSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const response = await getOrders();
            if (isDetailResponse(response)) {
                setOrders(response.data);
            }
        };
        fetchData();
    }, []);
    const handleOk = () => {
        try {
            if (!orderIdToDelete) {
                console.error("No ID provided for deletion");
                return;
            }
            console.log(`Order with ID ${orderIdToDelete} deleted successfully`);
        } catch (error) {
            console.error("Error deleting:", error);
            setOrderIdToDelete(undefined);
        } finally {
            setMessage("");
            setOpen(false);
            setOrderIdToDelete(undefined);
        }
    };

    return (
        <div style={{
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Navigation Bar with Search Filters - Single Row */}
            <Card style={{ marginBottom: '16px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                    gap: '8px',
                    alignItems: 'end',
                    marginBottom: '12px',
                }}>
                    <div >
                        <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                            Mã đơn hàng
                        </Text>
                        <Input
                            placeholder="Mã đơn..."
                            allowClear
                            value={orderSearch}
                            onChange={e => setOrderSearch(e.target.value)}
                            size="small"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div >
                        <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                            Ngày tạo
                        </Text>
                        <DatePicker
                            placeholder="Chọn ngày"
                            allowClear
                            value={orderDateSearch ? dayjs(orderDateSearch) : null}
                            onChange={(date) => setOrderDateSearch(date ? date.format('YYYY-MM-DD') : undefined)}
                            size="small"
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                        />
                    </div>

                    <div >
                        <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                            Khách hàng
                        </Text>
                        <Input
                            placeholder="Tìm khách hàng..."
                            allowClear
                            value={customerSearch}
                            onChange={e => setCustomerSearch(e.target.value)}
                            size="small"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div >
                        <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                            Dịch vụ
                        </Text>
                        <Select
                            placeholder="Chọn dịch vụ"
                            allowClear
                            value={serviceSearch || undefined}
                            onChange={setServiceSearch}
                            size="small"
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="Vệ sinh theo giờ">Vệ sinh theo giờ</Select.Option>
                            <Select.Option value="Tổng vệ sinh">Tổng vệ sinh</Select.Option>
                            <Select.Option value="Vệ sinh máy lạnh">Vệ sinh máy lạnh</Select.Option>
                            <Select.Option value="Vệ sinh máy giặt">Vệ sinh máy giặt</Select.Option>
                            <Select.Option value="Vệ sinh máy nóng lạnh">Vệ sinh máy nóng lạnh</Select.Option>
                        </Select>
                    </div>

                    <div >
                        <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                            Ngày làm việc
                        </Text>
                        <DatePicker
                            placeholder="Chọn ngày"
                            allowClear
                            value={workingTimeSearch ? dayjs(workingTimeSearch) : null}
                            onChange={(date) => setWorkingTimeSearch(date ? date.format('YYYY-MM-DD') : undefined)}
                            size="small"
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                        />
                    </div>

                    <div >
                        <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                            CTV
                        </Text>
                        <Input
                            placeholder="Tìm CTV..."
                            allowClear
                            value={ctvSearch}
                            onChange={e => setCtvSearch(e.target.value)}
                            size="small"
                            style={{ width: '100%' }}
                        />
                    </div>

                    <div >
                        <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                            Phương thức TT
                        </Text>
                        <Select
                            placeholder="Chọn PT"
                            allowClear
                            value={paymentMethodSearch || undefined}
                            onChange={setPaymentMethodSearch}
                            size="small"
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="Tiền mặt">Tiền mặt</Select.Option>
                            <Select.Option value="Momo">Momo</Select.Option>
                            <Select.Option value="VnPay">VnPay</Select.Option>
                        </Select>
                    </div>

                    <div >
                        <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                            Trạng thái
                        </Text>
                        <Select
                            placeholder="Chọn TT"
                            allowClear
                            value={statusSearch || undefined}
                            onChange={setStatusSearch}
                            size="small"
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="Hoàn thành">Hoàn thành</Select.Option>
                            <Select.Option value="Đang làm">Đang làm</Select.Option>
                            <Select.Option value="Chờ làm">Chờ làm</Select.Option>
                            <Select.Option value="Đã nhận">Đã nhận</Select.Option>
                            <Select.Option value="Đã hủy">Đã hủy</Select.Option>
                        </Select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                        Tìm thấy {orders.length} đơn hàng
                    </Typography.Text>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            size="small"
                            onClick={() => {
                                setOrderSearch("");
                                setOrderDateSearch(undefined);
                                setCustomerSearch("");
                                setServiceSearch("");
                                setWorkingTimeSearch(undefined);
                                setCtvSearch("");
                                setPaymentMethodSearch("");
                                setStatusSearch("");
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                        <Button type="primary" size="small"
                            onClick={() => router.push('/admin/orders/create-customer-order')}
                        >
                            Tạo đơn hàng cá nhân
                        </Button>
                        <Button type="primary" size="small"
                            onClick={() => router.push('/admin/orders/create-business-order')}
                        >
                            Tạo đơn hàng doanh nghiệp
                        </Button>
                    </div>
                </div>
            </Card>


            {/* Table */}
            <Card style={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
                <NotificationModal open={open} setOpen={setOpen} message={message} onOk={handleOk} />
                <div style={{
                    width: '100%',
                    overflowX: 'auto'
                }}>
                    <Table
                        dataSource={orders}
                        columns={
                            orderColumns(
                                setMessage,
                                setOpen,
                                setOrderIdToDelete,
                                router,
                            )}
                        rowKey="id"
                        size="small"
                        className="small-font-table"
                        pagination={{
                            pageSize: 10,
                            position: ['bottomCenter'],
                        }}
                        scroll={{ x: 1200 }}
                        style={{
                            width: '100%',
                            minWidth: '1200px'
                        }}
                    />
                </div>
                <style jsx>{`
                    :global(.small-font-table) {
                        font-size: 11px !important;
                    }
                    :global(.small-font-table .ant-table-tbody > tr > td),
                    :global(.small-font-table .ant-table-thead > tr > th) {
                        font-size: 11px !important;
                        padding: 6px 4px !important;
                    }
                    :global(.small-font-table .ant-typography) {
                        font-size: 11px !important;
                    }
                    :global(.small-font-table .ant-tag) {
                        font-size: 10px !important;
                        padding: 1px 4px !important;
                        margin: 0 !important;
                    }
                    :global(.small-font-table .ant-table-thead > tr > th > div) {
                        font-size: 11px !important;
                        font-weight: 600 !important;
                    }
                    :global(.small-font-table .ant-table-tbody > tr:nth-child(even)) {
                        background-color: #fafafa;
                    }
                    :global(.small-font-table .ant-table-container) {
                        font-size: 11px !important;
                        width: 100% !important;
                        max-width: 100% !important;
                    }
                    :global(.small-font-table .ant-btn) {
                        font-size: 10px !important;
                        padding: 2px 4px !important;
                        height: auto !important;
                    }
                    :global(.small-font-table .ant-table) {
                        width: 100% !important;
                    }
                    :global(.small-font-table .ant-table-content) {
                        overflow-x: auto !important;
                    }
                    @media (max-width: 1200px) {
                        :global(.small-font-table .ant-table-tbody > tr > td),
                        :global(.small-font-table .ant-table-thead > tr > th) {
                            padding: 4px 2px !important;
                        }
                    }
                `}</style>
            </Card>
        </div>

    );
}