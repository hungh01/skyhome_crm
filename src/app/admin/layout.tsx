
import "./globals.scss";
import type { Metadata } from "next";
import { Flex, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import styles from "./layout.module.scss";
import { headers } from 'next/headers';
import MainHeader from "./components/MainHeader";
import Sidebar from "./components/Sidebar";
import ProtectedRoute from "../storage/protected-route";

export const metadata: Metadata = {
  title: "Sky Home CRM",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const headersList = await headers();
  const pathname = headersList.get('x-next-url') || '/';
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', gap: '16px' }}>
          <ProtectedRoute>
            <Layout className={styles.layoutContainer}>
              <MainHeader />
              {/* Content */}
              <Layout>
                <Sidebar currentPath={pathname} />
                <Content className={styles.content}>
                  {children}
                </Content>
              </Layout>
            </Layout>
          </ProtectedRoute>
        </div>
      </body>
    </html>
  );
}
