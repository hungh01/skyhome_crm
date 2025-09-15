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
    DatePicker,
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

const { Title, Text } = Typography;
const { Option } = Select;

interface FormValues {
    _id: string | undefined;
    name: string;
    type: string;
    position: string;
    linkId?: string;
    imageUrl?: string | null;
    status: boolean;
    publishDate: dayjs.Dayjs;
}


export default function CreateBanner() {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string>('');

    // Image preview modal states
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const { editingBanner: initialData } = useBannerContext();

    console.log('Editing banner data:', initialData);
    console.log('Image URL state:', form.getFieldValue('imageUrl'));
    const { handleSaveBanner, loading: saving } = useBannerActions();

    // Effect to populate form when editing
    useEffect(() => {
        if (initialData) {
            form.setFieldsValue({
                _id: initialData._id,
                name: initialData.name,
                type: initialData.type,
                position: initialData.position,
                linkId: initialData.linkId || '',
                imageUrl: initialData.imageUrl || '',
                status: initialData.status,
                publishDate: initialData.publishDate ? dayjs(initialData.publishDate) : dayjs()
            });

            // Set image if exists
            if (initialData.imageUrl) {
                setImageUrl(initialData.imageUrl);
                setImagePreview(initialData.imageUrl);
            }
        } else {
            handleReset();
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
        // if (!imageUrl) {
        //     message.error('Vui lòng tải lên hình ảnh banner!');
        //     return;
        // }
        console.log('Submit values:', values);
        try {
            const bannerData: BannerRequest = {
                _id: form.getFieldValue('_id') || undefined,
                name: values.name,
                type: values.type,
                position: values.position,
                linkId: values.linkId,
                imageUrl: imageUrl || values.imageUrl,
                status: values.status,
                publishDate: values.publishDate.format('YYYY-MM-DD HH:mm:ss')
            };

            // Simulate API call
            await handleSaveBanner(bannerData);
            // Reset form if creating new

        } catch (error) {
            console.error('Submit error:', error);
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
