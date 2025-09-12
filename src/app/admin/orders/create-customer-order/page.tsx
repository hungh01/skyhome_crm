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

import { OptionalService } from '@/type/services/optional';
import { isDetailResponse } from '@/utils/response-handler';
import { notify } from '@/components/Notification';
import { couponListApi } from '@/api/promotion/coupons-api';
import { Promotion } from '@/type/promotion/promotion';

import { createOrderApi, getCaculateInvoice } from '@/api/order/order-api';
import { Invoice } from '@/type/order/invoice';
import { CreateOrder } from '@/type/order/createOrder.request';

interface InvoiceData extends Invoice {
    customerName?: string;
    customerAddress?: string;
    customerPhone?: string;
    customerId?: string;
    serviceName?: string;
    serviceDescription?: string;
    servicePrice?: number;
    selectedOptionals?: OptionalService[];
    selectedPromotions?: Promotion[];
    scheduledDate?: string;
    scheduledTime?: string;
    paymentMethod?: string;
    note?: string;
    promotions?: string[];
    createdAt?: string;
    vatAmount?: number;
    totalAmount?: number;
}


const { Title, Text } = Typography;
const { Option } = Select;



interface CustomerOrderFormData {
    customerId?: string;
    name: string;
    address: string;
    service: string;
    day: Dayjs | null;
    paymentMethod: string;
    note: string;
    selectedOptionals: string[];
    promotions?: string[];
    selectedPromotions: string[];
}


const initialFormState: CustomerOrderFormData = {
    name: '',
    address: '',
    service: '',
    day: null,
    paymentMethod: '',
    note: '',
    selectedOptionals: [],
    customerId: '',
    promotions: [],
    selectedPromotions: [],
};

function useCustomerOrderForm(services: Service[], setSelectedCustomer: (customer: Customer) => void, promotions: Promotion[]) {
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
        setSelectedCustomer(customerData);
    };


    const handlePromotionSelect = (promotionIds: string[]) => {
        setFormState(prev => ({
            ...prev,
            promotions: promotionIds,
            selectedPromotions: promotionIds,
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



    const getSelectedService = () => services.find((s: Service) => s._id === formState.service);

    const getSelectedOptionals = () => {
        const selectedService = getSelectedService();
        if (!selectedService?.optionalServices) return [];
        return selectedService.optionalServices.filter(opt =>
            formState.selectedOptionals.includes(opt._id)
        );
    };

    const getSelectedPromotions = () => {
        if (!promotions || !formState.selectedPromotions) return [];
        return promotions.filter((promo: Promotion) =>
            formState.selectedPromotions.includes(promo._id)
        );
    };

    // const getTotalPrice = () => {
    //     const selectedService = getSelectedService();
    //     const basePrice = selectedService?.price || 0;
    //     const optionalsPrice = getSelectedOptionals().reduce((sum, opt) => sum + (opt.price || 0), 0);
    //     return (basePrice + optionalsPrice) * 1.1;
    // };

    // const getVAT = () => {
    //     const selectedService = getSelectedService();
    //     const basePrice = selectedService?.price || 0;
    //     const optionalsPrice = getSelectedOptionals().reduce((sum, opt) => sum + (opt.price || 0), 0);
    //     return (basePrice + optionalsPrice) * 0.1;
    // };

    const handleReset = () => setFormState(initialFormState);

    return {
        formState,
        setFormState,
        handleChange,
        handleCustomerSelect,
        //handleCollaboratorSelect,
        handlePromotionSelect,
        handleServiceChange,
        handleOptionalToggle,
        getSelectedService,
        getSelectedOptionals,
        getSelectedPromotions,
        // getTotalPrice,
        // getVAT,
        handleReset,
    };
}

function InvoiceCard({
    formState,
    getSelectedService,
    getSelectedOptionals,
    invoiceData,
    showInvoice,
    onCreateOrder,
    createOrderLoading,
    promotions,
}: {
    formState: CustomerOrderFormData;
    getSelectedService: () => Service | undefined;
    getSelectedOptionals: () => OptionalService[];
    invoiceData?: InvoiceData | null;
    showInvoice: boolean;
    onCreateOrder: () => void;
    createOrderLoading: boolean;
    promotions: Promotion[];
}) {
    return (
        <Card
            title={
                <span style={{ color: '#1890ff', fontWeight: 600 }}>
                    {showInvoice ? 'Hóa đơn tạm tính' : 'Thông tin tạm tính'}
                </span>
            }
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
            {showInvoice && invoiceData ? (
                <>
                    <div style={{ marginBottom: 16, padding: '12px', background: '#f0f8ff', borderRadius: '6px' }}>

                        <div style={{ fontSize: '12px', color: '#666' }}>
                            Ngày tạo: {invoiceData.createdAt ? new Date(invoiceData.createdAt).toLocaleString('vi-VN') : ''}
                        </div>
                    </div>
                    {/* Thông tin khách hàng */}
                    <div style={{ marginBottom: 16, padding: '12px', background: '#f0f8ff', borderRadius: '6px' }}>
                        <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#1890ff' }}>Thông tin khách hàng:</div>

                        {invoiceData.customerName && (
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Tên khách hàng:</span>
                                <span>{invoiceData.customerName}</span>
                            </div>
                        )}

                        {invoiceData.customerPhone && (
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Số điện thoại:</span>
                                <span>{invoiceData.customerPhone}</span>
                            </div>
                        )}

                        {invoiceData.customerId && (
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Mã khách hàng:</span>
                                <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{invoiceData.customerId}</span>
                            </div>
                        )}

                        {invoiceData.customerAddress && (
                            <div style={{ marginBottom: 8 }}>
                                <span style={{ fontWeight: 'bold' }}>Địa chỉ:</span>
                                <div style={{ marginTop: 4, fontSize: '13px', wordBreak: 'break-word', padding: '8px', background: '#fff', borderRadius: '4px' }}>
                                    {invoiceData.customerAddress}
                                </div>
                            </div>
                        )}
                    </div>
                    {/* Thông tin dịch vụ */}
                    <div style={{ marginBottom: 16, padding: '12px', background: '#fff7e6', borderRadius: '6px' }}>
                        <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#fa8c16' }}>Thông tin dịch vụ:</div>

                        {invoiceData.serviceName && (
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Tên dịch vụ:</span>
                                <span>{invoiceData.serviceName}</span>
                            </div>
                        )}

                        {invoiceData.servicePrice !== undefined && (
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Giá dịch vụ:</span>
                                <span>{invoiceData.servicePrice.toLocaleString()} VNĐ</span>
                            </div>
                        )}

                        {invoiceData.serviceDescription && (
                            <div style={{ marginBottom: 8 }}>
                                <span style={{ fontWeight: 'bold' }}>Mô tả:</span>
                                <div style={{ marginTop: 4, fontSize: '13px', padding: '8px', background: '#fff', borderRadius: '4px' }}>
                                    {invoiceData.serviceDescription}
                                </div>
                            </div>
                        )}

                        {invoiceData.selectedOptionals && invoiceData.selectedOptionals.length > 0 && (
                            <div>
                                <span style={{ fontWeight: 'bold', display: 'block', marginBottom: 8 }}>Dịch vụ tùy chọn:</span>
                                <div>
                                    {invoiceData.selectedOptionals.map((opt: OptionalService) => (
                                        <Tag key={opt._id} color="orange" style={{ marginBottom: 4, fontSize: 12 }}>
                                            {opt.name} - {opt.price?.toLocaleString()} VNĐ
                                            {opt.durationMinutes && ` (${opt.durationMinutes} phút)`}
                                        </Tag>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <Divider style={{ margin: '16px 0' }} />

                    {/* Thông tin tài chính chi tiết */}
                    <div style={{ marginBottom: 16, padding: '12px', background: '#f9f9f9', borderRadius: '6px' }}>
                        <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#1890ff' }}>Chi tiết tài chính:</div>

                        {invoiceData.initialFee !== undefined && (
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Tổng phí dịch vụ:</span>
                                <span>{invoiceData.initialFee.toLocaleString()} VNĐ</span>
                            </div>
                        )}


                        {invoiceData.platformFee !== undefined && (
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Phí nền tảng:</span>
                                <span>{invoiceData.platformFee.toLocaleString()} VNĐ</span>
                            </div>
                        )}


                        {invoiceData.shiftIncome !== undefined && (
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Thu nhập của cộng tác viên:</span>
                                <span>{invoiceData.shiftIncome.toLocaleString()} VNĐ</span>
                            </div>
                        )}

                        {invoiceData.totalDiscount !== undefined && (
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Tổng giảm giá:</span>
                                <span style={{ color: '#52c41a' }}>-{invoiceData.totalDiscount.toLocaleString()} VNĐ</span>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: 16 }}>VAT (10%):</Text>
                        <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{invoiceData.vatAmount?.toLocaleString()} VNĐ</Text>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: 16 }}>Tổng tiền thanh toán:</Text>
                        <Text strong style={{ fontSize: 18, color: '#1890ff' }}>{invoiceData.finalFee?.toLocaleString()} VNĐ</Text>
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

                    {/* Thông tin lịch hẹn và khuyến mãi */}
                    <div style={{ marginBottom: 16, padding: '12px', background: '#f6ffed', borderRadius: '6px' }}>
                        <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#52c41a' }}>Thông tin bổ sung:</div>

                        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Ngày hẹn:</span>
                            <span>{invoiceData.scheduledDate || 'Chưa chọn'} - {invoiceData.scheduledTime || 'Chưa chọn'}</span>
                        </div>
                        {invoiceData.totalTime !== undefined && (
                            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Thời gian làm việc:</span>
                                <span>{invoiceData.totalTime / 60} giờ {invoiceData.totalTime % 60} phút</span>
                            </div>
                        )}

                        {invoiceData.promotions && invoiceData.promotions.length > 0 && (
                            <div style={{ marginBottom: 8 }}>
                                <span style={{ fontWeight: 'bold', display: 'block', marginBottom: 4 }}>Khuyến mãi áp dụng:</span>
                                <div>
                                    {invoiceData.promotions.map((promotionId: string, index: number) => {
                                        // Tìm promotion từ danh sách promotions
                                        const promotion = promotions.find((p: Promotion) => p._id === promotionId);
                                        if (!promotion) {
                                            return (
                                                <Tag key={promotionId || index} color="green" style={{ marginBottom: 4, fontSize: 12 }}>
                                                    Mã: {promotionId}
                                                </Tag>
                                            );
                                        }

                                        return (
                                            <Tag
                                                key={promotion._id}
                                                color="green"
                                                style={{
                                                    marginBottom: 4,
                                                    fontSize: 12,
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    display: 'inline-block',
                                                    marginRight: '8px'
                                                }}
                                            >
                                                <div style={{ fontWeight: 'bold' }}>{promotion.code}</div>
                                                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                                                    {promotion.discountType === 'percent'
                                                        ? `-${promotion.discountValue}%`
                                                        : `-${promotion.discountValue.toLocaleString()} VNĐ`
                                                    }
                                                    {promotion.maxDiscountValue && promotion.discountType === 'percent' &&
                                                        ` (tối đa ${promotion.maxDiscountValue.toLocaleString()} VNĐ)`
                                                    }
                                                </div>
                                                {promotion.minOrderValue > 0 && (
                                                    <div style={{ fontSize: '10px', opacity: 0.8 }}>
                                                        Đơn tối thiểu: {promotion.minOrderValue.toLocaleString()} VNĐ
                                                    </div>
                                                )}
                                            </Tag>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
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
                        <strong>Khách hàng:</strong>
                        <span>{formState.name}</span>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Địa chỉ:</strong>
                        <span>{formState.address}</span>
                    </div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Dịch vụ:</strong>
                        <span>{getSelectedService()?.name || ''}</span>
                    </div>
                    {getSelectedOptionals().length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                            <strong style={{ display: 'block', textAlign: 'left' }}>Dịch vụ tùy chọn:</strong>
                            <div style={{ marginTop: 4 }}>
                                {getSelectedOptionals().map(opt => (
                                    <Tag key={opt._id} color="purple" style={{ marginBottom: 4, fontSize: 12 }}>
                                        {opt.name} {opt.price?.toLocaleString()} VNĐ
                                    </Tag>
                                ))}
                            </div>
                        </div>
                    )}
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Phương thức thanh toán:</strong>
                        <span>{formState.paymentMethod}</span>
                    </div>

                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong>Ngày hẹn:</strong>
                        <span>{formState.day ? formState.day.format('DD/MM/YYYY - HH:mm:ss') : ''}</span>
                    </div>
                    {formState.note && (
                        <div style={{ marginBottom: 16 }}>
                            <strong>Ghi chú:</strong>
                            <div style={{ marginTop: 4, padding: '8px', background: '#f5f5f5', borderRadius: '4px', fontSize: '13px' }}>
                                {formState.note}
                            </div>
                        </div>
                    )}
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

function PromotionSelect({
    value,
    onChange,
    selectedServiceId,
}: {
    value?: string[];
    onChange: (value: string[]) => void;
    services: Service[];
    selectedServiceId?: string;
}) {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    // Function to fetch promotions
    const fetchPromotions = useCallback(async (search: string = '') => {
        setLoading(true);
        try {
            const result = await couponListApi(1, 100, search || '', 'active', '', '', '');
            if (isDetailResponse(result)) {
                // Filter promotions that are applicable to the selected service or general promotions
                const filteredPromotions = result.data.filter(promotion => {
                    if (!selectedServiceId) return true;

                    // Check if promotion is applicable to the selected service
                    // This logic would depend on your promotion structure
                    // For now, assuming all active promotions are applicable
                    return promotion.status === 1;
                });
                setPromotions(filteredPromotions);
            }
        } catch (error) {
            console.error('Error searching promotions:', error);
            message.error('Lỗi khi tìm kiếm khuyến mãi');
            setPromotions([]);
        } finally {
            setLoading(false);
        }
    }, [selectedServiceId]);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            await fetchPromotions(query);
        }, 300),
        [fetchPromotions]
    );

    // Load initial data on first render and when service changes
    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    // Search when searchValue changes
    useEffect(() => {
        if (searchValue === '') {
            fetchPromotions();
        } else {
            debouncedSearch(searchValue);
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchValue, debouncedSearch, fetchPromotions]);

    const handleSearch = (searchText: string) => {
        setSearchValue(searchText);
    };

    const handleChange = (selectedValues: string[]) => {
        onChange(selectedValues);
    };

    const handleClear = () => {
        setSearchValue('');
        onChange([]);
    };

    return (
        <Select
            mode="multiple"
            showSearch
            value={value}
            placeholder="Chọn mã khuyến mãi"
            style={{ width: '100%' }}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            onClear={handleClear}
            allowClear
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : 'Không tìm thấy khuyến mãi'}
            suffixIcon={<SearchOutlined />}
            maxTagCount="responsive"
        >
            {promotions.map(promotion => (
                <Select.Option key={promotion._id} value={promotion._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>{promotion.code}</div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                {promotion.description || 'Mã khuyến mãi'}
                            </div>
                        </div>
                        <Tag color="green" style={{ margin: 0 }}>
                            -{promotion.discountValue}%
                        </Tag>
                    </div>
                </Select.Option>
            ))}
        </Select>
    );
}



export default function CreateCustomerOrderPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
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

    // Load promotions and collaborators on component mount
    useEffect(() => {
        const loadPromotions = async () => {
            try {
                const response = await couponListApi(1, 100, '', 'active', '', '', '');
                if (isDetailResponse(response)) {
                    setPromotions(response.data);
                }
            } catch (error) {
                console.error('Error loading promotions:', error);
                message.error('Lỗi khi tải danh sách khuyến mãi');
                setPromotions([]);
            }
        };

        loadPromotions();
    }, []);

    const {
        formState,
        handleChange,
        handleCustomerSelect,
        //handleCollaboratorSelect,
        handlePromotionSelect,
        handleServiceChange,
        handleOptionalToggle,
        getSelectedService,
        getSelectedOptionals,
        getSelectedPromotions,
        // getTotalPrice,
        // getVAT,
        handleReset,
    } = useCustomerOrderForm(services, setSelectedCustomer, promotions);

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
            if (!formState.paymentMethod) {
                notify({ type: 'error', message: 'Vui lòng chọn phương thức thanh toán!' });
                return;
            }
            if (formState.note && formState.note.length > 500) {
                notify({ type: 'error', message: 'Ghi chú không được quá 500 ký tự!' });
                return;
            }

            setLoading(true);

            // Call API tính giá
            const invoicePayload = {
                serviceId: formState.service,
                optionalService: formState.selectedOptionals,
                promotions: formState.promotions || [],
                paymentMethod: formState.paymentMethod
            };

            const invoiceResponse = await getCaculateInvoice(invoicePayload);
            if (!isDetailResponse(invoiceResponse)) {
                throw new Error('Invalid invoice response');
            }

            // Kết hợp thông tin từ formState với kết quả tính toán từ API
            const selectedService = getSelectedService();
            const selectedOptionals = getSelectedOptionals();


            const combinedInvoiceData: InvoiceData = {
                ...invoiceResponse.data,
                // Thông tin khách hàng
                customerName: formState.name,
                customerAddress: formState.address,
                customerPhone: selectedCustomer?.userId?.phone || '',
                customerId: selectedCustomer?._id || '',

                // Thông tin dịch vụ
                serviceName: selectedService?.name || '',
                serviceDescription: selectedService?.description || '',
                servicePrice: selectedService?.price || 0,
                selectedOptionals: selectedOptionals,

                // Thông tin lịch hẹn
                scheduledDate: formState.day?.format('DD/MM/YYYY') || '',
                scheduledTime: formState.day?.format('HH:mm:ss') || '',

                // Thông tin thanh toán
                paymentMethod: formState.paymentMethod,

                // Ghi chú
                note: formState.note || '',

                // Khuyến mãi
                promotions: formState.promotions || [],

                // Timestamp
                createdAt: new Date().toISOString(),

                // Thông tin tính toán (từ API response)
                vatAmount: Math.round(invoiceResponse.data.totalFee * 0.1),
                totalAmount: invoiceResponse.data.totalFee
            };

            setInvoiceData(combinedInvoiceData);
            setShowInvoice(true);
            notify({ type: 'success', message: 'Tạo hóa đơn tạm tính thành công. Vui lòng kiểm tra bên phải.' });

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
            const selectedOptionals = getSelectedOptionals();
            const selectedPromotions = getSelectedPromotions();

            if (!invoiceData || !selectedCustomer) {
                throw new Error('Chưa có thông tin hóa đơn hoặc khách hàng');
            }

            // Chuyển đổi payment method
            const paymentMethodMap: { [key: string]: 'cash' | 'card' | 'momo' | 'vnpay' } = {
                'cash': 'cash',
                'bank': 'card',
                'ewallet': 'momo',
                'credit': 'card'
            };



            // Tạo payload theo DTO structure
            const orderPayload: CreateOrder = {
                type: 'personal',
                customerId: selectedCustomer._id,
                customerName: selectedCustomer.userId.fullName,
                customerPhone: selectedCustomer.userId.phone || '',
                address: selectedCustomer.userId.address || formState.address,

                dateWork: formState.day ? formState.day.format('YYYY-MM-DDTHH:mm:ss.sssZ') : '',
                endDateWork: formState.day ? formState.day.add(invoiceData.totalTime, 'minutes').format('YYYY-MM-DDTHH:mm:ss.sssZ') : '',
                serviceId: formState.service,

                optionalService: selectedOptionals,

                promotions: selectedPromotions?.map((promo: Promotion) => ({
                    _id: promo._id,
                    name: promo.code,
                    discountValue: promo.discountValue,
                })) || [],
                note: formState.note || undefined,
                paymentMethod: paymentMethodMap[formState.paymentMethod] || 'cash',

                // Thông tin tài chính từ invoice
                initialFee: invoiceData.initialFee || 0,
                finalFee: invoiceData.finalFee || 0,
                totalFee: invoiceData.totalFee || 0,
                platformFee: invoiceData.platformFee || 0,
                workShiftDeposit: invoiceData.workShiftDeposit || 0,
                remainingShiftDeposit: invoiceData.remainingShiftDeposit || 0,
                shiftIncome: invoiceData.shiftIncome || 0,
                netIncome: invoiceData.netIncome || 0,
                totalDiscount: invoiceData.totalDiscount || 0,
                totalTime: invoiceData.totalTime || 0,
            };

            // Gọi API tạo đơn hàng
            const response = await createOrderApi(orderPayload);

            if (!isDetailResponse(response)) {
                throw new Error('Không thể tạo đơn hàng');
            }

            notify({ type: 'success', message: 'Tạo đơn hàng thành công.' });

            // Reset form và invoice
            handleReset();
            setInvoiceData(null);
            setShowInvoice(false);

        } catch (error) {
            console.error('Create order error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi khi tạo đơn hàng';
            notify({ type: 'error', message: errorMessage });
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
                                <Col span={24} style={{ marginTop: 16 }}>
                                    <label><b>Ngày và thời gian thực hiện</b></label>
                                    <DatePicker
                                        showTime={{
                                            format: 'HH:mm:ss',
                                        }}
                                        format="DD/MM/YYYY HH:mm:ss"
                                        placeholder="Chọn ngày và thời gian"
                                        value={formState.day}
                                        onChange={dateTime => {
                                            handleChange('day', dateTime);
                                        }}
                                        style={{ width: '100%' }}
                                        disabledDate={current => current && current.isBefore(dayjs().startOf('day'))}
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
                                                {service.name} ({service.categoryId.name})
                                            </Option>
                                        ))}
                                    </Select>
                                </Col>
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
                                                        {opt.name} <span style={{ color: '#888' }}>({opt.price?.toLocaleString()} VNĐ)</span>
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

                                <Col xs={24} sm={24} style={{ marginTop: 16 }}>
                                    <label><b>Khuyến mãi</b></label>
                                    <PromotionSelect
                                        value={formState.promotions}
                                        onChange={handlePromotionSelect}
                                        services={services}
                                        selectedServiceId={formState.service}
                                    />
                                    {formState.promotions && formState.promotions.length > 0 && (
                                        <div style={{ marginTop: 8 }}>
                                            {formState.promotions.map(promotionId => {
                                                const promotion = promotions.find((p: Promotion) => p._id === promotionId);
                                                return promotion ? (
                                                    <Tag
                                                        key={promotion._id}
                                                        color="green"
                                                        style={{
                                                            marginBottom: 4,
                                                            fontSize: 12,
                                                            padding: '4px 8px',
                                                            borderRadius: '6px',
                                                            display: 'inline-block',
                                                            marginRight: '8px'
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: 'bold' }}>{promotion.code}</div>
                                                        <div style={{ fontSize: '10px', opacity: 0.8 }}>
                                                            {promotion.discountType === 'percent'
                                                                ? `-${promotion.discountValue}%`
                                                                : `-${promotion.discountValue.toLocaleString()} VNĐ`
                                                            }
                                                            {promotion.maxDiscountValue && promotion.discountType === 'percent' &&
                                                                ` (tối đa ${promotion.maxDiscountValue.toLocaleString()} VNĐ)`
                                                            }
                                                        </div>
                                                    </Tag>
                                                ) : null;
                                            })}
                                        </div>
                                    )}
                                </Col>

                                {/* <Col span={24} style={{ marginTop: 16 }}>
                                    <label><b>Cộng tác viên</b></label>
                                    <CollaboratorSelect
                                        value={formState.collaboratorId}
                                        onChange={value => handleChange('collaboratorId', value)}
                                        onSelect={handleCollaboratorSelect}
                                    />
                                </Col> */}

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
                        invoiceData={invoiceData}
                        showInvoice={showInvoice}
                        onCreateOrder={handleCreateOrder}
                        createOrderLoading={createOrderLoading}
                        promotions={promotions}
                    />
                </Col>
            </Row>
        </div>
    );
}


