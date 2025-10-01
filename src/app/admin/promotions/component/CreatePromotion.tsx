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
    Upload,
    DatePicker,
    message,
    Modal,
    InputNumber,
    Image,
    Switch
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EyeOutlined,
    SaveOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

import dayjs from 'dayjs';
import { Promotion, UpdatePromotion } from '@/type/promotion/promotion';
import { useAreasFilter } from '@/hooks/useAreasFilter';
import { useServiceCategoryWithCache } from '@/hooks/useServiceTypeFilter';
import { useCustomerFilter } from '@/hooks/useCustomerFilter';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;



interface FormValues {
    _id?: string;
    code: string;
    title: string;
    description: string;
    shortDescription: string;
    promotionType: 'voucher' | 'promotion';
    discountValue: number;
    discountType: 'percent' | 'amount';
    applicableAreas: string[];
    dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    isLimitCount: boolean;
    limitCount?: number;
    maxDiscountValue?: number;
    minOrderValue?: number;
    thumbnail?: File | string;
    background?: string;
    status: number; // 0 = inactive, 1 = active, 2 = expired
    idCustomer?: string[];
    isIdCustomer?: boolean;
    idGroupCustomer?: string[];
    isIdGroupCustomer?: boolean;
    serviceApply?: string[];
}

const promotionTypes = [
    { value: 'voucher', label: 'Voucher giảm giá' },
    { value: 'promotion', label: 'Khuyến mãi tự động' },
];



interface CreatePromotionProps {
    handleCloseModal: () => void;
    onSuccess: (coupon: UpdatePromotion) => void;
    initialData?: Promotion;
}

export default function CreatePromotion({ onSuccess, initialData, handleCloseModal }: CreatePromotionProps) {

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    // Image preview modal states
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [customerSearch, setCustomerSearch] = useState('');

    const { areas: regions, loading: regionsLoading } = useAreasFilter(); // Custom hook to fetch regions
    const { serviceCategories, loading: serviceCategoriesLoading } = useServiceCategoryWithCache(); // Custom hook to fetch service categories

    const { customers, loading: customersLoading } = useCustomerFilter({ search: customerSearch }); // Custom hook to fetch customers

    // Effect to populate form when editing
    useEffect(() => {
        if (initialData) {
            // Convert the initial data to form format
            const startDate = initialData?.startAt ? dayjs(initialData.startAt) : undefined;
            const endDate = initialData?.endAt ? dayjs(initialData.endAt) : undefined;
            form.setFieldsValue({
                _id: initialData._id,
                code: initialData.code,
                title: initialData.title,
                description: initialData.description,
                shortDescription: initialData.shortDescription,
                promotionType: initialData.promotionType,
                discountValue: initialData.discountValue,
                discountType: initialData.discountType,
                applicableAreas: initialData.applicableAreas || [],
                serviceApply: initialData.serviceApply || [],
                dateRange: startDate && endDate ? [startDate, endDate] : undefined,
                isLimitCount: initialData.isLimitCount,
                limitCount: initialData.limitCount,
                maxDiscountValue: initialData.maxDiscountValue,
                minOrderValue: initialData.minOrderValue,
                status: initialData.status
            });

            if (initialData.thumbnail && typeof initialData.thumbnail === 'string') {
                setImagePreview(initialData.thumbnail);
            }
        }
    }, [initialData, form]);



    const handleImageChange = (info: any) => {
        const file = info.fileList[0]?.originFileObj;
        if (file && file.type && file.type.startsWith('image/')) {
            // Check file size (max 5MB)
            if (file.size > 10 * 1024 * 1024) {
                message.error('Kích thước file không được vượt quá 5MB!');
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
            message.success('Tải ảnh thành công!');
        } else {
            setImageFile(null);
            // If editing and have existing image, keep preview
            if (initialData && initialData.thumbnail && typeof initialData.thumbnail === 'string') {
                setImagePreview(initialData.thumbnail);
            } else {
                setImagePreview('');
            }
        }
    };

    const generatePromotionCode = (): void => {
        const prefix = 'PROMO';
        const timestamp = Date.now().toString().slice(-6);
        const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
        const code = `${prefix}${timestamp}${randomStr}`;
        form.setFieldsValue({ code });
    };

    const handleSubmit = async (values: FormValues): Promise<void> => {
        setLoading(true);
        try {
            const [startDate, endDate] = values.dateRange;

            const promotionData: UpdatePromotion = {
                _id: values._id,
                code: values.code,
                title: values.title,
                description: values.description,
                shortDescription: values.shortDescription,
                promotionType: values.promotionType,
                discountValue: values.discountValue,
                discountType: values.discountType,
                applicableAreas: values.applicableAreas,
                startAt: startDate.toISOString(),
                endAt: endDate.toISOString(),
                thumbnail: (imageFile as any) || initialData?.thumbnail,
                background: values.background,
                status: values.status,
                maxDiscountValue: values.maxDiscountValue,
                minOrderValue: values.minOrderValue || 0,
                isLimitCount: values.isLimitCount,
                limitCount: values.limitCount || 0,
                countUse: 0, // Default for new promotions
                idCustomer: values.idCustomer || [],
                isIdCustomer: values.isIdCustomer || false,
                idGroupCustomer: values.idGroupCustomer || [],
                isIdGroupCustomer: values.isIdGroupCustomer || false,
                serviceApply: values.serviceApply || [],
            };

            await onSuccess(promotionData);

            // Reset form
            handleReset();
        } catch (error) {
            console.error('Submit error:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
            handleCloseModal(); // Close modal after success
        }
    };

    console.log('initialData:', initialData?.applicableAreas);

    const handleReset = (): void => {
        form.resetFields();
        setImageFile(null);
        setImagePreview('');
        setPreviewOpen(false);
        setPreviewImage('');
        setPreviewTitle('');
    };


    return (
        <div style={{ padding: initialData ? '24px' : '24px', background: initialData ? 'transparent' : '#f5f5f5', minHeight: initialData ? 'auto' : '100vh' }}>
            <Row justify="center" gutter={24}>
                <Col xs={24} xl={initialData ? 24 : 16}>
                    <Card
                        style={{
                            boxShadow: initialData ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            border: initialData ? 'none' : undefined
                        }}
                    >
                        {!initialData && (
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                                    Tạo khuyến mãi mới
                                </Title>
                                <Text type="secondary">
                                    Tạo chương trình khuyến mãi với thông tin chi tiết và điều kiện áp dụng
                                </Text>
                            </div>
                        )}

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                isActive: true,
                                discountType: 'percent',
                                discountValue: 0,
                                isLimitCount: false,
                                limitCount: 100,
                                minOrderValue: 0
                            }}
                        >
                            <Title level={4} style={{ marginBottom: '16px' }}>
                                Thông tin cơ bản
                            </Title>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item name="_id" style={{ display: 'none' }}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item
                                        label="Mã khuyến mãi"
                                        name="code"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mã khuyến mãi!' },
                                            { min: 3, message: 'Mã khuyến mãi phải có ít nhất 3 ký tự!' }
                                        ]}
                                    >
                                        <Input
                                            placeholder="Nhập mã khuyến mãi"
                                            addonAfter={
                                                <Button
                                                    type="link"
                                                    size="small"
                                                    onClick={generatePromotionCode}
                                                    style={{ padding: '0 8px' }}
                                                >
                                                    Tự động tạo
                                                </Button>
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Tên khuyến mãi"
                                        name="title"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập tên khuyến mãi!' },
                                            { min: 2, message: 'Tên khuyến mãi phải có ít nhất 2 ký tự!' }
                                        ]}
                                    >
                                        <Input placeholder="Nhập tên khuyến mãi" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Mô tả ngắn"
                                name="shortDescription"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mô tả ngắn!' },
                                    { max: 100, message: 'Mô tả ngắn không được quá 100 ký tự!' }
                                ]}
                            >
                                <Input placeholder="Nhập mô tả ngắn gọn..." maxLength={100} />
                            </Form.Item>

                            <Form.Item
                                label="Mô tả khuyến mãi"
                                name="description"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mô tả!' },
                                    { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' }
                                ]}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Nhập mô tả chi tiết về chương trình khuyến mãi..."
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Hình thức khuyến mãi"
                                        name="promotionType"
                                        rules={[{ required: true, message: 'Vui lòng chọn hình thức!' }]}
                                    >
                                        <Select placeholder="Chọn hình thức khuyến mãi">
                                            {promotionTypes.map(type => (
                                                <Option key={type.value} value={type.value}>
                                                    {type.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Khu vực áp dụng"
                                        name="applicableAreas"
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Chọn khu vực áp dụng"
                                            allowClear
                                            loading={regionsLoading}
                                        >
                                            {regions.map(region => (
                                                <Option key={region._id} value={region._id}>
                                                    {region.code + (region.ward ? '( ' + region.ward : '( ') + region.city + ' )'}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Loại giảm giá"
                                        name="discountType"
                                        rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá!' }]}
                                    >
                                        <Select placeholder="Chọn loại giảm giá">
                                            <Option value="percent">Theo phần trăm (%)</Option>
                                            <Option value="fixed">Số tiền cố định (VNĐ)</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Giá trị giảm"
                                        name="discountValue"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập giá trị giảm!' },
                                            { type: 'number', min: 0, message: 'Giá trị phải lớn hơn 0!' }
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder="Nhập giá trị"
                                            style={{ width: '100%' }}
                                            min={0}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => Number((value || '').replace(/\$\s?|(,*)/g, '')) as 0}
                                            addonAfter={
                                                <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.discountType !== currentValues.discountType}>
                                                    {({ getFieldValue }) => getFieldValue('discountType') === 'percent' ? '%' : 'VNĐ'}
                                                </Form.Item>
                                            }
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Giá trị đơn hàng tối thiểu"
                                        name="minOrderValue"
                                    >
                                        <InputNumber
                                            placeholder="Nhập giá trị tối thiểu"
                                            style={{ width: '100%' }}
                                            min={0}
                                            step={10000}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => Number((value || '').replace(/\$\s?|(,*)/g, '')) as 0}
                                            addonAfter="VNĐ"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Thời gian áp dụng"
                                        name="dateRange"
                                        rules={[{ required: true, message: 'Vui lòng chọn thời gian áp dụng!' }]}
                                    >
                                        <RangePicker
                                            showTime
                                            format='DD/MM/YYYY HH:mm:ss'
                                            placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Giới hạn số lượng sử dụng"
                                        name="isLimitCount"
                                        valuePropName="checked"
                                    >
                                        <Switch checkedChildren="Có" unCheckedChildren="Không" />
                                    </Form.Item>
                                    <Form.Item
                                        noStyle
                                        shouldUpdate={(prevValues, currentValues) =>
                                            prevValues.isLimitCount !== currentValues.isLimitCount
                                        }
                                    >
                                        {({ getFieldValue }) =>
                                            getFieldValue('isLimitCount') ? (
                                                <Form.Item
                                                    label="Số lượng tối đa"
                                                    name="limitCount"
                                                    rules={[
                                                        { required: true, message: 'Vui lòng nhập số lượng tối đa!' },
                                                        { type: 'number', min: 1, message: 'Số lượng phải lớn hơn 0!' }
                                                    ]}
                                                >
                                                    <InputNumber
                                                        placeholder="Nhập số lượng tối đa"
                                                        style={{ width: '100%' }}
                                                        min={1}
                                                        step={1}
                                                    />
                                                </Form.Item>
                                            ) : null
                                        }
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Hình ảnh khuyến mãi"
                                        name="thumbnail"
                                        rules={initialData ? [] : [{ required: true, message: 'Vui lòng chọn ảnh khuyến mãi!' }]}
                                    >
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                            <Upload
                                                listType="picture-card"
                                                showUploadList={false}
                                                beforeUpload={() => false}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                                maxCount={1}
                                            >
                                                {imagePreview ? (
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Promotion image preview"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8, fontSize: '12px' }}>Tải ảnh</div>
                                                    </div>
                                                )}
                                            </Upload>
                                            {imagePreview && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <Button
                                                        type="text"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => {
                                                            setPreviewImage(imagePreview);
                                                            setPreviewOpen(true);
                                                            setPreviewTitle('Hình ảnh khuyến mãi');
                                                        }}
                                                        size="small"
                                                    >
                                                        Xem
                                                    </Button>
                                                    <Button
                                                        type="text"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => {
                                                            setImagePreview('');
                                                            setImageFile(null);
                                                            form.setFieldsValue({ thumbnail: null });
                                                            message.success('Đã xóa ảnh!');
                                                        }}
                                                        size="small"
                                                        danger
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <Text type="secondary" style={{ fontSize: '12px', marginTop: 4, display: 'block' }}>
                                            Tối đa 5MB, định dạng: JPG, PNG, GIF
                                        </Text>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Trạng thái"
                                        name="status"
                                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                                    >
                                        <Select placeholder="Chọn trạng thái">
                                            <Option value={0}>
                                                <span style={{ color: '#fbbd00' }}>● Sắp diễn ra</span>
                                            </Option>
                                            <Option value={1}>
                                                <span style={{ color: '#52c41a' }}>● Đang diễn ra</span>
                                            </Option>
                                            <Option value={2}>
                                                <span style={{ color: '#ff4d4f' }}>● Đã kết thúc</span>
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16} style={{ marginTop: 32 }}>
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Áp dụng cho khách hàng cụ thể" name="isIdCustomer" valuePropName="checked">
                                        <Switch checkedChildren="Có" unCheckedChildren="Không" />
                                    </Form.Item>
                                    <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.isIdCustomer !== currentValues.isIdCustomer}>
                                        {({ getFieldValue }) =>
                                            getFieldValue('isIdCustomer') ? (
                                                <Form.Item label="Khách hàng" name="idCustomer">
                                                    <Select
                                                        mode="tags"
                                                        placeholder="Nhập hoặc chọn khách hàng"
                                                        allowClear
                                                        showSearch
                                                        loading={customersLoading}
                                                        onSearch={(value) => setCustomerSearch(value)}
                                                        notFoundContent={customersLoading ? 'Đang tải...' : 'Không tìm thấy khách hàng'}
                                                    >
                                                        {customers.map(customer => (
                                                            <Option key={customer._id} value={customer._id}>
                                                                {customer.code} - ({customer.userId.fullName})
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            ) : null
                                        }
                                    </Form.Item>
                                </Col>
                                {/* <Col xs={24} md={12}>
                                    <Form.Item label="Áp dụng cho nhóm khách hàng" name="isIdGroupCustomer" valuePropName="checked">
                                        <Switch checkedChildren="Có" unCheckedChildren="Không" />
                                    </Form.Item>
                                    <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.isIdGroupCustomer !== currentValues.isIdGroupCustomer}>
                                        {({ getFieldValue }) =>
                                            getFieldValue('isIdGroupCustomer') ? (
                                                <Form.Item label="ID Nhóm khách hàng" name="idGroupCustomer">
                                                    <Select mode="tags" placeholder="Nhập hoặc chọn ID nhóm khách hàng" allowClear />
                                                </Form.Item>
                                            ) : null
                                        }
                                    </Form.Item>
                                </Col> */}
                            </Row>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Dịch vụ áp dụng" name="serviceApply" >
                                        <Select
                                            mode="multiple"
                                            placeholder="Chọn dịch vụ áp dụng"
                                            allowClear
                                            loading={serviceCategoriesLoading}
                                        >
                                            {serviceCategories.map(service => (
                                                <Option key={service._id} value={service._id}>
                                                    {service.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Ảnh nền khuyến mãi" name="background">
                                        <Input placeholder="Nhập URL ảnh nền hoặc upload" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16} style={{ marginTop: 32 }}>
                                <Col xs={24} sm={12}>
                                    <Button
                                        size="large"
                                        block
                                        onClick={handleReset}
                                        icon={<ReloadOutlined />}
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
                                        icon={<SaveOutlined />}
                                    >
                                        {loading ? 'Đang lưu...' : 'Lưu khuyến mãi'}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </Col>
            </Row>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
                centered
            >
                <Image alt="Promotion image preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
}