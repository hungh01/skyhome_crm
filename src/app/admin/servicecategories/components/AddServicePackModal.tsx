'use client';

import { useState, useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Button,
    Row,
    Col,
} from 'antd';
import { Service, ServiceRequest } from '@/type/services/services';
import { createService, updateService } from '@/api/service/service-api';
import { isDetailResponse } from '@/utils/response-handler';
import { notify } from '@/components/Notification';
import { useAuth } from '@/storage/auth-context';

interface FormValues {
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    numberOfCollaborators: number;
    image: string;
}

interface AddServicePackModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: (servicePack: Service) => void;
    serviceToEdit?: Service | null;
    serviceCategoryId: string;
}

export default function AddServicePackModal({
    visible,
    onCancel,
    onSuccess,
    serviceToEdit,
    serviceCategoryId,
}: AddServicePackModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    //const [imagePreview, setImagePreview] = useState<string>('');

    // Populate form when editing service
    useEffect(() => {
        if (visible && serviceToEdit) {
            // Delay setting form values to ensure modal is fully rendered
            setTimeout(() => {
                form.setFieldsValue({
                    name: serviceToEdit.name,
                    description: serviceToEdit.description,
                    price: serviceToEdit.price,
                    durationMinutes: serviceToEdit.durationMinutes,
                    numberOfCollaborators: serviceToEdit.numberOfCollaborators,
                });
            }, 100);
        } else if (visible && !serviceToEdit) {
            // Reset form for new service with default values
            form.resetFields();
            form.setFieldsValue({
                durationMinutes: 60,
                numberOfCollaborators: 1,
            });
        }
    }, [visible, serviceToEdit, form]);

    // Calculate price based on formula: 1 hour * collaborators * 100000

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

            if (serviceToEdit) {
                // Update existing service
                const updateData: Partial<ServiceRequest> = {
                    name: values.name,
                    description: values.description || '',
                    thumbnail: "", // Temporarily disabled
                    price: values.price || 0,
                    durationMinutes: values.durationMinutes || 60,
                    numberOfCollaborators: values.numberOfCollaborators || 1,
                };

                const response = await updateService(serviceToEdit._id, updateData);

                if (isDetailResponse(response)) {
                    const updatedService = response.data;
                    onSuccess(updatedService);

                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Cập nhật dịch vụ thành công!',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Có lỗi xảy ra khi cập nhật dịch vụ!',
                    });
                }
            } else {
                // Create new service
                const createData: Partial<ServiceRequest> = {
                    name: values.name,
                    description: values.description || '',
                    thumbnail: "", // Temporarily disabled
                    numberOfCollaborators: values.numberOfCollaborators || 1,
                    durationMinutes: values.durationMinutes || 60,
                    price: values.price || 0,
                    createdBy: user?._id || '',
                    isActive: true,
                    categoryId: serviceCategoryId,
                };

                const response = await createService(createData);

                if (isDetailResponse(response)) {
                    const newService = response.data;
                    onSuccess(newService);

                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Tạo dịch vụ thành công!',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Có lỗi xảy ra khi tạo dịch vụ!',
                    });
                }
            }

            form.resetFields();
            onCancel();
        } catch (error) {
            console.error('Error saving service:', error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: `Có lỗi xảy ra khi ${serviceToEdit ? 'cập nhật' : 'tạo'} dịch vụ!`,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        // setImagePreview(''); // Temporarily disabled
        onCancel();
    };

    return (
        <Modal
            title={serviceToEdit ? "Chỉnh sửa gói dịch vụ" : "Thêm gói dịch vụ mới"}
            open={visible}
            onCancel={loading ? undefined : handleCancel}
            footer={null}
            width={600}
            destroyOnHidden
            maskClosable={!loading}
            closable={!loading}
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
                    rules={[
                        { required: true, message: 'Vui lòng nhập mô tả!' },
                    ]}
                >
                    <Input.TextArea
                        rows={2}
                        placeholder="Nhập mô tả gói dịch vụ"
                        maxLength={15}
                        showCount
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
                            rules={[
                                { required: true, message: 'Vui lòng nhập giá!' },
                                { type: 'number', min: 1000, message: 'Giá phải ít nhất 1,000 VNĐ!' }
                            ]}
                        >
                            <InputNumber
                                min={1000}
                                step={1000}
                                style={{ width: '100%' }}
                                placeholder="10,000"
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value: string | undefined) => {
                                    const parsed = value?.replace(/\$\s?|(,*)/g, '') || '0';
                                    return Number(parsed) as 1000;
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Thời gian (phút)"
                            name="durationMinutes"
                            rules={[
                                { required: true, message: 'Vui lòng nhập thời gian!' },
                                { type: 'number', min: 15, message: 'Thời gian phải ít nhất 15 phút!' },
                                { type: 'number', max: 480, message: 'Thời gian không được vượt quá 8 giờ (480 phút)!' }
                            ]}
                            initialValue={60}
                        >
                            <InputNumber
                                min={15}
                                max={480}
                                step={15}
                                style={{ width: '100%' }}
                                placeholder="60"
                                addonAfter="phút"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Số cộng tác viên"
                            name="numberOfCollaborators"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số cộng tác viên!' },
                                { type: 'number', min: 1, message: 'Phải có ít nhất 1 cộng tác viên!' },
                                { type: 'number', max: 10, message: 'Không được vượt quá 10 cộng tác viên!' }
                            ]}
                            initialValue={1}
                        >
                            <InputNumber
                                min={1}
                                max={10}
                                style={{ width: '100%' }}
                                placeholder="1"
                                addonAfter="người"
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
