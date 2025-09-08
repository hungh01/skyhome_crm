
import { serviceDashboardApi } from "@/api/dashboard/dashboard-api";
import { ServiceOrder } from "@/type/dashboard/serviceOrder";
import { ViewState } from "@/type/other/viewState";
import { Card, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function ServiceOrderDashboard() {

    const [viewState, setViewState] = useState<ViewState>('weekly');
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
    // Custom label function for pie chart
    const renderCustomizedLabel = (entry: PieLabelEntry) => {
        const { cx = 0, cy = 0, midAngle = 0, outerRadius = 0, percent = 0, name = '' } = entry;

        const RADIAN = Math.PI / 180;
        const radius = outerRadius + 30; // Position labels outside the pie
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        // Only show percentage if it's greater than 2% to avoid cluttering
        if (percent < 0.02) {
            return null;
        }

        // Find the revenue for this service
        const serviceData = serviceOrdersData.find(item => item.service === name);
        const revenue = serviceData?.totalRevenue || 0;

        return (
            <text
                x={x}
                y={y}
                fill="#333"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                fontSize={10}
                fontWeight="500"
            >
                <tspan x={x} dy="0">{`${(percent * 100).toFixed(1)}%`}</tspan>
                <tspan x={x} dy="12">{`${revenue.toLocaleString()} VNĐ`}</tspan>
            </text>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await serviceDashboardApi(viewState);
            const dataArray = 'data' in response && Array.isArray(response.data) ? response.data : [];
            if (Array.isArray(dataArray)) {
                setServiceOrdersData(dataArray);
            } else {
                setServiceOrdersData([]);
            }
        }
        fetchData().catch(console.error);
    }, [viewState]);

    return (
        <Card title="Phân tích đăng ký dịch vụ"
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
                        dataKey="orderCount"
                        nameKey="service"
                        animationDuration={800}
                    >
                        {serviceOrdersData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(orderCount: number, service: string) => {
                            const total = serviceOrdersData.reduce((sum, item) => sum + item.orderCount, 0);
                            const percentage = total > 0 ? ((orderCount / total) * 100).toFixed(1) : '0';
                            const serviceData = serviceOrdersData.find(item => item.service === service);
                            const revenue = serviceData?.totalRevenue || 0;
                            return [
                                `${orderCount} đơn hàng (${percentage}%) - ${revenue.toLocaleString()} VNĐ`,
                                service
                            ];
                        }}
                        labelFormatter={(service: string) => `Dịch vụ: ${service}`}
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