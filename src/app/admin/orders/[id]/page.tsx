"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
    Card,
    Row,
    Col,
    Typography,
    Tag,
    Button,
    Table,
    Avatar,
    Space,
    Modal,
    Form,
    Input,
    Select,
    message,
    Divider,

} from "antd";
import UpdateAddressModal from "../components/UpdateAddressModal";



const { Title, Text } = Typography;

interface OrderItem {
    id: string;
    description: string;
    price: number;
    quantity: number;
    total: number;
}

interface OrderDetails {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    staffName: string;
    staffPhone: string;
    address: string;
    serviceDate: string;
    serviceTime: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    items: OrderItem[];
    subtotal: number;
    discount: number;
    serviceCharge: number;
    tip: number;
    total: number;
    paymentMethod: string;
    customerNotes: string;
    createdAt: string;
    timeline: {
        status: string;
        time: string;
        description: string;
    }[];
}

const mockOrderData: OrderDetails = {
    id: "25790000337",
    customerName: "SƠN 52",
    customerPhone: "0779902052",
    customerEmail: "son52@example.com",
    staffName: "Đang tìm kiếm",
    staffPhone: "Đang tìm kiếm",
    address: "246 Phạm Văn Chiêu, Phường 9, Gò Vấp, Hồ Chí Minh",
    serviceDate: "18/07/2025",
    serviceTime: "09:00 - 11:00",
    status: 'pending',
    items: [
        {
            id: "1",
            description: "2 giờ (55m² 2 phòng)",
            price: 192000,
            quantity: 1,
            total: 192000
        },
        {
            id: "2",
            description: "Mang theo dụng cụ",
            price: 30000,
            quantity: 1,
            total: 30000
        }
    ],
    subtotal: 222000,
    discount: 10000,
    serviceCharge: 2000,
    tip: 10000,
    total: 224000,
    paymentMethod: "Tiền mặt",
    customerNotes: "Muốn chị Hoàng Yến làm",
    createdAt: "15/07/2025 08:29",
    timeline: [
        {
            status: "Đặt hàng",
            time: "15/07/2025 08:29",
            description: "Khách hàng đặt hàng thành công"
        },
        {
            status: "Xác nhận",
            time: "15/07/2025 09:00",
            description: "Đang tìm kiếm nhân viên phù hợp"
        }
    ]
};

export default function OrderDetailPage() {
    const params = useParams();
    const [order, setOrder] = useState<OrderDetails>(mockOrderData);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [editForm] = Form.useForm();

    // Use params.id if needed for future API calls
    console.log('Order ID from params:', params.id);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'orange';
            case 'confirmed': return 'blue';
            case 'in_progress': return 'purple';
            case 'completed': return 'green';
            case 'cancelled': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Đang chờ làm';
            case 'confirmed': return 'Đã xác nhận';
            case 'in_progress': return 'Đang thực hiện';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const handleUpdateOrder = () => {
        editForm.setFieldsValue({
            status: order.status,
            staffName: order.staffName,
            staffPhone: order.staffPhone
        });
        setIsEditModalVisible(true);
    };

    const handleEditSubmit = (values: {
        status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
        staffName?: string;
        staffPhone?: string;
    }) => {
        setOrder(prev => ({
            ...prev,
            ...values
        }));
        setIsEditModalVisible(false);
        message.success('Cập nhật đơn hàng thành công!');
    };

    const handleAddressUpdate = (newAddress: string) => {
        setOrder(prev => ({
            ...prev,
            address: newAddress
        }));
    };

    const columns = [
        {
            title: 'Mã đơn',
            dataIndex: 'id',
            key: 'id',
            width: 150,
            render: (text: string) => (
                <Text style={{ color: '#1890ff', fontWeight: 600 }}>
                    #{text}
                </Text>
            )
        },
        {
            title: 'Dịch vụ',
            dataIndex: 'description',
            key: 'description',
            width: 200
        },
        {
            title: 'Ngày làm',
            key: 'date',
            width: 120,
            render: () => (
                <div>
                    <div>{order.serviceDate}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>
                        {order.serviceTime}
                    </div>
                </div>
            )
        },
        {
            title: 'Công tác viên',
            key: 'staff',
            width: 150,
            render: () => (
                <div>
                    <div>{order.staffName}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>
                        {order.staffPhone}
                    </div>
                </div>
            )
        },
        {
            title: 'Trạng thái',
            key: 'status',
            width: 120,
            render: () => (
                <Tag color={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                </Tag>
            )
        },
        {
            title: 'Tổng tiền',
            key: 'total',
            width: 120,
            render: () => (
                <Text style={{ fontWeight: 600 }}>
                    {order.total.toLocaleString()} đ
                </Text>
            )
        },
        {
            title: 'Tổng khuyến mãi',
            key: 'discount',
            width: 120,
            render: () => (
                <Text style={{ color: '#ff4d4f' }}>
                    -{order.discount.toLocaleString()} đ
                </Text>
            )
        },
        {
            title: 'Thanh toán',
            key: 'payment',
            width: 120,
            render: () => (
                <div>
                    <div>{order.paymentMethod}</div>
                    <div style={{ fontWeight: 600 }}>
                        {order.total.toLocaleString()} đ
                    </div>
                </div>
            )
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: () => (
                <Space>
                    <Button
                        type="primary"
                        size="small"
                        onClick={handleUpdateOrder}
                    >
                        Hủy đơn
                    </Button>
                    <Button
                        type="text"
                        size="small"

                    />
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 24,
                background: '#fff',
                padding: '16px 24px',
                borderRadius: 8
            }}>
                <div>
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                        Mã đơn hàng #{order.id}
                    </Title>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Text type="secondary">
                        Thứ 3 {order.createdAt.split(' ')[0]}
                    </Text>
                    <Text type="secondary">
                        {order.createdAt.split(' ')[1]}
                    </Text>
                    <Button
                        type="primary"
                        style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
                    >
                        Đang chờ làm
                    </Button>
                </div>
            </div>

            <Row gutter={[24, 24]}>
                {/* Left Column */}
                <Col xs={24} lg={16}>
                    {/* Customer Info */}
                    <Card title="Thông tin khách hàng" style={{ marginBottom: 24 }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Avatar size={48} />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 16 }}>
                                            {order.customerName}
                                        </div>
                                        <div style={{ color: '#666' }}>Thành viên</div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ marginBottom: 8 }}>
                                        <Text>Tên: <strong>{order.customerName}</strong></Text>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <Text>SĐT: <strong>{order.customerPhone}</strong></Text>
                                    </div>
                                    <div>
                                        <Text>Email: <strong>{order.customerEmail}</strong></Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Staff Info */}
                    <Card title="Thông tin công tác viên" style={{ marginBottom: 24 }}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <Avatar size={48} />
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 16 }}>
                                            {order.staffName}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ marginTop: 16 }}>
                                    <div style={{ marginBottom: 8 }}>
                                        <Text>Tên: <strong>{order.staffName}</strong></Text>
                                    </div>
                                    <div style={{ marginBottom: 8 }}>
                                        <Text>SĐT: <strong>{order.staffPhone}</strong></Text>
                                    </div>
                                    <div>
                                        <Text>Số sao: <strong>{order.staffName}</strong></Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    {/* Order Items */}
                    <Card title="Chi tiết đơn hàng" style={{ marginBottom: 24 }}>
                        <Table
                            columns={[
                                {
                                    title: 'Mô tả',
                                    dataIndex: 'description',
                                    key: 'description'
                                },
                                {
                                    title: 'Giá',
                                    dataIndex: 'price',
                                    key: 'price',
                                    render: (price: number) => `${price.toLocaleString()} đ`
                                },
                                {
                                    title: 'Số lượng',
                                    dataIndex: 'quantity',
                                    key: 'quantity',
                                    align: 'center' as const
                                },
                                {
                                    title: 'Thành tiền',
                                    dataIndex: 'total',
                                    key: 'total',
                                    render: (total: number) => `${total.toLocaleString()} đ`
                                }
                            ]}
                            dataSource={order.items}
                            rowKey="id"
                            pagination={false}
                            size="small"
                        />
                    </Card>

                    {/* Customer Notes */}
                    <Card title="Ghi chú của khách KH" style={{ marginBottom: 24 }}>
                        <Input.TextArea
                            value={order.customerNotes}
                            rows={4}
                            readOnly
                            style={{ resize: 'none' }}
                        />
                    </Card>

                    {/* Order History Table */}
                    <Card title="Lịch sử đơn hàng" style={{ marginBottom: 24 }}>
                        <Table
                            columns={columns}
                            dataSource={[{
                                key: `order-history-${order.id}`,
                                ...order,
                                id: `${order.id}.001`,
                                description: order.items[0]?.description || ''
                            }]}
                            rowKey="key"
                            pagination={false}
                            size="small"
                        />
                    </Card>
                </Col>

                {/* Right Column */}
                <Col xs={24} lg={8}>
                    {/* Address and Time */}
                    <Card
                        title="Thông tin thời gian và địa chỉ"
                        style={{ marginBottom: 24 }}
                        extra={
                            <Button
                                type="primary"
                                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                                onClick={() => setIsAddressModalVisible(true)}
                            >
                                Chỉnh sửa
                            </Button>
                        }
                    >
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>

                                <Text strong>Địa chỉ:</Text>
                            </div>
                            <Text>{order.address}</Text>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>

                                <Text strong>Ngày làm:</Text>
                            </div>
                            <Text>{order.serviceDate} (Thứ 6)</Text>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>

                                <Text strong>Giờ làm:</Text>
                            </div>
                            <Text>{order.serviceTime} (2giờ)</Text>
                        </div>
                    </Card>

                    {/* Payment Summary */}
                    <Card title="Thông tin thanh toán đơn hàng" style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text>Tổng tiền</Text>
                                <Text strong>{order.subtotal.toLocaleString()} đ</Text>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text>Chương trình khuyến mãi</Text>
                                <Text></Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text style={{ color: '#ff4d4f' }}>Ngày vàng cuối năm không lo về giá</Text>
                                <Text style={{ color: '#ff4d4f' }}>-{order.discount.toLocaleString()} đ</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                <Text>VAT (10%)</Text>
                                <Text>{(order.subtotal * 0.1).toLocaleString()} đ</Text>
                            </div>
                            <Divider />

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text strong style={{ fontSize: 16 }}>Tổng tiền</Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {(order.subtotal * 1.1 - order.discount).toLocaleString()} đ
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Edit Modal */}
            <Modal
                title="Cập nhật đơn hàng"
                open={isEditModalVisible}
                onCancel={() => setIsEditModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditSubmit}
                >
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Select.Option value="pending">Đang chờ làm</Select.Option>
                            <Select.Option value="confirmed">Đã xác nhận</Select.Option>
                            <Select.Option value="in_progress">Đang thực hiện</Select.Option>
                            <Select.Option value="completed">Hoàn thành</Select.Option>
                            <Select.Option value="cancelled">Đã hủy</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Tên công tác viên"
                        name="staffName"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="SĐT công tác viên"
                        name="staffPhone"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsEditModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Update Address Modal */}
            <UpdateAddressModal
                visible={isAddressModalVisible}
                onCancel={() => setIsAddressModalVisible(false)}
                onSuccess={handleAddressUpdate}
                currentAddress={order.address}
            />
        </div>
    );
}
