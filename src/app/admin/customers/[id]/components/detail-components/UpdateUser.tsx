import { User } from "@/type/user/user";
import { Form, Input, Modal, InputNumber, Select, DatePicker } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { Collaborator } from "@/type/user/collaborator/collaborator";

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
    collaborator: Collaborator;
}

export default function UpdateUser({ open, setOpen, collaborator }: props) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && collaborator) {
            form.setFieldsValue({
                customerName: collaborator.userId.fullName,
                age: collaborator.userId.age,
                gender: collaborator.userId.gender,
                referralCode: collaborator.userId.referralCode,
                phoneNumber: collaborator.userId.phone,
                dateOfBirth: collaborator.userId.birthDate ? dayjs(collaborator.userId.birthDate) : null,
                address: collaborator.userId.address,
                createdAt: collaborator.userId.createdAt ? dayjs(collaborator.userId.createdAt) : null,
            });
        }
    }, [open, collaborator, form]);

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
                <Form.Item label="Ngày sinh" name="birthDate">
                    <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
                </Form.Item>

                <Form.Item label="Địa chỉ" name="address">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}