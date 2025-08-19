import { Equipment, Service } from "@/type/services/services";
import { Button, Card, Form, Input, InputNumber, message, Modal, Space, Switch, Table, Typography } from "antd";

import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ToolOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { TextArea } = Input;

interface EquipmentProps {
    equipment: Equipment[] | undefined;
    setServiceData: React.Dispatch<React.SetStateAction<Service | null>>;
}

const { Text } = Typography;


export default function EquipmentCommponent({ equipment, setServiceData }: EquipmentProps) {

    const [equipmentForm] = Form.useForm();
    const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
    const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

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
                setServiceData((prev: Service | null) => {
                    if (!prev || !prev.equipment) return prev;
                    return {
                        ...prev,
                        equipment: prev.equipment.filter((eq: Equipment) => eq.id !== equipmentId)
                    };
                });
                message.success('Đã xóa thiết bị!');
            }
        });
    };


    const handleEquipmentSubmit = async (values: Omit<Equipment, 'id'>) => {
        try {
            if (editingEquipment) {
                // Update existing equipment
                setServiceData((prev: Service | null) => {
                    if (!prev || !prev.equipment) return prev;
                    return {
                        ...prev,
                        equipment: prev.equipment.map((eq: Equipment) =>
                            eq.id === editingEquipment.id
                                ? { ...eq, ...values }
                                : eq
                        )
                    };
                });
                message.success('Đã cập nhật thiết bị!');
            } else {
                // Add new equipment
                const newEquipment: Equipment = {
                    id: Date.now().toString(),
                    ...values
                };
                setServiceData((prev: Service | null) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        equipment: [...(prev.equipment || []), newEquipment]
                    };
                });
                message.success('Đã thêm thiết bị mới!');
            }

            setEquipmentModalOpen(false);
            equipmentForm.resetFields();
        } catch {
            message.error('Có lỗi xảy ra!');
        }
    };

    const toggleEquipmentAvailability = (equipmentId: string) => {
        setServiceData((prev: Service | null) => {
            if (!prev || !prev.equipment) return prev;
            const updatedEquipment = prev.equipment.map((eq: Equipment) => {
                if (eq.id === equipmentId) {
                    return { ...eq, status: !eq.status };
                }
                return eq;
            });
            // Find the toggled equipment
            const toggledEq = prev.equipment.find(eq => eq.id === equipmentId);
            let newBasePrice = prev.basePrice || 0;
            if (toggledEq) {
                if (toggledEq.status) {
                    // Was ON, now OFF
                    newBasePrice -= toggledEq.price;
                    if (newBasePrice < 0) newBasePrice = 0;
                } else {
                    // Was OFF, now ON
                    newBasePrice += toggledEq.price;
                }
            }
            return {
                ...prev,
                equipment: updatedEquipment,
                basePrice: newBasePrice
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
                    {price.toLocaleString()}
                </Text>
            ),
            width: 120
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: boolean, record: Equipment) => (
                <Switch
                    checked={status}
                    onChange={() => toggleEquipmentAvailability(record.id)}
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
                        onClick={() => handleDeleteEquipment(record.id)}
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
                    </Form.Item>                        <Form.Item
                        label="Giá thuê (VNĐ)"
                        name="price"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            // parser removed to match InputNumber type requirements
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
                    </Form.Item>                        <Form.Item
                        label="Trạng thái"
                        name="status"
                        valuePropName="checked"
                        initialValue={true}
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