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
    Spin,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useState, useCallback, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';
import { customerListApi } from '@/api/user/customer-api';
import { Customer } from '@/type/user/customer/customer';
import { Service } from '@/type/services/services';
import { getPersonalServices } from '@/api/service/service-api';
import { collaboratorListApi } from '@/api/user/collaborator-api';
import { Collaborator } from '@/type/user/collaborator/collaborator';
import { Equipment } from '@/type/services/equipmemt';
import { OptionalService } from '@/type/services/optional';

const { Title, Text } = Typography;
const { Option } = Select;

interface CustomerOrderFormData {
    name: string;
    address: string;
    service: string;
    day: Dayjs | null;
    time: string;
    paymentMethod: string;
    partner: string;
    note: string;
    selectedOptionals: string[];
    selectedEquipment: string[];
    customerId?: string; // Thêm field để lưu ID khách hàng
}

const initialFormState: CustomerOrderFormData = {
    name: '',
    address: '',
    service: '',
    day: null,
    time: '',
    paymentMethod: '',
    partner: '',
    note: '',
    selectedOptionals: [],
    selectedEquipment: [],
    customerId: undefined,
};

function useCustomerOrderForm(services: Service[]) {
    const [formState, setFormState] = useState<CustomerOrderFormData>(initialFormState);

    const handleChange = <K extends Exclude<keyof CustomerOrderFormData, 'selectedOptionals' | 'selectedEquipment'>>(field: K, value: CustomerOrderFormData[K]) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleCustomerSelect = (customerId: string, customerData: Customer) => {
        setFormState(prev => ({
            ...prev,
            customerId: customerId,
            name: customerData.userId.fullName,
            address: customerData.userId.address,
        }));
    };

    const handleCollaboratorSelect = (collaboratorId: string) => {
        setFormState(prev => ({
            ...prev,
            partner: collaboratorId,
        }));
    };

    const handleServiceChange = (serviceId: string) => {
        setFormState(prev => ({
            ...prev,
            service: serviceId,
            selectedOptionals: [],
            selectedEquipment: [],
        }));
    };

    const handleOptionalToggle = (optionalId: string) => {
        setFormState(prev => ({
            ...prev,
            selectedOptionals: prev.selectedOptionals.includes(optionalId)
                ? prev.selectedOptionals.filter(id => id !== optionalId)
                : [...prev.selectedOptionals, optionalId],
        }));
    };

    const handleEquipmentToggle = (equipmentId: string) => {
        setFormState(prev => ({
            ...prev,
            selectedEquipment: prev.selectedEquipment.includes(equipmentId)
                ? prev.selectedEquipment.filter(id => id !== equipmentId)
                : [...prev.selectedEquipment, equipmentId],
        }));
    };

    const getSelectedService = () => services.find((s: Service) => s._id === formState.service);

    const getSelectedOptionals = () => {
        const selectedService = getSelectedService();
        if (!selectedService?.optionalServices) return [];
        return selectedService.optionalServices.filter(opt =>
            formState.selectedOptionals.includes(opt._id)
        );
    };

    const getSelectedEquipment = () => {
        const selectedService = getSelectedService();
        if (!selectedService?.equipments) return [];
        return selectedService.equipments.filter(equip =>
            formState.selectedEquipment.includes(equip._id)
        );
    };

    const getTotalPrice = () => {
        const selectedService = getSelectedService();
        const basePrice = selectedService?.price || 0;
        const optionalsPrice = getSelectedOptionals().reduce((sum, opt) => sum + (opt.servicePrice || 0), 0);
        const equipmentPrice = getSelectedEquipment().reduce((sum, equip) => sum + (equip.equipmentPrice || 0), 0);
        return (basePrice + optionalsPrice + equipmentPrice) * 1.1;
    };

    const getVAT = () => {
        const selectedService = getSelectedService();
        const basePrice = selectedService?.price || 0;
        const optionalsPrice = getSelectedOptionals().reduce((sum, opt) => sum + (opt.servicePrice || 0), 0);
        const equipmentPrice = getSelectedEquipment().reduce((sum, equip) => sum + (equip.equipmentPrice || 0), 0);
        return (basePrice + optionalsPrice + equipmentPrice) * 0.1;
    };

    const handleReset = () => setFormState(initialFormState);

    return {
        formState,
        setFormState,
        handleChange,
        handleCustomerSelect,
        handleCollaboratorSelect,
        handleServiceChange,
        handleOptionalToggle,
        handleEquipmentToggle,
        getSelectedService,
        getSelectedOptionals,
        getSelectedEquipment,
        getTotalPrice,
        getVAT,
        handleReset,
    };
}

function InvoiceCard({
    formState,
    getSelectedService,
    getSelectedOptionals,
    getSelectedEquipment,
    getTotalPrice,
    getVAT,
}: {
    formState: CustomerOrderFormData;
    getSelectedService: () => Service | undefined;
    getSelectedOptionals: () => OptionalService[];
    getSelectedEquipment: () => Equipment[];
    getTotalPrice: () => number;
    getVAT: () => number;
}) {
    return (
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
                <span>{getSelectedService()?.name || <span style={{ color: '#bbb' }}>Chưa chọn</span>}</span>
            </div>
            {getSelectedEquipment().length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <strong style={{ display: 'block', textAlign: 'left' }}>Thiết bị:</strong> <br />
                    <div style={{ marginTop: 4 }}>
                        {getSelectedEquipment().map((equip: Equipment) => (
                            <Tag key={equip._id} color="blue" style={{ marginBottom: 4, fontSize: 12 }}>
                                {equip.equipmentName} {equip.equipmentPrice?.toLocaleString()} VNĐ
                            </Tag>
                        ))}
                    </div>
                </div>
            )}
            {getSelectedOptionals().length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <strong style={{ display: 'block', textAlign: 'left' }}>Dịch vụ tùy chọn:</strong> <br />
                    <div style={{ marginTop: 4 }}>
                        {getSelectedOptionals().map((opt: OptionalService) => (
                            <Tag key={opt._id} color="purple" style={{ marginBottom: 4, fontSize: 12 }}>
                                {opt.serviceName} {opt.servicePrice?.toLocaleString()} VNĐ
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
                <span>
                    {{
                        cash: 'Tiền mặt',
                        bank: 'Chuyển khoản ngân hàng',
                        ewallet: 'Ví điện tử',
                        credit: 'Thẻ tín dụng',
                    }[formState.paymentMethod] || <span style={{ color: '#bbb' }}>Chưa chọn</span>}
                </span>
            </div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Cộng tác viên:</strong> <br />
                <span>
                    {{
                        ctv001: 'Nguyễn Văn A - CTV001',
                        ctv002: 'Trần Thị B - CTV002',
                        ctv003: 'Lê Văn C - CTV003',
                        ctv004: 'Phạm Thị D - CTV004',
                        ctv005: 'Hoàng Văn E - CTV005',
                        auto: 'Tự động phân công',
                    }[formState.partner] || <span style={{ color: '#bbb' }}>Chưa chọn</span>}
                </span>
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
    );
}

function CustomerSelect({
    value,
    onChange,
    onSelect,
}: {
    value?: string;
    onChange?: (value: string) => void;
    onSelect: (customerId: string, customerData: Customer) => void;
}) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    // Function to fetch customers
    const fetchCustomers = useCallback(async (query: string = '') => {
        setLoading(true);
        try {
            const result = await customerListApi(1, 10, undefined, undefined, query || undefined);
            setCustomers(result.data);
        } catch (error) {
            console.error('Error searching customers:', error);
            message.error('Lỗi khi tìm kiếm khách hàng');
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            await fetchCustomers(query);
        }, 300),
        [fetchCustomers]
    );

    // Load initial data on first render
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Search when searchValue changes
    useEffect(() => {
        if (searchValue === '') {
            // Khi xóa hết text, load lại danh sách ban đầu
            fetchCustomers();
        } else {
            // Khi có text, dùng debounced search
            debouncedSearch(searchValue);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchValue, debouncedSearch, fetchCustomers]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        onChange?.(value);
    };

    const handleSelect = (customerId: string) => {
        const selectedCustomer = customers.find(c => c._id === customerId);
        if (selectedCustomer) {
            onSelect(customerId, selectedCustomer);
            setSearchValue(selectedCustomer.userId.fullName);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        onChange?.('');
        // fetchCustomers sẽ được gọi trong useEffect khi searchValue = ''
    };

    return (
        <Select
            showSearch
            value={searchValue || value}
            placeholder="Nhập tên, số điện thoại hoặc địa chỉ khách hàng"
            style={{ width: '100%' }}
            filterOption={false}
            onSearch={handleSearch}
            onSelect={handleSelect}
            onClear={handleClear}
            allowClear
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : 'Không tìm thấy khách hàng'}
            suffixIcon={<SearchOutlined />}
        >
            {customers.map(customer => (
                <Select.Option key={customer._id} value={customer._id}>
                    <div>
                        <div style={{ fontWeight: 500 }}>{customer.userId.fullName}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {customer.userId.phone} • {customer.userId.address}
                        </div>
                    </div>
                </Select.Option>
            ))}
        </Select>
    );
}

function CollaboratorSelect({
    value,
    onChange,
    onSelect,
}: {
    value?: string;
    onChange?: (value: string) => void;
    onSelect: (collaboratorId: string, collaboratorData: Collaborator) => void;
}) {
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    // Function to fetch collaborators
    const fetchCollaborators = useCallback(async (search: string = '') => {
        setLoading(true);
        try {
            console.log("query: ", search);
            const result = await collaboratorListApi(1, 10, '', '', search || undefined);
            if (result.data) {
                setCollaborators(result.data);
            }
        } catch (error) {
            console.error('Error searching collaborators:', error);
            message.error('Lỗi khi tìm kiếm cộng tác viên');
            setCollaborators([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            await fetchCollaborators(query);
        }, 300),
        [fetchCollaborators]
    );

    // Load initial data on first render
    useEffect(() => {
        fetchCollaborators();
    }, [fetchCollaborators]);

    // Search when searchValue changes
    useEffect(() => {
        if (searchValue === '') {
            // Khi xóa hết text, load lại danh sách ban đầu
            fetchCollaborators();
        } else {
            // Khi có text, dùng debounced search
            debouncedSearch(searchValue);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchValue, debouncedSearch, fetchCollaborators]);

    const handleSearch = (value: string) => {
        setSearchValue(value);
        onChange?.(value);
    };

    const handleSelect = (collaboratorId: string) => {
        const selectedCollaborator = collaborators.find(c => c._id === collaboratorId);
        if (selectedCollaborator) {
            onSelect(collaboratorId, selectedCollaborator);
            setSearchValue(`${selectedCollaborator.userId.fullName} - ${selectedCollaborator.code}`);
        }
    };

    const handleClear = () => {
        setSearchValue('');
        onChange?.('');
        // fetchCollaborators sẽ được gọi trong useEffect khi searchValue = ''
    };

    return (
        <Select
            showSearch
            value={searchValue || value}
            placeholder="Nhập tên, mã code hoặc số điện thoại cộng tác viên"
            style={{ width: '100%' }}
            filterOption={false}
            onSearch={handleSearch}
            onSelect={handleSelect}
            onClear={handleClear}
            allowClear
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : 'Không tìm thấy cộng tác viên'}
            suffixIcon={<SearchOutlined />}
        >
            <Select.Option key="auto" value="auto">
                <div>
                    <div style={{ fontWeight: 500, color: '#1890ff' }}>Tự động phân công</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                        Hệ thống sẽ tự động chọn cộng tác viên phù hợp
                    </div>
                </div>
            </Select.Option>
            {collaborators.map(collaborator => (
                <Select.Option key={collaborator._id} value={collaborator._id}>
                    <div>
                        <div style={{ fontWeight: 500 }}>
                            {collaborator.userId.fullName} - {collaborator.code}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                            {collaborator.userId.phone} • {collaborator.userId.address}
                        </div>
                    </div>
                </Select.Option>
            ))}
        </Select>
    );
}

export default function CreateCustomerOrderPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [servicesLoading, setServicesLoading] = useState(true);

    // Load services on component mount
    useEffect(() => {
        const loadServices = async () => {
            try {
                setServicesLoading(true);
                const response = await getPersonalServices();
                if (response.data) {
                    setServices(response.data);
                }
            } catch (error) {
                console.error('Error loading services:', error);
                message.error('Lỗi khi tải danh sách dịch vụ');
                setServices([]);
            } finally {
                setServicesLoading(false);
            }
        };
        loadServices();
    }, []);

    const {
        formState,
        handleChange,
        handleCustomerSelect,
        handleCollaboratorSelect,
        handleServiceChange,
        handleOptionalToggle,
        handleEquipmentToggle,
        getSelectedService,
        getSelectedOptionals,
        getSelectedEquipment,
        getTotalPrice,
        getVAT,
        handleReset,
    } = useCustomerOrderForm(services);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form values:', {
                ...formState,
                day: formState.day ? formState.day.format('YYYY-MM-DD') : null,
            });
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
                            borderRadius: '8px',
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
                                    <CustomerSelect
                                        value={formState.name}
                                        onChange={value => handleChange('name', value)}
                                        onSelect={handleCustomerSelect}
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
                                        loading={servicesLoading}
                                        disabled={servicesLoading}
                                    >
                                        {services.map((service: Service) => (
                                            <Option key={service._id} value={service._id}>
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
                                        disabledDate={current => current && current.isBefore(dayjs().startOf('day'))}
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
                                {/* Equipment Selection */}
                                {formState.service && (() => {
                                    const selectedService = getSelectedService();
                                    return (selectedService?.equipments && selectedService.equipments.length > 0) ? (
                                        <Col xs={24} sm={12} style={{ marginTop: 16 }}>
                                            <label><b>Thiết bị</b></label>
                                            <div style={{ marginTop: 8, padding: '12px', background: '#f0f9ff', borderRadius: '6px' }}>
                                                {selectedService.equipments.map(equip => (
                                                    <Tag.CheckableTag
                                                        key={equip._id}
                                                        checked={formState.selectedEquipment.includes(equip._id)}
                                                        onChange={() => handleEquipmentToggle(equip._id)}
                                                        style={{ marginBottom: 8, fontSize: 13, padding: '6px 12px' }}
                                                    >
                                                        {equip.equipmentName} <span style={{ color: '#888' }}>({equip.equipmentPrice?.toLocaleString()} VNĐ)</span>
                                                    </Tag.CheckableTag>
                                                ))}
                                            </div>
                                        </Col>
                                    ) : null;
                                })()}
                                {/* Optional Services Selection */}
                                {formState.service && (() => {
                                    const selectedService = getSelectedService();
                                    return (selectedService?.optionalServices && selectedService.optionalServices.length > 0) ? (
                                        <Col xs={24} sm={12} style={{ marginTop: 16 }}>
                                            <label><b>Dịch vụ tùy chọn</b></label>
                                            <div style={{ marginTop: 8, padding: '12px', background: '#f9f9f9', borderRadius: '6px' }}>
                                                {selectedService.optionalServices.map(opt => (
                                                    <Tag.CheckableTag
                                                        key={opt._id}
                                                        checked={formState.selectedOptionals.includes(opt._id)}
                                                        onChange={() => handleOptionalToggle(opt._id)}
                                                        style={{ marginBottom: 8, fontSize: 13, padding: '6px 12px' }}
                                                    >
                                                        {opt.serviceName} <span style={{ color: '#888' }}>({opt.servicePrice?.toLocaleString()} VNĐ)</span>
                                                    </Tag.CheckableTag>
                                                ))}
                                            </div>
                                        </Col>
                                    ) : null;
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
                                    <CollaboratorSelect
                                        value={formState.partner}
                                        onChange={value => handleChange('partner', value)}
                                        onSelect={handleCollaboratorSelect}
                                    />
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
                <Col xs={24} lg={10} xl={9} xxl={8} style={{ marginTop: 0, marginBottom: 24 }}>
                    <InvoiceCard
                        formState={formState}
                        getSelectedService={getSelectedService}
                        getSelectedOptionals={getSelectedOptionals}
                        getSelectedEquipment={getSelectedEquipment}
                        getTotalPrice={getTotalPrice}
                        getVAT={getVAT}
                    />
                </Col>
            </Row>
        </div>
    );
}