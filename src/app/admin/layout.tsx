
import type { Metadata } from "next";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import styles from "@/app/layout.module.scss";
import MainHeader from "../../components/MainHeader";
import Sidebar from "../../components/Sidebar";
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* <ProtectedRoute> */}
      <Sidebar />
      {/* Content area with margin to account for fixed sidebar */}
      <Layout>
        <MainHeader />
        <Content className={styles.content} style={{ minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </Content>
      </Layout>
      {/* </ProtectedRoute> */}
    </div>
  );
}
