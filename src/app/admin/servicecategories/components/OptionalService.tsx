
import { Button, Card, Form, Input, InputNumber, Modal, Space, Switch, Table, Typography, Select } from "antd";

import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { OptionalService, UpdateOptionalService } from "@/type/services/optional";
import { createOptionalService, updateOptionalService, getOptionalService } from "@/api/service/optional-service-api";
import { isDetailResponse } from "@/utils/response-handler";
import { notify } from "@/components/Notification";
import { DetailResponse } from "@/type/detailResponse/detailResponse";

const { TextArea } = Input;


interface OptionalServiceProps {
    serviceId: string;
}
const { Text } = Typography;

export default function OptionalServiceComponent({ serviceId }: OptionalServiceProps) {
    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState<OptionalService | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [optionToDelete, setOptionToDelete] = useState<string | null>(null);

    // Move optionalServices state here
    const [optionalServices, setOptionalServices] = useState<OptionalService[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch optional services when serviceId changes
    useEffect(() => {
        if (serviceId) {
            fetchOptionalServices();
        }
    }, [serviceId]);

    const fetchOptionalServices = async (): Promise<void> => {
        try {
            setLoading(true);
            const response: DetailResponse<OptionalService[]> = await getOptionalService(serviceId);
            if (isDetailResponse(response)) {
                setOptionalServices(Array.isArray(response.data) ? response.data : []);
            } else {
                setOptionalServices([]);
            }
        } catch (error) {
            console.error('Error fetching optional services:', error);
            setOptionalServices([]);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi tải danh sách tuỳ chọn!',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddOption = () => {
        setEditingOption(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleEditOption = (option: OptionalService) => {
        setEditingOption(option);
        form.setFieldsValue(option);
        setModalOpen(true);
    };

    const handleDeleteOption = (optionId: string) => {
        setOptionToDelete(optionId);
        setDeleteModalOpen(true);
    };

    const confirmDeleteOption = async () => {
        if (!optionToDelete) return;

        try {
            const response = await updateOptionalService(optionToDelete, {
                isDeleted: true
            });

            if (isDetailResponse(response)) {
                // Remove from local state (since it's marked as deleted)
                setOptionalServices(prev => prev.filter(opt => opt._id !== optionToDelete));

                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Xóa tuỳ chọn thành công!',
                });
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: 'Có lỗi xảy ra khi xóa tuỳ chọn!',
                });
            }
        } catch (error) {
            console.error('Error deleting optional service:', error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi xóa tuỳ chọn!',
            });
        } finally {
            setDeleteModalOpen(false);
            setOptionToDelete(null);
        }
    };
    const handleOptionSubmit = async (values: UpdateOptionalService) => {
        try {
            setSubmitting(true);

            if (editingOption) {
                // Update existing option
                const response = await updateOptionalService(editingOption._id || '', values);

                if (isDetailResponse(response)) {
                    const updatedOption = response.data;
                    setOptionalServices(prev => prev.map(opt =>
                        opt._id === editingOption._id ? updatedOption : opt
                    ));

                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Cập nhật tuỳ chọn thành công!',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Có lỗi xảy ra khi cập nhật tuỳ chọn!',
                    });
                }
            } else {
                // Create new option
                const createData = {
                    ...values,
                    serviceId: serviceId
                };

                console.log('Creating option with data:', createData);

                const response = await createOptionalService(createData);

                if (isDetailResponse(response)) {
                    const newOption = response.data as OptionalService;
                    setOptionalServices(prev => [...prev, newOption]);

                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Thêm tuỳ chọn thành công!',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Có lỗi xảy ra khi thêm tuỳ chọn!',
                    });
                }
            }

            setModalOpen(false);
            form.resetFields();
            setEditingOption(null);
        } catch (error) {
            console.error('Error submitting option:', error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: `Có lỗi xảy ra khi ${editingOption ? 'cập nhật' : 'thêm'} tuỳ chọn!`,
            });
        } finally {
            setSubmitting(false);
        }
    };

    const toggleOptionAvailability = async (optionId: string) => {
        try {
            const option = optionalServices?.find(opt => opt._id === optionId);
            if (!option) return;

            const response = await updateOptionalService(optionId, {
                status: !option.status
            });

            if (isDetailResponse(response)) {
                const updatedOption = response.data as OptionalService;
                setOptionalServices(prev => prev.map(opt =>
                    opt._id === optionId ? updatedOption : opt
                ));

                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Cập nhật trạng thái thành công!',
                });
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: 'Có lỗi xảy ra khi cập nhật trạng thái!',
                });
            }
        } catch (error) {
            console.error('Error toggling status:', error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi cập nhật trạng thái!',
            });
        }
    };

    const toggleOptionEnable = async (optionId: string) => {
        try {
            const option = optionalServices?.find(opt => opt._id === optionId);
            if (!option) return;

            const response = await updateOptionalService(optionId, {
                enable: !option.enable
            });

            if (isDetailResponse(response)) {
                const updatedOption = response.data as OptionalService;
                setOptionalServices(prev => prev.map(opt =>
                    opt._id === optionId ? updatedOption : opt
                ));

                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Cập nhật cài đặt thành công!',
                });
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: 'Có lỗi xảy ra khi cập nhật cài đặt!',
                });
            }
        } catch (error) {
            console.error('Error toggling enable:', error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi cập nhật cài đặt!',
            });
        }
    };

    const optionColumns = [
        {
            title: 'Tên tuỳ chọn',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: OptionalService) => (
                <div>
                    <Text strong>{text}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                        {record.description || 'Không có mô tả'}
                    </Text>
                </div>
            )
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type: 'equipment' | 'activity') => (
                <span>
                    {type === 'equipment' ? 'Thiết bị' : 'Hoạt động'}
                </span>
            ),
            width: 100
        },
        {
            title: 'Thời gian (phút)',
            dataIndex: 'durationMinutes',
            key: 'durationMinutes',
            render: (duration: number) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {duration?.toLocaleString() || '0'} phút
                </Text>
            ),
            width: 120
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {price?.toLocaleString('vi-VN') || '0'} VNĐ
                </Text>
            ),
            width: 120
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean, record: OptionalService) => (
                <Switch
                    checked={status}
                    onChange={() => toggleOptionAvailability(record._id ? record._id : '')}
                />
            ),
            width: 120
        },
        {
            title: 'Được chọn sẵn',
            dataIndex: 'enable',
            key: 'enable',
            render: (enable: boolean, record: OptionalService) => (
                <Switch
                    checked={enable}
                    onChange={() => toggleOptionEnable(record._id ? record._id : '')}
                />
            ),
            width: 120
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: unknown, record: OptionalService) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditOption(record)}
                        size="small"
                    />
                    <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteOption(record._id ? record._id : '')}
                        size="small"
                        danger
                    />
                </Space>
            ),
            width: 100
        }
    ];

    return (
        <>
            <Card
                title={
                    <Space>
                        <ToolOutlined />
                        <span>Tuỳ chọn dịch vụ</span>
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddOption}
                    >
                        Thêm tuỳ chọn
                    </Button>
                }
            >
                <Table
                    dataSource={optionalServices || []}
                    columns={optionColumns}
                    rowKey="_id"
                    size="small"
                    pagination={false}
                    loading={loading}
                    locale={{ emptyText: 'Chưa có tuỳ chọn nào' }}
                />
            </Card>

            {/* Optional Service Modal */}
            <Modal
                title={editingOption ? 'Chỉnh sửa tuỳ chọn' : 'Thêm tuỳ chọn mới'}
                open={modalOpen}
                onCancel={() => !submitting && setModalOpen(false)}
                footer={null}
                width={600}
                closable={!submitting}
                maskClosable={!submitting}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleOptionSubmit}
                >
                    <Form.Item
                        label="Tên tuỳ chọn"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tuỳ chọn!' }]}
                    >
                        <Input placeholder="Nhập tên tuỳ chọn" />
                    </Form.Item>

                    <Form.Item
                        label="Giá (VNĐ)"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            min={0}
                            step={1000}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Mô tả về tuỳ chọn..."
                        />
                    </Form.Item>

                    <Form.Item
                        label="Thời gian thực hiện (phút)"
                        name="durationMinutes"
                        rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={1}
                            step={15}
                            placeholder="Nhập thời gian (phút)"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Loại tuỳ chọn"
                        name="type"
                        rules={[{ required: true, message: 'Vui lòng chọn loại tuỳ chọn!' }]}
                    >
                        <Select placeholder="Chọn loại tuỳ chọn">
                            <Select.Option value="equipment">Thiết bị</Select.Option>
                            <Select.Option value="activity">Hoạt động</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Hiển thị trên app?"
                        name="status"
                        valuePropName="checked"
                        initialValue={true}
                    >
                        <Switch checkedChildren="Hoạt động" unCheckedChildren="Ngừng" />
                    </Form.Item>

                    <Form.Item
                        label="Được chọn sẵn?"
                        name="enable"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Switch checkedChildren="Có" unCheckedChildren="Không" />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button
                                onClick={() => {
                                    setModalOpen(false);
                                    setSubmitting(false);
                                    form.resetFields();
                                }}
                                disabled={submitting}
                            >
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit" loading={submitting}>
                                {editingOption ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Xác nhận xóa"
                open={deleteModalOpen}
                onOk={confirmDeleteOption}
                onCancel={() => {
                    setDeleteModalOpen(false);
                    setOptionToDelete(null);
                }}
                okText="Xóa"
                cancelText="Hủy"
                okType="danger"
            >
                <p>Bạn có chắc chắn muốn xóa tuỳ chọn này?</p>
            </Modal>
        </>
    );

}