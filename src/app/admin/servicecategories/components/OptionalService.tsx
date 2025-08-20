// import { Service } from "@/type/services/services";
// import { Button, Card, Form, Input, InputNumber, message, Modal, Space, Switch, Table, Typography } from "antd";

// import {
//     PlusOutlined,
//     EditOutlined,
//     DeleteOutlined,
//     ToolOutlined,
// } from "@ant-design/icons";
// import { useState } from "react";
// import { OptionalService } from "@/type/services/optional";

// const { TextArea } = Input;


// interface OptionalServiceProps {
//     optionalServices?: OptionalService[];
//     setServiceData: React.Dispatch<React.SetStateAction<Service | null>>;
// }
// const { Text } = Typography;

export default function OptionalServiceComponent() {
    // const [form] = Form.useForm();
    // const [modalOpen, setModalOpen] = useState(false);
    // const [editingOption, setEditingOption] = useState<OptionalService | null>(null);

    // const handleAddOption = () => {
    //     setEditingOption(null);
    //     form.resetFields();
    //     setModalOpen(true);
    // };

    // const handleEditOption = (option: OptionalService) => {
    //     setEditingOption(option);
    //     form.setFieldsValue(option);
    //     setModalOpen(true);
    // };

    // const handleDeleteOption = (optionId: string) => {
    //     Modal.confirm({
    //         title: 'Xác nhận xóa',
    //         content: 'Bạn có chắc chắn muốn xóa tuỳ chọn này?',
    //         okText: 'Xóa',
    //         cancelText: 'Hủy',
    //         onOk: () => {
    //             setServiceData((prev: Service | null) => {
    //                 if (!prev || !prev.optionalServices) return prev;
    //                 return {
    //                     ...prev,
    //                     optionalServices: prev.optionalServices.filter((opt: OptionalService) => opt._id !== optionId)
    //                 };
    //             });
    //             message.success('Đã xóa tuỳ chọn!');
    //         }
    //     });
    // };

    // const handleOptionSubmit = async (values: Omit<OptionalService, 'id'>) => {
    //     try {
    //         if (editingOption) {
    //             // Update existing option
    //             setServiceData((prev: Service | null) => {
    //                 if (!prev || !prev.optionalServices) return prev;
    //                 return {
    //                     ...prev,
    //                     optionalServices: prev.optionalServices.map((opt: OptionalService) =>
    //                         opt._id === editingOption._id
    //                             ? { ...opt, ...values }
    //                             : opt
    //                     )
    //                 };
    //             });
    //             message.success('Đã cập nhật tuỳ chọn!');
    //         } else {
    //             // Add new option
    //             const newOption: OptionalService = {
    //                 ...values
    //             };
    //             setServiceData((prev: Service | null) => {
    //                 if (!prev) return prev;
    //                 return {
    //                     ...prev,
    //                     optionalServices: [...(prev.optionalServices || []), newOption]
    //                 };
    //             });
    //             message.success('Đã thêm tuỳ chọn mới!');
    //         }

    //         setModalOpen(false);
    //         form.resetFields();
    //     } catch {
    //         message.error('Có lỗi xảy ra!');
    //     }
    // };

    // const toggleOptionAvailability = (optionId: string) => {
    //     setServiceData((prev: Service | null) => {
    //         if (!prev || !prev.optionalServices) return prev;
    //         return {
    //             ...prev,
    //             optionalServices: prev.optionalServices.map((opt: OptionalService) =>
    //                 opt._id === optionId
    //                     ? { ...opt, serviceStatus: !opt.serviceStatus }
    //                     : opt
    //             )
    //         };
    //     });
    // };

    // const optionColumns = [
    //     {
    //         title: 'Tên tuỳ chọn',
    //         dataIndex: 'name',
    //         key: 'name',
    //         render: (text: string, record: OptionalService) => (
    //             <div>
    //                 <Text strong>{text}</Text>
    //                 <br />
    //                 <Text type="secondary" style={{ fontSize: '12px' }}>
    //                     {record.description || 'Không có mô tả'}
    //                 </Text>
    //             </div>
    //         )
    //     },
    //     {
    //         title: 'Giá (VNĐ)',
    //         dataIndex: 'basePrice',
    //         key: 'basePrice',
    //         render: (basePrice: number) => (
    //             <Text strong style={{ color: '#52c41a' }}>
    //                 {basePrice.toLocaleString()}
    //             </Text>
    //         ),
    //         width: 120
    //     },
    //     {
    //         title: 'Trạng thái',
    //         dataIndex: 'status',
    //         key: 'status',
    //         render: (status: boolean, record: OptionalService) => (
    //             <Switch
    //                 checked={status}
    //                 onChange={() => toggleOptionAvailability(record.id)}
    //             />
    //         ),
    //         width: 120
    //     },
    //     {
    //         title: 'Hành động',
    //         key: 'actions',
    //         render: (_: unknown, record: OptionalService) => (
    //             <Space>
    //                 <Button
    //                     type="text"
    //                     icon={<EditOutlined />}
    //                     onClick={() => handleEditOption(record)}
    //                     size="small"
    //                 />
    //                 <Button
    //                     type="text"
    //                     danger
    //                     icon={<DeleteOutlined />}
    //                     onClick={() => handleDeleteOption(record.id)}
    //                     size="small"
    //                 />
    //             </Space>
    //         ),
    //         width: 100
    //     }
    // ];

    // return (
    //     <>
    //         <Card
    //             title={
    //                 <Space>
    //                     <ToolOutlined />
    //                     <span>Tuỳ chọn dịch vụ</span>
    //                 </Space>
    //             }
    //             extra={
    //                 <Button
    //                     type="primary"
    //                     icon={<PlusOutlined />}
    //                     onClick={handleAddOption}
    //                 >
    //                     Thêm tuỳ chọn
    //                 </Button>
    //             }
    //         >
    //             <Table
    //                 dataSource={optionalServices || []}
    //                 columns={optionColumns}
    //                 rowKey="id"
    //                 size="small"
    //                 pagination={false}
    //                 locale={{ emptyText: 'Chưa có tuỳ chọn nào' }}
    //             />
    //         </Card>

    //         {/* Optional Service Modal */}
    //         <Modal
    //             title={editingOption ? 'Chỉnh sửa tuỳ chọn' : 'Thêm tuỳ chọn mới'}
    //             open={modalOpen}
    //             onCancel={() => setModalOpen(false)}
    //             footer={null}
    //             width={600}
    //         >
    //             <Form
    //                 form={form}
    //                 layout="vertical"
    //                 onFinish={handleOptionSubmit}
    //             >
    //                 <Form.Item
    //                     label="Tên tuỳ chọn"
    //                     name="name"
    //                     rules={[{ required: true, message: 'Vui lòng nhập tên tuỳ chọn!' }]}
    //                 >
    //                     <Input placeholder="Nhập tên tuỳ chọn" />
    //                 </Form.Item>
    //                 <Form.Item
    //                     label="Giá (VNĐ)"
    //                     name="basePrice"
    //                     rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
    //                 >
    //                     <InputNumber
    //                         style={{ width: '100%' }}
    //                         formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
    //                         min={0}
    //                         step={1000}
    //                     />
    //                 </Form.Item>
    //                 <Form.Item
    //                     label="Mô tả"
    //                     name="description"
    //                 >
    //                     <TextArea
    //                         rows={3}
    //                         placeholder="Mô tả về tuỳ chọn..."
    //                     />
    //                 </Form.Item>
    //                 <Form.Item
    //                     label="Trạng thái"
    //                     name="status"
    //                     valuePropName="checked"
    //                     initialValue={true}
    //                 >
    //                     <Switch checkedChildren="Có sẵn" unCheckedChildren="Hết" />
    //                 </Form.Item>
    //                 <Form.Item>
    //                     <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
    //                         <Button onClick={() => setModalOpen(false)}>
    //                             Hủy
    //                         </Button>
    //                         <Button type="primary" htmlType="submit">
    //                             {editingOption ? 'Cập nhật' : 'Thêm mới'}
    //                         </Button>
    //                     </Space>
    //                 </Form.Item>
    //             </Form>
    //         </Modal>
    //     </>
    // );

}