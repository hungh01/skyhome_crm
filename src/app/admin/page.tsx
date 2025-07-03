
'use client';

import { Card, Row, Col, Statistic, Typography, DatePicker, Button, Space, Table, Tag, Avatar } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  ShoppingOutlined,
  DollarOutlined,
  TeamOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { Line, Column, Pie, Area } from '@ant-design/plots';
import { useState } from 'react';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Mock data for charts
const lineData = [
  { date: '2024-01', value: 120, category: 'Khách hàng' },
  { date: '2024-02', value: 132, category: 'Khách hàng' },
  { date: '2024-03', value: 145, category: 'Khách hàng' },
  { date: '2024-04', value: 168, category: 'Khách hàng' },
  { date: '2024-05', value: 180, category: 'Khách hàng' },
  { date: '2024-06', value: 195, category: 'Khách hàng' },
  { date: '2024-01', value: 80, category: 'Đối tác' },
  { date: '2024-02', value: 85, category: 'Đối tác' },
  { date: '2024-03', value: 92, category: 'Đối tác' },
  { date: '2024-04', value: 98, category: 'Đối tác' },
  { date: '2024-05', value: 105, category: 'Đối tác' },
  { date: '2024-06', value: 112, category: 'Đối tác' },
];

const columnData = [
  { type: 'Dọn dẹp', value: 2500 },
  { type: 'Sửa chữa', value: 1800 },
  { type: 'Vận chuyển', value: 1200 },
  { type: 'Khác', value: 800 },
];

const pieData = [
  { type: 'Dọn dẹp nhà', value: 35, color: '#1890ff' },
  { type: 'Sửa chữa', value: 25, color: '#52c41a' },
  { type: 'Vận chuyển', value: 20, color: '#faad14' },
  { type: 'Khác', value: 20, color: '#f5222d' },
];

const areaData = [
  { date: '2024-01', value: 850000 },
  { date: '2024-02', value: 920000 },
  { date: '2024-03', value: 1100000 },
  { date: '2024-04', value: 1200000 },
  { date: '2024-05', value: 1350000 },
  { date: '2024-06', value: 1430000 },
];

// Recent orders data
const recentOrders = [
  {
    key: '1',
    id: 'ORD001',
    customer: 'Nguyễn Văn A',
    service: 'Dọn dẹp nhà',
    amount: 350000,
    status: 'Hoàn thành',
    date: '2024-06-15',
  },
  {
    key: '2',
    id: 'ORD002',
    customer: 'Trần Thị B',
    service: 'Sửa chữa điện',
    amount: 450000,
    status: 'Đang thực hiện',
    date: '2024-06-14',
  },
  {
    key: '3',
    id: 'ORD003',
    customer: 'Lê Minh C',
    service: 'Vận chuyển',
    amount: 200000,
    status: 'Đang chờ',
    date: '2024-06-13',
  },
];

const columns = [
  {
    title: 'Mã đơn',
    dataIndex: 'id',
    key: 'id',
    render: (text: string) => <Text code>{text}</Text>,
  },
  {
    title: 'Khách hàng',
    dataIndex: 'customer',
    key: 'customer',
    render: (text: string) => (
      <Space>
        <Avatar size="small" icon={<UserOutlined />} />
        {text}
      </Space>
    ),
  },
  {
    title: 'Dịch vụ',
    dataIndex: 'service',
    key: 'service',
  },
  {
    title: 'Số tiền',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount: number) => (
      <Text strong style={{ color: '#52c41a' }}>
        {amount.toLocaleString()} VND
      </Text>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const statusConfig = {
        'Hoàn thành': { color: 'success', icon: <CheckCircleOutlined /> },
        'Đang thực hiện': { color: 'processing', icon: <ClockCircleOutlined /> },
        'Đang chờ': { color: 'default', icon: <ClockCircleOutlined /> },
      };
      const config = statusConfig[status as keyof typeof statusConfig];
      return (
        <Tag color={config.color} icon={config.icon}>
          {status}
        </Tag>
      );
    },
  },
  {
    title: 'Ngày',
    dataIndex: 'date',
    key: 'date',
    render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
  },
];

export default function Home() {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(30, 'days'),
    dayjs()
  ]);

  const lineConfig = {
    data: lineData,
    xField: 'date',
    yField: 'value',
    seriesField: 'category',
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    color: ['#1890ff', '#52c41a'],
  };

  const columnConfig = {
    data: columnData,
    xField: 'type',
    yField: 'value',
    color: '#1890ff',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
  };

  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    label: {
      content: '{name}: {value}%',
    },
    legend: {
      position: 'bottom' as const,
    },
    statistic: {
      title: {
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
        },
        content: 'Tổng',
      },
      content: {
        style: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1890ff',
        },
        content: '1,430',
      },
    },
  };

  const areaConfig = {
    data: areaData,
    xField: 'date',
    yField: 'value',
    smooth: true,
    color: '#1890ff',
    areaStyle: {
      fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
    },
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Bảng điều khiển tổng quan
          </Title>
          <Text type="secondary">Theo dõi hiệu suất kinh doanh của bạn</Text>
        </div>
        <Space>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            format="DD/MM/YYYY"
          />
          <Button type="primary" icon={<EyeOutlined />}>
            Xem báo cáo
          </Button>
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng khách hàng"
              value={3286}
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> 12.5%
                </div>
              }
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đơn hàng hôm nay"
              value={79}
              prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
              suffix={
                <div style={{ fontSize: '12px', color: '#52c41a' }}>
                  <ArrowUpOutlined /> 8.2%
                </div>
              }
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Doanh thu tháng"
              value={1372}
              prefix={<DollarOutlined style={{ color: '#faad14' }} />}
              suffix={
                <div style={{ fontSize: '12px', color: '#faad14' }}>
                  <ArrowUpOutlined /> 15.3%
                </div>
              }
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đối tác hoạt động"
              value={366}
              prefix={<TeamOutlined style={{ color: '#f5222d' }} />}
              suffix={
                <div style={{ fontSize: '12px', color: '#f5222d' }}>
                  <ArrowDownOutlined /> 2.1%
                </div>
              }
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Xu hướng tăng trưởng" extra={<Button type="link">Xem thêm</Button>}>
            <Line {...lineConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Phân tích dịch vụ" extra={<Button type="link">Xem thêm</Button>}>
            <Column {...columnConfig} height={300} />
          </Card>
        </Col>
      </Row>

      {/* Second Charts Row */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} md={8}>
          <Card title="Tỷ lệ dịch vụ">
            <Pie {...pieConfig} height={280} />
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card title="Doanh thu theo thời gian">
            <Area {...areaConfig} height={280} />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders and Performance */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Đơn hàng gần đây" extra={<Button type="link">Xem tất cả</Button>}>
            <Table
              columns={columns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Thống kê nhanh" style={{ marginTop: '16px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Đánh giá trung bình</Text>
                <Text strong style={{ color: '#52c41a' }}>4.8/5</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Tỷ lệ hoàn thành</Text>
                <Text strong style={{ color: '#1890ff' }}>96.2%</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Khách hàng quay lại</Text>
                <Text strong style={{ color: '#faad14' }}>78.5%</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Thời gian phản hồi</Text>
                <Text strong style={{ color: '#f5222d' }}>2.3 phút</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
