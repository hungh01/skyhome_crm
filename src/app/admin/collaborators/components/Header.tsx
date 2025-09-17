import { Button, Card } from "antd";
import { useCollaboratorContext } from "../provider/collaborator-provider";



export default function Header() {

    const { setOpen } = useCollaboratorContext();
    return (
        <Card style={{ marginBottom: 16, borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <h1 style={{ margin: 0 }}>
                        Quản lý cộng tác viên
                    </h1>
                    <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                        Quản lý và theo dõi cộng tác viên trong hệ thống, bao gồm thông tin cá nhân, lịch sử giao dịch và các hoạt động khác.
                    </p>
                </div>
                <Button type="primary" onClick={() => setOpen(true)}>+ Thêm CTV</Button>
            </div>
        </Card>
    );
}