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

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface NewsFormData {
    title: string;
    description: string;
    link: string;
    type: string;
    position: number;
    image: string;
    isActive: boolean;
}

interface FormValues {
    title: string;
    description: string;
    link: string;
    type: string;
    position: number;
    isActive: boolean;
}

const newsTypes = [
    { value: 'news', label: 'Tin tức' },
    { value: 'promotion', label: 'Khuyến mãi' },
    { value: 'tips', label: 'Mẹo hay' },
    { value: 'company', label: 'Công ty' },
    { value: 'event', label: 'Sự kiện' },
    { value: 'announcement', label: 'Thông báo' }
];

interface CreateNewsProps {
    onSuccess?: () => void;
    initialData?: {
        id: number;
        title: string;
        description: string;
        link: string;
        type: string;
        typeLabel: string;
        position: number;
        image: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
}

export default function CreateNews({ onSuccess, initialData }: CreateNewsProps) {
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
                title: initialData.title,
                description: initialData.description,
                link: initialData.link,
                type: initialData.type,
                position: initialData.position,
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
            message.error('Vui lòng tải lên hình ảnh tin tức!');
            return;
        }

        // Validate URL format
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlRegex.test(values.link)) {
            message.error('Vui lòng nhập đúng định dạng URL!');
            return;
        }

        setLoading(true);
        try {
            const newsData: NewsFormData = {
                title: values.title,
                description: values.description,
                link: values.link.startsWith('http') ? values.link : `https://${values.link}`,
                type: values.type,
                position: values.position,
                image: imageUrl,
                isActive: values.isActive
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('News Data:', newsData);
            message.success(initialData ? 'Cập nhật tin tức thành công!' : 'Tạo tin tức thành công!');

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
                                    {initialData ? 'Chỉnh sửa Tin tức' : 'Tạo Tin tức mới'}
                                </Title>
                                <Text type="secondary">
                                    {initialData ? 'Cập nhật thông tin tin tức hiện tại' : 'Tạo tin tức với thông tin chi tiết'}
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
                                type: 'news'
                            }}
                        >
                            <Title level={4} style={{ marginBottom: '16px' }}>
                                Thông tin cơ bản
                            </Title>

                            <Row gutter={16}>
                                <Col xs={24} md={16}>
                                    <Form.Item
                                        label="Tiêu đề tin tức"
                                        name="title"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập tiêu đề!' },
                                            { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự!' },
                                            { max: 200, message: 'Tiêu đề không được vượt quá 200 ký tự!' }
                                        ]}
                                    >
                                        <Input placeholder="Nhập tiêu đề tin tức" showCount maxLength={200} />
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
                                            min={1}
                                            max={99}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Mô tả ngắn"
                                name="description"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mô tả!' },
                                    { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' },
                                    { max: 500, message: 'Mô tả không được vượt quá 500 ký tự!' }
                                ]}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Nhập mô tả ngắn về tin tức..."
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>

                            <Row gutter={16}>
                                <Col xs={24} md={16}>
                                    <Form.Item
                                        label="Link tin tức"
                                        name="link"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập link!' },
                                            { type: 'url', message: 'Vui lòng nhập đúng định dạng URL!' }
                                        ]}
                                    >
                                        <Input
                                            placeholder="https://example.com/news"
                                            addonBefore="🔗"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Form.Item
                                        label="Loại tin tức"
                                        name="type"
                                        rules={[{ required: true, message: 'Vui lòng chọn loại tin tức!' }]}
                                    >
                                        <Select placeholder="Chọn loại tin tức">
                                            {newsTypes.map(type => (
                                                <Option key={type.value} value={type.value}>
                                                    {type.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={16}>
                                    <Form.Item
                                        label="Hình ảnh tin tức"
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
                                            >
                                                {imagePreview ? (
                                                    <Image
                                                        src={imagePreview}
                                                        alt="News image preview"
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
                                                            Tải ảnh tin tức
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
                                                            setPreviewTitle('Hình ảnh tin tức');
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
                                <Col xs={24} md={8}>
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
                                        {loading ? 'Đang lưu...' : initialData ? 'Cập nhật Tin tức' : 'Tạo Tin tức'}
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
                <Image alt="News preview" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
}
