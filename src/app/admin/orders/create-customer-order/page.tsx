'use client';

import {
    Form,
    Input,
    Button,
    Card,
    Typography,
    Row,
    Col,
    Select,
    message
} from 'antd';
import {
    UserOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;
const { Option } = Select;

interface CustomerOrderFormData {
    name: string;
    address: string;
    service: string;
    paymentMethod: string;
    partner: string;
    note: string;
}

export default function CreateCustomerOrderPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: CustomerOrderFormData) => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Form values:', values);
            message.success('Tạo đơn hàng thành công!');
            form.resetFields();
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại!' + error);
        } finally {
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: unknown) => {
        console.log('Failed:', errorInfo);
        message.error('Vui lòng kiểm tra lại thông tin!');
    };

    return (
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
            <Row justify="center">
                <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                    <Card
                        style={{
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            borderRadius: '8px'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <Title level={2} style={{ color: '#1890ff', marginBottom: '8px' }}>
                                Tạo đơn hàng cho cá nhân
                            </Title>
                            <Typography.Text type="secondary">
                                Vui lòng điền đầy đủ thông tin đơn hàng
                            </Typography.Text>
                        </div>

                        <Form
                            form={form}
                            name="customerOrder"
                            layout="vertical"
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            size="large"
                        >
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Tên khách hàng"
                                        name="name"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập tên khách hàng!' },
                                            { min: 2, message: 'Tên khách hàng phải có ít nhất 2 ký tự!' },
                                            { max: 50, message: 'Tên khách hàng không được quá 50 ký tự!' }
                                        ]}
                                    >
                                        <Input
                                            prefix={<UserOutlined />}
                                            placeholder="Nhập tên khách hàng"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label="Địa chỉ thực hiện dịch vụ"
                                        name="address"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập địa chỉ!' },
                                            { min: 10, message: 'Địa chỉ phải có ít nhất 10 ký tự!' }
                                        ]}
                                    >
                                        <Input.TextArea
                                            rows={3}
                                            placeholder="Nhập địa chỉ đầy đủ nơi thực hiện dịch vụ"
                                            style={{ resize: 'none' }}
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Dịch vụ"
                                        name="service"
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn dịch vụ!' }
                                        ]}
                                    >
                                        <Select placeholder="Chọn dịch vụ cần thực hiện">
                                            <Option value="Dọn dẹp nhà cửa">Dọn dẹp nhà cửa</Option>
                                            <Option value="Nấu ăn">Nấu ăn</Option>
                                            <Option value="Trông trẻ">Trông trẻ</Option>
                                            <Option value="Chăm sóc người già">Chăm sóc người già</Option>
                                            <Option value="Giặt ủi">Giặt ủi</Option>
                                            <Option value="Chăm sóc vườn">Chăm sóc vườn</Option>
                                            <Option value="Bảo vệ">Bảo vệ</Option>
                                            <Option value="Sửa chữa điện nước">Sửa chữa điện nước</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Phương thức thanh toán"
                                        name="paymentMethod"
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn phương thức thanh toán!' }
                                        ]}
                                    >
                                        <Select placeholder="Chọn phương thức thanh toán">
                                            <Option value="cash">Tiền mặt</Option>
                                            <Option value="bank">Chuyển khoản ngân hàng</Option>
                                            <Option value="ewallet">Ví điện tử</Option>
                                            <Option value="credit">Thẻ tín dụng</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label="Cộng tác viên"
                                        name="partner"
                                        rules={[
                                            { required: true, message: 'Vui lòng chọn cộng tác viên!' }
                                        ]}
                                    >
                                        <Select placeholder="Chọn cộng tác viên thực hiện">
                                            <Option value="ctv001">Nguyễn Văn A - CTV001</Option>
                                            <Option value="ctv002">Trần Thị B - CTV002</Option>
                                            <Option value="ctv003">Lê Văn C - CTV003</Option>
                                            <Option value="ctv004">Phạm Thị D - CTV004</Option>
                                            <Option value="ctv005">Hoàng Văn E - CTV005</Option>
                                            <Option value="auto">Tự động phân công</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={24}>
                                    <Form.Item
                                        label="Ghi chú"
                                        name="note"
                                        rules={[
                                            { max: 500, message: 'Ghi chú không được quá 500 ký tự!' }
                                        ]}
                                    >
                                        <Input.TextArea
                                            rows={4}
                                            placeholder="Nhập ghi chú, yêu cầu đặc biệt hoặc lưu ý cho cộng tác viên..."
                                            style={{ resize: 'none' }}
                                            showCount
                                            maxLength={500}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item style={{ marginTop: '24px', marginBottom: 0 }}>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Button
                                            size="large"
                                            block
                                            onClick={() => form.resetFields()}
                                        >
                                            Làm mới
                                        </Button>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            size="large"
                                            block
                                            loading={loading}
                                        >
                                            {loading ? 'Đang tạo đơn hàng...' : 'Tạo đơn hàng'}
                                        </Button>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}