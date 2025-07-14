'use client';

import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Radio,
    Upload,
    Button,
    Space,
    Typography,
    Row,
    Col,
    message,
    UploadFile
} from 'antd';
import {
    UploadOutlined,
    DollarOutlined,
} from '@ant-design/icons';
import { WalletTransaction } from '@/type/wallet';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface CreateTransactionModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (transaction: Omit<WalletTransaction, 'id'>) => void;
    loading?: boolean;
}

const categoryOptions = [
    { value: 'equipment', label: 'Thiết bị' },
    { value: 'maintenance', label: 'Bảo trì' },
    { value: 'purchase', label: 'Mua sắm' },
    { value: 'repair', label: 'Sửa chữa' },
    { value: 'rental', label: 'Cho thuê' },
    { value: 'other', label: 'Khác' }
];

const paymentMethodOptions = [
    { value: 'cash', label: 'Tiền mặt' },
    { value: 'bank_transfer', label: 'Chuyển khoản' },
    { value: 'credit_card', label: 'Thẻ tín dụng' },
    { value: 'other', label: 'Khác' }
];

export default function CreateTransactionModal({
    visible,
    onCancel,
    onSubmit,
    loading = false
}: CreateTransactionModalProps) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const transaction: Omit<WalletTransaction, 'id'> = {
                type: values.type,
                category: values.category,
                amount: values.amount,
                description: values.description,
                equipmentName: values.equipmentName,
                equipmentId: values.equipmentId,
                date: values.date.toISOString(),
                status: 'pending',
                createdBy: 'Current User', // Replace with actual user
                paymentMethod: values.paymentMethod,
                reference: values.reference,
                notes: values.notes,
                attachments: fileList.map(file => file.name || file.fileName || '')
            };

            onSubmit(transaction);
            form.resetFields();
            setFileList([]);
            message.success('Tạo giao dịch thành công!');
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFileList([]);
        onCancel();
    };

    const uploadProps = {
        fileList,
        onChange: ({ fileList: newFileList }: { fileList: UploadFile[] }) => setFileList(newFileList),
        beforeUpload: () => false, // Prevent auto upload
        multiple: true,
    };

    return (
        <Modal
            title={
                <Space>
                    <DollarOutlined style={{ color: '#1890ff' }} />
                    <span>Thêm giao dịch mới</span>
                </Space>
            }
            open={visible}
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                >
                    Tạo giao dịch
                </Button>
            ]}
            width={800}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    type: 'expense',
                    category: 'equipment',
                    paymentMethod: 'bank_transfer',
                    date: dayjs()
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="type"
                            label="Loại giao dịch"
                            rules={[{ required: true, message: 'Vui lòng chọn loại giao dịch!' }]}
                        >
                            <Radio.Group>
                                <Radio value="income">Thu nhập</Radio>
                                <Radio value="expense">Chi tiêu</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="category"
                            label="Danh mục"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                        >
                            <Select placeholder="Chọn danh mục">
                                {categoryOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="equipmentName"
                            label="Tên thiết bị"
                            rules={[{ required: true, message: 'Vui lòng nhập tên thiết bị!' }]}
                        >
                            <Input placeholder="Nhập tên thiết bị" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="equipmentId"
                            label="Mã thiết bị"
                        >
                            <Input placeholder="Nhập mã thiết bị (tùy chọn)" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="description"
                    label="Mô tả giao dịch"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                >
                    <TextArea
                        rows={3}
                        placeholder="Mô tả chi tiết về giao dịch"
                        showCount
                        maxLength={500}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="amount"
                            label="Số tiền (VNĐ)"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số tiền!' },
                                { type: 'number', min: 0, message: 'Số tiền phải lớn hơn 0!' }
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                placeholder="Nhập số tiền"
                                addonAfter="VNĐ"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="date"
                            label="Ngày giao dịch"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày giao dịch"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="paymentMethod"
                            label="Phương thức thanh toán"
                            rules={[{ required: true, message: 'Vui lòng chọn phương thức!' }]}
                        >
                            <Select placeholder="Chọn phương thức thanh toán">
                                {paymentMethodOptions.map(option => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="reference"
                            label="Mã tham chiếu"
                        >
                            <Input placeholder="Mã hóa đơn, chứng từ (tùy chọn)" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="notes"
                    label="Ghi chú thêm"
                >
                    <TextArea
                        rows={2}
                        placeholder="Ghi chú thêm về giao dịch (tùy chọn)"
                        showCount
                        maxLength={200}
                    />
                </Form.Item>

                <Form.Item
                    label="Tệp đính kèm"
                >
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>
                            Chọn tệp đính kèm
                        </Button>
                    </Upload>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: '4px' }}>
                        Hỗ trợ: PDF, DOC, DOCX, JPG, PNG. Tối đa 10MB/tệp
                    </Text>
                </Form.Item>
            </Form>
        </Modal>
    );
}
