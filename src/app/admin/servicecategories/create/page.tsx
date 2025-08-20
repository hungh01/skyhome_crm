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
    InputNumber,
    message,
    Divider,
    List,
    Tag,
    Upload,
    Space,
    Image,
    Modal
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    SaveOutlined,
    ReloadOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface OptionalService {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    unit: string;
    isActive: boolean;
    imageUrl?: string;
}

interface Equipment {
    id: string;
    name: string;
    description: string;
    price: number;
    isAvailable: boolean;
    imageUrl?: string;
}

interface ServiceFormData {
    name: string;
    description: string;
    category: string;
    basePrice: number;
    unit: string;
    duration: number;
    isActive: boolean;
    tags: string[];
    image?: string;
    optionalServices: OptionalService[];
    equipment: Equipment[];
}

interface FormValues {
    name: string;
    description: string;
    category: string;
    basePrice: number;
    unit: string;
    duration: number;
    isActive: boolean;
}

const serviceCategories = [
    { value: 'household', label: 'Dịch vụ gia đình' },
    { value: 'cleaning', label: 'Dọn dẹp vệ sinh' },
    { value: 'maintenance', label: 'Sửa chữa bảo trì' },
    { value: 'care', label: 'Chăm sóc' },
    { value: 'cooking', label: 'Nấu ăn' },
    { value: 'security', label: 'Bảo vệ' },
    { value: 'event', label: 'Sự kiện' },
    { value: 'other', label: 'Khác' }
];

export default function CreateServicePage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [optionalServices, setOptionalServices] = useState<OptionalService[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // Optional Service form states
    const [optionalForm, setOptionalForm] = useState({
        name: '',
        description: '',
        basePrice: 0,
        unit: 'lần',
        isActive: true,
        imageUrl: ''
    });
    const [editingOptionalId, setEditingOptionalId] = useState<string | null>(null);
    const [optionalImagePreview, setOptionalImagePreview] = useState<string>('');

    // Equipment form states
    const [equipmentForm, setEquipmentForm] = useState({
        name: '',
        description: '',
        price: 0,
        isAvailable: true,
        imageUrl: ''
    });
    const [editingEquipmentId, setEditingEquipmentId] = useState<string | null>(null);
    const [equipmentImagePreview, setEquipmentImagePreview] = useState<string>('');

    // Image preview modal states
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    // Main service image state
    const [serviceImageUrl, setServiceImageUrl] = useState<string>('');
    const [serviceImagePreview, setServiceImagePreview] = useState<string>('');

    // Image handling functions
    const getBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });



    const handleServiceImageChange = async (file: File): Promise<void> => {
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
            setServiceImageUrl(imageUrl);
            setServiceImagePreview(imageUrl);
            message.success('Tải ảnh thành công!');
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Tải ảnh thất bại!');
        }
    };

    const handleOptionalImageChange = async (file: File): Promise<void> => {
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
            setOptionalForm({ ...optionalForm, imageUrl });
            setOptionalImagePreview(imageUrl);
            message.success('Tải ảnh thành công!');
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Tải ảnh thất bại!');
        }
    };

    const handleEquipmentImageChange = async (file: File): Promise<void> => {
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
            setEquipmentForm({ ...equipmentForm, imageUrl });
            setEquipmentImagePreview(imageUrl);
            message.success('Tải ảnh thành công!');
        } catch (error) {
            console.error('Upload error:', error);
            message.error('Tải ảnh thất bại!');
        }
    };

    const addOptionalService = (): void => {
        if (!optionalForm.name || optionalForm.basePrice <= 0) {
            message.error('Vui lòng nhập đầy đủ thông tin dịch vụ tùy chọn!');
            return;
        }

        const newOptional: OptionalService = {
            id: Date.now().toString(),
            ...optionalForm
        };

        setOptionalServices([...optionalServices, newOptional]);
        setOptionalForm({
            name: '',
            description: '',
            basePrice: 0,
            unit: 'lần',
            isActive: true,
            imageUrl: ''
        });
        setOptionalImagePreview('');
        message.success('Đã thêm dịch vụ tùy chọn!');
    };

    const updateOptionalService = (): void => {
        if (!editingOptionalId || !optionalForm.name || optionalForm.basePrice <= 0) {
            message.error('Vui lòng nhập đầy đủ thông tin dịch vụ tùy chọn!');
            return;
        }

        setOptionalServices(optionalServices.map(opt =>
            opt.id === editingOptionalId
                ? { ...opt, ...optionalForm }
                : opt
        ));

        setOptionalForm({
            name: '',
            description: '',
            basePrice: 0,
            unit: 'lần',
            isActive: true,
            imageUrl: ''
        });
        setEditingOptionalId(null);
        setOptionalImagePreview('');
        message.success('Đã cập nhật dịch vụ tùy chọn!');
    };

    const editOptionalService = (optional: OptionalService): void => {
        setOptionalForm({
            name: optional.name,
            description: optional.description,
            basePrice: optional.basePrice,
            unit: optional.unit,
            isActive: optional.isActive,
            imageUrl: optional.imageUrl || ''
        });
        setEditingOptionalId(optional.id);
        setOptionalImagePreview(optional.imageUrl || '');
    };

    const removeOptionalService = (id: string): void => {
        setOptionalServices(optionalServices.filter(opt => opt.id !== id));
        message.success('Đã xóa dịch vụ tùy chọn!');
    };

    const addEquipment = (): void => {
        if (!equipmentForm.name || equipmentForm.price <= 0) {
            message.error('Vui lòng nhập đầy đủ thông tin thiết bị!');
            return;
        }

        const newEquipment: Equipment = {
            id: Date.now().toString(),
            ...equipmentForm
        };

        setEquipment([...equipment, newEquipment]);
        setEquipmentForm({
            name: '',
            description: '',
            price: 0,
            isAvailable: true,
            imageUrl: ''
        });
        setEquipmentImagePreview('');
        message.success('Đã thêm thiết bị!');
    };

    const updateEquipment = (): void => {
        if (!editingEquipmentId || !equipmentForm.name || equipmentForm.price <= 0) {
            message.error('Vui lòng nhập đầy đủ thông tin thiết bị!');
            return;
        }

        setEquipment(equipment.map(equip =>
            equip.id === editingEquipmentId
                ? { ...equip, ...equipmentForm }
                : equip
        ));

        setEquipmentForm({
            name: '',
            description: '',
            price: 0,
            isAvailable: true,
            imageUrl: ''
        });
        setEditingEquipmentId(null);
        setEquipmentImagePreview('');
        message.success('Đã cập nhật thiết bị!');
    };

    const editEquipment = (equip: Equipment): void => {
        setEquipmentForm({
            name: equip.name,
            description: equip.description,
            price: equip.price,
            isAvailable: equip.isAvailable,
            imageUrl: equip.imageUrl || ''
        });
        setEditingEquipmentId(equip.id);
        setEquipmentImagePreview(equip.imageUrl || '');
    };

    const removeEquipment = (id: string): void => {
        setEquipment(equipment.filter(equip => equip.id !== id));
        message.success('Đã xóa thiết bị!');
    };


    const handleSubmit = async (values: FormValues): Promise<void> => {
        setLoading(true);
        try {
            const serviceData: ServiceFormData = {
                ...values,
                tags: selectedTags,
                image: serviceImageUrl,
                optionalServices,
                equipment
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Service Data:', serviceData);
            message.success('Tạo dịch vụ thành công!');

            // Reset form
            form.resetFields();
            setOptionalServices([]);
            setEquipment([]);
            setSelectedTags([]);
            setServiceImageUrl('');
            setServiceImagePreview('');
        } catch (error) {
            console.error('Submit error:', error);
            message.error('Có lỗi xảy ra, vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = (): void => {
        form.resetFields();
        setOptionalServices([]);
        setEquipment([]);
        setSelectedTags([]);
        setServiceImageUrl('');
        setServiceImagePreview('');
        setOptionalForm({
            name: '',
            description: '',
            basePrice: 0,
            unit: 'lần',
            isActive: true,
            imageUrl: ''
        });
        setEquipmentForm({
            name: '',
            description: '',
            price: 0,
            isAvailable: true,
            imageUrl: ''
        });
        setEditingOptionalId(null);
        setEditingEquipmentId(null);
        setOptionalImagePreview('');
        setEquipmentImagePreview('');
        setPreviewOpen(false);
        setPreviewImage('');
        setPreviewTitle('');
        message.info('Đã làm mới form!');
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Row justify="center" gutter={24}>
                <Col xs={24} xl={16}>
                    <Card
                        style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px',
                            marginBottom: '24px'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                                Tạo dịch vụ mới
                            </Title>
                            <Text type="secondary">
                                Tạo một dịch vụ mới với thông tin chi tiết, dịch vụ tùy chọn và thiết bị đi kèm
                            </Text>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}
                            initialValues={{
                                isActive: true,
                                unit: 'lần',
                                duration: 60,
                                basePrice: 0
                            }}
                        >
                            <Title level={4} style={{ marginBottom: '16px' }}>
                                Thông tin cơ bản
                            </Title>

                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Tên dịch vụ"
                                        name="name"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập tên dịch vụ!' },
                                            { min: 2, message: 'Tên dịch vụ phải có ít nhất 2 ký tự!' }
                                        ]}
                                    >
                                        <Input placeholder="Nhập tên dịch vụ" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Danh mục"
                                        name="category"
                                        rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                                    >
                                        <Select placeholder="Chọn danh mục dịch vụ">
                                            {serviceCategories.map(cat => (
                                                <Option key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                label="Mô tả dịch vụ"
                                name="description"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập mô tả!' },
                                    { min: 10, message: 'Mô tả phải có ít nhất 10 ký tự!' }
                                ]}
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Nhập mô tả chi tiết về dịch vụ..."
                                    showCount
                                    maxLength={500}
                                />
                            </Form.Item>



                            <Row gutter={16} style={{ marginTop: 16 }}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Hình ảnh dịch vụ">
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                            <Upload
                                                listType="picture-card"
                                                showUploadList={false}
                                                customRequest={({ file, onSuccess }) => {
                                                    // Handle file selection immediately
                                                    handleServiceImageChange(file as File);
                                                    onSuccess?.(file);
                                                }}
                                                accept="image/*"
                                            >
                                                {serviceImagePreview ? (
                                                    <Image src={serviceImagePreview} alt="Service preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8, fontSize: '12px' }}>Tải ảnh</div>
                                                    </div>
                                                )}
                                            </Upload>
                                            {serviceImagePreview && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <Button
                                                        type="text"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => {
                                                            setPreviewImage(serviceImagePreview);
                                                            setPreviewOpen(true);
                                                            setPreviewTitle('Hình ảnh dịch vụ');
                                                        }}
                                                        size="small"
                                                    >
                                                        Xem
                                                    </Button>
                                                    <Button
                                                        type="text"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => {
                                                            setServiceImagePreview('');
                                                            setServiceImageUrl('');
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

                            </Row>



                            <Divider />

                            <Title level={4} style={{ marginBottom: '16px' }}>
                                Dịch vụ tùy chọn
                            </Title>

                            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f9f9f9' }}>
                                <Row gutter={12}>
                                    <Col xs={24} md={8}>
                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                            Tên dịch vụ tùy chọn
                                        </Text>
                                        <Input
                                            placeholder="Nhập tên dịch vụ tùy chọn"
                                            value={optionalForm.name}
                                            onChange={e => setOptionalForm({ ...optionalForm, name: e.target.value })}
                                        />
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                            Mô tả
                                        </Text>
                                        <Input
                                            placeholder="Nhập mô tả"
                                            value={optionalForm.description}
                                            onChange={e => setOptionalForm({ ...optionalForm, description: e.target.value })}
                                        />
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                            Giá (VNĐ)
                                        </Text>
                                        <InputNumber
                                            placeholder="Nhập giá"
                                            value={optionalForm.basePrice}
                                            onChange={value => setOptionalForm({ ...optionalForm, basePrice: value || 0 })}
                                            style={{ width: '100%' }}
                                            min={0}
                                            step={1000}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => Number((value || '').replace(/\$\s?|(,*)/g, '')) as 0}
                                        />
                                    </Col>
                                    <Col xs={24} md={8} style={{ marginTop: 16 }}>
                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                            Hình ảnh dịch vụ
                                        </Text>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <Upload
                                                listType="picture-card"
                                                showUploadList={false}
                                                customRequest={({ file, onSuccess }) => {
                                                    // Handle file selection immediately
                                                    handleOptionalImageChange(file as File);
                                                    onSuccess?.(file);
                                                }}
                                                accept="image/*"
                                            >
                                                {optionalImagePreview ? (
                                                    <Image src={optionalImagePreview} alt="Optional service preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8, fontSize: '12px' }}>Tải ảnh</div>
                                                    </div>
                                                )}
                                            </Upload>
                                            {optionalImagePreview && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <Button
                                                        type="text"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => {
                                                            setPreviewImage(optionalImagePreview);
                                                            setPreviewOpen(true);
                                                            setPreviewTitle('Hình ảnh dịch vụ tùy chọn');
                                                        }}
                                                        size="small"
                                                    >
                                                        Xem
                                                    </Button>
                                                    <Button
                                                        type="text"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => {
                                                            setOptionalImagePreview('');
                                                            setOptionalForm({ ...optionalForm, imageUrl: '' });
                                                        }}
                                                        size="small"
                                                        danger
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Col>

                                    <Col xs={24} md={8} style={{ marginTop: 16 }}>
                                        <div style={{ paddingTop: '20px' }}>
                                            <Button
                                                type="primary"
                                                icon={editingOptionalId ? <EditOutlined /> : <PlusOutlined />}
                                                onClick={editingOptionalId ? updateOptionalService : addOptionalService}
                                                block
                                            >
                                                {editingOptionalId ? 'Cập nhật' : 'Thêm dịch vụ'}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            {optionalServices.length > 0 && (
                                <Card size="small" style={{ marginBottom: 16 }}>
                                    <Text strong style={{ display: 'block', marginBottom: 12 }}>
                                        Danh sách dịch vụ tùy chọn ({optionalServices.length})
                                    </Text>
                                    <List
                                        size="small"
                                        dataSource={optionalServices}
                                        renderItem={(item) => (
                                            <List.Item
                                                actions={[
                                                    <Button
                                                        key="edit"
                                                        type="link"
                                                        size="small"
                                                        icon={<EditOutlined />}
                                                        onClick={() => editOptionalService(item)}
                                                    >
                                                        Sửa
                                                    </Button>,
                                                    <Button
                                                        key="delete"
                                                        type="link"
                                                        danger
                                                        size="small"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => removeOptionalService(item.id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={
                                                        item.imageUrl ? (
                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                src={item.imageUrl}
                                                                alt={`${item.name} optional service image`}
                                                                style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                                preview={{
                                                                    mask: <EyeOutlined style={{ color: 'white' }} />
                                                                }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: 50, height: 50, backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <PlusOutlined style={{ color: '#ccc' }} />
                                                            </div>
                                                        )
                                                    }
                                                    title={
                                                        <Space>
                                                            {item.name}
                                                            <Tag color={item.isActive ? 'green' : 'red'}>
                                                                {item.isActive ? 'Hoạt động' : 'Tạm ngừng'}
                                                            </Tag>
                                                        </Space>
                                                    }
                                                    description={
                                                        <div>
                                                            <Text type="secondary">{item.description}</Text>
                                                            <br />
                                                            <Text strong style={{ color: '#1890ff' }}>
                                                                {item.basePrice.toLocaleString()} VNĐ/{item.unit}
                                                            </Text>
                                                        </div>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            )}

                            <Divider />

                            <Title level={4} style={{ marginBottom: '16px' }}>
                                Thiết bị đi kèm
                            </Title>

                            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f9f9f9' }}>
                                <Row gutter={12}>
                                    <Col xs={24} md={8}>
                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                            Tên thiết bị
                                        </Text>
                                        <Input
                                            placeholder="Nhập tên thiết bị"
                                            value={equipmentForm.name}
                                            onChange={e => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                                        />
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                            Mô tả
                                        </Text>
                                        <Input
                                            placeholder="Nhập mô tả thiết bị"
                                            value={equipmentForm.description}
                                            onChange={e => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                                        />
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                            Giá thuê (VNĐ)
                                        </Text>
                                        <InputNumber
                                            placeholder="Nhập giá thuê"
                                            value={equipmentForm.price}
                                            onChange={value => setEquipmentForm({ ...equipmentForm, price: value || 0 })}
                                            style={{ width: '100%' }}
                                            min={0}
                                            step={1000}
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={(value) => Number((value || '').replace(/\$\s?|(,*)/g, '')) as 0}
                                        />
                                    </Col>
                                    <Col xs={24} md={8} style={{ marginTop: 16 }}>
                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                            Hình ảnh thiết bị
                                        </Text>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <Upload
                                                listType="picture-card"
                                                showUploadList={false}
                                                customRequest={({ file, onSuccess }) => {
                                                    // Handle file selection immediately
                                                    handleEquipmentImageChange(file as File);
                                                    onSuccess?.(file);
                                                }}
                                                accept="image/*"
                                            >
                                                {equipmentImagePreview ? (
                                                    <Image src={equipmentImagePreview} alt="Equipment preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <div>
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8, fontSize: '12px' }}>Tải ảnh</div>
                                                    </div>
                                                )}
                                            </Upload>
                                            {equipmentImagePreview && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                                    <Button
                                                        type="text"
                                                        icon={<EyeOutlined />}
                                                        onClick={() => {
                                                            setPreviewImage(equipmentImagePreview);
                                                            setPreviewOpen(true);
                                                            setPreviewTitle('Hình ảnh thiết bị');
                                                        }}
                                                        size="small"
                                                    >
                                                        Xem
                                                    </Button>
                                                    <Button
                                                        type="text"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => {
                                                            setEquipmentImagePreview('');
                                                            setEquipmentForm({ ...equipmentForm, imageUrl: '' });
                                                        }}
                                                        size="small"
                                                        danger
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                    <Col xs={24} md={8} style={{ marginTop: 16 }}>
                                        <div style={{ paddingTop: '20px' }}>
                                            <Button
                                                type="primary"
                                                icon={editingEquipmentId ? <EditOutlined /> : <PlusOutlined />}
                                                onClick={editingEquipmentId ? updateEquipment : addEquipment}
                                                block
                                            >
                                                {editingEquipmentId ? 'Cập nhật' : 'Thêm thiết bị'}
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>

                            {equipment.length > 0 && (
                                <Card size="small" style={{ marginBottom: 16 }}>
                                    <Text strong style={{ display: 'block', marginBottom: 12 }}>
                                        Danh sách thiết bị ({equipment.length})
                                    </Text>
                                    <List
                                        size="small"
                                        dataSource={equipment}
                                        renderItem={(item) => (
                                            <List.Item
                                                actions={[
                                                    <Button
                                                        key="edit"
                                                        type="link"
                                                        size="small"
                                                        icon={<EditOutlined />}
                                                        onClick={() => editEquipment(item)}
                                                    >
                                                        Sửa
                                                    </Button>,
                                                    <Button
                                                        key="delete"
                                                        type="link"
                                                        danger
                                                        size="small"
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => removeEquipment(item.id)}
                                                    >
                                                        Xóa
                                                    </Button>
                                                ]}
                                            >
                                                <List.Item.Meta
                                                    avatar={
                                                        item.imageUrl ? (
                                                            <Image
                                                                width={50}
                                                                height={50}
                                                                src={item.imageUrl}
                                                                alt={`${item.name} equipment image`}
                                                                style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                                preview={{
                                                                    mask: <EyeOutlined style={{ color: 'white' }} />
                                                                }}
                                                            />
                                                        ) : (
                                                            <div style={{ width: 50, height: 50, backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                <PlusOutlined style={{ color: '#ccc' }} />
                                                            </div>
                                                        )
                                                    }
                                                    title={
                                                        <Space>
                                                            {item.name}
                                                            <Tag color={item.isAvailable ? 'green' : 'red'}>
                                                                {item.isAvailable ? 'Có sẵn' : 'Hết hàng'}
                                                            </Tag>
                                                        </Space>
                                                    }
                                                    description={
                                                        <div>
                                                            <Text type="secondary">{item.description}</Text>
                                                            <br />
                                                            <Text strong style={{ color: '#1890ff' }}>
                                                                {item.price.toLocaleString()} VNĐ
                                                            </Text>
                                                        </div>
                                                    }
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Card>
                            )}

                            <Divider />

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
                                        {loading ? 'Đang lưu...' : 'Tạo dịch vụ'}
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
                <Image alt={previewTitle || "Image preview"} style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
}