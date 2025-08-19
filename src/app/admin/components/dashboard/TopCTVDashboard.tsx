
import { Avatar, Card, Select, Space } from "antd";

import {
    UserOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from "react";
import { TopCTV } from "@/type/dashboard/topCTV";
import { ViewState } from "@/type/other/viewState";
import { topCTVApi } from "@/api/dashboard/dashboard-api";


export default function TopCTVDashboard() {

    const [viewState, setViewState] = useState<ViewState>('weekly');
    const [topUser, setTopUser] = useState<TopCTV[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await topCTVApi(viewState);
            const dataArray = 'data' in response && Array.isArray(response.data) ? response.data : [];
            if (Array.isArray(dataArray)) {
                setTopUser(dataArray);
            } else {
                setTopUser([]);
            }
        };
        fetchData().catch(console.error);
    }, [viewState]);

    if (topUser.length === 0) {
        return (
            <Card title="Top 3 Cộng tác viên" style={{ height: '100%' }}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    Không có dữ liệu
                </div>
            </Card>
        );
    }

    return (
        <Card title="Top 3 Cộng tác viên"
            style={{ height: '100%' }}
            extra={
                <Space>
                    <Select
                        value={viewState}
                        style={{ width: 120 }}
                        options={[
                            { value: 'weekly', label: 'Tuần' },
                            { value: 'monthly', label: 'Tháng' },
                            { value: 'annual', label: 'Năm' },
                        ]}
                        onChange={setViewState}
                    />
                </Space>
            }
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {topUser.slice(0, 3).map((user, index) => (
                    <div
                        key={user._id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                            backgroundColor: index === 0 ? '#fff7e6' : index === 1 ? '#f6ffed' : '#f0f5ff',
                            borderRadius: '8px',
                            border: `2px solid ${index === 0 ? '#ffd666' : index === 1 ? '#b7eb8f' : '#91d5ff'}`,
                        }}
                    >
                        <div
                            style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: index === 0 ? '#faad14' : index === 1 ? '#52c41a' : '#1890ff',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                marginRight: '12px',
                            }}
                        >
                            {index + 1}
                        </div>
                        <Avatar
                            size={40}
                            icon={<UserOutlined />}
                            style={{ marginRight: '12px' }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                                {user.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                                {user.totalOrders} đơn hàng
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                fontWeight: 'bold',
                                color: '#52c41a',
                                fontSize: '14px'
                            }}>
                                {Number(user.totalRevenue).toLocaleString()} VNĐ
                            </div>
                            <div style={{ fontSize: '11px', color: '#999' }}>
                                Doanh thu
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}