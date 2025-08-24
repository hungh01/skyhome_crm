import { Service } from "@/type/services/services";
import { Button, Card, Form, Input, InputNumber, message, Modal, Space, Switch, Table, Typography } from "antd";

import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { OptionalService } from "@/type/services/optional";

const { TextArea } = Input;


interface OptionalServiceProps {
    optionalServices?: OptionalService[];
    setServiceData: (updateFn: (service: Service) => Service) => void;
}
const { Text } = Typography;

export default function OptionalServiceComponent({ optionalServices, setServiceData }: OptionalServiceProps) {
    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState<OptionalService | null>(null);

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
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa tuỳ chọn này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: () => {
                setServiceData((service: Service) => ({
                    ...service,
                    optionalServices: service.optionalServices?.filter((opt: OptionalService) => opt._id !== optionId) || []
                }));
                message.success('Đã xóa tuỳ chọn!');
            }
        });
    };

    const handleOptionSubmit = async (values: OptionalService) => {
        try {
            if (editingOption) {
                // Update existing option
                setServiceData((service: Service) => ({
                    ...service,
                    optionalServices: service.optionalServices?.map((opt: OptionalService) =>
                        opt._id === editingOption._id
                            ? { ...opt, ...values }
                            : opt
                    ) || []
                }));
                message.success('Đã cập nhật tuỳ chọn!');
            } else {
                // Add new option
                const newOption: OptionalService = {
                    _id: String(Date.now()),
                    name: values.name,
                    price: values.price,
                    description: values.description,
                    status: values.status
                };
                setServiceData((service: Service) => ({
                    ...service,
                    optionalServices: [...(service.optionalServices || []), newOption]
                }));
                message.success('Đã thêm tuỳ chọn mới!');
            }

            setModalOpen(false);
            form.resetFields();
        } catch {
            message.error('Có lỗi xảy ra!');
        }
    };

    const toggleOptionAvailability = (optionId: string) => {
        setServiceData((service: Service) => ({
            ...service,
            optionalServices: service.optionalServices?.map((opt: OptionalService) =>
                opt._id === optionId
                    ? { ...opt, status: opt.status === 'active' ? 'inactive' : 'active' }
                    : opt
            ) || []
        }));
    };

    const optionColumns = [
        {
            title: 'Tên tuỳ chọn',
            dataIndex: 'serviceName',
            key: 'serviceName',
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
            title: 'Thời gian thực hiện',
            dataIndex: 'durationMinutes',
            key: 'durationMinutes',
            render: (duration: number) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {duration?.toLocaleString() || '0'}
                </Text>
            ),
            width: 120
        },
        {
            title: 'Giá (VNĐ)',
            dataIndex: 'servicePrice',
            key: 'servicePrice',
            render: (basePrice: number) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {basePrice?.toLocaleString() || '0'}
                </Text>
            ),
            width: 120
        },
        {
            title: 'Trạng thái',
            dataIndex: 'serviceStatus',
            key: 'serviceStatus',
            render: (status: string, record: OptionalService) => (
                <Switch
                    checked={status === 'active'}
                    onChange={() => toggleOptionAvailability(record._id ? record._id : '')}
                />
            ),
            width: 120
        },
        {
            title: 'Được chọn sẵn trên app',
            dataIndex: 'enable',
            key: 'enable',
            render: (enable: boolean, record: OptionalService) => (
                <Switch
                    checked={enable}
                    onChange={() => toggleOptionAvailability(record._id ? record._id : '')}
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
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteOption(record._id ? record._id : '')}
                        size="small"
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
                    locale={{ emptyText: 'Chưa có tuỳ chọn nào' }}
                />
            </Card>

            {/* Optional Service Modal */}
            <Modal
                title={editingOption ? 'Chỉnh sửa tuỳ chọn' : 'Thêm tuỳ chọn mới'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleOptionSubmit}
                >
                    <Form.Item
                        label="Tên tuỳ chọn"
                        name="serviceName"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tuỳ chọn!' }]}
                    >
                        <Input placeholder="Nhập tên tuỳ chọn" />
                    </Form.Item>
                    <Form.Item
                        label="Giá (VNĐ)"
                        name="servicePrice"
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
                        name="serviceDescription"
                    >
                        <TextArea
                            rows={3}
                            placeholder="Mô tả về tuỳ chọn..."
                        />
                    </Form.Item>
                    <Form.Item
                        label="Trạng thái"
                        name="serviceStatus"
                        valuePropName="checked"
                        initialValue={true}
                        getValueFromEvent={(checked) => checked ? 'active' : 'inactive'}
                        getValueProps={(value) => ({ checked: value === 'active' })}
                    >
                        <Switch checkedChildren="Có sẵn" unCheckedChildren="Hết" />
                    </Form.Item>
                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setModalOpen(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingOption ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );

}