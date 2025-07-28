'use client';
import { Typography, Space, Alert, Card, Divider } from "antd";
import ListUserWithAPI from "../components/ListUserWithAPI";

const { Title, Paragraph } = Typography;

const APIDemoPage: React.FC = () => {
  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card style={{ borderRadius: 12 }}>
          <Title level={2}>API Integration Demo</Title>
          <Paragraph>
            This page demonstrates the integration between the SkyHome CRM frontend and the backend user API.
            The component below will attempt to fetch real data from your backend API.
          </Paragraph>
          
          <Alert
            message="API Connection Status"
            description={
              <div>
                <p><strong>Backend URL:</strong> <code>http://localhost:8080/users</code></p>
                <p><strong>Features:</strong></p>
                <ul>
                  <li>✅ Real-time data fetching from backend</li>
                  <li>✅ Automatic error handling with fallback to mock data</li>
                  <li>✅ Search and filtering capabilities</li>
                  <li>✅ Pagination support</li>
                  <li>✅ Loading states and error messages</li>
                </ul>
                <p><strong>To test:</strong></p>
                <ol>
                  <li>Make sure your backend is running on port 8080</li>
                  <li>The component will automatically try to connect to the API</li>
                  <li>If the API is unavailable, it will show mock data with a warning</li>
                  <li>Try the search and filter functions to see real-time API calls</li>
                </ol>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        </Card>

        <Divider />

        <ListUserWithAPI title="Customer List with API Integration" />
      </Space>
    </div>
  );
};

export default APIDemoPage; 