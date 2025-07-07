'use client';

import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    Row,
    Col,
    Select,
    InputNumber,
    message,
    Divider,
    List,
    Tag
} from 'antd';
import {
    ShopOutlined,
    FileTextOutlined,
    PlusOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;
const { Option } = Select;

interface ServiceItem {
    id: string;
    name: string;
    price: number;
}

interface BusinessOrderFormData {
    companyName: string;
    taxCode: string;
    address: string;
    paymentMethod: string;
    currency: string;
    services: ServiceItem[];
    totalAmount: number;
}

const availableServices = [
    { value: 'cleaning', label: 'Dọn dẹp nhà cửa' },
    { value: 'cooking', label: 'Nấu ăn' },
    { value: 'childcare', label: 'Trông trẻ' },
    { value: 'eldercare', label: 'Chăm sóc người già' },
    { value: 'laundry', label: 'Giặt ủi' },
    { value: 'gardening', label: 'Chăm sóc vườn' },
    { value: 'security', label: 'Bảo vệ' },
    { value: 'maintenance', label: 'Sửa chữa điện nước' },
    { value: 'office_cleaning', label: 'Vệ sinh văn phòng' },
    { value: 'event_support', label: 'Hỗ trợ sự kiện' }
];

export default function CreateBusinessOrderPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
    const [currentService, setCurrentService] = useState<string>('');
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [editingService, setEditingService] = useState<string | null>(null);

    const addService = () => {
        if (!currentService || currentPrice <= 0) {
            message.error('Vui lòng chọn dịch vụ và nhập giá hợp lệ!');
            return;
        }

        const serviceLabel = availableServices.find(s => s.value === currentService)?.label || currentService;
        const newService: ServiceItem = {
            id: Date.now().toString(),
            name: serviceLabel,
            price: currentPrice
        };

        setSelectedServices([...selectedServices, newService]);
        setCurrentService('');
        setCurrentPrice(0);
        message.success('Đã thêm dịch vụ thành công!');
    };

    const removeService = (serviceId: string) => {
        setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
        message.success('Đã xóa dịch vụ!');
    };

    const editService = (serviceId: string) => {
        const service = selectedServices.find(s => s.id === serviceId);
        if (service) {
            const serviceValue = availableServices.find(s => s.label === service.name)?.value || '';
            setCurrentService(serviceValue);
            setCurrentPrice(service.price);
            setEditingService(serviceId);
        }
    };

    const updateService = () => {
        if (!currentService || currentPrice <= 0 || !editingService) {
            message.error('Vui lòng chọn dịch vụ và nhập giá hợp lệ!');
            return;
        }

        const serviceLabel = availableServices.find(s => s.value === currentService)?.label || currentService;
        setSelectedServices(selectedServices.map(s =>
            s.id === editingService
                ? { ...s, name: serviceLabel, price: currentPrice }
                : s
        ));

        setCurrentService('');
        setCurrentPrice(0);
        setEditingService(null);
        message.success('Đã cập nhật dịch vụ!');
    };

    const getTotalAmount = () => {
        return selectedServices.reduce((total, service) => total + service.price, 0);
    };

    const onFinish = async (values: Omit<BusinessOrderFormData, 'services' | 'totalAmount'>) => {
        if (selectedServices.length === 0) {
            message.error('Vui lòng thêm ít nhất một dịch vụ!');
            return;
        }

        setLoading(true);
        try {
            const formData: BusinessOrderFormData = {
                ...values,
                services: selectedServices,
                totalAmount: getTotalAmount()
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Business Order Form values:', formData);
            message.success('Tạo đơn hàng doanh nghiệp thành công!');
            form.resetFields();
            setSelectedServices([]);
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!' + error);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.log('Failed:', errorInfo);
        message.error('Vui lòng kiểm tra lại thông tin!');
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Row justify="center">
                <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                    <Card
                        style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                                Tạo đơn hàng doanh nghiệp
                            </Title>
                            <Typography.Text type="secondary">
                                Vui lòng điền đầy đủ thông tin doanh nghiệp và dịch vụ
                            </Typography.Text>
                        </div>

                        <Form
                            form={form}
                            name="businessOrder"
                            layout="vertical"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            size="large"
                        >
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Tên đơn vị"
                                        name="companyName"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập tên đơn vị!' },
                                            { min: 2, message: 'Tên đơn vị phải có ít nhất 2 ký tự!' },
                                            { max: 100, message: 'Tên đơn vị không được quá 100 ký tự!' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<ShopOutlined />}
                                            placeholder="Nhập tên công ty/đơn vị"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Mã số thuế"
                                        name="taxCode"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mã số thuế!' },
                                            {
                                                pattern: /^[0-9]{10}$|^[0-9]{13}$/,
                                                message: 'Mã số thuế phải có 10 hoặc 13 chữ số!'
                                            }
                                        ]}
                                    >
                                        <Input
                                            prefix={<FileTextOutlined />}
                                            placeholder="Nhập mã số thuế (10 hoặc 13 số)"
                                            maxLength={13}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label="Địa chỉ doanh nghiệp"
                                        name="address"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập địa chỉ!' },
                                            { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự!' }
                                        ]}
                                    >
                                        <Input.TextArea
                                            rows={3}
                                            placeholder="Nhập địa chỉ đầy đủ của doanh nghiệp"
                                            style={{ resize: 'none' }}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Hình thức thanh toán"
                                        name="paymentMethod"
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn hình thức thanh toán!' }
                                        ]}
                                    >
                                        <Select placeholder="Chọn hình thức thanh toán">
                                            <Option value="bank_transfer">Chuyển khoản ngân hàng</Option>
                                            <Option value="cash">Tiền mặt</Option>
                                            <Option value="credit_card">Thẻ tín dụng</Option>
                                            <Option value="check">Séc</Option>
                                            <Option value="installment">Trả góp</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Đồng tiền thanh toán"
                                        name="currency"
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn đồng tiền!' }
                                        ]}
                                    >
                                        <Select placeholder="Chọn đồng tiền">
                                            <Option value="VND">VND (Việt Nam Đồng)</Option>
                                            <Option value="USD">USD (Đô la Mỹ)</Option>
                                            <Option value="EUR">EUR (Euro)</Option>
                                            <Option value="JPY">JPY (Yên Nhật)</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider orientation="left">
                                <Title level={4} style={{ margin: 0 }}>
                                    Dịch vụ và giá cả
                                </Title>
                            </Divider>

                            {/* Service Addition Section */}
                            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#fafafa' }}>
                                <Row gutter={12} align="middle">
                                    <Col xs={24} sm={8}>
                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                            Chọn dịch vụ
                                        </Text>
                                        <Select
                                            placeholder="Chọn dịch vụ"
                                            value={currentService}
                                            onChange={setCurrentService}
                                            style={{ width: '100%' }}
                                            size="middle"
                                        >
                                            {availableServices.map(service => (
                                                <Option key={service.value} value={service.value}>
                                                    {service.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                            Giá tiền
                                        </Text>
                                        <InputNumber
                                            placeholder="Nhập giá"
                                            value={currentPrice}
                                            onChange={(value) => setCurrentPrice(value || 0)}
                                            style={{ width: '100%' }}
                                            min={0}
                                            step={10000}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => Number((value || '').replace(/\$\s?|(,*)/g, ''))}
                                            size="middle"
                                        />
                                    </Col>
                                    <Col xs={24} sm={8}>
                                        <div style={{ paddingTop: '20px' }}>
                                            <Button
                                                type="primary"
                                                icon={editingService ? <EditOutlined /> : <PlusOutlined />}
                                                onClick={editingService ? updateService : addService}
                                                block
                                                size="middle"
                                            >
                                                {editingService ? 'Cập nhật' : 'Thêm dịch vụ'}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            {/* Selected Services List */}
                            {selectedServices.length > 0 && (
                                <Card size="small" style={{ marginBottom: 16 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                        <Text strong>Danh sách dịch vụ đã chọn:</Text>
                                        <Tag color="blue" style={{ fontSize: '12px' }}>
                                            Tổng: {getTotalAmount().toLocaleString()} VNĐ
                                        </Tag>
                                    </div>
                                    <List
                                        size="small"
                                        dataSource={selectedServices}
                                        renderItem={(service) => (
                                            <List.Item
                                                actions={[
                                                    <Button
                                                        key="edit"
                                                        type="link"
                                                        size="small"
                                                        icon={<EditOutlined />}
                                                        onClick={() => editService(service.id)}
                                                    >
                                                        Sửa
                                                    </Button>,
                                                    <Button
                                                        key="delete"
                                                        type="link"
                                                        danger
                                                        size="small"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => removeService(service.id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    title={service.name}
                                                    description={
                                                        <Text type="secondary">
                                                            Giá: {service.price.toLocaleString()} VNĐ
                                                        </Text>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            )}

                            <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Button
                                            size="large"
                                            block
                                            onClick={() => {
                                                form.resetFields();
                                                setSelectedServices([]);
                                                setCurrentService('');
                                                setCurrentPrice(0);
                                                setEditingService(null);
                                            }}
                                        >
                                            Làm mới
                                        </Button>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            block
                                            loading={loading}
                                        >
                                            {loading ? 'Đang tạo đơn hàng...' : 'Tạo đơn hàng doanh nghiệp'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}