'use client';

import React from 'react';
import { Typography, Space, Alert } from 'antd';
import UserList from '../../components/UserList/UserList';

const { Title, Paragraph } = Typography;

const UsersPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={2}>User Management</Title>
          <Paragraph>
            This page demonstrates the integration with the backend user API. 
            The component will attempt to fetch data from the API and fall back to mock data if the API is unavailable.
          </Paragraph>
        </div>

        <Alert
          message="API Integration Demo"
          description={
            <div>
              <p>This component is connected to the backend API at: <code>http://localhost:8080/user</code></p>
              <p>Features:</p>
              <ul>
                <li>Real-time search and filtering</li>
                <li>Pagination support</li>
                <li>Error handling with fallback to mock data</li>
                <li>Responsive design</li>
              </ul>
              <p>To test the API integration:</p>
              <ol>
                <li>Make sure your backend is running on port 8080</li>
                <li>Set the environment variable <code>NEXT_PUBLIC_API_URL</code> if your API is on a different URL</li>
                <li>The component will automatically handle API errors and show mock data as fallback</li>
              </ol>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
        />

        <UserList title="User List with API Integration" />
      </Space>
    </div>
  );
};

export default UsersPage; 