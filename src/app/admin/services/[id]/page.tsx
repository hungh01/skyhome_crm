'use client';

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Card,
    Form,
    Input,
    InputNumber,
    Button,
    Typography,
    Row,
    Col,
    Divider,
    Table,
    Modal,
    Switch,
    message,
    Space,
    Select
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    ToolOutlined,
    ArrowLeftOutlined
} from "@ant-design/icons";
import { mockServices, mockBusinessServices } from "@/api/mock-services";
import { Service, Equipment } from "@/type/services";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function DetailServices() {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;

    const [form] = Form.useForm();
    const [equipmentForm] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

    // Load service data from mock API
    const [serviceData, setServiceData] = useState<Service | null>(null);

    useEffect(() => {
        // Find service in mock data
        const allServices = [...mockServices, ...mockBusinessServices];
        const foundService = allServices.find(s => s.id === serviceId);

        if (foundService) {
            setServiceData(foundService);
            // Initialize form with current data
            form.setFieldsValue({
                name: foundService.name,
                basePrice: foundService.basePrice,
                estimatedTime: foundService.estimatedTime,
                description: foundService.description,
                status: foundService.status,
                category: foundService.category
            });
        }
    }, [serviceId, form]);

    const handleSaveService = async (values: Service) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setServiceData((prev: Service | null) => prev ? ({
                ...prev,
                name: values.name,
                basePrice: values.basePrice,
                estimatedTime: values.estimatedTime,
                description: values.description,
                status: values.status,
                category: values.category
            }) : null);

            message.success('Đã cập nhật thông tin dịch vụ!');
        } catch {
            message.error('Có lỗi xảy ra khi cập nhật!');
        } finally {
            setLoading(false);
        }
    };

    const handleAddEquipment = () => {
        setEditingEquipment(null);
        equipmentForm.resetFields();
        setEquipmentModalOpen(true);
    };

    const handleEditEquipment = (equipment: Equipment) => {
        setEditingEquipment(equipment);
        equipmentForm.setFieldsValue(equipment);
        setEquipmentModalOpen(true);
    };

    const handleDeleteEquipment = (equipmentId: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa thiết bị này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: () => {
                setServiceData((prev: Service | null) => {
                    if (!prev || !prev.equipment) return prev;
                    return {
                        ...prev,
                        equipment: prev.equipment.filter((eq: Equipment) => eq.id !== equipmentId)
                    };
                });
                message.success('Đã xóa thiết bị!');
            }
        });
    };

    const handleEquipmentSubmit = async (values: Omit<Equipment, 'id'>) => {
        try {
            if (editingEquipment) {
                // Update existing equipment
                setServiceData((prev: Service | null) => {
                    if (!prev || !prev.equipment) return prev;
                    return {
                        ...prev,
                        equipment: prev.equipment.map((eq: Equipment) =>
                            eq.id === editingEquipment.id
                                ? { ...eq, ...values }
                                : eq
                        )
                    };
                });
                message.success('Đã cập nhật thiết bị!');
            } else {
                // Add new equipment
                const newEquipment: Equipment = {
                    id: Date.now().toString(),
                    ...values
                };
                setServiceData((prev: Service | null) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        equipment: [...(prev.equipment || []), newEquipment]
                    };
                });
                message.success('Đã thêm thiết bị mới!');
            }

            setEquipmentModalOpen(false);
            equipmentForm.resetFields();
        } catch {
            message.error('Có lỗi xảy ra!');
        }
    };

    const toggleEquipmentAvailability = (equipmentId: string) => {
        setServiceData((prev: Service | null) => {
            if (!prev || !prev.equipment) return prev;
            return {
                ...prev,
                equipment: prev.equipment.map((eq: Equipment) =>
                    eq.id === equipmentId
                        ? { ...eq, status: !eq.status }
                        : eq
                )
            };
        });
    };

    const equipmentColumns = [
        {
            title: 'Tên thiết bị',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Equipment) => (
                <div>
                    <Text strong>{text}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.description || 'Không có mô tả'}
                    </Text>
                </div>
            )
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {price.toLocaleString()}
                </Text>
            ),
            width: 120
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean, record: Equipment) => (
                <Switch
                    checked={status}
                    onChange={() => toggleEquipmentAvailability(record.id)}
                    checkedChildren="Có sẵn"
                    unCheckedChildren="Hết"
                />
            ),
            width: 120
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: unknown, record: Equipment) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditEquipment(record)}
                        size="small"
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteEquipment(record.id)}
                        size="small"
                    />
                </Space>
            ),
            width: 100
        }
    ];

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    if (!serviceData) {
        return (
            <div style={{ padding: "24px", textAlign: 'center' }}>
                <Text>Đang tải dữ liệu dịch vụ...</Text>
            </div>
        );
    }

    return (
        <div style={{ padding: "24px", background: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <Row gutter={24}>
                <Col span={24}>
                    <Card style={{ marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{}}>
                                    <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                        <ToolOutlined /> Chi tiết dịch vụ: {serviceData.name}
                                    </Title>

                                </div>
                            </div>
                            <Text type="secondary">
                                Quản lý thông tin chi tiết và thiết bị của dịch vụ
                            </Text>
                            <Form
                                form={form}
                                layout="horizontal"
                            >
                                <Form.Item
                                    label="Trạng thái"
                                    name="status"
                                    valuePropName="checked"
                                >
                                    <Switch
                                        checkedChildren="Hoạt động"
                                        unCheckedChildren="Tạm dừng"
                                    />
                                </Form.Item>
                            </Form>
                        </div>

                        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => router.back()}
                            >
                                Quay lại
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
            <Row gutter={24}>
                {/* Service Information */}
                <Col xs={24} lg={12}>
                    <Card
                        title={
                            <Space>
                                <DollarOutlined />
                                <span>Thông tin dịch vụ</span>
                            </Space>
                        }
                        style={{ height: 'fit-content' }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSaveService}
                        >
                            <Form.Item
                                label="Tên dịch vụ"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ!' }]}
                            >
                                <Input placeholder="Nhập tên dịch vụ" />
                            </Form.Item>

                            <Form.Item
                                label="Loại dịch vụ"
                                name="category"
                            >
                                <Select placeholder="Chọn loại dịch vụ">
                                    <Option value="personal">Dịch vụ cá nhân</Option>
                                    <Option value="business">Dịch vụ doanh nghiệp</Option>
                                </Select>
                            </Form.Item>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        label="Giá cơ bản (VNĐ)"
                                        name="basePrice"
                                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            //parser={(value) => value ? Number(value.replace(/\$\s?|(,*)/g, '')) : 0}
                                            min={0}
                                            step={10000}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="Thời gian ước tính (phút)"
                                        name="estimatedTime"
                                        rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
                                    >
                                        <InputNumber
                                            style={{ width: '100%' }}
                                            min={15}
                                            step={15}
                                            addonAfter="phút"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Mô tả dịch vụ"
                                name="description"
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Nhập mô tả chi tiết về dịch vụ..."
                                />
                            </Form.Item>

                            <Divider />

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SaveOutlined />}
                                    size="large"
                                    block
                                >
                                    Lưu thông tin
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

                {/* Equipment Management */}
                <Col xs={24} lg={12}>
                    <Card
                        style={{ height: 'fit-content', marginBottom: '8px' }}
                    >
                        <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
                            <Title level={5}>Tóm tắt dịch vụ</Title>
                            <Row gutter={16}>
                                <Col span={8}>
                                    <div style={{ textAlign: 'center' }}>
                                        <Text type="secondary">Giá cơ bản</Text>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                                            {serviceData.basePrice.toLocaleString()} VNĐ
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{ textAlign: 'center' }}>
                                        <Text type="secondary">Thời gian</Text>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                                            <ClockCircleOutlined /> {formatTime(serviceData.estimatedTime)}
                                        </div>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div style={{ textAlign: 'center' }}>
                                        <Text type="secondary">Thiết bị</Text>
                                        <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                            {serviceData.equipment?.length || 0} loại
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                    <Card
                        title={
                            <Space>
                                <ToolOutlined />
                                <span>Thiết bị & Dụng cụ</span>
                            </Space>
                        }
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAddEquipment}
                            >
                                Thêm thiết bị
                            </Button>
                        }
                    >
                        <Table
                            dataSource={serviceData.equipment || []}
                            columns={equipmentColumns}
                            rowKey="id"
                            size="small"
                            pagination={false}
                            locale={{ emptyText: 'Chưa có thiết bị nào' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Equipment Modal */}
            <Modal
                title={editingEquipment ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
                open={equipmentModalOpen}
                onCancel={() => setEquipmentModalOpen(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={equipmentForm}
                    layout="vertical"
                    onFinish={handleEquipmentSubmit}
                >
                    <Form.Item
                        label="Tên thiết bị"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}
                    >
                        <Input placeholder="Nhập tên thiết bị" />
                    </Form.Item>                        <Form.Item
                        label="Giá thuê (VNĐ)"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            // parser removed to match InputNumber type requirements
                            min={0}
                            step={1000}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Mô tả về thiết bị và tác dụng..."
                        />
                    </Form.Item>                        <Form.Item
                        label="Trạng thái"
                        name="status"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch checkedChildren="Có sẵn" unCheckedChildren="Hết" />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setEquipmentModalOpen(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingEquipment ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
