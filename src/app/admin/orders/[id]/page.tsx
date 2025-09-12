"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    Card,
    Row,
    Col,
    Typography,
    Tag,
    Button,
    Table,
    Space,
    Descriptions,
    Divider,
    Spin,
    message,
    Rate,
    Select,
    Input,
    Dropdown,
    Modal,
} from "antd";
import {
    UserOutlined,
    PhoneOutlined,
    EnvironmentOutlined,
    CalendarOutlined,
    DollarOutlined,
    StarOutlined,
    ClockCircleOutlined,
    EditOutlined,
    DownOutlined,
} from "@ant-design/icons";
import { assignCollaboratorToOrder, getCollaboratorForOrder, getOrderById, updateOrderStatus } from "@/api/order/order-api";
import { isDetailResponse } from "@/utils/response-handler";
import { Order } from "@/type/order/order";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { useAuth } from "@/storage/auth-context";
import { notify } from "@/components/Notification";
import { getStatusColor, getStatusText } from "@/common/status/order-status";

const { Title, Text } = Typography;


export default function OrderDetailPage() {
    const params = useParams();
    const { user } = useAuth();
    const id = params.id as string;
    const [order, setOrder] = useState<Order>();
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [tranfernote, setTranfernote] = useState<string>(`Gán CTV bởi quản trị viên ${user?.fullName} lúc ${new Date().toLocaleString()}`);

    const [selectedCollaboratorId, setSelectedCollaboratorId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [statusNote, setStatusNote] = useState<string>('');

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const res = await getCollaboratorForOrder(id);
                if (isDetailResponse(res) && res.data) {
                    setCollaborators(res.data);
                }
            } catch (error) {
                console.error("Error fetching collaborators:", error);
            }
        };
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const response = await getOrderById(id);
                if (isDetailResponse(response) && response.data) {
                    setOrder(response.data);
                } else {
                    throw new Error('Failed to fetch order data');
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        Promise.all([fetchOrder(), fetchCollaborators()]);
    }, [params.id]);


    const handleAssignCollaborator = async () => {
        if (!selectedCollaboratorId) {
            message.warning('Vui lòng chọn một cộng tác viên.');
            return;
        }
        setLoading(true);
        try {
            const response = await assignCollaboratorToOrder(id, selectedCollaboratorId, user?._id || '', tranfernote);
            if (isDetailResponse(response) && response.data) {
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Cộng tác viên đã được gán thành công!',
                });
                const updatedOrder = await getOrderById(id);
                if (isDetailResponse(updatedOrder) && updatedOrder.data) {
                    setOrder(updatedOrder.data);
                }
            }
        } catch (error) {
            console.error("Error assigning collaborator:", error);
            message.error('Có lỗi xảy ra khi gán cộng tác viên.');
        } finally {
            setLoading(false);
        }
    };

    // Hàm kiểm tra xem có thể thay đổi trạng thái hay không
    const canChangeStatus = (currentStatus: string) => {
        // Không cho phép thay đổi nếu order đã done, cancel, hoặc pending
        return !['done', 'cancel', 'pending'].includes(currentStatus);
    };

    // Hàm xử lý thay đổi trạng thái
    const handleStatusChange = (newStatus: string) => {
        if (!canChangeStatus(order?.status || '')) {
            message.warning('Không thể thay đổi trạng thái của đơn hàng này.');
            return;
        }
        setSelectedStatus(newStatus);
        setStatusNote(`Thay đổi trạng thái từ ${getStatusText(order?.status || '')} sang ${getStatusText(newStatus)} bởi ${user?.fullName} lúc ${new Date().toLocaleString()}`);
        setShowStatusModal(true);
    };

    // Hàm xác nhận thay đổi trạng thái
    const handleConfirmStatusChange = async () => {
        if (!selectedStatus) return;

        setStatusUpdateLoading(true);
        try {
            const response = await updateOrderStatus(id, selectedStatus, user?._id || '');
            if (isDetailResponse(response) && response.data) {
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Trạng thái đơn hàng đã được cập nhật thành công!',
                });
                setOrder({ ...order, status: selectedStatus } as Order);
                setShowStatusModal(false);
                setSelectedStatus('');
                setStatusNote('');
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            message.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.');
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    // Helper functions
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };




    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case 'cash': return 'Tiền mặt';
            case 'bank_transfer': return 'Chuyển khoản';
            case 'credit_card': return 'Thẻ tín dụng';
            default: return method;
        }
    };

    // Optional services table columns
    const optionalServiceColumns = [
        {
            title: 'Tên dịch vụ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => {
                if (price) {
                    return formatCurrency(price);
                }
            },
        },
        {
            title: 'Thời gian (phút)',
            dataIndex: 'durationMinutes',
            key: 'durationMinutes',
        },
    ];

    // Promotions table columns
    const promotionColumns = [
        {
            title: 'Mã khuyến mãi',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Giá trị giảm',
            dataIndex: 'discountValue',
            key: 'discountValue',
            render: (value: number) => formatCurrency(value),
        },
    ];

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Spin size="large" />
            </div>
        );
    }
    if (!order) {
        return (
            <div style={{ padding: '24px', textAlign: 'center' }}>
                <Text type="danger">Không tìm thấy đơn hàng.</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <Card style={{ marginBottom: '16px' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ margin: 0 }}>
                            Đơn hàng {order.idView}
                        </Title>
                        <Text type="secondary">
                            Tạo lúc: {formatDateTime(order.createdAt)}
                        </Text>
                    </Col>
                    <Col>
                        <Space>
                            <Tag color={getStatusColor(order.status)} style={{ fontSize: '14px', padding: '4px 12px' }}>
                                {getStatusText(order.status)}
                            </Tag>
                            {canChangeStatus(order.status) ? (
                                <Dropdown
                                    menu={{
                                        items: [
                                            ...(order.status !== 'doing' ? [{
                                                key: 'doing',
                                                label: 'CTV đang thực hiện',
                                                onClick: () => handleStatusChange('doing'),
                                            }] : []),
                                            {
                                                key: 'done',
                                                label: 'Hoàn thành',
                                                onClick: () => handleStatusChange('done'),
                                            },
                                            {
                                                key: 'cancel',
                                                label: 'Hủy bỏ',
                                                onClick: () => handleStatusChange('cancel'),
                                            },
                                        ],
                                    }}
                                    placement="bottomLeft"
                                >
                                    <Button type="primary" icon={<EditOutlined />}>
                                        Thay đổi trạng thái <DownOutlined />
                                    </Button>
                                </Dropdown>
                            ) : (
                                <Button type="primary" icon={<EditOutlined />} disabled>
                                    Không thể thay đổi
                                </Button>
                            )}
                        </Space>
                    </Col>
                </Row>
            </Card>

            <Row gutter={16}>
                {/* Left Column - Main Information */}
                <Col xs={24} lg={16}>
                    {/* Customer Information */}
                    <Card title="Thông tin khách hàng" style={{ marginBottom: '16px' }}>
                        <Descriptions column={2}>
                            <Descriptions.Item
                                label={<><UserOutlined /> Tên khách hàng</>}
                                span={2}
                            >
                                <Text strong>{order.customerName}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                                {order.customerPhone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã khách hàng">
                                {order.customerId.code}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<><EnvironmentOutlined /> Địa chỉ</>}
                                span={2}
                            >
                                {order.address}
                            </Descriptions.Item>
                            <Descriptions.Item label="Hạng khách hàng">
                                <Tag color="gold">{order.customerId.rank}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Điểm tích lũy">
                                {order.customerId.totalPoints.toLocaleString()} điểm
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Collaborator Information */}
                    <Card title="Thông tin cộng tác viên" style={{ marginBottom: '16px' }}>

                        {order.collaboratorId ? (<Descriptions column={2}>
                            <Descriptions.Item
                                label={<><UserOutlined /> Tên CTV</>}
                                span={2}
                            >
                                <Text strong>{order.collaboratorName}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
                                {order.collaboratorPhone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mã CTV">
                                {order.collaboratorId.code}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><StarOutlined /> Đánh giá</>}>
                                <Rate disabled defaultValue={order.collaboratorId.commissionRate} />
                                <Text style={{ marginLeft: 8 }}>({order.collaboratorId.commissionRate}/5)</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag color={order.collaboratorId.status === 'active' ? 'green' : 'red'}>
                                    {order.collaboratorId.status}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>)
                            : (
                                <div>
                                    Chưa có cộng tác viên được gán cho đơn hàng này.
                                    <Select
                                        value={selectedCollaboratorId}
                                        onChange={setSelectedCollaboratorId}
                                        placeholder="Chọn cộng tác viên"
                                        style={{ width: '100%' }}
                                    >
                                        {collaborators.map(collaborator => (
                                            <Select.Option key={collaborator._id} value={collaborator._id}>
                                                {collaborator.code}- {collaborator.userId.fullName} ({collaborator.userId.phone})
                                            </Select.Option>
                                        ))}
                                    </Select>
                                    {selectedCollaboratorId && (
                                        <div style={{ marginTop: '8px' }}>
                                            <Text>Ghi chú:</Text>
                                            <Input.TextArea
                                                value={tranfernote}
                                                onChange={(e) => setTranfernote(e.target.value)}
                                                placeholder="Nhập ghi chú"
                                                style={{ marginTop: '8px' }}
                                                rows={3}
                                            />
                                        </div>
                                    )}
                                    <Button
                                        type="primary"
                                        onClick={handleAssignCollaborator}
                                        style={{ marginTop: '16px' }}
                                        disabled={!selectedCollaboratorId}
                                    >
                                        Chọn CTV này cho đơn hàng
                                    </Button>
                                </div>
                            )}
                    </Card>

                    {/* Service Information */}
                    <Card title="Thông tin dịch vụ" style={{ marginBottom: '16px' }}>
                        <Descriptions column={2}>
                            <Descriptions.Item label="Tên dịch vụ" span={2}>
                                <Text strong>{order.serviceId.name}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Mô tả" span={2}>
                                {order.serviceId.description}
                            </Descriptions.Item>
                            <Descriptions.Item label="Danh mục">
                                <Tag color="blue">{order.serviceId.categoryId.name}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Loại dịch vụ">
                                <Tag color="purple">{order.type}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Giá cơ bản">
                                {formatCurrency(order.serviceId.price)}
                            </Descriptions.Item>
                            <Descriptions.Item label={<><ClockCircleOutlined /> Thời gian</>}>
                                {order.serviceId.durationMinutes} phút
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        {/* Optional Services */}
                        <Title level={5}>Dịch vụ tùy chọn</Title>
                        <Table
                            key="_id"
                            dataSource={order.optionalService}
                            columns={optionalServiceColumns}
                            pagination={false}
                            size="small"
                            rowKey="_id"
                        />
                    </Card>

                    {/* Schedule Information */}
                    <Card title="Lịch làm việc" style={{ marginBottom: '16px' }}>
                        <Descriptions column={2}>
                            <Descriptions.Item
                                label={<><CalendarOutlined /> Thời gian bắt đầu</>}
                            >
                                {formatDateTime(order.dateWork)}
                            </Descriptions.Item>
                            <Descriptions.Item
                                label={<><CalendarOutlined /> Thời gian kết thúc</>}
                            >
                                {formatDateTime(order.endDateWork)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng thời gian">
                                {order.totalTime} phút
                            </Descriptions.Item>
                            <Descriptions.Item label="Phương thức thanh toán">
                                <Tag color="green">{getPaymentMethodText(order.paymentMethod)}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ghi chú" span={2}>
                                {order.note || 'Không có ghi chú'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

                    {/* Promotions */}
                    {order.promotions.length > 0 && (
                        <Card title="Khuyến mãi áp dụng" style={{ marginBottom: '16px' }}>
                            <Table
                                dataSource={order.promotions}
                                columns={promotionColumns}
                                pagination={false}
                                size="small"
                                rowKey="_id"
                            />
                        </Card>
                    )}
                </Col>

                {/* Right Column - Financial Information */}
                <Col xs={24} lg={8}>
                    <Card
                        title={<><DollarOutlined /> Chi tiết thanh toán</>}
                        style={{ position: 'sticky', top: '16px' }}
                    >
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="Phí ban đầu">
                                {formatCurrency(order.initialFee)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Tổng giảm giá">
                                <Text type="danger">
                                    -{formatCurrency(order.totalDiscount)}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Phí cuối cùng">
                                <Text strong style={{ fontSize: '16px' }}>
                                    {formatCurrency(order.finalFee)}
                                </Text>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider />

                        <Descriptions column={1} size="small" title="Phân chia thu nhập">
                            <Descriptions.Item label="Phí nền tảng">
                                {formatCurrency(order.platformFee)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Đặt cọc ca làm">
                                {formatCurrency(order.workShiftDeposit)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Còn lại đặt cọc">
                                {formatCurrency(order.remainingShiftDeposit)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu nhập ca làm">
                                <Text strong style={{ color: '#52c41a' }}>
                                    {formatCurrency(order.shiftIncome)}
                                </Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Thu nhập ròng">
                                <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                                    {formatCurrency(order.netIncome)}
                                </Text>
                            </Descriptions.Item>
                            {order.valueAddedTax > 0 && (
                                <Descriptions.Item label="VAT">
                                    {formatCurrency(order.valueAddedTax)}
                                </Descriptions.Item>
                            )}
                            {order.totalPunishMoney > 0 && (
                                <Descriptions.Item label="Tiền phạt">
                                    <Text type="danger">
                                        {formatCurrency(order.totalPunishMoney)}
                                    </Text>
                                </Descriptions.Item>
                            )}
                        </Descriptions>

                        {order.rating && (
                            <>
                                <Divider />
                                <div style={{ textAlign: 'center' }}>
                                    <Title level={5}>Đánh giá dịch vụ</Title>
                                    <Rate disabled defaultValue={order.rating} />
                                    <div>{order.rating}/5 sao</div>
                                </div>
                            </>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* Modal xác nhận thay đổi trạng thái */}
            <Modal
                title="Xác nhận thay đổi trạng thái"
                open={showStatusModal}
                onOk={handleConfirmStatusChange}
                onCancel={() => {
                    setShowStatusModal(false);
                    setSelectedStatus('');
                    setStatusNote('');
                }}
                confirmLoading={statusUpdateLoading}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p>
                    Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng từ{' '}
                    <Tag color={getStatusColor(order?.status || '')}>{getStatusText(order?.status || '')}</Tag>
                    {' '}sang{' '}
                    <Tag color={getStatusColor(selectedStatus)}>{getStatusText(selectedStatus)}</Tag>
                    ?
                </p>
                <div style={{ marginTop: 16 }}>
                    <Text strong>Ghi chú:</Text>
                    <Input.TextArea
                        rows={3}
                        value={statusNote}
                        onChange={(e) => setStatusNote(e.target.value)}
                        placeholder="Nhập ghi chú cho việc thay đổi trạng thái..."
                        style={{ marginTop: 8 }}
                    />
                </div>
            </Modal>
        </div>
    );
}
