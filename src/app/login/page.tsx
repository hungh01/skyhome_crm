'use client';

import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input, Spin } from 'antd';
import { useAuth } from '@/storage/auth-context';
import { useRouter } from 'next/navigation';

import { notify } from '@/components/Notification';
import { loginApi } from '@/api/auth/auth-api';

type FieldType = {
    phone?: string;
    password?: string;
    remember?: boolean;
};


export default function LoginPage() {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const { login } = useAuth();
    const router = useRouter();
    const [form] = Form.useForm();

    useEffect(() => {
        setMounted(true);
        const timer = setTimeout(() => setLoading(false), 100);
        // Tự động điền số điện thoại nếu đã lưu
        const rememberedPhone = localStorage.getItem('rememberedPhone');
        const rememberedPassword = localStorage.getItem('rememberedPassword');
        if (rememberedPhone && rememberedPassword) {
            form.setFieldsValue({ phone: rememberedPhone, password: rememberedPassword, remember: true });
        }
        return () => clearTimeout(timer);
    }, [form]);

    if (!mounted) return null;

    const onFinish = async (values: FieldType) => {
        const res = await loginApi(values.phone!, values.password!);
        if (!res.success) {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Đăng nhập thất bại, vui lòng kiểm tra lại số điện thoại hoặc mật khẩu của bạn.',
            });
            return;
        }
        // Lưu số điện thoại nếu người dùng chọn "Lưu tài khoản"
        if (values.remember) {
            localStorage.setItem('rememberedPhone', values.phone!);
            localStorage.setItem('rememberedPassword', values.password!);
        } else {
            localStorage.removeItem('rememberedPhone');
            localStorage.removeItem('rememberedPassword');
        }
        await login();
        router.push('/admin');
    };



    return (
        <Spin spinning={loading} tip="Đang tải ..." size="large">
            <Form
                form={form}
                name="loginForm"
                layout="vertical"
                style={{ maxWidth: 600, margin: '0 auto', marginTop: 50 }}
                initialValues={{ remember: true }}
                autoComplete="off"
                onFinish={onFinish}
            >
                <Form.Item<FieldType>
                    label="Tên đăng nhập"
                    name="phone"
                    rules={[{ required: true, message: 'Please input your phone!' }]}
                >
                    <Input placeholder="phone" />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>

                <Form.Item<FieldType> name="remember" valuePropName="checked">
                    <Checkbox style={{ color: '#fcda00' }}>
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

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                            background: "linear-gradient(135deg, #fcda00, #f6ec1b)",
                            width: "100%",
                        }}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
}