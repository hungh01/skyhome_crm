import { monthServiceDashboard, weakServiceDashboard, yearServiceDashboard } from "@/api/dashboard/mock-serviceDashboard";
import { ServiceOrder } from "@/type/dashboard/serviceOrder";
import { Card, Select, Space } from "antd";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ServiceOrderDashboard() {

    const [viewState, setViewState] = useState<'weak' | 'month' | 'year'>('weak');
    const [serviceOrdersData, setServiceOrdersData] = useState<ServiceOrder[]>([]);

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
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={serviceOrdersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={11} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#faad14" radius={[4, 4, 0, 0]} name="Số đơn hàng" />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
}