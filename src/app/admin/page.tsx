'use client';

import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  DatePicker,
  Space,
  Spin,
  Select,
} from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line as RechartsLine
} from 'recharts';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { mockOrders } from '@/api/moc-orderlist';
import { mockPartners } from '@/api/mock-partner';
import { revenueMonth } from '@/api/revenue/revenue-mont';
import { revenueYear } from '@/api/revenue/revenue-year';
import { revenueDay } from '@/api/revenue/revenue-day';
import { Revenue } from '@/type/dashboard/revenue';
import UserDashBoard from './components/dashboard/UserDashBoard';
import TopCTV from './components/dashboard/TopCTV';
import ServiceOrderDashboard from './components/dashboard/ServiceOrderDashboard';
import NearByOrder from './components/dashboard/NearByOrder';


dayjs.extend(isBetween);

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;






export default function Home() {
  const [viewState, setViewState] = useState<string>('Theo Tháng');
  const [areaData, setAreaData] = useState<Revenue[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs(),
  ]);

  const partners = mockPartners.filter(partner =>
    dayjs(partner.createdAt).isBetween(dateRange[0], dateRange[1], null, '[]')
  );


  useEffect(() => {
    let data: Revenue[] = [];
    switch (viewState) {
      case 'Theo Ngày':
        data = revenueDay;
        break;
      case 'Theo Tháng':
        data = revenueMonth;
        break;
      case 'Theo Năm':
        data = revenueYear;
        break;
      default:
        data = revenueMonth;
    }
    // Format value as currency
    setAreaData(
      data.map(item => ({
        ...item,
        GMV: typeof item.GMV === 'number'
          ? Number(item.GMV)
          : parseFloat(item.GMV),
        valueFormatted: Number(item.GMV).toLocaleString(),
      }))
    );

  }, [viewState]);




  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;



  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0 }}>{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ margin: 0, color: entry.color }}>
              {`${entry.dataKey}: ${Number(entry.value).toLocaleString()} ${entry.dataKey === 'value' ? 'VNĐ' : ''}`}
            </p>
          ))}
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
    <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
      <Spin spinning={loading} tip="Đang tải dashboard..." size="large">
        {/* Header */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              Bảng điều khiển tổng quan
            </Title>
            <Text type="secondary">Theo dõi hiệu suất kinh doanh của bạn</Text>
          </div>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng khách hàng"
                value={15}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng CTV"
                value={partners.length}
                prefix={<TeamOutlined style={{ color: '#f5222d' }} />}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng số lượng đơn hàng"
                value={150}
                prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card >
              <Statistic
                title="Tổng doanh thu"
                value={1500000}
                suffix="VND"
                prefix={<DollarOutlined style={{ color: '#faad14' }} />}
                valueStyle={{ color: '#faad14' }}
                formatter={value => `${Number(value).toLocaleString()}`}
              />
            </Card>
          </Col>
        </Row>

        {/* Revenue Chart */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <Card title="Thống kê đơn hàng"
              extra={
                <Space>
                  <Select
                    value={viewState}
                    style={{ width: 120 }}
                    options={[
                      { value: 'Theo Ngày', label: 'Theo Ngày' },
                      { value: 'Theo Tháng', label: 'Theo Tháng' },
                      { value: 'Theo Năm', label: 'Theo Năm' },
                    ]}
                    onChange={setViewState}
                  />
                  <RangePicker
                    value={dateRange}
                    onChange={dates => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
                    format="DD/MM/YYYY"
                  />
                </Space>
              }
            >
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={areaData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dateDisplay" />
                  <YAxis tickFormatter={formatYAxis} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <RechartsLine
                    type="monotone"
                    dataKey="GMV"
                    stroke="#722323"
                    strokeWidth={2}
                    dot={{ fill: '#722323', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#722323', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>


        {/* Recent Orders */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <NearByOrder />
          </Col>
        </Row>

        {/* Charts Row */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={8}>
            <TopCTV />
          </Col>

          <Col xs={24} lg={8}>
            <ServiceOrderDashboard />
          </Col>

          <Col xs={24} lg={8}>
            <UserDashBoard />
          </Col>
        </Row>
      </Spin>
    </div>
  );
}
