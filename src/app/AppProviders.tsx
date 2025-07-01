'use client';

import React, { ReactNode } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';

interface AppProvidersProps {
    children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
    <StyleProvider hashPriority="high">
        <ConfigProvider>
            {children}
        </ConfigProvider>
    </StyleProvider>
);

export default AppProviders;