

import { getAreas, getCollaborators, getServices } from "@/api/user/collaborator-group-api";
import { Form, Modal, Select } from "antd";
import { useState, useCallback, useEffect } from "react";

interface AddGroupModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
}

export default function AddGroupModal({ open, setOpen, setLoading }: AddGroupModalProps) {

    const [memberList, setMemberList] = useState<{ _id: string; code: string; fullName: string; }[]>([]);
    const [areas, setAreas] = useState<{ _id: string; code: string }[]>([]);
    const [services, setServices] = useState<{ _id: string; name: string }[]>([]);
    const [serviceFilter, setServiceFilter] = useState<string>("");
    const [areaFilter, setAreaFilter] = useState<string>("");
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [servicesRes, areasRes] = await Promise.all([
                    getServices(),
                    getAreas()
                ]);
                if ('data' in servicesRes && 'data' in areasRes) {
                    setServices(servicesRes.data);
                    setAreas(areasRes.data);
                } else {
                    setServices([]);
                    setAreas([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const collaboratorsRes = await getCollaborators(selectedServices, selectedAreas);
                if ('data' in collaboratorsRes) {
                    setMemberList(collaboratorsRes.data);
                } else {
                    setMemberList([]);
                }
            } catch (error) {
                console.error("Error fetching collaborators:", error);
                setMemberList([]);
            }
        }
        fetchCollaborators();
    }, [selectedServices, selectedAreas]);

    const handleOk = useCallback(() => {
        form.submit();
    }, [form]);

    const handleFinish = useCallback((values: unknown) => {
        // handle form submission-callapi logic here
        console.log("Form submit values:", values);
        setOpen(false);
        form.resetFields();
    }, [setOpen, form]);

    const handleCancel = useCallback(() => {
        setOpen(false);
        form.resetFields();

    }, [setOpen, form]);



    const handleServiceChange = useCallback((values: string[]) => {
        setSelectedServices(values);
        console.log("Selected services:", values);
    }, []);

    const handleAreaChange = useCallback((values: string[]) => {
        setSelectedAreas(values);
        console.log("Selected areas:", values);
    }, []);

    // const handleMemberSearch = useCallback((value: string) => {
    //     setMemberName(value);
    // }, []);

    // Function to normalize Vietnamese text (remove diacritics)
    const normalizeVietnamese = (str: string) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase();
    };

    const filteredServices = services.filter(service => {
        const normalizedServiceName = normalizeVietnamese(service.name);
        const normalizedFilter = normalizeVietnamese(serviceFilter);
        return normalizedServiceName.includes(normalizedFilter);
    });

    const filteredAreas = areas.filter(area => {
        const normalizedAreaCode = normalizeVietnamese(area.code);
        const normalizedFilter = normalizeVietnamese(areaFilter);
        return normalizedAreaCode.includes(normalizedFilter);
    });
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
                    label="Chọn dịch vụ"
                    name="services"
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn dịch vụ"
                        allowClear
                        showSearch
                        searchValue={serviceFilter}
                        onSearch={setServiceFilter}
                        filterOption={false}
                        onChange={handleServiceChange}
                    >
                        {filteredServices.map(service => (
                            <Select.Option key={service._id} value={service._id}>
                                {service.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Chọn khu vực"
                    name="areas"
                >
                    <Select
                        mode="multiple"
                        placeholder="Chọn khu vực"
                        allowClear
                        showSearch
                        searchValue={areaFilter}
                        onSearch={setAreaFilter}
                        filterOption={false}
                        onChange={handleAreaChange}
                    >
                        {filteredAreas.map(area => (
                            <Select.Option key={area._id} value={area._id}>
                                {area.code}
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
                        //onSearch={handleMemberSearch}
                        placeholder="Chọn thành viên"
                        allowClear
                    >
                        {memberList.map(collaborator => (
                            <Select.Option key={collaborator._id} value={collaborator._id}>
                                {`${collaborator.fullName} - ${collaborator.code}`}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
}


