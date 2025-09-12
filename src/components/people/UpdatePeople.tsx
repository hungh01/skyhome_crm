import { User } from "@/type/user/user";
import { Form, Input, Modal, Select, DatePicker } from "antd";
import { useEffect } from "react";
import dayjs from "dayjs";
import { updateUserApi } from "@/api/user/user-api";
import { notify } from "../Notification";
import { ErrorResponse } from "@/type/error";

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: User;
    updateSuccess: () => void;
}

export default function UpdatePeople({ open, setOpen, user, updateSuccess }: props) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open && user) {
            form.setFieldsValue({
                fullName: user.fullName,
                gender: user.gender,
                phone: user.phone,
                birthDate: user.birthDate ? dayjs(user.birthDate) : null,
                address: user.address,
            });
        }
    }, [open, user, form]);

    const handleOk = () => {
        form.submit();
    };

    const handleFinish = async (values: Partial<User>) => {
        try {
            const response = await updateUserApi(user._id, values);
            if (response && 'data' in response) {
                updateSuccess();
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Cập nhật người dùng thành công!',
                });
                setOpen(false);
                form.resetFields();
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: (response && 'message' in response ? (response as ErrorResponse).message : 'Có lỗi xảy ra khi cập nhật người dùng, vui lòng thử lại sau.'),
                });
            }
        } catch (error) {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Cập nhật người dùng thất bại, vui lòng thử lại!',
            });
            console.error("Error updating user:", error);
        }
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
                <Form.Item label="Họ và tên" name="fullName" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Giới tính" name="gender">
                    <Select>
                        <Select.Option value={0}>Nam</Select.Option>
                        <Select.Option value={1}>Nữ</Select.Option>
                        <Select.Option value={2}>Khác</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Số điện thoại" name="phone">
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