
import { monthdashboardUser, sixmonthdashboardUser, weekdashboardUser } from "@/api/dashboard/mock-user-dashboard";
import { DashboardUser } from "@/type/dashboard/dasboardUser";
import { Card, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function UserDashBoard() {
    const [viewState, setViewUserState] = useState<'weak' | 'month' | 'sixmonth'>('weak');
    const [dashboardUser, setDashboardUser] = useState<DashboardUser[]>([]);

    useEffect(() => {
        switch (viewState) {
            case 'weak':
                setDashboardUser(weekdashboardUser);
                break;
            case 'month':
                setDashboardUser(monthdashboardUser);
                break;
            case 'sixmonth':
                setDashboardUser(sixmonthdashboardUser); // Assuming year data is similar to month for now
                break;
            default:
                setDashboardUser([]);
        }
    }, [viewState]);

    return (
        <Card title="Khách hàng"
            extra={
                <Space>
                    <Select
                        value={viewState}
                        style={{ width: 120 }}
                        options={[
                            { value: 'weak', label: '7 ngày' },
                            { value: 'month', label: '1 tháng' },
                            { value: 'sixmonth', label: '6 tháng' },
                        ]}
                        onChange={setViewUserState}
                    />
                </Space>
            }
        >
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={dashboardUser} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" stackId="a" fill="#1890ff" name="Khách hàng cũ" />
                    <Bar dataKey="upperValue" stackId="a" name="Khách hàng mới" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}