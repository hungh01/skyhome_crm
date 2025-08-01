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
    Image
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
import { Coupon } from '@/type/promotion/coupon';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;



interface FormValues {
    _id?: string;
    code: string;
    name: string;
    description: string;
    promotionType: string;
    discountValue: number;
    discountType: string;
    applicableAreas: string[];
    dateRange: [dayjs.Dayjs, dayjs.Dayjs];
    maxUsage?: number;
    maxDiscountValue?: number;
    minOrderValue?: number;
    imageUrl: string;
    status: number; // 0 = inactive, 1 = active, 2 = expired
}

const promotionTypes = [
    { value: 'voucher', label: 'Voucher giảm giá' },
    { value: 'automatic', label: 'Tự động' },
];

const regions = [
    { value: 'hn', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'danang', label: 'Đà Nẵng' },
    { value: 'haiphong', label: 'Hải Phòng' },
    { value: 'cantho', label: 'Cần Thơ' },
    { value: 'nhatrang', label: 'Nha Trang' },
    { value: 'dalat', label: 'Đà Lạt' },
    { value: 'vungtau', label: 'Vũng Tàu' },
    { value: 'nationwide', label: 'Toàn quốc' }
];

interface CreatePromotionProps {
    handleCloseModal: () => void;
    onSuccess: (coupon: Coupon) => void;
    initialData?: Coupon;
}

export default function CreatePromotion({ onSuccess, initialData, handleCloseModal }: CreatePromotionProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string>('');

    // Image preview modal states
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');


    // Effect to populate form when editing
    useEffect(() => {
        if (initialData) {
            // Convert the initial data to form format
            const startDate = initialData?.startAt ? dayjs(initialData.startAt) : undefined;
            const endDate = initialData?.endAt ? dayjs(initialData.endAt) : undefined;
            form.setFieldsValue({
                _id: initialData._id,
                code: initialData.code,
                name: initialData.name,
                description: initialData.description,
                promotionType: initialData.promotionType, // Map the type
                discountValue: initialData.discountValue, // Default value since not in data
                discountType: initialData.discountType, // Default to percentage if not set
                applicableAreas: initialData.applicableAreas, // Map region
                dateRange: startDate && endDate ? [startDate, endDate] : undefined,
                status: initialData.status,
                maxUsage: initialData.maxUsage,
                minOrderValue: initialData.minOrderValue
            });

            // Set image if exists
            if (initialData.imageUrl) {
                setImageUrl(initialData.imageUrl);
                setImagePreview(initialData.imageUrl);
            }
        }
    }, [initialData, form]);

    // Image handling functions
    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const handleImageChange = async (file: File): Promise<void> => {
        // Check file type
        if (!file.type.startsWith('image/')) {
            message.error('Chỉ chấp nhận file hình ảnh!');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            message.error('Kích thước file không được vượt quá 5MB!');
            return;
        }

        try {
            const imageUrl = await getBase64(file);
            setImageUrl(imageUrl);
            setImagePreview(imageUrl);
            message.success('Tải ảnh thành công!');
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Tải ảnh thất bại!');
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

            const promotionData: Coupon = {
                _id: values._id, // Use existing ID if editing
                code: values.code,
                name: values.name,
                description: values.description,
                promotionType: values.promotionType,
                discountValue: values.discountValue,
                discountType: values.discountType,
                applicableAreas: values.applicableAreas,
                startAt: startDate.toDate(),
                endAt: endDate.toDate(),
                imageUrl: imageUrl,
                status: values.status,
                maxDiscountValue: values.maxDiscountValue,
                minOrderValue: values.minOrderValue
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

    const handleReset = (): void => {
        form.resetFields();
        setImageUrl('');
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
                                maxUsage: 100,
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
                                        name="name"
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
                                        rules={[{ required: true, message: 'Vui lòng chọn khu vực!' }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Chọn khu vực áp dụng"
                                            allowClear
                                        >
                                            {regions.map(region => (
                                                <Option key={region.value} value={region.value}>
                                                    {region.label}
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
                                        label="Số lượng sử dụng tối đa"
                                        name="maxUsage"
                                    >
                                        <InputNumber
                                            placeholder="Nhập số lượng tối đa"
                                            style={{ width: '100%' }}
                                            min={1}
                                            step={1}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Hình ảnh khuyến mãi">
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                            <Upload
                                                listType="picture-card"
                                                showUploadList={false}
                                                customRequest={({ file, onSuccess }) => {
                                                    handleImageChange(file as File);
                                                    onSuccess?.(file);
                                                }}
                                                accept="image/*"
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
                                                            setImageUrl('');
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