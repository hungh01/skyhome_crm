"use client";

import { useState } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    InputNumber,
    Row,
    Col,
    Space,
    Button,
    message
} from "antd";
import { Penalty } from "@/type/penalty";
import {
    mockViolationTypes,
    mockStaffLevels
} from "@/api/mock-penalties";
import dayjs, { Dayjs } from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

interface CreatePenaltyProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (penalty: Penalty) => void;
}

export default function CreatePenalty({ visible, onClose, onSubmit }: CreatePenaltyProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: {
        staffName: string;
        staffPhone: string;
        createdBy?: string;
        amount?: number;
        orderCode?: string;
        implementationDate?: Dayjs;
        startDate?: Dayjs;
        endDate?: Dayjs;
        violationType: string;
        content: string;
        note?: string;
    }) => {
        setLoading(true);
        try {
            // Generate new penalty data
            const newPenalty: Penalty = {
                id: Date.now().toString(),
                stt: 1, // This will be updated by parent component
                penaltyCode: `#${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                createdDate: dayjs().format('DD/MM/YYYY'),
                createdTime: dayjs().format('HH:mm:ss'),
                staffName: values.staffName,
                staffPhone: values.staffPhone,
                staffLevel: values.createdBy || 'Hệ thống',
                amount: values.amount || 0,
                orderCode: values.orderCode || `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                implementationDate: values.implementationDate
                    ? dayjs(values.implementationDate).format('DD/MM/YYYY')
                    : dayjs().format('DD/MM/YYYY'),
                implementationTime: values.implementationDate
                    ? dayjs(values.implementationDate).format('HH:mm:ss')
                    : dayjs().format('HH:mm:ss'),
                violationType: values.violationType,
                startDate: values.startDate
                    ? dayjs(values.startDate).format('DD/MM/YYYY')
                    : (values.violationType === 'Nhắc nhở' ? 'Không có' : dayjs().format('DD/MM/YYYY')),
                startTime: values.startDate
                    ? dayjs(values.startDate).format('HH:mm:ss')
                    : (values.violationType === 'Nhắc nhở' ? '' : dayjs().format('HH:mm:ss')),
                endDate: values.endDate
                    ? dayjs(values.endDate).format('DD/MM/YYYY')
                    : (values.violationType === 'Nhắc nhở' ? 'Không có' : dayjs().add(1, 'day').format('DD/MM/YYYY')),
                endTime: values.endDate
                    ? dayjs(values.endDate).format('HH:mm:ss')
                    : (values.violationType === 'Nhắc nhở' ? '' : dayjs().add(1, 'day').format('HH:mm:ss')),
                content: values.content,
                status: 'pending',
                note: values.note || 'Chờ xử lý'
            };

            onSubmit(newPenalty);
            message.success('Tạo lệnh phạt thành công!');
            form.resetFields();
            onClose();
        } catch {
            message.error('Có lỗi xảy ra khi tạo lệnh phạt!');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    const handleViolationTypeChange = (value: string) => {
        // Auto-fill fields based on violation type
        if (value === 'Nhắc nhở') {
            form.setFieldsValue({
                amount: 0,
                startDate: null,
                endDate: null
            });
        } else if (value === 'Phạt') {
            form.setFieldsValue({
                startDate: dayjs(),
                endDate: dayjs().add(1, 'day')
            });
        }
    };

    return (
        <Modal
            title={
                <div style={{ fontSize: 18, fontWeight: 600, color: '#8B5CF6' }}>
                    Tạo lệnh phạt mới
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={800}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    createdBy: 'Hệ thống',
                    violationType: 'Nhắc nhở',
                    implementationDate: dayjs()
                }}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Tên nhân viên"
                            name="staffName"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên nhân viên!' },
                                { min: 2, message: 'Tên phải có ít nhất 2 ký tự!' }
                            ]}
                        >
                            <Input placeholder="Nhập tên nhân viên" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="staffPhone"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                            ]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Loại vi phạm"
                            name="violationType"
                            rules={[{ required: true, message: 'Vui lòng chọn loại vi phạm!' }]}
                        >
                            <Select
                                placeholder="Chọn loại vi phạm"
                                onChange={handleViolationTypeChange}
                            >
                                {mockViolationTypes.map(type => (
                                    <Option key={type} value={type}>{type}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Người tạo"
                            name="createdBy"
                            rules={[{ required: true, message: 'Vui lòng chọn người tạo!' }]}
                        >
                            <Select placeholder="Chọn người tạo">
                                {mockStaffLevels.map(level => (
                                    <Option key={level} value={level}>{level}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Mã đơn hàng"
                            name="orderCode"
                            rules={[{ required: true, message: 'Vui lòng nhập mã đơn hàng!' }]}
                        >
                            <Input placeholder="Nhập mã đơn hàng" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Số tiền phạt (VNĐ)"
                            name="amount"
                            rules={[
                                { type: 'number', min: 0, message: 'Số tiền phải lớn hơn hoặc bằng 0!' }
                            ]}
                        >
                            <InputNumber
                                placeholder="Nhập số tiền phạt"
                                style={{ width: '100%' }}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            label="Ngày thực thi"
                            name="implementationDate"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày thực thi!' }]}
                        >
                            <DatePicker
                                placeholder="Chọn ngày thực thi"
                                style={{ width: '100%' }}
                                showTime
                                format="DD/MM/YYYY HH:mm"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Ngày bắt đầu"
                            name="startDate"
                            tooltip="Để trống nếu là nhắc nhở"
                        >
                            <DatePicker
                                placeholder="Chọn ngày bắt đầu"
                                style={{ width: '100%' }}
                                showTime
                                format="DD/MM/YYYY HH:mm"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Ngày kết thúc"
                            name="endDate"
                            tooltip="Để trống nếu là nhắc nhở"
                        >
                            <DatePicker
                                placeholder="Chọn ngày kết thúc"
                                style={{ width: '100%' }}
                                showTime
                                format="DD/MM/YYYY HH:mm"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Nội dung vi phạm"
                    name="content"
                    rules={[
                        { required: true, message: 'Vui lòng nhập nội dung vi phạm!' },
                        { min: 10, message: 'Nội dung phải có ít nhất 10 ký tự!' }
                    ]}
                >
                    <TextArea
                        placeholder="Mô tả chi tiết nội dung vi phạm..."
                        rows={4}
                        maxLength={500}
                        showCount
                    />
                </Form.Item>

                <Form.Item
                    label="Ghi chú"
                    name="note"
                >
                    <TextArea
                        placeholder="Ghi chú thêm (không bắt buộc)..."
                        rows={3}
                        maxLength={300}
                        showCount
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={handleCancel} disabled={loading}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{
                                backgroundColor: '#8B5CF6',
                                borderColor: '#8B5CF6'
                            }}
                        >
                            Tạo lệnh phạt
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
}
