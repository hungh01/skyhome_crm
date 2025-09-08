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

import ServiceOrderDashboard from './components/dashboard/ServiceOrderDashboard';
import NearByOrder from './components/dashboard/NearByOrder';
import RevenueDashboard from './components/dashboard/Revenue';

import TopCTVDashboard from './components/dashboard/TopCTVDashboard';
import { totalCollaboratorApi, totalOrdersApi, totalRevenueApi, totalUserApi } from '@/api/dashboard/dashboard-api';

dayjs.extend(isBetween);

const { Title, Text } = Typography;


export default function Home() {

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  const [totalUser, setTotalUser] = useState(0);
  const [totalCollaborators, setTotalCollaborators] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [userRes, collaboratorRes, orderRes, revenueRes] = await Promise.all([
          totalUserApi(),
          totalCollaboratorApi(),
          totalOrdersApi(),
          totalRevenueApi(),
        ]);
        setTotalUser('data' in userRes && 'totalCustomer' in userRes.data ? userRes.data.totalCustomer : 0);
        setTotalCollaborators('data' in collaboratorRes && 'totalCollaborator' in collaboratorRes.data ? collaboratorRes.data.totalCollaborator : 0);
        setTotalOrders('data' in orderRes && 'totalOrder' in orderRes.data ? orderRes.data.totalOrder : 0);
        setTotalRevenue('data' in revenueRes && 'totalRevenue' in revenueRes.data ? revenueRes.data.totalRevenue : 0);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      }
    };
    fetchDashboardStats();
  }, []);



  const onlineCollaborators = 0; // Example value, replace with actual data

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
          <Col xs={24} sm={12} md={4.8} lg={4.8} xl={4.8} flex="1">
            <Card>
              <Statistic
                title="Tổng khách hàng"
                value={totalUser}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4.8} lg={4.8} xl={4.8} flex="1">
            <Card>
              <Statistic
                title="Tổng CTV"
                value={totalCollaborators}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4.8} lg={4.8} xl={4.8} flex="1">
            <Card>
              <Statistic
                title="CTV Online"
                value={Math.round((onlineCollaborators / totalCollaborators ? onlineCollaborators / totalCollaborators : 0) * 100) + '%'}
                valueStyle={{ color: '#f5222d' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4.8} lg={4.8} xl={4.8} flex="1">
            <Card>
              <Statistic
                title="Tổng đơn hàng"
                value={totalOrders}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={4.8} lg={4.8} xl={4.8} flex="1">
            <Card>
              <Statistic
                title="Tổng doanh thu (VNĐ)"
                value={totalRevenue}
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
            <TopCTVDashboard />
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
