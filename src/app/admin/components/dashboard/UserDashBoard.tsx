
import { userDashboardApi } from "@/api/dashboard/dashboard-api";
import { DashboardUser } from "@/type/dashboard/dasboardUser";
import { ViewState } from "@/type/other/viewState";
import { Card, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function UserDashBoard() {
    const [viewState, setViewUserState] = useState<ViewState>('weekly');
    const [dashboardUser, setDashboardUser] = useState<DashboardUser[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await userDashboardApi(viewState);
            if (response) {
                setDashboardUser(response);
            }
        };
        fetchData().catch(console.error);
    }, [viewState]);

    return (
        <Card title="Khách hàng"
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
                        onChange={setViewUserState}
                    />
                </Space>
            }
        >
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dashboardUser} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="oldUserCount" stackId="a" fill="#1890ff" name="Khách hàng cũ" />
                    <Bar dataKey="newUserCount" stackId="a" name="Khách hàng mới" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}