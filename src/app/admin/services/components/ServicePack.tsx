import { ServicePack } from "@/type/services/service-pack";
import { Card, Typography, Space, Button, Image } from "antd";
import { useState } from "react";
import { InputNumber, Form, Input, message } from "antd";


const { Title } = Typography;

interface ServicePackProps {
    servicePack: ServicePack;
}

export default function ServicePackComponent({ servicePack }: ServicePackProps) {
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    const handleEdit = () => {
        setEditing(true);
        form.setFieldsValue({
            description: servicePack.description,
            price: servicePack.price,
            durationTime: servicePack.durationTime,
        });
    };

    const handleCancel = () => {
        setEditing(false);
    };

    const handleSave = () => {
        // Here you would call an API or update parent state
        message.success("Lưu thành công!");
        setEditing(false);
    };

    return (
        <Card
            style={{
                width: '200px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #e8e8e8',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                padding: '24px 16px'
            }}
        >
            {editing ? (
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        name: servicePack.name,
                        price: servicePack.price,
                        durationTime: servicePack.durationTime,
                        description: servicePack.description,
                        image: servicePack.image
                    }}
                    onFinish={handleSave}
                >
                    <Form.Item label="Tên gói dịch vụ" name="name" rules={[{ required: true, message: 'Nhập tên gói dịch vụ' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Giá cơ bản" name="price" rules={[{ required: true, message: 'Nhập giá' }]}>
                        <InputNumber min={0} style={{ width: '100%' }} addonAfter="VNĐ" disabled={true} />
                    </Form.Item>
                    <Form.Item label="Thời gian (phút)" name="durationTime" rules={[{ required: true, message: 'Nhập thời gian' }]}>
                        <InputNumber min={1} style={{ width: '100%' }} addonAfter="phút" />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Nhập mô tả' }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Form.Item
                        label="Ảnh"
                        name="image"
                        rules={[{ required: true, message: 'Vui lòng chọn ảnh' }]}
                    >
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                    const file = e.target.files && e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = (ev) => {
                                            form.setFieldsValue({ image: ev.target?.result });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                            {form.getFieldValue('image') && (
                                <div style={{ marginTop: 8 }}>
                                    <Image
                                        src={form.getFieldValue('image')}
                                        alt="Preview"
                                        width={80}
                                        height={80}
                                        style={{ objectFit: 'contain', border: '1px solid #eee', borderRadius: 4 }}
                                        preview={true}
                                        fallback="https://via.placeholder.com/80x80?text=No+Image"
                                    />
                                </div>
                            )}
                        </div>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" size="small">Lưu</Button>
                            <Button onClick={handleCancel} size="small">Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            ) : (
                <div>
                    {/* Header with service title */}
                    <div style={{
                        backgroundColor: '#fadb14',
                        color: '#333',
                        padding: '8px 0',
                        borderRadius: '8px 8px 0 0',
                        margin: '-24px -16px 16px -16px',
                        fontSize: '14px',
                        fontWeight: 600
                    }}>
                        Gói dịch vụ
                    </div>

                    {/* Service icon and air flow */}
                    <div style={{
                        backgroundColor: '#f8f9fa',
                        padding: '20px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        border: '1px solid #e8e8e8'
                    }}>
                        <div style={{ marginBottom: '8px' }}>
                            <Image src={servicePack.image} alt="Service Icon" />
                        </div>
                    </div>

                    {/* Service name */}
                    <Title level={5} style={{
                        margin: '8px 0',
                        color: '#333',
                        fontSize: '16px',
                        fontWeight: 600
                    }}>
                        {servicePack.name || 'Treo tường'}
                    </Title>

                    {/* Service price */}
                    <Title level={5} style={{
                        margin: '8px 0',
                        color: '#52c41a',
                        fontSize: '16px',
                        fontWeight: 600
                    }}>
                        {servicePack.price.toLocaleString('vi-VN', { currency: 'VND' })}
                    </Title>

                    {/* Edit button */}
                    <Button
                        size="small"
                        onClick={handleEdit}
                        style={{ marginTop: '8px' }}
                    >
                        Chỉnh sửa
                    </Button>
                </div>
            )}

            {/* CSS Animation for air flow */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); opacity: 0.7; }
                    50% { transform: translateY(-5px); opacity: 1; }
                }
            `}</style>
        </Card>
    );
}