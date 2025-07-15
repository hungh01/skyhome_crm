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
        outerRadius?: number;
        percent?: number;
        index?: number;

        name?: string;
    }

    // Custom label function for pie chart
    const renderCustomizedLabel = (entry: PieLabelEntry) => {
        const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, percent = 0 } = entry;

        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 30; // Position labels outside the pie
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // Only show percentage if it's greater than 2% to avoid cluttering
        if (percent < 0.02) {
            return null;
        }

        return (
            <text
                x={x}
                y={y}
                fill="#333"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={11}
                fontWeight="500"
            >
                {`${(percent * 100).toFixed(1)}%`}
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
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={serviceOrdersData}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={450}
                        label={renderCustomizedLabel}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="total"
                        nameKey="name"
                        animationDuration={800}
                    >
                        {serviceOrdersData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number, name: string) => {
                            const total = serviceOrdersData.reduce((sum, item) => sum + item.total, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                            return [
                                `${value} đơn hàng (${percentage}%)`,
                                name
                            ];
                        }}
                        labelFormatter={(label: string) => `Dịch vụ: ${label}`}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px',
                            fontSize: '12px'
                        }}
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