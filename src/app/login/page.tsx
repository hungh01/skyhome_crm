'use client';

import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useAuth } from '@/storage/auth-context';

type FieldType = {
    username?: string;
    password?: string;
    remember?: boolean;
};

type NotificationType = {
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
};

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
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input placeholder="Username" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item<FieldType> name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
                    <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}
