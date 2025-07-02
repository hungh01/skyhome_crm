
import type { Metadata } from "next";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import styles from "@/app/layout.module.scss";
import { headers } from 'next/headers';
import MainHeader from "./components/MainHeader";
import Sidebar from "./components/Sidebar";
// import ProtectedRoute from "../storage/protected-route";

export const metadata: Metadata = {
  title: "Sky Home CRM",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ display: 'flex', gap: '16px' }}>
      {/* <ProtectedRoute> */}

      <Layout className={styles.layoutContainer}>
        <MainHeader />
        {/* Content */}
        <Layout>
          <Sidebar />
          <Content className={styles.content}>
            {children}
          </Content>
        </Layout>
      </Layout>
      {/* </ProtectedRoute> */}
    </div>
  );
}
