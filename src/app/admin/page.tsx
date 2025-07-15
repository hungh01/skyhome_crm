'use client';

import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
} from 'antd';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import UserDashBoard from './components/dashboard/UserDashBoard';
import TopCTV from './components/dashboard/TopCTV';
import ServiceOrderDashboard from './components/dashboard/ServiceOrderDashboard';
import NearByOrder from './components/dashboard/NearByOrder';
import RevenueDashboard from './components/dashboard/Revenue';


dayjs.extend(isBetween);

const { Title, Text } = Typography;


export default function Home() {

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

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
        <Row gutter={[16, 16]} style={{ marginBottom: 24, textAlign: 'center' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng khách hàng"
                value={15}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng CTV"
                value={30}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng số lượng đơn hàng"
                value={150}
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
                valueStyle={{ color: '#faad14' }}
                formatter={value => `${Number(value).toLocaleString()}`}
              />
            </Card>
          </Col>
        </Row>

        {/* Revenue Chart */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24}>
            <RevenueDashboard />
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
          <Col xs={24} lg={8} style={{ maxHeight: '100%' }}>
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
