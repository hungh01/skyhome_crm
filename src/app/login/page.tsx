'use client';

import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useAuth } from '@/storage/auth-context';

type FieldType = {
    username?: string;
    password?: string;
    remember?: boolean;
};

// type NotificationType = {
//     message: string;
//     type: 'info' | 'success' | 'warning' | 'error';
// };

export default function LoginPage() {
    //const [notifications, setNotifications] = React.useState<NotificationType>();
    const { login } = useAuth();
    const onFinish = (values: FieldType) => {
        console.log('Success:', values);
        login();
        window.location.href = '/admin';
    };

    // const onFinishFailed = (errorInfo: any) => {
    //     setNotifications({
    //         message: 'Login Failed',
    //         type: 'error',
    //     });
    // };


    return (
        <>
            {/* {notifications && <Notifications {...notifications} />} */}
            <Form
                name="loginForm"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600, margin: '0 auto', marginTop: 100 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                onFinish={onFinish}
            //onFinishFailed={onFinishFailed}
            >
                <Form.Item<FieldType>
                    label="Tên đăng nhập"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item<FieldType> name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                    <Checkbox style={{
                        color: '#fcda00',
                    }}>
                        <span style={{ color: '#333' }}>Lưu tài khoản</span>
                    </Checkbox>
                </Form.Item>

                <style jsx>{`
                    :global(.ant-checkbox-checked .ant-checkbox-inner) {
                        background-color: #fcda00 !important;
                        border-color: #fcda00 !important;
                    }
                    :global(.ant-checkbox:hover .ant-checkbox-inner) {
                        border-color: #fcda00 !important;
                    }
                    :global(.ant-checkbox-wrapper:hover .ant-checkbox-inner) {
                        border-color: #fcda00 !important;
                    }
                `}</style>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit" style={{ background: "linear-gradient(135deg, #fcda00, #f6ec1b)", }}>
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
