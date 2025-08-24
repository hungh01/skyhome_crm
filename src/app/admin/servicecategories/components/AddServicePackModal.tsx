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
} from 'antd';
import { Service } from '@/type/services/services';

interface FormValues {
    name: string;
    description: string;
    price: number;
    durationTime: number;
    numberOfCollaborators: number;
    image: string;
}

interface FormValues {
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    numberOfPeople: number;
    numberOfCollaborators: number;
    image: string;
}

interface AddServicePackModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: (servicePack: Service) => void;
    serviceToEdit?: Service | null;
}

export default function AddServicePackModal({
    visible,
    onCancel,
    onSuccess,
    serviceToEdit,
}: AddServicePackModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    //const [imagePreview, setImagePreview] = useState<string>('');

    // Calculate price based on formula: 1 hour * collaborators * 100000
    const calculatePrice = useCallback(() => {
        const numberOfCollaborators = form.getFieldValue('numberOfCollaborators') || 1;
        const durationTime = form.getFieldValue('durationTime') || 60;
        const hours = durationTime / 60;
        const calculatedPrice = hours * numberOfCollaborators * 100000;
        form.setFieldsValue({ price: calculatedPrice });
    }, [form]);

    // const handleImageChange = (info: UploadChangeParam<UploadFile>) => {
    //     const file = info.file.originFileObj;
    //     if (file && file.type && file.type.startsWith('image/')) {
    //         const reader = new FileReader();
    //         reader.onload = (e) => {
    //             const result = e.target?.result as string;
    //             setImagePreview(result);
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    const handleSubmit = async (values: FormValues) => {
        try {
            setLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const servicePackData: Service = {
                _id: serviceToEdit ? serviceToEdit._id : Date.now().toString(),
                name: values.name,
                numberOfCollaborators: values.numberOfCollaborators || 1,
                durationMinutes: values.durationTime,
                description: values.description,
                thumbnail: "", // Temporarily disabled - using empty string
                price: values.price,
                status: serviceToEdit ? serviceToEdit.status : true,
                equipments: serviceToEdit ? serviceToEdit.equipments : [],
                optionalServices: serviceToEdit ? serviceToEdit.optionalServices : [],
            };

            onSuccess(servicePackData);
            message.success(serviceToEdit ? 'Cập nhật gói dịch vụ thành công!' : 'Thêm gói dịch vụ thành công!');
            form.resetFields();
            // setImagePreview(''); // Temporarily disabled
            onCancel();
        } catch {
            message.error('Có lỗi xảy ra khi thêm gói dịch vụ!');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        // setImagePreview(''); // Temporarily disabled
        onCancel();
    };

    // Calculate initial price when modal opens
    useEffect(() => {
        if (visible) {
            if (serviceToEdit) {
                // Editing mode - load existing data
                form.setFieldsValue({
                    name: serviceToEdit.name,
                    description: serviceToEdit.description || '',
                    numberOfCollaborators: serviceToEdit.numberOfCollaborators || 1,
                    durationTime: serviceToEdit.durationMinutes || 60,
                    price: serviceToEdit.price || 0,
                });
                // Temporarily disabled image preview
                // setImagePreview(serviceToEdit.image || '');
                //setImagePreview('');
            } else {
                // Creating mode - set initial values and calculate price
                form.setFieldsValue({
                    numberOfCollaborators: 1,
                    durationTime: 60
                });
                calculatePrice();
            }
        }
    }, [visible, serviceToEdit, form, calculatePrice]);

    return (
        <Modal
            title={serviceToEdit ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}
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

                {/* Temporarily disabled image upload
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
                */}

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
                            label="Số cộng tác viên"
                            name="numberOfCollaborators"
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
                        {serviceToEdit ? "Cập nhật gói dịch vụ" : "Thêm gói dịch vụ"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}
