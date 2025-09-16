'use client';
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";

import MainHeader from "@/components/MainHeader";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/storage/protected-route";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <ProtectedRoute>
        <Sidebar />
        {/* Content area with margin to account for fixed sidebar */}
        <Layout style={{

          overflow: 'hidden'
        }}>
          <MainHeader />
          <Content className="admin-content" style={{
            minHeight: 'calc(100vh - 64px)',
            backgroundColor: '#fff',
            padding: '0',
            overflow: 'auto',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            {children}
          </Content>
        </Layout>
      </ProtectedRoute>

      <style jsx global>{`
        :root {
          --sidebar-width: 80px;
        }
        
        .admin-content {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        .ant-layout {
          transform: translateZ(0);
          will-change: margin-left, width;
          box-sizing: border-box;
        }
        
        .ant-layout-sider {
          transform: translateZ(0);
          will-change: width;
        }
        
        .ant-layout-content {
          width: 100% !important;
          max-width: 100% !important;
          box-sizing: border-box !important;
        }
        
        @media (max-width: 768px) {
          .ant-layout {
            margin-left: 0 !important;
            width: 100vw !important;
            max-width: 100vw !important;
          }
        }
      `}</style>
    </div>
  );
}
