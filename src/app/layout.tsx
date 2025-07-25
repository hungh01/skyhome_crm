import 'antd/dist/reset.css';
import React, { ReactNode } from 'react';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { AuthProvider } from '@/storage/auth-context';
import { NotificationProvider } from '@/components/Notification';

export const metadata: Metadata = {
    title: 'SkyHome CRM',
    description: 'Customer Relationship Management System',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/favicon.ico',
    },
};

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <html lang="en">
            <body style={{ margin: 0, padding: 0, height: '100vh', width: '100vw' }}>
                <AntdRegistry>
                    <NotificationProvider>
                        {/* <AppProviders> */}
                        <AuthProvider>
                            {children}
                        </AuthProvider>
                        {/* </AppProviders> */}
                    </NotificationProvider>
                </AntdRegistry>
            </body>
        </html>
    );
}