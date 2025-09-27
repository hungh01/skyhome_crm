
import 'antd/dist/reset.css';

import React, { ReactNode, useEffect } from 'react';

import '@/app/globals.scss';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import type { Metadata } from 'next';
import { AuthProvider } from '@/storage/auth-context';
import { NotificationProvider } from '@/components/Notification';

export const metadata: Metadata = {
    title: 'SkyHome CRM',
    description: 'SkyHome Management System',
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
            <body style={{ margin: 0, padding: 0, }}>
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