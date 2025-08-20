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
import { isDetailResponse } from '@/utils/response-handler';
import { notify } from '@/components/Notification';

const { Title, Text } = Typography;
const { Option } = Select;

interface CustomerOrderFormData {
    name: string;
    address: string;
    service: string;
    day: Dayjs | null;
    time: string;
    paymentMethod: string;
    collaboratorId: string;
    note: string;
    selectedOptionals: string[];
    selectedEquipment: string[];
    customerId: string;
    collaboratorInfo: string;
}

interface InvoiceData {
    invoiceId: string;
    invoiceNumber: string;
    status: string;
    customerId: string;
    customerName: string;
    customerAddress: string;
    serviceId: string;
    serviceName?: string;
    servicePrice: number;
    selectedEquipment: Equipment[];
    selectedOptionals: OptionalService[];
    scheduledDate: string | null;
    scheduledTime: string;
    paymentMethod: string;
    collaboratorId: string;
    collaboratorInfo: string;
    note: string;
    vatAmount: number;
    totalAmount: number;
    createdAt: string;
}

const initialFormState: CustomerOrderFormData = {
    name: '',
    address: '',
    service: '',
    day: null,
    time: '',
    paymentMethod: '',
    collaboratorId: '',
    note: '',
    selectedOptionals: [],
    selectedEquipment: [],
    customerId: '',
    collaboratorInfo: '',
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

    const handleCollaboratorSelect = (collaboratorId: string, collaboratorData: Collaborator) => {
        setFormState(prev => ({
            ...prev,
            collaboratorId: collaboratorId,
            collaboratorInfo: `${collaboratorData.userId.fullName} - ${collaboratorData.code}`,
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
    invoiceData,
    showInvoice,
    onCreateOrder,
    createOrderLoading,
}: {
    formState: CustomerOrderFormData;
    getSelectedService: () => Service | undefined;
    getSelectedOptionals: () => OptionalService[];
    getSelectedEquipment: () => Equipment[];
    getTotalPrice: () => number;
    getVAT: () => number;
    invoiceData?: InvoiceData | null;
    showInvoice: boolean;
    onCreateOrder: () => void;
    createOrderLoading: boolean;
}) {
    return (
        <Card
            title={
                <span style={{ color: '#1890ff', fontWeight: 600 }}>
                    {showInvoice ? 'Hóa đơn tạm tính' : 'Hóa đơn tạm tính'}
                </span>
            }
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
            {showInvoice && invoiceData ? (
                <>
                    <div style={{ marginBottom: 16, padding: '12px', background: '#f0f8ff', borderRadius: '6px' }}>

                        <div style={{ fontSize: '12px', color: '#666' }}>
                            Ngày tạo: {new Date(invoiceData.createdAt).toLocaleString('vi-VN')}
                        </div>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Khách hàng:</strong>
                        <span>{invoiceData.customerName}</span>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Địa chỉ:</strong>
                        <div style={{ marginTop: 4, fontSize: '13px', wordBreak: 'break-word' }}>
                            {invoiceData.customerAddress}
                        </div>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Dịch vụ:</strong>
                        <span>{invoiceData.serviceName}</span>
                    </div>
                    {invoiceData.selectedEquipment?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <strong style={{ display: 'block', textAlign: 'left' }}>Thiết bị:</strong>
                            <div style={{ marginTop: 4 }}>
                                {invoiceData.selectedEquipment.map((equip: Equipment) => (
                                    <Tag key={equip._id} color="blue" style={{ marginBottom: 4, fontSize: 12 }}>
                                        {equip.equipmentName} {equip.equipmentPrice?.toLocaleString()} VNĐ
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    )}
                    {invoiceData.selectedOptionals?.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <strong style={{ display: 'block', textAlign: 'left' }}>Dịch vụ tùy chọn:</strong>
                            <div style={{ marginTop: 4 }}>
                                {invoiceData.selectedOptionals.map((opt: OptionalService) => (
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
                        <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{invoiceData.vatAmount?.toLocaleString()} VNĐ</Text>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: 16 }}>Tổng tiền:</Text>
                        <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{invoiceData.totalAmount?.toLocaleString()} VNĐ</Text>
                    </div>
                    <Divider style={{ margin: '16px 0' }} />
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Phương thức thanh toán:</strong>
                        <span>
                            {{
                                cash: 'Tiền mặt',
                                bank: 'Chuyển khoản ngân hàng',
                                ewallet: 'Ví điện tử',
                                credit: 'Thẻ tín dụng',
                            }[invoiceData.paymentMethod as string] || 'Chưa chọn'}
                        </span>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Cộng tác viên:</strong>
                        <span>{invoiceData.collaboratorInfo || 'Chưa chọn'}</span>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Ngày hẹn:</strong>
                        <span>{invoiceData.scheduledDate || 'Chưa chọn'} - {invoiceData.scheduledTime || 'Chưa chọn'}</span>
                    </div>
                    {invoiceData.note && (
                        <div style={{ marginBottom: 16 }}>
                            <strong>Ghi chú:</strong>
                            <div style={{ marginTop: 4, padding: '8px', background: '#f5f5f5', borderRadius: '4px', fontSize: '13px' }}>
                                {invoiceData.note}
                            </div>
                        </div>
                    )}
                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={onCreateOrder}
                        loading={createOrderLoading}
                        style={{ marginTop: 16 }}
                    >
                        {createOrderLoading ? 'Đang tạo đơn hàng...' : 'Tạo đơn hàng'}
                    </Button>
                </>
            ) : (
                <>
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
                        <strong>Cộng tác viên:</strong>
                        <span>{formState.collaboratorInfo || <span style={{ color: '#bbb' }}>Chưa chọn</span>}</span>
                    </div>
                </>
            )}
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
            if (isDetailResponse(result)) {
                setCustomers(result.data);
            }
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
            const result = await collaboratorListApi(1, 10, '', '', search || undefined);
            if (isDetailResponse(result)) {
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
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [showInvoice, setShowInvoice] = useState(false);
    const [createOrderLoading, setCreateOrderLoading] = useState(false);

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

    const handleCreateInvoice = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Creating invoice with values:', formState);
        try {
            if (!formState.name || formState.name.length < 2 || formState.name.length > 50) {
                notify({ type: 'error', message: 'Tên khách hàng phải có từ 2 đến 50 ký tự!' });
                return;
            }
            if (!formState.address || formState.address.length < 10) {
                notify({ type: 'error', message: 'Địa chỉ phải có ít nhất 10 ký tự!' });
                return;
            }
            if (!formState.service) {
                notify({ type: 'error', message: 'Vui lòng chọn dịch vụ!' });
                return;
            }
            if (!formState.day) {
                notify({ type: 'error', message: 'Vui lòng chọn ngày thực hiện dịch vụ!' });
                return;
            }
            if (!formState.time) {
                notify({ type: 'error', message: 'Vui lòng chọn thời gian thực hiện dịch vụ!' });
                return;
            }
            if (!formState.paymentMethod) {
                notify({ type: 'error', message: 'Vui lòng chọn phương thức thanh toán!' });
                return;
            }
            if (!formState.collaboratorId) {
                notify({ type: 'error', message: 'Vui lòng chọn cộng tác viên!' });
                return;
            }
            if (formState.note && formState.note.length > 500) {
                notify({ type: 'error', message: 'Ghi chú không được quá 500 ký tự!' });
                return;
            }

            setLoading(true);

            // Call API tạo hóa đơn tạm tính
            const invoicePayload = {
                customerId: formState.customerId,
                customerName: formState.name,
                customerAddress: formState.address,
                serviceId: formState.service,
                serviceName: getSelectedService()?.name,
                servicePrice: getSelectedService()?.price || 0,
                selectedEquipment: getSelectedEquipment(),
                selectedOptionals: getSelectedOptionals(),
                scheduledDate: formState.day ? formState.day.format('YYYY-MM-DD') : null,
                scheduledTime: formState.time,
                paymentMethod: formState.paymentMethod,
                collaboratorId: formState.collaboratorId,
                collaboratorInfo: formState.collaboratorInfo,
                note: formState.note,
                vatAmount: getVAT(),
                totalAmount: getTotalPrice(),
                createdAt: new Date().toISOString(),
            };

            // Simulate API call - thay thế bằng API thật
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Giả lập response từ API
            const mockInvoiceResponse = {
                ...invoicePayload,
                invoiceId: `INV-${Date.now()}`,
                invoiceNumber: `HD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: 'draft',
            };

            setInvoiceData(mockInvoiceResponse);
            setShowInvoice(true);
            message.success('Tạo hóa đơn tạm tính thành công!');

        } catch (error) {
            console.error('Create invoice error:', error);
            notify({ type: 'error', message: 'Đã xảy ra lỗi khi tạo hóa đơn tạm tính. Vui lòng thử lại sau.' });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrder = async () => {
        try {
            setCreateOrderLoading(true);

            // Call API tạo đơn hàng
            const orderPayload = {
                ...invoiceData,
                orderId: `ORD-${Date.now()}`,
                orderNumber: `DH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: 'confirmed',
                confirmedAt: new Date().toISOString(),
            };

            // Simulate API call - thay thế bằng API thật
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log('Order created:', orderPayload);
            message.success('Tạo đơn hàng thành công!');

            // Reset form và invoice
            handleReset();
            setInvoiceData(null);
            setShowInvoice(false);

        } catch (error) {
            console.error('Create order error:', error);
            notify({ type: 'error', message: 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau.' });
        } finally {
            setCreateOrderLoading(false);
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
                        <form onSubmit={handleCreateInvoice} autoComplete="off">
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
                                        value={formState.collaboratorId}
                                        onChange={value => handleChange('collaboratorId', value)}
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
                                        {loading ? 'Đang tạo hóa đơn...' : 'Xuất hóa đơn tạm tính'}
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
                        invoiceData={invoiceData}
                        showInvoice={showInvoice}
                        onCreateOrder={handleCreateOrder}
                        createOrderLoading={createOrderLoading}
                    />
                </Col>
            </Row>
        </div>
    );
}