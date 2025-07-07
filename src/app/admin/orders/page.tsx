'use client';

import { Card, Select, Input, Button, Typography, Space, Row, Col, DatePicker } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function OrdersPage() {
    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>
                    Danh sách đơn hàng
                </Title>
            </div>

            {/* Filter Section */}
            <Card style={{ marginBottom: 24 }}>
                <Row gutter={[16, 16]} align="top">
                    <Col xs={24} sm={12} md={8} lg={4}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>Trạng thái:</Text>
                            <Select
                                placeholder="Chọn trạng thái"
                                style={{ width: '100%' }}
                                allowClear
                            >
                                <Option value="">Tất cả</Option>
                                <Option value="pending">Chờ xử lý</Option>
                                <Option value="processing">Đang xử lý</Option>
                                <Option value="completed">Hoàn thành</Option>
                                <Option value="cancelled">Đã hủy</Option>
                            </Select>
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>Thời gian:</Text>
                            <RangePicker
                                style={{ width: '100%' }}
                                placeholder={['Từ ngày', 'Đến ngày']}
                                format="DD/MM/YYYY"
                            />
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>Dịch vụ:</Text>
                            <Select
                                placeholder="Chọn dịch vụ"
                                style={{ width: '100%' }}
                                allowClear
                            >
                                <Option value="">Tất cả</Option>
                                <Option value="cleaning">Dọn dẹp nhà cửa</Option>
                                <Option value="cooking">Nấu ăn</Option>
                                <Option value="babysitting">Trông trẻ</Option>
                                <Option value="eldercare">Chăm sóc người già</Option>
                                <Option value="laundry">Giặt ủi</Option>
                                <Option value="gardening">Chăm sóc vườn</Option>
                            </Select>
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={4}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>Thanh toán:</Text>
                            <Select
                                placeholder="Phương thức"
                                style={{ width: '100%' }}
                                allowClear
                            >
                                <Option value="">Tất cả</Option>
                                <Option value="cash">Tiền mặt</Option>
                                <Option value="bank_transfer">Chuyển khoản</Option>
                                <Option value="e_wallet">Ví điện tử</Option>
                                <Option value="credit_card">Thẻ tín dụng</Option>
                            </Select>
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>Địa chỉ:</Text>
                            <Input
                                placeholder="Tìm theo địa chỉ"
                                allowClear
                            />
                        </Space>
                    </Col>
                </Row>
                <Row style={{ marginTop: 16 }}>
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Text>Tìm kiếm:</Text>
                            <Input
                                placeholder="Tìm theo tên hoặc mã đơn"
                                prefix={<SearchOutlined />}
                                allowClear
                            />
                        </Space>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6} style={{ display: 'flex', alignItems: 'end' }}>
                        <Space style={{ marginTop: 24 }}>
                            <Button
                                type="primary"
                                icon={<FilterOutlined />}
                            >
                                Lọc
                            </Button>
                            <Button>
                                Xóa bộ lọc
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Content */}
            <Card>
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                        Danh sách đơn hàng sẽ được hiển thị ở đây.
                    </Text>
                    <br />
                    <Text type="secondary">
                        Chức năng này đang được phát triển.
                    </Text>
                </div>
            </Card>
        </div>
    );
}