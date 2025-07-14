import { monthServiceDashboard, weakServiceDashboard, yearServiceDashboard } from "@/api/dashboard/mock-serviceDashboard";
import { ServiceOrder } from "@/type/dashboard/serviceOrder";
import { Card, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function ServiceOrderDashboard() {

    const [viewState, setViewState] = useState<'weak' | 'month' | 'year'>('weak');
    const [serviceOrdersData, setServiceOrdersData] = useState<ServiceOrder[]>([]);

    // Colors for pie chart segments
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

    // Interface for pie chart label entry
    interface PieLabelEntry {
        cx?: number;
        cy?: number;
        midAngle?: number;
        innerRadius?: number;
        outerRadius?: number;
        percent?: number;
        index?: number;
        value?: number;
        name?: string;
    }

    // Custom label function for pie chart
    const renderCustomizedLabel = (entry: PieLabelEntry) => {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent } = entry;

        // Guard clause to ensure all required values are present
        if (!cx || !cy || midAngle === undefined || !innerRadius || !outerRadius || !percent) {
            return null;
        }

        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={12}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    useEffect(() => {
        switch (viewState) {
            case 'weak':
                setServiceOrdersData(weakServiceDashboard);
                break;
            case 'month':
                setServiceOrdersData(monthServiceDashboard);
                break;
            case 'year':
                setServiceOrdersData(yearServiceDashboard); break;
            default:
                setServiceOrdersData([]);
        }
    }, [viewState]);
    return (
        <Card title="Phân tích đăng ký dịch vụ"
            extra={
                <Space>
                    <Select
                        value={viewState}
                        style={{ width: 120 }}
                        options={[
                            { value: 'weak', label: 'Tuần' },
                            { value: 'month', label: 'Tháng' },
                            { value: 'year', label: 'Năm' },
                        ]}
                        onChange={setViewState}
                    />
                </Space>
            }
        >
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={serviceOrdersData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="total"
                        nameKey="name"
                    >
                        {serviceOrdersData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [value, 'Số đơn hàng']}
                        labelFormatter={(label: string) => `${label}`}
                    />
                    <Legend
                        verticalAlign="bottom"
                        align="center"
                        layout="vertical"
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
}