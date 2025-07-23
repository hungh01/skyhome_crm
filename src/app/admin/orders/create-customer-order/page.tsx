'use client';

import {
    Input,
    Button,
    Card,
    Typography,
    Row,
    Col,
    Select,
    message,
    Tag,
    Divider,
    DatePicker,

} from 'antd';
import {
    UserOutlined
} from '@ant-design/icons';
import { useState } from 'react';
import { mockServices } from '@/api/mock-services';

const { Title, Text } = Typography;
const { Option } = Select;

interface CustomerOrderFormData {
    name: string;
    address: string;
    service: string;
    day: string;
    time: string;
    paymentMethod: string;
    partner: string;
    note: string;
    selectedOptionals: string[];
    selectedEquipment: string[];
}


export default function CreateCustomerOrderPage() {
    const [loading, setLoading] = useState(false);
    const services = mockServices;
    const [formState, setFormState] = useState<CustomerOrderFormData>({
        name: '',
        address: '',
        service: '',
        day: '',
        time: '',
        paymentMethod: '',
        partner: '',
        note: '',
        selectedOptionals: [],
        selectedEquipment: []
    });

    const handleChange = (field: keyof CustomerOrderFormData, value: string) => {
        if (field === 'selectedOptionals' || field === 'selectedEquipment') {
            // These shouldn't be called directly, use specific toggle functions instead
            return;
        } else {
            setFormState(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleServiceChange = (serviceId: string) => {
        setFormState(prev => ({
            ...prev,
            service: serviceId,
            selectedOptionals: [],
            selectedEquipment: []
        }));
    };

    const handleOptionalToggle = (optionalId: string) => {
        setFormState(prev => ({
            ...prev,
            selectedOptionals: prev.selectedOptionals.includes(optionalId)
                ? prev.selectedOptionals.filter(id => id !== optionalId)
                : [...prev.selectedOptionals, optionalId]
        }));
    };

    const handleEquipmentToggle = (equipmentId: string) => {
        setFormState(prev => ({
            ...prev,
            selectedEquipment: prev.selectedEquipment.includes(equipmentId)
                ? prev.selectedEquipment.filter(id => id !== equipmentId)
                : [...prev.selectedEquipment, equipmentId]
        }));
    };

    const getSelectedService = () => {
        return services.find(s => s.id === formState.service);
    };

    const getSelectedOptionals = () => {
        const selectedService = getSelectedService();
        if (!selectedService?.optionalServices) return [];
        return selectedService.optionalServices.filter(opt =>
            formState.selectedOptionals.includes(opt.id)
        );
    };

    const getSelectedEquipment = () => {
        const selectedService = getSelectedService();
        if (!selectedService?.equipment) return [];
        return selectedService.equipment.filter(equip =>
            formState.selectedEquipment.includes(equip.id)
        );
    };

    const getTotalPrice = () => {
        const optionalsPrice = getSelectedOptionals().reduce((sum, opt) => sum + (opt.basePrice || 0), 0);
        const equipmentPrice = getSelectedEquipment().reduce((sum, equip) => sum + (equip.price || 0), 0);
        return (optionalsPrice + equipmentPrice) * 1.1;
    };
    const getVAT = () => {
        const optionalsPrice = getSelectedOptionals().reduce((sum, opt) => sum + (opt.basePrice || 0), 0);
        const equipmentPrice = getSelectedEquipment().reduce((sum, equip) => sum + (equip.price || 0), 0);
        return (optionalsPrice + equipmentPrice) * 0.1;
    };

    const handleReset = () => {
        setFormState({
            name: '',
            address: '',
            service: '',
            day: '',
            time: '',
            paymentMethod: '',
            partner: '',
            note: '',
            selectedOptionals: [],
            selectedEquipment: []
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation (can be expanded)
        if (!formState.name || formState.name.length < 2 || formState.name.length > 50) {
            message.error('Tên khách hàng phải có từ 2 đến 50 ký tự!');
            return;
        }
        if (!formState.address || formState.address.length < 10) {
            message.error('Địa chỉ phải có ít nhất 10 ký tự!');
            return;
        }
        if (!formState.service) {
            message.error('Vui lòng chọn dịch vụ!');
            return;
        }
        if (!formState.day) {
            message.error('Vui lòng chọn ngày thực hiện dịch vụ!');
            return;
        }
        if (!formState.time) {
            message.error('Vui lòng chọn thời gian thực hiện dịch vụ!');
            return;
        }
        if (!formState.paymentMethod) {
            message.error('Vui lòng chọn phương thức thanh toán!');
            return;
        }
        if (!formState.partner) {
            message.error('Vui lòng chọn cộng tác viên!');
            return;
        }
        if (formState.note.length > 500) {
            message.error('Ghi chú không được quá 500 ký tự!');
            return;
        }
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form values:', formState);
            message.success('Tạo đơn hàng thành công!');
            handleReset();
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!' + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Row justify="center" gutter={32}>
                <Col xs={24} lg={14} xl={13} xxl={12}>
                    <Card
                        style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                                Tạo đơn hàng cho cá nhân
                            </Title>
                            <Typography.Text type="secondary">
                                Vui lòng điền đầy đủ thông tin đơn hàng
                            </Typography.Text>
                        </div>
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Row gutter={16}>
                                <Col span={24}>
                                    <label><b>Tên khách hàng</b></label>
                                    <Input
                                        prefix={<UserOutlined />}
                                        placeholder="Nhập tên khách hàng"
                                        value={formState.name}
                                        onChange={e => handleChange('name', e.target.value)}
                                    />
                                </Col>
                                <Col span={24} style={{ marginTop: 16 }}>
                                    <label><b>Địa chỉ thực hiện dịch vụ</b></label>
                                    <Input.TextArea
                                        rows={3}
                                        placeholder="Nhập địa chỉ đầy đủ nơi thực hiện dịch vụ"
                                        style={{ resize: 'none' }}
                                        value={formState.address}
                                        onChange={e => handleChange('address', e.target.value)}
                                    />
                                </Col>
                                <Col xs={24} sm={24} style={{ marginTop: 16 }}>
                                    <label><b>Dịch vụ</b></label>
                                    <Select
                                        placeholder="Chọn dịch vụ cần thực hiện"
                                        value={formState.service || undefined}
                                        onChange={handleServiceChange}
                                        style={{ width: '100%' }}
                                    >
                                        {services.map(service => (
                                            <Option key={service.id} value={service.id}>
                                                {service.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col xs={24} sm={12} style={{ marginTop: 16 }}>
                                    <label><b>Ngày thực hiện</b></label>
                                    <DatePicker
                                        value={formState.day}
                                        onChange={date => handleChange('day', date)}
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                                <Col xs={24} sm={12} style={{ marginTop: 16 }}>
                                    <label><b>Thời gian thực hiện</b></label>
                                    <Input
                                        type="time"
                                        value={formState.time}
                                        onChange={e => handleChange('time', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                </Col>
                                {/* Equipment for selected service */}
                                {formState.service && (() => {
                                    const selectedService = getSelectedService();
                                    return selectedService?.equipment && selectedService.equipment.length > 0 && (
                                        <Col xs={24} sm={12} style={{ marginTop: 16 }}>
                                            <label><b>Thiết bị</b></label>
                                            <div style={{ marginTop: 8, padding: '12px', background: '#f0f9ff', borderRadius: '6px' }}>
                                                {selectedService.equipment.map(equip => (
                                                    <Tag.CheckableTag
                                                        key={equip.id}
                                                        checked={formState.selectedEquipment.includes(equip.id)}
                                                        onChange={() => handleEquipmentToggle(equip.id)}
                                                        style={{ marginBottom: 8, fontSize: 13, padding: '6px 12px' }}
                                                    >
                                                        {equip.name} <span style={{ color: '#888' }}>({equip.price?.toLocaleString()} VNĐ)</span>
                                                    </Tag.CheckableTag>
                                                ))}
                                            </div>
                                        </Col>
                                    );
                                })()}
                                {/* Optionals for selected service */}
                                {formState.service && (() => {
                                    const selectedService = getSelectedService();
                                    return selectedService?.optionalServices && selectedService.optionalServices.length > 0 && (
                                        <Col xs={24} sm={12} style={{ marginTop: 16 }}>
                                            <label><b>Dịch vụ tùy chọn</b></label>
                                            <div style={{ marginTop: 8, padding: '12px', background: '#f9f9f9', borderRadius: '6px' }}>
                                                {selectedService.optionalServices.map(opt => (
                                                    <Tag.CheckableTag
                                                        key={opt.id}
                                                        checked={formState.selectedOptionals.includes(opt.id)}
                                                        onChange={() => handleOptionalToggle(opt.id)}
                                                        style={{ marginBottom: 8, fontSize: 13, padding: '6px 12px' }}
                                                    >
                                                        {opt.name} <span style={{ color: '#888' }}>({opt.basePrice?.toLocaleString()} VNĐ)</span>
                                                    </Tag.CheckableTag>
                                                ))}
                                            </div>
                                        </Col>
                                    );
                                })()}
                                <Col xs={24} sm={24} style={{ marginTop: 16 }}>
                                    <label><b>Phương thức thanh toán</b></label>
                                    <Select
                                        placeholder="Chọn phương thức thanh toán"
                                        value={formState.paymentMethod || undefined}
                                        onChange={value => handleChange('paymentMethod', value)}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="cash">Tiền mặt</Option>
                                        <Option value="bank">Chuyển khoản ngân hàng</Option>
                                        <Option value="ewallet">Ví điện tử</Option>
                                        <Option value="credit">Thẻ tín dụng</Option>
                                    </Select>
                                </Col>
                                <Col span={24} style={{ marginTop: 16 }}>
                                    <label><b>Cộng tác viên</b></label>
                                    <Select
                                        placeholder="Chọn cộng tác viên thực hiện"
                                        value={formState.partner || undefined}
                                        onChange={value => handleChange('partner', value)}
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="ctv001">Nguyễn Văn A - CTV001</Option>
                                        <Option value="ctv002">Trần Thị B - CTV002</Option>
                                        <Option value="ctv003">Lê Văn C - CTV003</Option>
                                        <Option value="ctv004">Phạm Thị D - CTV004</Option>
                                        <Option value="ctv005">Hoàng Văn E - CTV005</Option>
                                        <Option value="auto">Tự động phân công</Option>
                                    </Select>
                                </Col>
                                <Col span={24} style={{ marginTop: 16 }}>
                                    <label><b>Ghi chú</b></label>
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Nhập ghi chú, yêu cầu đặc biệt hoặc lưu ý cho cộng tác viên..."
                                        style={{ resize: 'none' }}
                                        value={formState.note}
                                        onChange={e => handleChange('note', e.target.value)}
                                        showCount
                                        maxLength={500}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: 24 }}>
                                <Col xs={24} sm={12}>
                                    <Button
                                        size="large"
                                        block
                                        onClick={handleReset}
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
                                        {loading ? 'Đang tạo đơn hàng...' : 'Tạo đơn hàng'}
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    </Card>
                </Col>
                {/* INVOICE COLUMN */}
                <Col xs={24} lg={10} xl={9} xxl={8} style={{ marginTop: 0, marginBottom: 24 }}>
                    <Card
                        title={<span style={{ color: '#1890ff', fontWeight: 600 }}>Hóa đơn tạm tính</span>}
                        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>Khách hàng:</strong> <br />
                            <span>{formState.name || <span style={{ color: '#bbb' }}>Chưa nhập</span>}</span>
                        </div>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>Địa chỉ:</strong>
                            <div style={{ marginTop: 4, fontSize: '13px', wordBreak: 'break-word' }}>
                                {formState.address || <span style={{ color: '#bbb' }}>Chưa nhập</span>}
                            </div>
                        </div>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>Dịch vụ:</strong> <br />
                            <span>{(() => {
                                const selectedService = getSelectedService();
                                return selectedService?.name || <span style={{ color: '#bbb' }}>Chưa chọn</span>;
                            })()}</span>
                        </div>
                        {getSelectedEquipment().length > 0 && (
                            <div style={{ marginBottom: 16 }}>
                                <strong style={{ display: 'block', textAlign: 'left' }}>Thiết bị:</strong> <br />
                                <div style={{ marginTop: 4 }}>
                                    {getSelectedEquipment().map(equip => (
                                        <Tag key={equip.id} color="blue" style={{ marginBottom: 4, fontSize: 12 }}>
                                            {equip.name} {equip.price?.toLocaleString()} VNĐ
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}
                        {getSelectedOptionals().length > 0 && (
                            <div style={{ marginBottom: 16 }}>
                                <strong style={{ display: 'block', textAlign: 'left' }}>Dịch vụ tùy chọn:</strong> <br />
                                <div style={{ marginTop: 4 }}>
                                    {getSelectedOptionals().map(opt => (
                                        <Tag key={opt.id} color="purple" style={{ marginBottom: 4, fontSize: 12 }}>
                                            {opt.name} {opt.basePrice?.toLocaleString()} VNĐ
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Divider style={{ margin: '16px 0' }} />
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: 16 }}>VAT (10%):</Text>
                            <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{getVAT().toLocaleString()} VNĐ</Text>
                        </div>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: 16 }}>Tổng tiền:</Text>
                            <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{getTotalPrice().toLocaleString()} VNĐ</Text>
                        </div>
                        <Divider style={{ margin: '16px 0' }} />
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>Phương thức thanh toán:</strong> <br />
                            <span>{(() => {
                                const val = formState.paymentMethod;
                                const map: Record<string, string> = {
                                    cash: 'Tiền mặt',
                                    bank: 'Chuyển khoản ngân hàng',
                                    ewallet: 'Ví điện tử',
                                    credit: 'Thẻ tín dụng'
                                };
                                if (!val) return <span style={{ color: '#bbb' }}>Chưa chọn</span>;
                                return map[val] || val;
                            })()}</span>
                        </div>
                        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>Cộng tác viên:</strong> <br />
                            <span>{(() => {
                                const val = formState.partner;
                                const map: Record<string, string> = {
                                    ctv001: 'Nguyễn Văn A - CTV001',
                                    ctv002: 'Trần Thị B - CTV002',
                                    ctv003: 'Lê Văn C - CTV003',
                                    ctv004: 'Phạm Thị D - CTV004',
                                    ctv005: 'Hoàng Văn E - CTV005',
                                    auto: 'Tự động phân công'
                                };
                                if (!val) return <span style={{ color: '#bbb' }}>Chưa chọn</span>;
                                return map[val] || val;
                            })()}</span>
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <strong style={{ display: 'block', textAlign: 'left' }}>Ghi chú:</strong>
                            <div style={{ marginTop: 4, padding: '8px', background: '#f9f9f9', borderRadius: '4px', minHeight: '20px' }}>
                                <Text style={{ fontSize: '13px', wordBreak: 'break-word' }}>
                                    {formState.note || <span style={{ color: '#bbb' }}>Không có</span>}
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}