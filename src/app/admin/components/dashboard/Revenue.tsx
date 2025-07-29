import { revenueDashboardApi } from "@/api/dashboard/revenue-dasboard-api";
import { Revenue } from "@/type/dashboard/revenue";
import { Card, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function RevenueDashboard() {
    const [viewState, setViewState] = useState<'weekly' | 'monthly' | 'annual'>('weekly');
    const [areaData, setAreaData] = useState<Revenue[]>([]);

    useEffect(() => {
        const revenueApi = async () => {
            try {
                const revenueData = await revenueDashboardApi(viewState);
                console.log('Revenue Data:', revenueData);
                setAreaData(
                    revenueData.map(item => ({
                        ...item,
                        GMV: typeof item.GMV === 'number'
                            ? Number(item.GMV)
                            : parseFloat(item.GMV),
                        valueFormatted: Number(item.GMV).toLocaleString(),
                    }))
                );
            } catch (error) {
                console.error('Failed to fetch revenue data:', error);
            }
        };
        revenueApi();
    }, [viewState]);

    // Define types for tooltip
    interface TooltipPayload {
        color: string;
        dataKey: string;
        value: number;
        payload?: Revenue; // Add payload to access full data
    }

    interface CustomTooltipProps {
        active?: boolean;
        payload?: TooltipPayload[];
        label?: string;
    }

    const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
        if (active && payload && payload.length) {
            const data = payload[0]?.payload; // Get the full data object
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                        {`${label}`}
                    </p>
                    <p style={{ margin: 0, color: '#722323', textAlign: 'left' }}>
                        Doanh thu: {Number(data?.GMV || 0).toLocaleString()} VNĐ
                    </p>
                    <p style={{ margin: 0, color: '#1890ff', textAlign: 'left' }}>
                        Số đơn hàng: {data?.orderCount || 0}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Format Y-axis for currency
    const formatYAxis = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(0)}K`;
        }
        return value.toString();
    };



    return (
        <Card title="Thống kê đơn hàng"
            extra={
                <Space>
                    <Select
                        value={viewState}
                        style={{ width: 120 }}
                        options={[
                            { value: 'weekly', label: 'Theo tuần' },
                            { value: 'monthly', label: 'Theo Tháng' },
                            { value: 'annual', label: 'Theo Năm' },
                        ]}
                        onChange={setViewState}
                    />
                    {/* <RangePicker
                    value={dateRange}
                    onChange={dates => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                    format="DD/MM/YYYY"
                  /> */}
                </Space>
            }
        >
            <ResponsiveContainer width="100%" height={280}>
                <LineChart data={areaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="dateDisplay" />
                    <YAxis yAxisId="left" tickFormatter={formatYAxis} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="GMV"
                        stroke="#722323"
                        strokeWidth={2}
                        dot={{ fill: '#722323', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#722323', strokeWidth: 2 }}
                        name="Doanh thu (VNĐ)"
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}