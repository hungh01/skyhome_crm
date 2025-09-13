import { Col, Input, Row, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useBannerContext } from "../provider/banner-provider";
import { bannerStatusOptions, bannerTypes } from "../constants/banner-filter";

export default function Filter() {

    const { search, setSearch,
        type, setType,
        status, setStatus
    } = useBannerContext();

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8}>
                <Input
                    placeholder="Tìm kiếm banner..."
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                />
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Select
                    placeholder="Lọc theo loại"
                    value={type}
                    onChange={setType}
                    allowClear
                    style={{ width: '100%' }}
                >
                    {bannerTypes.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
                <Select
                    placeholder="Lọc theo trạng thái"
                    value={status}
                    onChange={setStatus}
                    allowClear
                    style={{ width: '100%' }}
                >
                    {bannerStatusOptions.map(option => (
                        <Select.Option key={option.value} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
        </Row>
    );
}