import 'antd/dist/reset.css';
import React, { ReactNode } from 'react';
import { AuthProvider } from './storage/auth-context';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SkyHome CRM',
    description: 'Customer Relationship Management System',
    icons: {
        icon: '/icon.png',
        shortcut: '/icon.png',
        apple: '/icon.png',
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
                    {/* <AppProviders> */}
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                    {/* </AppProviders> */}
                </AntdRegistry>
            </body>
        </html>
    );
}