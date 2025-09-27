'use client';
import {
    Button,
    Card,
    Switch,
    Table,
    Typography,
    Tag,
    Image,
    Space,
    Modal,
    Form,
    Input,
    Select,
    Upload,
    message,
    Spin,
    InputNumber,
} from "antd";
import { RightOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import { CreateServiceCategory, ServiceCategory } from "@/type/services/service-category";
import { useEffect, useState } from "react";
import { createServiceCategory, getServiceCategory, updateServiceCategory } from "@/api/service/service-categories-api";
import { isDetailResponse } from "@/utils/response-handler";
import { notify } from "@/components/Notification";

const { Text } = Typography;

function orderColumns(
    router: ReturnType<typeof useRouter>,
    handleEdit: (record: ServiceCategory) => void
): ColumnsType<ServiceCategory> {
    return [
        {
            title: "Ảnh",
            dataIndex: 'thumbNail',
            key: 'thumbNail',
            render: (thumbNail: string) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Image
                        src={thumbNail || undefined}
                        alt="Service Category"
                        width={60}
                        height={60}
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                        fallback="https://via.placeholder.com/60x60?text=No+Img"
                    />
                </div>
            ),
            align: 'center',
            width: 100,
        },
        {
            title: "Tên danh mục",
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
            align: 'center',
            width: 200,
        },
        {
            title: "Loại",
            dataIndex: 'type',
            key: 'type',
            render: (type: 'personal' | 'business') => (
                <Tag color={type === 'personal' ? 'blue' : 'green'}>
                    {type === 'personal' ? 'Cá nhân' : 'Doanh nghiệp'}
                </Tag>
            ),
            align: 'center',
            width: 120,
        },
        {
            title: "Phí nền tảng (%)",
            dataIndex: 'percentPlatformFee',
            key: 'percentPlatformFee',
            render: (fee: number) => (
                <Text style={{ fontWeight: 'bold', color: '#1890ff' }}>
                    {fee}%
                </Text>
            ),
            align: 'center',
            width: 150,
        },
        {
            title: "Trạng thái",
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean, record: ServiceCategory) => (
                <Switch
                    checked={status}
                    onChange={(checked) => {
                        console.log(`Service category ${record.name} status changed to:`, checked);
                    }}
                />
            ),
            align: 'center',
            width: 120,
        },
        {
            title: "Thao tác",
            key: "action",
            width: 150,
            render: (record: ServiceCategory) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEdit(record)}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        type="default"
                        size="small"
                        onClick={() => router.push(`/admin/servicecategories/${record._id}`)}
                    >
                        Chi tiết <RightOutlined />
                    </Button>
                </Space>
            ),
            align: 'center',
        }
    ];
}

export default function ServiceCategoryList() {
    const router = useRouter();
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<ServiceCategory | null>(null);
    const [isCreateMode, setIsCreateMode] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [listLoading, setListLoading] = useState(true);
    const [servicecategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [activeType, setActiveType] = useState<'personal' | 'business'>('personal');

    useEffect(() => {
        const fetchServiceCategories = async () => {
            try {
                setListLoading(true);
                const response = await getServiceCategory(activeType);
                if (isDetailResponse(response)) {
                    setServiceCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching service categories:", error);
                notify({
                    type: 'error',
                    message: 'Lỗi khi tải danh sách danh mục dịch vụ!',
                });
            } finally {
                setListLoading(false);
            }
        }
        fetchServiceCategories();
    }, [activeType]);

    const handleTypeChange = (type: 'personal' | 'business') => {
        setActiveType(type);
    };

    const filteredServiceCategories = servicecategories.filter(category => category.type === activeType);

    const handleEdit = (record: ServiceCategory) => {
        setIsCreateMode(false);
        setEditingRecord(record);
        setEditModalVisible(true);

        form.setFieldsValue({
            name: record.name,
            type: record.type,
            percentPlatformFee: record.percentPlatformFee,
            status: record.status,
            thumbNail: record.thumbNail
                ? [{
                    uid: "-1",
                    name: "thumb.png",
                    status: "done",
                    url: record.thumbNail,
                }]
                : [],
        });
    };

    const handleCreate = () => {
        setIsCreateMode(true);
        setEditingRecord(null);
        setEditModalVisible(true);
        form.setFieldsValue({
            name: '',
            type: activeType,
            percentPlatformFee: 0,
            status: true,
            thumbNail: null,
        });
    };

    const handleModalCancel = () => {
        setEditModalVisible(false);
        setEditingRecord(null);
        setIsCreateMode(false);
        form.resetFields();
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();
            console.log('Form values:', values);
            let thumbNailFile: File | null = null;
            if (values.thumbNail && values.thumbNail.length > 0) {
                const fileObj = values.thumbNail[0];
                if (fileObj.originFileObj instanceof File) {
                    thumbNailFile = fileObj.originFileObj;
                }
            }

            if (isCreateMode) {
                const response = await createServiceCategory({
                    ...values,
                    percentPlatformFee: Number(values.percentPlatformFee) || 0,
                    thumbNail: thumbNailFile,
                });

                if (!response || !isDetailResponse(response)) {
                    notify({ type: 'error', message: 'Tạo danh mục dịch vụ thất bại!' });
                    return;
                }

                setServiceCategories(prev => [...prev, response.data]);
                notify({ type: 'success', message: 'Tạo danh mục dịch vụ thành công!' });
                handleModalCancel();
            } else {
                if (!editingRecord) {
                    message.error('Không tìm thấy danh mục dịch vụ để cập nhật!');
                    return;
                }

                const updatedValues: Partial<CreateServiceCategory> = {
                    ...values,
                    percentPlatformFee: Number(values.percentPlatformFee),
                };

                if (thumbNailFile) {
                    updatedValues.thumbNail = thumbNailFile as File;
                }

                const response = await updateServiceCategory(editingRecord._id, updatedValues);

                if (!response || !isDetailResponse(response)) {
                    notify({ type: 'error', message: 'Cập nhật danh mục dịch vụ thất bại!' });
                } else {
                    setServiceCategories(prev =>
                        prev.map(cat => cat._id === editingRecord._id ? response.data : cat)
                    );
                    notify({ type: 'success', message: 'Cập nhật danh mục dịch vụ thành công!' });
                    handleModalCancel();
                }
            }
        } catch (error) {
            console.error('Error saving service category:', error);
            message.error(`Có lỗi xảy ra khi ${isCreateMode ? 'tạo' : 'cập nhật'} danh mục dịch vụ!`);
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        name: 'file',
        listType: 'picture' as const,
        maxCount: 1,
        beforeUpload: (file: File) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Chỉ có thể upload file JPG/PNG!');
                return Upload.LIST_IGNORE;
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Kích thước file phải nhỏ hơn 2MB!');
                return Upload.LIST_IGNORE;
            }
            return false; // prevent auto upload
        },
    };

    return (
        <>
            <Card style={{ borderRadius: 12, marginBottom: 16, padding: '16px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <Typography.Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                            Quản lý danh mục dịch vụ
                        </Typography.Title>
                        {listLoading
                            ? <Spin size="small" style={{ marginLeft: 8 }} />
                            : <Typography.Text style={{ color: '#666', fontSize: '14px' }}>
                                Tổng số: {filteredServiceCategories.length} danh mục ({activeType === 'personal' ? 'cá nhân' : 'doanh nghiệp'})
                            </Typography.Text>
                        }
                        <br />
                        <Button type="primary" size="large" onClick={handleCreate} style={{ borderRadius: '8px', marginTop: '8px' }}>
                            + Thêm danh mục
                        </Button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button type={activeType === 'personal' ? 'primary' : 'default'} size="large" loading={listLoading} onClick={() => handleTypeChange('personal')}>
                            <Tag color="blue" style={{ margin: 0, marginRight: 8 }}>Cá nhân</Tag> Dịch vụ cá nhân
                        </Button>
                        <Button type={activeType === 'business' ? 'primary' : 'default'} size="large" loading={listLoading} onClick={() => handleTypeChange('business')}>
                            <Tag color="green" style={{ margin: 0, marginRight: 8 }}>Doanh nghiệp</Tag> Dịch vụ doanh nghiệp
                        </Button>
                    </div>
                </div>
            </Card>

            <Card style={{ borderRadius: 12, overflow: 'hidden' }}>
                {listLoading
                    ? <Spin size="small" />
                    : <Table
                        dataSource={filteredServiceCategories}
                        columns={orderColumns(router, handleEdit)}
                        rowKey="_id"
                        size="large"
                        className="small-font-table"
                        pagination={false}
                        scroll={{ x: 1200 }}
                    />
                }
            </Card>

            <Modal
                title={isCreateMode ? "Thêm danh mục dịch vụ" : "Chỉnh sửa danh mục dịch vụ"}
                open={editModalVisible}
                onCancel={handleModalCancel}
                onOk={handleSave}
                okText={isCreateMode ? "Tạo mới" : "Cập nhật"}
                cancelText="Hủy"
                width={600}
                confirmLoading={loading}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        status: true,
                        type: 'personal',
                        percentPlatformFee: 0,
                        thumbNail: [],
                    }}
                >
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                    >
                        <Input placeholder="Nhập tên danh mục dịch vụ" />
                    </Form.Item>

                    <Form.Item
                        label="Loại dịch vụ"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ!' }]}
                    >
                        <Select>
                            <Select.Option value="personal">Cá nhân</Select.Option>
                            <Select.Option value="business">Doanh nghiệp</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Phí nền tảng (%)"
                        name="percentPlatformFee"
                        rules={[
                            { required: true, message: 'Vui lòng nhập phí nền tảng!' },
                            { type: 'number', min: 0, max: 100, message: 'Phí phải từ 0 đến 100%' },
                        ]}
                    >
                        <InputNumber min={0} max={100} step={1} style={{ width: '100%' }} suffix="%" />
                    </Form.Item>

                    <Form.Item label="Ảnh thumbNail" name="thumbNail" valuePropName="fileList" getValueFromEvent={(e) => e.fileList}>
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item label="Trạng thái" name="status" valuePropName="checked">
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
