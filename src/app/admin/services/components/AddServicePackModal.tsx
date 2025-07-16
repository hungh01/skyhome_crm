'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Button,
    Row,
    Col,
    message,
    Upload,
    Image,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { ServicePack } from '@/type/services/service-pack';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';

interface FormValues {
    name: string;
    description: string;
    price: number;
    durationTime: number;
    numberOfPeople: number;
    image: string;
}

interface AddServicePackModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: (servicePack: ServicePack) => void;
}

export default function AddServicePackModal({
    visible,
    onCancel,
    onSuccess,
}: AddServicePackModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');

    // Calculate price based on formula: 1 hour * people * 100000
    const calculatePrice = useCallback(() => {
        const numberOfPeople = form.getFieldValue('numberOfPeople') || 1;
        const durationTime = form.getFieldValue('durationTime') || 60;
        const hours = durationTime / 60;
        const calculatedPrice = hours * numberOfPeople * 100000;
        form.setFieldsValue({ price: calculatedPrice });
    }, [form]);

    const handleImageChange = (info: UploadChangeParam<UploadFile>) => {
        const file = info.file.originFileObj;
        if (file && file.type && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (values: FormValues) => {
        try {
            setLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newServicePack: ServicePack = {
                id: Date.now().toString(),
                name: values.name,
                numberOfPeople: values.numberOfPeople || 1,
                durationTime: values.durationTime,
                description: values.description,
                image: imagePreview || "", // Use the preview image or empty string
                price: values.price,
                status: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            onSuccess(newServicePack);
            message.success('Thêm gói dịch vụ thành công!');
            form.resetFields();
            setImagePreview('');
            onCancel();
        } catch {
            message.error('Có lỗi xảy ra khi thêm gói dịch vụ!');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setImagePreview('');
        onCancel();
    };

    // Calculate initial price when modal opens
    useEffect(() => {
        if (visible) {
            // Set initial values and calculate price
            form.setFieldsValue({
                numberOfPeople: 1,
                durationTime: 60
            });
            calculatePrice();
        }
    }, [visible, form, calculatePrice]);

    return (
        <Modal
            title="Thêm gói dịch vụ mới"
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >

                <Form.Item
                    label="Tên gói dịch vụ"
                    name="name"
                    rules={[{ required: true, message: 'Vui lòng nhập tên gói dịch vụ!' }]}
                >
                    <Input placeholder="Nhập tên gói dịch vụ" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Nhập mô tả gói dịch vụ"
                    />
                </Form.Item>

                <Form.Item
                    label="Ảnh dịch vụ"
                    name="image"
                    rules={[{ required: true, message: 'Vui lòng chọn ảnh!' }]}
                >
                    <div>
                        <Upload
                            accept="image/*"
                            beforeUpload={() => false}
                            onChange={handleImageChange}
                            showUploadList={false}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                        {imagePreview && (
                            <div style={{ marginTop: 16, textAlign: 'center' }}>
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={120}
                                    height={120}
                                    style={{
                                        objectFit: 'cover',
                                        border: '1px solid #d9d9d9',
                                        borderRadius: 8
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Giá (VNĐ)"
                            name="price"
                            rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="0"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                readOnly
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Thời gian (phút)"
                            name="durationTime"
                            rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
                            initialValue={60}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                placeholder="60"
                                onChange={calculatePrice}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Số người"
                            name="numberOfPeople"
                            initialValue={1}
                        >
                            <InputNumber
                                min={1}
                                style={{ width: '100%' }}
                                placeholder="1"
                                onChange={calculatePrice}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button
                        onClick={handleCancel}
                        style={{ marginRight: 8 }}
                        disabled={loading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        Thêm gói dịch vụ
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
