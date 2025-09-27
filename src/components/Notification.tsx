'use client';

import { notification } from 'antd';
import { NotificationPlacement } from 'antd/es/notification/interface';
import React from 'react';

type NotificationType = 'success' | 'info' | 'warning' | 'error';

interface NotifyOptions {
    type: NotificationType;
    message: string;
    description?: string;
    placement?: NotificationPlacement;
    duration?: number; // thời gian tự đóng, đơn vị giây
}

let notifyApi: ReturnType<typeof notification.useNotification>[0];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [api, contextHolder] = notification.useNotification();
    notifyApi = api;


    return (
        <>
            {contextHolder}
            {children}
        </>
    );
};

// Hàm gọi notification từ bất cứ đâu
export const notify = ({
    type,
    message,
    description = '',
    placement = 'topRight',
    duration = 3,
}: NotifyOptions) => {
    notifyApi?.[type]({
        message,
        description,
        placement,
        duration,
    });
};
