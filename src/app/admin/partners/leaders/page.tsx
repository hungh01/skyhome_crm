
import Leaders from "./component/Leaders";
import { mockLeaders } from "@/api/user/mock-leader";

export default function LeadersPage() {
    const data = mockLeaders;
    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>👥 Quản lý trưởng nhóm</h2>
                <p style={{ color: 'gray' }}>
                    Quản lý và theo dõi tất cả các trưởng nhóm cộng tác viên trong hệ thống
                </p>
            </div>

            {/* Content */}
            <Leaders data={data} />
        </div>
    );
}