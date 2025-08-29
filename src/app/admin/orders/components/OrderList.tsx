
import { Button, Card, DatePicker, Dropdown, Input, Select, Spin, Table, Tag, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';
import { useRouter } from "next/navigation";
import { debounce } from 'lodash';
import { useCallback } from "react";

import { EllipsisOutlined, EyeOutlined, StopOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { RangePicker } = DatePicker;

import {
    CheckCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from "react";
import NotificationModal from "@/components/Modal";
import { getOrders } from "@/api/order/order-api";
import { isDetailResponse } from "@/utils/response-handler";
import { Order } from "@/type/order/order";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ErrorResponse } from "@/type/error";

const statusConfig = {
    'done': { color: 'success', icon: <CheckCircleOutlined /> },
    'doing': { color: 'processing', icon: <ClockCircleOutlined /> },
    'confirm': { color: 'default', icon: <ClockCircleOutlined /> },
    'pending': { color: 'processing', icon: <ClockCircleOutlined /> }, // đổi icon thành ClockCircleOutlined
    'cancel': { color: 'error', icon: <ClockCircleOutlined /> },
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
            width: 150,
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
            key: 'serviceName',
            align: 'center',
            width: 140,
            // ellipsis: true,
            render: (record: Order) => (
                <div>
                    <Text strong>
                        {record?.serviceDetails?.name || ''} ({record?.serviceCategoryDetails?.name || ''})
                    </Text>
                </div>
            )
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Ngày làm</div>,
            dataIndex: 'dateWork',
            key: 'dateWork',
            render: (dateWork: string) => (
                <Text>
                    {dayjs(dateWork).format('HH:mm')}
                    <br />
                    {dayjs(dateWork).format('DD/MM/YYYY')}
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
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (totalPrice: string, record: Order) => (
                <div>
                    <Text strong style={{ color: '#52c41a', fontSize: '11px' }}>
                        {parseFloat(totalPrice).toLocaleString()}
                    </Text>
                    <br />
                    <Text style={{ fontSize: '10px', color: '#888' }}>
                        by {record.paymentMethod}
                    </Text>
                </div>
            ),
            align: 'center',
            width: 100,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Trạng thái</div>,
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['pending'];
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

    const [data, setData] = useState<DetailResponse<Order[]> | ErrorResponse>();
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [orderSearch, setOrderSearch] = useState("");

    const [createdAtStart, setCreatedAtStart] = useState("");
    const [createdAtEnd, setCreatedAtEnd] = useState("");

    const [customerSearch, setCustomerSearch] = useState("");
    const [serviceSearch, setServiceSearch] = useState("");

    const [dateWorkStart, setDateWorkStart] = useState("");
    const [dateWorkEnd, setDateWorkEnd] = useState("");
    const [collaboratorSearch, setCollaboratorSearch] = useState("");
    const [paymentMethodSearch, setPaymentMethodSearch] = useState("");
    const [statusSearch, setStatusSearch] = useState("");

    // Debounced fetch function
    const debouncedFetchData = useCallback(
        debounce(async (
            page: number,
            orderSearch: string,
            createdAtStart: string,
            createdAtEnd: string,
            customerSearch: string,
            serviceSearch: string,
            dateWorkStart: string,
            dateWorkEnd: string,
            collaboratorSearch: string,
            paymentMethodSearch: string,
            statusSearch: string
        ) => {
            try {
                setLoading(true);
                const response = await getOrders(
                    page,
                    orderSearch,
                    createdAtStart,
                    createdAtEnd,
                    customerSearch,
                    serviceSearch,
                    dateWorkStart,
                    dateWorkEnd,
                    collaboratorSearch,
                    paymentMethodSearch,
                    statusSearch
                );
                if (isDetailResponse(response)) {
                    setData(response);
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        }, 500), // 500ms delay
        []
    );

    // Initial load
    useEffect(() => {
        setLoading(true);
    }, []);

    useEffect(() => {
        debouncedFetchData(
            page,
            orderSearch,
            createdAtStart,
            createdAtEnd,
            customerSearch,
            serviceSearch,
            dateWorkStart,
            dateWorkEnd,
            collaboratorSearch,
            paymentMethodSearch,
            statusSearch
        );
    }, [
        debouncedFetchData,
        page,
        orderSearch,
        createdAtStart,
        createdAtEnd,
        customerSearch,
        serviceSearch,
        dateWorkStart,
        dateWorkEnd,
        collaboratorSearch,
        paymentMethodSearch,
        statusSearch
    ]);

    // Cleanup debounced function on unmount
    useEffect(() => {
        return () => {
            debouncedFetchData.cancel();
        };
    }, [debouncedFetchData]);

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
                        <RangePicker
                            placeholder={['Từ', 'Đến']}
                            allowClear
                            value={[
                                createdAtStart ? dayjs(createdAtStart) : null,
                                createdAtEnd ? dayjs(createdAtEnd) : null
                            ]}
                            onChange={(dates) => {
                                if (dates && dates[0] && dates[1]) {
                                    setCreatedAtStart(dates[0].format('YYYY-MM-DD'));
                                    setCreatedAtEnd(dates[1].format('YYYY-MM-DD'));
                                } else {
                                    setCreatedAtStart("");
                                    setCreatedAtEnd("");
                                }
                            }}
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
                            Thời gian làm việc
                        </Text>
                        <RangePicker
                            placeholder={['Từ', 'Đến']}
                            allowClear
                            value={[
                                dateWorkStart ? dayjs(dateWorkStart) : null,
                                dateWorkEnd ? dayjs(dateWorkEnd) : null
                            ]}
                            onChange={(dates) => {
                                if (dates && dates[0] && dates[1]) {
                                    setDateWorkStart(dates[0].format('YYYY-MM-DD'));
                                    setDateWorkEnd(dates[1].format('YYYY-MM-DD'));
                                } else {
                                    setDateWorkStart("");
                                    setDateWorkEnd("");
                                }
                            }}
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
                            value={collaboratorSearch}
                            onChange={e => setCollaboratorSearch(e.target.value)}
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
                            onChange={(value) => setPaymentMethodSearch(value || "")}
                            size="small"
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="cash">Tiền mặt</Select.Option>
                            <Select.Option value="card">Thẻ</Select.Option>
                            <Select.Option value="online">Momo, VnPay</Select.Option>
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
                            onChange={(value) => setStatusSearch(value || "")}
                            size="small"
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="done">Hoàn thành</Select.Option>
                            <Select.Option value="doing">Đang làm</Select.Option>
                            <Select.Option value="confirm">Chờ làm</Select.Option>
                            <Select.Option value="pending">Đã nhận</Select.Option>
                            <Select.Option value="cancel">Đã hủy</Select.Option>
                        </Select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                    <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                        Tìm thấy {isDetailResponse(data) ? data.pagination?.total : 0} đơn hàng
                    </Typography.Text>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            size="small"
                            loading={loading}
                            onClick={() => {
                                setOrderSearch("");
                                setDateWorkStart("");
                                setDateWorkEnd("");
                                setCustomerSearch("");
                                setServiceSearch("");
                                setDateWorkStart("");
                                setDateWorkEnd("");
                                setCollaboratorSearch("");
                                setPaymentMethodSearch("");
                                setStatusSearch("");
                            }}
                        >
                            Xóa bộ lọc
                        </Button>
                        <Button type="primary" size="small"
                            loading={loading}
                            onClick={() => router.push('/admin/orders/create-customer-order')}
                        >
                            Tạo đơn hàng cá nhân
                        </Button>
                        <Button type="primary" size="small"
                            loading={loading}
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
                        dataSource={isDetailResponse(data) ? data.data : []}
                        columns={
                            orderColumns(
                                setMessage,
                                setOpen,
                                setOrderIdToDelete,
                                router,
                            )}
                        rowKey="_id"
                        size="small"
                        className="small-font-table"
                        loading={loading}
                        pagination={{
                            current: isDetailResponse(data) ? data.pagination?.page : 1,
                            pageSize: isDetailResponse(data) ? data.pagination?.pageSize : 10,
                            total: isDetailResponse(data) ? data.pagination?.total : 0,
                            onChange: (page) => setPage(page),
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