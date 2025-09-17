'use client';
import { DatePicker, Modal } from "antd";
import { Form, Input, Select } from "antd";
import { useCustomerContext } from "../provider/customer-provider";
import { useCreateCustomer } from "../hooks/use-create-customer";


export default function CreateUser() {
    const { open, setOpen } = useCustomerContext();
    const [form] = Form.useForm();
    const handleOk = () => {
        form.submit();
    };

    const handleResetForm = () => {
        form.resetFields();
        setOpen(false);
    }
    const { handleFinish, loading } = useCreateCustomer(handleResetForm);


    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Modal
            title={
                <div
                    style={{ width: '100%', cursor: 'move' }}
                    onFocus={() => { }}
                    onBlur={() => { }}
                // end
                >
                    Tạo người dùng mới
                </div>
            }
            confirmLoading={loading}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Tên khách hàng"
                    name="fullName"
                    rules={[{ required: true, message: "Vui lòng nhập tên khách hàng" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Ngày sinh"
                    name="birthDate"
                    rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                >
                    <Select>
                        <Select.Option value={0}>Nam</Select.Option>
                        <Select.Option value={1}>Nữ</Select.Option>
                        <Select.Option value={2}>Khác</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Nhập lại mật khẩu"
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: "Vui lòng nhập lại mật khẩu" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Mã giới thiệu"
                    name="referralCode"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}