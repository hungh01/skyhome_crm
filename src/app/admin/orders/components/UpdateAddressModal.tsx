'use client';

import { Modal, Form, Input, Button, Space, message } from 'antd';
import { useState } from 'react';

interface UpdateAddressModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: (address: string) => void;
    currentAddress: string;
}

export default function UpdateAddressModal({
    visible,
    onCancel,
    onSuccess,
    currentAddress
}: UpdateAddressModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: { address: string }) => {
        try {
            setLoading(true);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            onSuccess(values.address);
            message.success('Cập nhật địa chỉ thành công!');
            form.resetFields();
            onCancel();
        } catch {
            message.error('Có lỗi xảy ra khi cập nhật địa chỉ!');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Cập nhật địa chỉ đơn hàng"
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ address: currentAddress }}
            >
                <Form.Item
                    label="Địa chỉ mới"
                    name="address"
                    rules={[
                        { required: true, message: 'Vui lòng nhập địa chỉ!' },
                        { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự!' },
                        { max: 200, message: 'Địa chỉ không được quá 200 ký tự!' }
                    ]}
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Nhập địa chỉ chi tiết (số nhà, tên đường, phường/xã, quận/huyện, thành phố)"
                        style={{ resize: 'none' }}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            Cập nhật
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}
