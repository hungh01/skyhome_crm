import { Col, Input, Row, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { typeOptions } from "../constants/typeOption";
import { statusOptions } from "../constants/statusOptions";
import { useNewsContext } from "../provider/news-provider";


export default function Filter() {

    const { search, setSearch, category, setCategory, status, setStatus } = useNewsContext();
    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            <Col xs={24} sm={12} md={8}>
                <Input
                    placeholder="Tìm kiếm tin tức..."
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    allowClear
                />
            </Col>

            <Col xs={24} sm={12} md={6}>
                <Select
                    placeholder="Lọc theo loại"
                    value={category}
                    onChange={setCategory}
                    allowClear
                    style={{ width: '100%' }}
                >
                    {typeOptions.map(option => (
                        <Select.Option key={option} value={option}>
                            {option}
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
                    {statusOptions.map(option => (
                        <Select.Option key={option} value={option}>
                            {option}
                        </Select.Option>
                    ))}
                </Select>
            </Col>
        </Row>
    );
}