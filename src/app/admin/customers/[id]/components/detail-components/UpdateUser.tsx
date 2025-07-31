import { User } from "@/type/user/user";
import { Form, Input, Modal, InputNumber, Select, DatePicker } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: User;
}

export default function UpdateUser({ open, setOpen, user }: props) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && user) {
            form.setFieldsValue({
                customerName: user.fullName,
                customerCode: user.customerCode,
                age: user.age,
                gender: user.gender,
                referralCode: user.referralCode,
                phoneNumber: user.phone,
                dateOfBirth: user.dateOfBirth ? dayjs(user.dateOfBirth) : null,
                address: user.address,
                createdAt: user.createdAt ? dayjs(user.createdAt) : null,
            });
        }
    }, [open, user, form]);

    const handleOk = () => {
        form.submit();
    };

    const handleFinish = (values: User) => {
        // handle update logic here
        console.log("Form submit values:", values);
        setOpen(false);
        form.resetFields();
    };

    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <Modal
            title="Cập nhật người dùng"
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item label="Tên khách hàng" name="customerName" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Mã khách hàng" name="customerCode">
                    <Input />
                </Form.Item>
                <Form.Item label="Tuổi" name="age">
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Giới tính" name="gender">
                    <Select>
                        <Select.Option value="Male">Nam</Select.Option>
                        <Select.Option value="Female">Nữ</Select.Option>
                        <Select.Option value="Other">Khác</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Mã giới thiệu" name="referralCode">
                    <Input />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phoneNumber">
                    <Input />
                </Form.Item>
                <Form.Item label="Ngày sinh" name="dateOfBirth">
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}