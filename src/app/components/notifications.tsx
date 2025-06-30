import { Alert } from "antd";

interface Notification {
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export default function Notifications(notifications: Notification) {
    return (
        <>
            <Alert
                message={notifications.type}
                description={notifications.message}
                type={notifications.type}
                showIcon
                closable
            />
        </>
    );
}