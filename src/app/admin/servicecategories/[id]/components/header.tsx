import { Button, Card, Col, Row } from "antd";

import { ArrowLeftOutlined, ToolOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { Typography } from "antd";

const { Title, Text } = Typography;

export default function Header() {
    const router = useRouter();
    return (
        <Row gutter={24}>
            <Col span={24}>
                <Card style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div>
                                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                                    <ToolOutlined /> Chi tiết danh mục dịch vụ
                                </Title>
                            </div>
                        </div>
                        <Text type="secondary">
                            Quản lý thông tin chi tiết và lựa chọn của dịch vụ
                        </Text>
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                        >
                            Quay lại
                        </Button>
                    </div>
                </Card>
            </Col>
        </Row>
    );
}