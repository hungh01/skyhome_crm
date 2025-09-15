import { Button, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useNewsContext } from "../provider/news-provider";


const { Title } = Typography;

export default function Header() {

    const { setShowCreateModal } = useNewsContext();

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0 }}>
                Danh sách Tin tức
            </Title>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowCreateModal(true)}
            >
                Tạo tin tức mới
            </Button>
        </div>
    );
}