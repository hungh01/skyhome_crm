'use client';

import { Button, Card, Col, DatePicker, Input, Row, Select, Space, Typography } from "antd";
import dayjs from "dayjs";

import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { usePromotionContext } from "../provider/promotions-provider";
import { PromotionStatus } from "../constants/promotion-status";
import { PromotionTypeOptions } from "../constants/promotiom-type";

const { Title } = Typography;

export default function Header() {

    const { searchInput, handleSearchChange, status, setStatus, type, setType, dateRange, setDateRange, setShowCreateModal } = usePromotionContext();

    return (
        <Card style={{ marginBottom: 16, borderRadius: 12 }}>
            <Row gutter={[16, 12]} align="middle" justify="space-between">
                <Col xs={24} sm={12} md={8} style={{ textAlign: 'left' }}>
                    <Title level={2} style={{ margin: 0 }}>
                        Chương trình khuyến mãi
                    </Title>

                    <Button
                        type="primary"
                        style={{ marginTop: 8 }}
                        icon={<PlusOutlined />}
                        onClick={() => setShowCreateModal(true)}
                    >
                        Thêm mới
                    </Button>
                </Col>
                <Col xs={24} sm={12} md={16}>
                    <Space wrap style={{ width: '100%', justifyContent: 'flex-end' }}>
                        <Input
                            allowClear
                            prefix={<SearchOutlined />}
                            placeholder="Tìm kiếm theo mã khuyến mãi"
                            style={{ width: 200, borderRadius: 8 }}
                            value={searchInput}
                            onChange={e => handleSearchChange(e.target.value)}
                        />
                        <Select
                            allowClear
                            placeholder="Trạng thái"
                            style={{ width: 140 }}
                            value={status}
                            onChange={e => setStatus(e)}
                            options={PromotionStatus}
                        />
                        <Select
                            allowClear
                            placeholder="Hình thức"
                            style={{ width: 120 }}
                            value={type}
                            onChange={e => setType(e)}
                            options={PromotionTypeOptions}
                        />
                        <DatePicker.RangePicker
                            allowClear
                            format="YYYY-MM-DD"
                            style={{ width: 240 }}
                            placeholder={["Ngày tạo từ", "Đến"]}
                            value={dateRange && (dateRange[0] || dateRange[1])
                                ? [dateRange[0] ? dayjs(dateRange[0]) : null, dateRange[1] ? dayjs(dateRange[1]) : null]
                                : null}
                            onChange={(dates, dateStrings) => {
                                if (!dateStrings[0] && !dateStrings[1]) {
                                    setDateRange(null);
                                } else {
                                    setDateRange([
                                        dateStrings[0] || null,
                                        dateStrings[1] || null
                                    ]);
                                }
                            }}
                        />
                    </Space>
                </Col>
            </Row>
        </Card>
    );
}