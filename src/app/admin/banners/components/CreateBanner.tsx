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
    message,
    Modal,
    InputNumber,
    Image,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EyeOutlined,
    SaveOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { useState, useEffect } from 'react';

const { Title, Text } = Typography;

const { Option } = Select;

interface BannerFormData {
    name: string;
    type: string;
    position: string;
    linkId?: string;
    url?: string;
    image: string;
    isActive: boolean;
}

interface FormValues {
    name: string;
    type: string;
    position: string;
    linkId?: string;
    url?: string;
    isActive: boolean;
}

const bannerTypes = [
    { value: 'service', label: 'Dịch vụ' },
    { value: 'promotion', label: 'Khuyến mãi' },
    { value: 'url', label: 'Liên kết' },
    { value: 'news', label: 'Tin tức' },
    { value: 'event', label: 'Sự kiện' }
];

interface CreateBannerProps {
    onSuccess?: () => void;
    initialData?: {
        id: number;
        name: string;
        type: string;
        typeLabel: string;
        position: string;
        linkId: string | null;
        image: string;
        isActive: boolean;
        url: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

export default function CreateBanner({ onSuccess, initialData }: CreateBannerProps) {
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
            form.setFieldsValue({
                name: initialData.name,
                type: initialData.type,
                position: initialData.position,
                linkId: initialData.linkId || '',
                url: initialData.url || '',
                isActive: initialData.isActive
            });

            // Set image if exists
            if (initialData.image) {
                setImageUrl(initialData.image);
                setImagePreview(initialData.image);
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

    const handleSubmit = async (values: FormValues): Promise<void> => {
        if (!imageUrl) {
            message.error('Vui lòng tải lên hình ảnh banner!');
            return;
        }

        setLoading(true);
        try {
            const bannerData: BannerFormData = {
                name: values.name,
                type: values.type,
                position: values.position,
                linkId: values.linkId,
                url: values.url,
                image: imageUrl,
                isActive: values.isActive
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Banner Data:', bannerData);
            message.success(initialData ? 'Cập nhật banner thành công!' : 'Tạo banner thành công!');

            // Reset form if creating new
            if (!initialData) {
                handleReset();
            }

            // Call onSuccess callback if provided
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Submit error:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = (): void => {
        form.resetFields();
        setImageUrl('');
        setImagePreview('');
        setPreviewOpen(false);
        setPreviewImage('');
        setPreviewTitle('');
        message.info('Đã làm mới form!');
    };

    return (
        <div style={{ padding: onSuccess ? '24px' : '24px', background: onSuccess ? 'transparent' : '#f5f5f5', minHeight: onSuccess ? 'auto' : '100vh' }}>
            <Row justify="center" gutter={24}>
                <Col xs={24} xl={onSuccess ? 24 : 16}>
                    <Card
                        style={{
                            boxShadow: onSuccess ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            marginBottom: '24px',
                            border: onSuccess ? 'none' : undefined
                        }}
                    >
                        {!onSuccess && (
                            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                                    {initialData ? 'Chỉnh sửa Banner' : 'Tạo Banner mới'}
                                </Title>
                                <Text type="secondary">
                                    {initialData ? 'Cập nhật thông tin banner hiện tại' : 'Tạo banner quảng cáo với thông tin chi tiết'}
                                </Text>
                            </div>
                        )}

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                isActive: true,
                                position: 1,
                                type: 'service'
                            }}
                        >
                            <Title level={4} style={{ marginBottom: '16px' }}>
                                Thông tin cơ bản
                            </Title>

                            <Row gutter={16}>
                                <Col xs={24} md={16}>
                                    <Form.Item
                                        label="Tên banner"
                                        name="name"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập tên banner!' },
                                            { min: 3, message: 'Tên banner phải có ít nhất 3 ký tự!' }
                                        ]}
                                    >
                                        <Input placeholder="Nhập tên banner" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Vị trí hiển thị"
                                        name="position"
                                        rules={[{ required: true, message: 'Vui lòng nhập vị trí!' }]}
                                    >
                                        <InputNumber
                                            placeholder="Vị trí"
                                            style={{ width: '100%' }}
                                            min={0}
                                            max={99}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Loại banner"
                                        name="type"
                                        rules={[{ required: true, message: 'Vui lòng chọn loại banner!' }]}
                                    >
                                        <Select placeholder="Chọn loại banner">
                                            {bannerTypes.map(type => (
                                                <Option key={type.value} value={type.value}>
                                                    {type.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Trạng thái"
                                        name="isActive"
                                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                                    >
                                        <Select placeholder="Chọn trạng thái">
                                            <Option value={true}>
                                                <span style={{ color: '#52c41a' }}>● Hoạt động</span>
                                            </Option>
                                            <Option value={false}>
                                                <span style={{ color: '#ff4d4f' }}>● Tạm ngừng</span>
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Link ID (cho dịch vụ, khuyến mãi)"
                                        name="linkId"
                                    >
                                        <Input placeholder="Nhập Link ID" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="URL (cho liên kết ngoài)"
                                        name="url"
                                    >
                                        <Input placeholder="Nhập URL (https://...)" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24}>
                                    <Form.Item
                                        label="Hình ảnh banner"
                                        required
                                    >
                                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                            <Upload
                                                listType="picture-card"
                                                showUploadList={false}
                                                customRequest={({ file, onSuccess }) => {
                                                    handleImageChange(file as File);
                                                    onSuccess?.(file);
                                                }}
                                                accept="image/*"
                                                style={{ width: 200, height: 100 }}
                                            >
                                                {imagePreview ? (
                                                    <Image
                                                        src={imagePreview}
                                                        alt="Banner image preview"
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover',
                                                            borderRadius: '6px'
                                                        }}
                                                        preview={false}
                                                    />
                                                ) : (
                                                    <div style={{ padding: '20px', textAlign: 'center' }}>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8, fontSize: '12px' }}>
                                                            Tải ảnh banner
                                                        </div>
                                                    </div>
                                                )}
                                            </Upload>
                                            {imagePreview && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                    <Button
                                                        type="default"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => {
                                                            setPreviewImage(imagePreview);
                                                            setPreviewOpen(true);
                                                            setPreviewTitle('Hình ảnh banner');
                                                        }}
                                                        size="small"
                                                    >
                                                        Xem trước
                                                    </Button>
                                                    <Button
                                                        type="default"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => {
                                                            setImagePreview('');
                                                            setImageUrl('');
                                                            message.success('Đã xóa ảnh!');
                                                        }}
                                                        size="small"
                                                        danger
                                                    >
                                                        Xóa ảnh
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <Text type="secondary" style={{ fontSize: '12px', marginTop: 8, display: 'block' }}>
                                            Tỷ lệ khuyến nghị: 16:9 | Tối đa 5MB | Định dạng: JPG, PNG, GIF
                                        </Text>
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
                                        disabled={loading}
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
                                        {loading ? 'Đang lưu...' : initialData ? 'Cập nhật Banner' : 'Tạo Banner'}
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
                width={800}
            >
                <Image alt="Banner preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
}
