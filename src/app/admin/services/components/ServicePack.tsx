import { ServicePack } from "@/type/services/service-pack";
import { Card, Col, Row, Typography, Space } from "antd";

import {
    ClockCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

interface ServicePackProps {
    servicePack: ServicePack;
}

import { useState } from "react";
import { InputNumber, Button, Form, Input, message } from "antd";

export default function ServicePackComponent({ servicePack }: ServicePackProps) {
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

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
        <Card style={{ height: 'fit-content', marginBottom: '8px' }}>
            <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px' }}>
                {editing ? (
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                            description: servicePack.description,
                            price: servicePack.price,
                            durationTime: servicePack.durationTime,
                        }}
                        onFinish={handleSave}
                    >
                        <Form.Item label="Tên gói dịch vụ" name="description" rules={[{ required: true, message: 'Nhập tên gói dịch vụ' }]}>
                            <Input />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={8}>
                                <Form.Item label="Giá cơ bản" name="price" rules={[{ required: true, message: 'Nhập giá' }]}>
                                    <InputNumber min={0} style={{ width: '100%' }} addonAfter="VNĐ" />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Thời gian (phút)" name="durationTime" rules={[{ required: true, message: 'Nhập thời gian' }]}>
                                    <InputNumber min={1} style={{ width: '100%' }} addonAfter="phút" />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">Lưu</Button>
                                <Button onClick={handleCancel}>Hủy</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                ) : (
                    <>
                        <Title level={5}>{servicePack.description}</Title>
                        <Row gutter={16}>
                            <Col span={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <Text type="secondary">Giá cơ bản</Text>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                                        {servicePack.price.toLocaleString()} VNĐ
                                    </div>
                                </div>
                            </Col>
                            <Col span={8}>
                                <div style={{ textAlign: 'center' }}>
                                    <Text type="secondary">Thời gian</Text>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                                        <ClockCircleOutlined /> {formatTime(servicePack.durationTime)}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Button style={{ marginTop: 16 }} onClick={handleEdit}>Chỉnh sửa</Button>
                    </>
                )}
            </div>
        </Card>
    );
}