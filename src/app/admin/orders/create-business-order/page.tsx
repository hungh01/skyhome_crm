'use client';

import {
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
    const [loading, setLoading] = useState(false);
    const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
    const [currentService, setCurrentService] = useState<string>('');
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [editingService, setEditingService] = useState<string | null>(null);
    const [formState, setFormState] = useState<{
        companyName: string;
        taxCode: string;
        address: string;
        paymentMethod: string;
        currency: string;
    }>({
        companyName: '',
        taxCode: '',
        address: '',
        paymentMethod: '',
        currency: 'VNĐ',
    });

    const handleFormChange = (field: string, value: string) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formState.companyName || formState.companyName.length < 2 || formState.companyName.length > 100) {
            message.error('Tên đơn vị phải có từ 2 đến 100 ký tự!');
            return;
        }
        if (!formState.taxCode || !/^\d{10}$|^\d{13}$/.test(formState.taxCode)) {
            message.error('Mã số thuế phải có 10 hoặc 13 chữ số!');
            return;
        }
        if (!formState.address || formState.address.length < 10) {
            message.error('Địa chỉ phải có ít nhất 10 ký tự!');
            return;
        }
        if (!formState.paymentMethod) {
            message.error('Vui lòng chọn hình thức thanh toán!');
            return;
        }
        if (!formState.currency) {
            message.error('Vui lòng chọn đồng tiền!');
            return;
        }
        if (selectedServices.length === 0) {
            message.error('Vui lòng thêm ít nhất một dịch vụ!');
            return;
        }

        setLoading(true);
        try {
            const formData: BusinessOrderFormData = {
                ...formState,
                services: selectedServices,
                totalAmount: getTotalAmount()
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Business Order Form values:', formData);
            message.success('Tạo đơn hàng doanh nghiệp thành công!');

            // Reset form
            setFormState({
                companyName: '',
                taxCode: '',
                address: '',
                paymentMethod: '',
                currency: 'VND',
            });
            setSelectedServices([]);
            setCurrentService('');
            setCurrentPrice(0);
            setEditingService(null);
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Row justify="center" gutter={32}>
                <Col xs={24} lg={15} xl={15} xxl={14}>
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
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <label><b>Tên đơn vị</b></label>
                                    <Input
                                        prefix={<ShopOutlined />}
                                        placeholder="Nhập tên công ty/đơn vị"
                                        value={formState.companyName}
                                        onChange={e => handleFormChange('companyName', e.target.value)}
                                    />
                                </Col>
                                <Col xs={24} sm={12}>
                                    <label><b>Mã số thuế</b></label>
                                    <Input
                                        prefix={<FileTextOutlined />}
                                        placeholder="Nhập mã số thuế (10 hoặc 13 số)"
                                        maxLength={13}
                                        value={formState.taxCode}
                                        onChange={e => handleFormChange('taxCode', e.target.value)}
                                    />
                                </Col>
                                <Col span={24} style={{ marginTop: 16 }}>
                                    <label><b>Địa chỉ doanh nghiệp</b></label>
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Nhập địa chỉ đầy đủ của doanh nghiệp"
                                        style={{ resize: 'none' }}
                                        value={formState.address}
                                        onChange={e => handleFormChange('address', e.target.value)}
                                    />
                                </Col>
                                <Col xs={24} sm={12} style={{ marginTop: 16 }}>
                                    <label><b>Hình thức thanh toán</b></label>
                                    <Select
                                        placeholder="Chọn hình thức thanh toán"
                                        value={formState.paymentMethod || undefined}
                                        onChange={value => handleFormChange('paymentMethod', value)}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="bank_transfer">Chuyển khoản ngân hàng</Option>
                                        <Option value="cash">Tiền mặt</Option>
                                        <Option value="credit_card">Thẻ tín dụng</Option>
                                        <Option value="check">Séc</Option>
                                        <Option value="installment">Trả góp</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} style={{ marginTop: 16 }}>
                                    <label><b>Đồng tiền thanh toán</b></label>
                                    <Select
                                        placeholder="Chọn đồng tiền"
                                        value={formState.currency || undefined}
                                        onChange={value => handleFormChange('currency', value)}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="VND">VND (Việt Nam Đồng)</Option>
                                        <Option value="USD">USD (Đô la Mỹ)</Option>
                                        <Option value="EUR">EUR (Euro)</Option>
                                        <Option value="JPY">JPY (Yên Nhật)</Option>
                                    </Select>
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
                                            Tổng: {getTotalAmount().toLocaleString()}
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
                            <Row gutter={16} style={{ marginTop: 32, marginBottom: 0 }}>
                                <Col xs={24} sm={12}>
                                    <Button
                                        size="large"
                                        block
                                        onClick={() => {
                                            setFormState({
                                                companyName: '',
                                                taxCode: '',
                                                address: '',
                                                paymentMethod: '',
                                                currency: 'VND',
                                            });
                                            setSelectedServices([]);
                                            setCurrentService('');
                                            setCurrentPrice(0);
                                            setEditingService(null);
                                        }}
                                        type="default"
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
                        </form>
                    </Card>
                </Col>
                {/* INVOICE COLUMN */}
                <Col xs={24} lg={9} xl={9} xxl={7} style={{ marginTop: 0, marginBottom: 24 }}>
                    <Card
                        title={<span style={{ color: '#1890ff', fontWeight: 600 }}>Hóa đơn tạm tính</span>}
                        variant="borderless"
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong>Đơn vị:</Text>
                            <Text>{formState.companyName || <span style={{ color: '#bbb' }}>Chưa nhập</span>}</Text>
                        </div>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong>Mã số thuế:</Text> <br />
                            <Text>{formState.taxCode || <span style={{ color: '#bbb' }}>Chưa nhập</span>}</Text>
                        </div>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong>Địa chỉ:</Text> <br />
                            <Text>{formState.address || <span style={{ color: '#bbb' }}>Chưa nhập</span>}</Text>
                        </div>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong>Hình thức thanh toán:</Text> <br />
                            <Text>{
                                (() => {
                                    const val = formState.paymentMethod;
                                    const map: Record<string, string> = {
                                        bank_transfer: 'Chuyển khoản ngân hàng',
                                        cash: 'Tiền mặt',
                                        credit_card: 'Thẻ tín dụng',
                                        check: 'Séc',
                                        installment: 'Trả góp'
                                    };
                                    if (!val) return <span style={{ color: '#bbb' }}>Chưa chọn</span>;
                                    return map[val] || val;
                                })()
                            }</Text>
                        </div>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong>Đồng tiền:</Text> <br />
                            <Text>{formState.currency || <span style={{ color: '#bbb' }}>Chưa chọn</span>}</Text>
                        </div>
                        <Divider style={{ margin: '16px 0' }} />
                        <Text strong style={{ fontSize: 15, display: 'flex', left: 0 }}>Dịch vụ đã chọn:</Text>
                        <List
                            size="small"
                            dataSource={selectedServices}
                            locale={{ emptyText: 'Chưa có dịch vụ nào' }}
                            renderItem={service => (
                                <List.Item style={{ padding: '4px 0' }}>
                                    <span>{service.name}</span>
                                    <span style={{ float: 'right', fontWeight: 500 }}>{service.price.toLocaleString()}</span>
                                </List.Item>
                            )}
                        />
                        <Divider style={{ margin: '16px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: 16 }}>VAT (10%):</Text>
                            <Text strong style={{ fontSize: 14, color: '#FF894F' }}>{(getTotalAmount() * 0.1).toLocaleString()}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: 16 }}>Tổng cộng:</Text>
                            <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{(getTotalAmount() * 1.1).toLocaleString()} </Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}