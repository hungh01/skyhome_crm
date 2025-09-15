import { Button, Typography } from "antd";


const { Title } = Typography;
import { PlusOutlined } from "@ant-design/icons";
import { useBannerContext } from "../provider/banner-provider";

export default function Header() {

    const { handleCreateBanner } = useBannerContext();
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                    Quản lý Banner
                </Title>
                <p style={{ color: '#666', margin: '8px 0 0 0' }}>
                    Quản lý các banner quảng cáo, liên kết và hình ảnh hiển thị trên ứng dụng
                </p>
            </div>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleCreateBanner()}
            >
                Tạo Banner mới
            </Button>
        </div>

    );
}