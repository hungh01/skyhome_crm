import { createCustomerApi } from "@/api/user/customer-api";
import { notify } from "@/components/Notification";
import { User } from "@/type/user/user";
import { DatePicker, Modal } from "antd";
import { Form, Input, Select } from "antd";

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
    fetchCustomers: () => void;
}

export default function CreateUser({ open, setOpen, fetchCustomers }: props) {
    const [form] = Form.useForm();
    const handleOk = () => {
        form.submit();
    };
    const handleFinish = async (values: User) => {
        try {
            const userData = await createCustomerApi(values);
            if (userData && 'data' in userData) {
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Thêm khách hàng thành công!',
                });
                fetchCustomers();
                setOpen(false);
                form.resetFields();
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: (userData && 'message' in userData ? userData.message : 'Có lỗi xảy ra khi thêm khách hàng, vui lòng thử lại sau.'),
                });
            }
        } catch (error) {
            console.error("Error creating user:", error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Thêm khách hàng thất bại, vui lòng thử lại!',
            });
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