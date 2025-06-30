import React, { ReactNode } from 'react';
import { AuthProvider } from './storage/auth-context';
import { AntdRegistry } from '@ant-design/nextjs-registry';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <AntdRegistry>
                        {children}
                    </AntdRegistry>
                </AuthProvider>
            </body>
        </html>
    );
}