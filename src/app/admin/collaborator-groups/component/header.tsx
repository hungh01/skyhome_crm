import { Button, Card } from "antd";
import { useGroupCollaboratorContext } from "../provider/collaborator-group-provider";


export function Header() {
    const { setOpenCreateGroupModal } = useGroupCollaboratorContext();
    return (
        <Card style={{ marginBottom: 16, borderRadius: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                    <h1 style={{ margin: 0 }}>
                        Quản lý nhóm
                    </h1>
                    <p style={{ color: 'gray', fontSize: '12px', margin: 0 }}>
                        Quản lý và theo dõi tất cả các nhóm, cộng tác viên trong hệ thống
                    </p>
                </div>
                <Button type="primary"
                    onClick={() => setOpenCreateGroupModal(true)}
                >+ Thêm nhóm</Button>
            </div>
        </Card>
    );
}