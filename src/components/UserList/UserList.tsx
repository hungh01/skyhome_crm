'use client';

import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Card, Row, Col, Select, message } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { UserService, UserFilters } from '../../api/user/userService';
import { User } from '../../type/user/user';
import dayjs from 'dayjs';
import Image from 'next/image';

const { Search } = Input;
const { Option } = Select;

interface UserListProps {
  title?: string;
}

const UserList: React.FC<UserListProps> = ({ title = 'User Management' }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    pageSize: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });

  const fetchUsers = async (filters: UserFilters = {}) => {
    setLoading(true);
    try {
      const response = await UserService.getUsers(filters);
      setUsers(response.data);
      setPagination({
        total: response.pagination.total,
        current: response.pagination.page,
        pageSize: response.pagination.pageSize,
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users. Using mock data instead.');
      // Fallback to mock data
      const mockUsers = UserService.getMockUsers();
      setUsers(mockUsers);
      setPagination({
        total: mockUsers.length,
        current: 1,
        pageSize: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(filters);
  }, [filters]);

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key: keyof UserFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
    setFilters(prev => ({
      ...prev,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  const handleRefresh = () => {
    fetchUsers(filters);
  };

  const columns = [
    {
      title: 'Avatar',
      key: 'image',
      render: (user: User) => (
        <Image
          src={user.image}
          alt={user.fullName}
          width={40}
          height={40}
          style={{ borderRadius: '50%' }}
          onError={() => {
            // Fallback handled by Next.js Image component
          }}
        />
      ),
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
      sorter: true,
    },
    {
      title: 'Customer Code',
      dataIndex: 'customerCode',
      key: 'customerCode',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      render: (age: number) => `${age} years`,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => (
        <span style={{
          color: gender === 'Male' ? '#1890ff' : gender === 'Female' ? '#eb2f96' : '#52c41a'
        }}>
          {gender}
        </span>
      ),
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank: number) => (
        <span style={{
          color: rank === 0 ? '#f5222d' : rank === 1 ? '#fa8c16' : rank === 2 ? '#faad14' : '#52c41a'
        }}>
          {rank === 0 ? 'VIP' : rank === 1 ? 'Gold' : rank === 2 ? 'Silver' : 'Bronze'}
        </span>
      ),
    },
  ];

  return (
    <Card title={title} style={{ margin: 16 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder="Search by name or phone"
            onSearch={handleSearch}
            style={{ width: '100%' }}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Input
            placeholder="Customer Code"
            onChange={(e) => handleFilterChange('code', e.target.value)}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Select Rank"
            style={{ width: '100%' }}
            onChange={(value) => handleFilterChange('rank', value)}
            allowClear
          >
            <Option value="0">VIP</Option>
            <Option value="1">Gold</Option>
            <Option value="2">Silver</Option>
            <Option value="3">Bronze</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
            style={{ width: '100%' }}
          >
            Refresh
          </Button>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
};

export default UserList; 