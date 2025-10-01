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
    Modal,
    InputNumber,
    Image,
    DatePicker,
    UploadFile,
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
import { BannerRequest } from '@/app/admin/banners/type/banner';
import { bannerTypes } from '../constants/banner-filter';
import { useBannerActions } from '../hooks/useBannerActions';
import { useBannerContext } from '../provider/banner-provider';
import { notify } from '@/components/Notification';

const { Title, Text } = Typography;
const { Option } = Select;

interface FormValues {
    _id: string | undefined;
    name: string;
    type: string;
    position: string;
    linkId?: string;
    imageUrl?: string;
    status: boolean;
    publishDate: dayjs.Dayjs;
}


export default function CreateBanner() {
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    // Image preview modal states
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const { editingBanner: initialData } = useBannerContext();

    const { handleSaveBanner, loading: saving } = useBannerActions();

    // Effect to populate form when editing
    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                _id: initialData._id,
                name: initialData.name,
                type: initialData.type,
                position: initialData.position,
                imageUrl: initialData.imageUrl || '',
                status: initialData.status,
                publishDate: initialData.publishDate ? dayjs(initialData.publishDate) : dayjs()
            });

            // Set image if exists
            if (initialData.imageUrl && typeof initialData.imageUrl === 'string') {
                setImagePreview(initialData.imageUrl);
            }
        } else {
            handleReset();
        }

    }, [initialData, form]);

    const handleImageChange = (info: any) => {
        const file = info.fileList[0]?.originFileObj;
        if (file && file.type && file.type.startsWith('image/')) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                notify({ type: 'error', message: 'Kích thước file không được vượt quá 5MB!' });
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
            notify({ type: 'success', message: 'Tải ảnh thành công!' });
        } else {
            setImageFile(null);
            // If editing and have existing image, keep preview
            if (initialData && initialData.imageUrl && typeof initialData.imageUrl === 'string') {
                setImagePreview(initialData.imageUrl);
            } else {
                setImagePreview('');
            }
        }
    };

    const handleSubmit = async (values: FormValues): Promise<void> => {
        // Only require image for new banners
        if (!initialData && !imageFile) {
            notify({ type: 'error', message: 'Vui lòng tải lên hình ảnh banner!' });
            return;
        }

        try {
            const bannerData: BannerRequest = {
                _id: form.getFieldValue('_id') || undefined,
                name: values.name,
                type: values.type,
                position: values.position,
                status: values.status,
                publishDate: values.publishDate.format('YYYY-MM-DD HH:mm:ss')
            };

            // Only send new image if selected
            if (imageFile) {
                bannerData.imageUrl = imageFile;
            }
            console.log('Submitting banner data:', bannerData);
            await handleSaveBanner(bannerData);

        } catch (error) {
            console.error('Submit error:', error);
        }
    };
    const handleReset = (): void => {
        form.resetFields();
        setImageFile(null);
        setImagePreview('');
        setPreviewOpen(false);
        setPreviewImage('');
        setPreviewTitle('');
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Row justify="center" gutter={24}>
                <Col xs={24} xl={16}>
                    <Card
                        style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            marginBottom: '24px',
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                                {initialData ? 'Chỉnh sửa Banner' : 'Tạo Banner mới'}
                            </Title>
                            <Text type="secondary">
                                {initialData ? 'Cập nhật thông tin banner hiện tại' : 'Tạo banner quảng cáo với thông tin chi tiết'}
                            </Text>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                isActive: true,
                                position: 1,
                                type: 'service',
                                publishTime: dayjs()
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
                                        label="Thời gian đăng bài"
                                        name="publishDate"
                                        rules={[{ required: true, message: 'Vui lòng chọn thời gian đăng bài!' }]}
                                    >
                                        <DatePicker
                                            showTime={{
                                                format: 'HH:mm:ss',
                                                defaultValue: dayjs('00:00:00', 'HH:mm:ss')
                                            }}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="Chọn thời gian đăng bài"
                                            style={{ width: '100%' }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Trạng thái"
                                        name="status"
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
                                <Col xs={24} md={12}>
                                    {/* Empty column for spacing */}
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
                                                accept="image/*"
                                                beforeUpload={() => false}
                                                onChange={handleImageChange}
                                                showUploadList={false}
                                                maxCount={1}
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
                                                            setImageFile(null);
                                                            form.setFieldsValue({ imageUrl: null });
                                                            notify({ type: 'success', message: 'Đã xóa ảnh!' });
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
                                        disabled={saving}
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
                                        loading={saving}
                                        icon={<SaveOutlined />}
                                    >
                                        {saving ? 'Đang lưu...' : initialData ? 'Cập nhật Banner' : 'Tạo Banner'}
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
