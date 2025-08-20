'use client';
import { Button, Card, Switch, Table, Typography, Tag, Image, Space, Modal, Form, Input, Select, Upload, message } from "antd";
import { RightOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";
import { ServiceCategory } from "@/type/services/service-category";
import { useEffect, useState } from "react";
import { UploadFile } from "antd/es/upload/interface";
import { getServiceCategory, updateServiceCategory } from "@/api/service/service-categories-api";
import { isDetailResponse } from "@/utils/response-handler";
import { notify } from "@/components/Notification";

const { Text } = Typography;
function orderColumns(
    router: ReturnType<typeof useRouter>,
    handleEdit: (record: ServiceCategory) => void
): ColumnsType<ServiceCategory> {
    return [
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Ảnh</div>,
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            render: (thumbnail: string) => (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Image
                        src={thumbnail}
                        alt="Service Category"
                        width={60}
                        height={60}
                        style={{ borderRadius: 8, objectFit: 'cover' }}
                        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN4BMghRZgTvAUOLuBIHAJciE4cOhABhyC4MiRw4EDBwhdwCEIrU6DRiJo7PUGlzJZz"
                    />
                </div>
            ),
            align: 'center',
            width: 100,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Tên danh mục</div>,
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text strong>{text}</Text>,
            align: 'center',
            width: 200,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Loại</div>,
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
            title: <div style={{ textAlign: 'center', width: '100%' }}>Phí nền tảng (%)</div>,
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
            title: <div style={{ textAlign: 'center', width: '100%' }}>Trạng thái</div>,
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean, record: ServiceCategory) => (
                <Switch
                    style={{ margin: '0 auto', display: 'block' }}
                    checked={status}
                    onChange={(checked) => {
                        // Handle switch change logic here
                        console.log(`Service category ${record.name} status changed to:`, checked);
                    }}
                />
            ),
            align: 'center',
            width: 120,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Thao tác</div>,
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
                        onClick={() => {
                            // Navigate to view details
                            router.push(`/admin/servicecategories/${record._id}`);
                        }}
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
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [servicecategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [activeType, setActiveType] = useState<'personal' | 'business'>('personal');

    useEffect(() => {
        const fetchServiceCategories = async () => {
            try {
                const response = await getServiceCategory(activeType);
                if (isDetailResponse(response)) {
                    setServiceCategories(response.data);
                }
            } catch (error) {
                console.error("Error fetching service categories:", error);
            }
        }
        fetchServiceCategories();
    }, [activeType]);

    const handleTypeChange = (type: 'personal' | 'business') => {
        setActiveType(type);
    };

    // Filter service categories by type
    const filteredServiceCategories = servicecategories.filter(category => category.type === activeType);

    const handleEdit = (record: ServiceCategory) => {
        setEditingRecord(record);
        setEditModalVisible(true);
        form.setFieldsValue({
            name: record.name,
            type: record.type,
            percentPlatformFee: record.percentPlatformFee,
            status: record.status,
        });
        // Set current thumbnail as initial file
        if (record.thumbnail) {
            setFileList([{
                uid: '-1',
                name: 'thumbnail.jpg',
                status: 'done',
                url: record.thumbnail,
            }]);
        }
    };

    const handleModalCancel = () => {
        setEditModalVisible(false);
        setEditingRecord(null);
        form.resetFields();
        setFileList([]);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            if (!editingRecord) {
                message.error('Không tìm thấy danh mục dịch vụ để cập nhật!');
                return;
            }
            // Chỉ lấy những trường trong values khác với editingRecord
            const normalizedValues = {
                ...values,
                percentPlatformFee: values.percentPlatformFee !== undefined ? Number(values.percentPlatformFee) : undefined,
            };
            const updatedValues = Object.keys(normalizedValues).reduce((acc, key) => {
                const normalizedKey = key as keyof ServiceCategory;
                if (normalizedValues[normalizedKey] !== editingRecord[normalizedKey]) {
                    acc[normalizedKey] = normalizedValues[normalizedKey];
                }
                return acc;
            }, {} as Partial<ServiceCategory>);



            const response = await updateServiceCategory(editingRecord._id, updatedValues);
            if (!response || !isDetailResponse(response)) {
                notify({
                    type: 'error',
                    message: 'Cập nhật danh mục dịch vụ thất bại!',
                })
            } else {
                setServiceCategories(prev =>
                    prev.map(cat =>
                        cat._id === editingRecord._id
                            ? {
                                ...cat,
                                ...updatedValues,
                                percentPlatformFee: updatedValues.percentPlatformFee !== undefined
                                    ? updatedValues.percentPlatformFee * 100
                                    : cat.percentPlatformFee
                            }
                            : cat
                    )
                );
                notify({
                    type: 'success',
                    message: 'Cập nhật danh mục dịch vụ thành công!',
                });
                handleModalCancel();
            }
        } catch (error) {
            console.error('Error updating service category:', error);

            // Check if it's a validation error
            if (error && typeof error === 'object' && 'errorFields' in error) {
                // This is a form validation error
                const validationError = error as { errorFields: Array<{ name: string[]; errors: string[] }> };
                const errorFields = validationError.errorFields;
                if (errorFields && errorFields.length > 0) {
                    const firstError = errorFields[0];
                    message.error(`Lỗi validation: ${firstError.errors[0]}`);
                } else {
                    message.error('Vui lòng kiểm tra lại thông tin đã nhập!');
                }
            } else {
                message.error('Có lỗi xảy ra khi cập nhật danh mục dịch vụ!');
            }
        } finally {
            setLoading(false);
        }
    };

    const uploadProps = {
        name: 'file',
        action: '/api/upload', // Replace with your upload API
        listType: 'picture' as const,
        fileList,
        onChange: (info: { fileList: UploadFile[]; file: { status?: string; name: string } }) => {
            setFileList(info.fileList);
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        beforeUpload: (file: File) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('Chỉ có thể upload file JPG/PNG!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Kích thước file phải nhỏ hơn 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },
    };
    return (
        <>
            {/* Header with Type Switcher */}
            <Card style={{ borderRadius: 12, marginBottom: 16, padding: '16px 24px' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <Typography.Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                            Quản lý danh mục dịch vụ
                        </Typography.Title>
                        <Typography.Text style={{ color: '#666', fontSize: '14px' }}>
                            Tổng số: {filteredServiceCategories.length} danh mục ({activeType === 'personal' ? 'cá nhân' : 'doanh nghiệp'})
                        </Typography.Text>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Button
                            type={activeType === 'personal' ? 'primary' : 'default'}
                            size="large"
                            onClick={() => handleTypeChange('personal')}
                            style={{
                                borderRadius: '8px',
                                fontWeight: activeType === 'personal' ? 'bold' : 'normal'
                            }}
                        >
                            <Tag color="blue" style={{ margin: 0, marginRight: 8 }}>Cá nhân</Tag>
                            Dịch vụ cá nhân
                        </Button>
                        <Button
                            type={activeType === 'business' ? 'primary' : 'default'}
                            size="large"
                            onClick={() => handleTypeChange('business')}
                            style={{
                                borderRadius: '8px',
                                fontWeight: activeType === 'business' ? 'bold' : 'normal'
                            }}
                        >
                            <Tag color="green" style={{ margin: 0, marginRight: 8 }}>Doanh nghiệp</Tag>
                            Dịch vụ doanh nghiệp
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card style={{ borderRadius: 12, overflow: 'hidden' }}
            >
                <Table
                    dataSource={filteredServiceCategories}
                    columns={orderColumns(
                        router,
                        handleEdit
                    )}
                    rowKey="_id"
                    size="large"
                    className="small-font-table"
                    pagination={false}
                    scroll={{ x: 1200 }}
                />
                <style jsx>{`
                    :global(.small-font-table .ant-table-tbody > tr > td),
                    :global(.small-font-table .ant-table-thead > tr > th) {
                        font-size: 16px !important;
                    }
                    :global(.small-font-table .ant-typography) {
                        font-size: 16px !important;
                    }
                    :global(.small-font-table .ant-tag) {
                        font-size: 14px !important;
                    }
                    :global(.small-font-table .ant-table-thead > tr > th > div) {
                        font-size: 16px !important;
                        font-weight: 600 !important;
                    }
                    :global(.small-font-table .ant-table-tbody > tr:nth-child(even)) {
                        background-color: #fafafa;
                    }
                `}</style>
            </Card>

            {/* Edit Modal */}
            <Modal
                title="Chỉnh sửa danh mục dịch vụ"
                open={editModalVisible}
                onCancel={handleModalCancel}
                onOk={handleSave}
                okText="Cập nhật"
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
                    }}
                >
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên danh mục!' },
                            { min: 2, message: 'Tên danh mục phải có ít nhất 2 ký tự!' },
                            { max: 100, message: 'Tên danh mục không được quá 100 ký tự!' },
                        ]}
                    >
                        <Input placeholder="Nhập tên danh mục dịch vụ" />
                    </Form.Item>

                    <Form.Item
                        label="Loại dịch vụ"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn loại dịch vụ!' }]}
                    >
                        <Select placeholder="Chọn loại dịch vụ">
                            <Select.Option value="personal">Cá nhân</Select.Option>
                            <Select.Option value="business">Doanh nghiệp</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Phí nền tảng (%)"
                        name="percentPlatformFee"
                        rules={[
                            { required: true, message: 'Vui lòng nhập phí nền tảng!' },
                            {
                                validator: (_, value) => {
                                    const numValue = Number(value);
                                    if (isNaN(numValue)) {
                                        return Promise.reject(new Error('Phí nền tảng phải là số!'));
                                    }
                                    if (numValue < 0 || numValue > 100) {
                                        return Promise.reject(new Error('Phí nền tảng phải từ 0% đến 100%!'));
                                    }
                                    return Promise.resolve();
                                }
                            },
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="Nhập phí nền tảng (0-100)"
                            suffix="%"
                            min={0}
                            max={100}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Ảnh thumbnail"
                        name="thumbnail"
                    >
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Hoạt động"
                            unCheckedChildren="Tạm dừng"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}