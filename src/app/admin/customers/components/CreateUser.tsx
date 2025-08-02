import { createCustomerApi } from "@/api/user/customer-api";
import { notify } from "@/components/Notification";
import { User } from "@/type/user/user";
import { Modal } from "antd";
import { Form, Input, InputNumber, Select } from "antd";

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function CreateUser({ open, setOpen }: props) {
    const [form] = Form.useForm();
    const handleOk = () => {
        form.submit();
    };
    const handleFinish = async (values: User) => {
        try {
            const userData = await createCustomerApi(values);
            if (userData) {
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Thêm khách hàng thành công!',
                });
            }
        } catch (error) {
            console.error("Error creating user:", error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Thêm khách hàng thất bại, vui lòng thử lại!',
            });
        } finally {
            setOpen(false);
            form.resetFields();
        }
    };

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
                    label="Tuổi"
                    name="age"
                    rules={[{ required: true, message: "Vui lòng nhập tuổi" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    label="Giới tính"
                    name="gender"
                    rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
                >
                    <Select>
                        <Select.Option value="Male">Nam</Select.Option>
                        <Select.Option value="Female">Nữ</Select.Option>
                        <Select.Option value="Other">Khác</Select.Option>
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