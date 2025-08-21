import { Service } from "@/type/services/services";
import { Button, Card, Form, Input, InputNumber, message, Modal, Space, Switch, Table, Typography } from "antd";

import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Equipment } from "@/type/services/equipmemt";

const { TextArea } = Input;

interface EquipmentFormValues {
    name: string;
    price: number;
    description: string;
    status: string;
    image?: string;
}

interface EquipmentProps {
    equipment: Equipment[] | undefined;
    setServiceData: (updateFn: (service: Service) => Service) => void;
}

const { Text } = Typography;


export default function EquipmentCommponent({ equipment, setServiceData }: EquipmentProps) {

    const [equipmentForm] = Form.useForm();
    const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

    console.log('Equipment:', equipment);
    const handleAddEquipment = () => {
        setEditingEquipment(null);
        equipmentForm.resetFields();
        setEquipmentModalOpen(true);
    };

    const handleEditEquipment = (equipment: Equipment) => {
        setEditingEquipment(equipment);
        equipmentForm.setFieldsValue(equipment);
        setEquipmentModalOpen(true);
    };

    const handleDeleteEquipment = (equipmentId: string) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa thiết bị này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            onOk: () => {
                setServiceData((service: Service) => ({
                    ...service,
                    equipments: service.equipments?.filter((eq: Equipment) => eq._id !== equipmentId) || []
                }));
                message.success('Đã xóa thiết bị!');
            }
        });
    };


    const handleEquipmentSubmit = async (values: EquipmentFormValues) => {
        try {
            if (editingEquipment) {
                // Update existing equipment
                setServiceData((service: Service) => ({
                    ...service,
                    equipments: service.equipments?.map((eq: Equipment) =>
                        eq._id === editingEquipment._id
                            ? { ...eq, ...values }
                            : eq
                    ) || []
                }));
                message.success('Đã cập nhật thiết bị!');
            } else {
                // Add new equipment
                const newEquipment: Equipment = {
                    _id: `equipment_${Date.now()}`,
                    name: values.name,
                    price: values.price,
                    description: values.description,
                    status: values.status,
                    image: values.image || ''
                };
                setServiceData((service: Service) => ({
                    ...service,
                    equipments: [...(service.equipments || []), newEquipment]
                }));
                message.success('Đã thêm thiết bị mới!');
            }

            setEquipmentModalOpen(false);
            equipmentForm.resetFields();
        } catch {
            message.error('Có lỗi xảy ra!');
        }
    };

    const toggleEquipmentAvailability = (equipmentId: string) => {
        setServiceData((service: Service) => {
            const updatedEquipments = service.equipments?.map((eq: Equipment) => {
                if (eq._id === equipmentId) {
                    return {
                        ...eq,
                        status: eq.status === 'active' ? 'inactive' : 'active'
                    };
                }
                return eq;
            }) || [];

            return {
                ...service,
                equipments: updatedEquipments
            };
        });
    };


    const equipmentColumns = [
        {
            title: 'Tên thiết bị',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: Equipment) => (
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
            title: 'Giá (VNĐ)',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => (
                <Text strong style={{ color: '#52c41a' }}>
                    {price?.toLocaleString() || '0'}
                </Text>
            ),
            width: 120
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string, record: Equipment) => (
                <Switch
                    checked={status === 'active'}
                    onChange={() => toggleEquipmentAvailability(record._id)}
                />
            ),
            width: 120
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_: unknown, record: Equipment) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => handleEditEquipment(record)}
                        size="small"
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteEquipment(record._id)}
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
                        <span>Thiết bị & Dụng cụ</span>
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddEquipment}
                    >
                        Thêm thiết bị
                    </Button>
                }
            >
                <Table
                    dataSource={equipment || []}
                    columns={equipmentColumns}
                    rowKey="id"
                    size="small"
                    pagination={false}
                    locale={{ emptyText: 'Chưa có thiết bị nào' }}
                />
            </Card>

            {/* Equipment Modal */}
            <Modal
                title={editingEquipment ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
                open={equipmentModalOpen}
                onCancel={() => setEquipmentModalOpen(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={equipmentForm}
                    layout="vertical"
                    onFinish={handleEquipmentSubmit}
                >
                    <Form.Item
                        label="Tên thiết bị"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}
                    >
                        <Input placeholder="Nhập tên thiết bị" />
                    </Form.Item>
                    <Form.Item
                        label="Giá thuê (VNĐ)"
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
                            placeholder="Mô tả về thiết bị và tác dụng..."
                        />
                    </Form.Item>
                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        valuePropName="checked"
                        initialValue={true}
                        getValueFromEvent={(checked) => checked ? 'active' : 'inactive'}
                        getValueProps={(value) => ({ checked: value === 'active' })}
                    >
                        <Switch />
                    </Form.Item>

                    <Form.Item>
                        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <Button onClick={() => setEquipmentModalOpen(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingEquipment ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );

}