
import { mockServices } from "@/api/mock-services";
import { Form, Modal, Select } from "antd";
import { useState, useCallback } from "react";

interface AddGroupModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export default function AddGroupModal({ open, setOpen }: AddGroupModalProps) {
    const [leaderName, setLeaderName] = useState<string>("");
    const [memberName, setMemberName] = useState<string>("");
    const [form] = Form.useForm();

    console.log("AddGroupModal open:", leaderName, memberName);

    // const leaderList = mockPartners.filter(partner =>
    //     partner.name.toLowerCase().includes(leaderName.toLowerCase())
    // );
    // const memberList = mockPartners.filter(partner =>
    //     partner.name.toLowerCase().includes(memberName.toLowerCase())
    // );

    const services = mockServices;

    const handleOk = useCallback(() => {
        form.submit();
    }, [form]);

    const handleFinish = useCallback((values: unknown) => {
        // handle form submission-callapi logic here
        console.log("Form submit values:", values);
        setOpen(false);
        form.resetFields();
        setLeaderName("");
        setMemberName("");
    }, [setOpen, form]);

    const handleCancel = useCallback(() => {
        setOpen(false);
        form.resetFields();
        setLeaderName("");
        setMemberName("");
    }, [setOpen, form]);

    const handleLeaderSearch = useCallback((value: string) => {
        setLeaderName(value);
    }, []);

    const handleMemberSearch = useCallback((value: string) => {
        setMemberName(value);
    }, []);
    return (
        <Modal
            title={
                <div
                    style={{ width: '100%', cursor: 'move' }}
                    onFocus={() => { }}
                    onBlur={() => { }}
                // end
                >
                    Tạo nhóm mới
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
                    label="Tên trưởng nhóm"
                    name="leader"
                    rules={[{ required: true, message: "Vui lòng nhập trưởng nhóm" }]}
                >
                    <Select
                        showSearch
                        onSearch={handleLeaderSearch}
                        placeholder="Nhập tên trưởng nhóm"
                        optionFilterProp="children"
                        allowClear
                    >
                        {/* {leaderList.map(partner => (
                            <Select.Option key={partner.id} value={partner.id}>
                                {`${partner.name} - ${partner.code} - ${partner.phoneNumber}`}
                            </Select.Option>
                        ))} */}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Chọn dịch vụ"
                    name="services"
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn dịch vụ"
                        allowClear
                    >
                        {services.map(service => (
                            <Select.Option key={service._id} value={service._id}>
                                {service.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Thêm thành viên"
                    name="memberList"
                >
                    <Select
                        mode="multiple"
                        showSearch
                        onSearch={handleMemberSearch}
                        placeholder="Chọn thành viên"
                        allowClear
                    >
                        {/* {memberList.map(partner => (
                            <Select.Option key={partner.id} value={partner.id}>
                                {`${partner.name} - ${partner.code} - ${partner.phoneNumber}`}
                            </Select.Option>
                        ))} */}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}


