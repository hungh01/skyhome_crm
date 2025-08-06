

import { Modal } from "antd";
import { Form, Input, InputNumber, Select } from "antd";

import type { FormInstance } from "antd/es/form";

interface props {
    open: boolean;
    setOpen: (open: boolean) => void;
    handleFinish?: (values: unknown) => void;
    form: FormInstance;
    areas?: { _id: string; ward: string; city: string; code: string }[];
    services?: { _id: string; name: string }[];
}

export default function CreateCollaborator({ form, open, setOpen, handleFinish, areas, services }: props) {
    const handleOk = () => {
        form.submit();
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
                >
                    Tạo mới
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
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
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
                <Form.Item
                    label="Khu vực"
                    name="areas"
                    rules={[{ required: true, message: "Vui lòng chọn khu vực" }]}
                >
                    <Select mode="multiple" allowClear placeholder="Chọn khu vực">
                        {areas?.map(area => (
                            <Select.Option key={area._id} value={area._id}>
                                ({area.code}) + {area.ward}, {area.city}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Dịch vụ"
                    name="services"
                    rules={[{ required: true, message: "Vui lòng chọn dịch vụ" }]}
                >
                    <Select mode="multiple" allowClear placeholder="Chọn dịch vụ">
                        {services?.map(service => (
                            <Select.Option key={service._id} value={service._id}>
                                {service.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>  </Form>
        </Modal>
    );
}