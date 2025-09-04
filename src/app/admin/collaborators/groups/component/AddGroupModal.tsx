
'use client';

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Form, Input, Modal, Select } from "antd";
import { createCollaboratorGroup, updateCollaboratorGroup, getAreas, getCollaborators, getServiceCategories } from "@/api/user/collaborator-group-api";
import { notify } from "@/components/Notification";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { Group } from "@/type/user/collaborator/group";

interface AddGroupModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    setLoading: (loading: boolean) => void;
    onSuccess: (group: Group) => void; // Callback for both create and update
    editGroup?: Group; // Optional group to edit
    mode?: 'create' | 'edit'; // Modal mode
}

interface FormValues {
    name: string;
    serviceType: string[];
    areas: string[];
    leaderId: string;
    memberIds: string[];
    description: string;
}

interface ServiceCategory {
    _id: string;
    name: string;
    type: string;
}

interface Area {
    _id: string;
    code: string;
}

// Utility functions
const normalizeVietnamese = (str: string): string => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase();
};

const showNotification = (type: 'success' | 'error', description: string) => {
    notify({
        type,
        message: 'Thông báo',
        description
    });
};

// Custom hooks
const useFormData = (setLoading: (loading: boolean) => void) => {
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [areas, setAreas] = useState<Area[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [servicesRes, areasRes] = await Promise.all([
                    getServiceCategories(),
                    getAreas()
                ]);

                setServiceCategories('data' in servicesRes ? servicesRes.data : []);
                setAreas('data' in areasRes ? areasRes.data : []);
            } catch (error) {
                console.error("Error fetching data:", error);
                showNotification('error', 'Lỗi khi tải dữ liệu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setLoading]);

    return { serviceCategories, areas };
};

const useCollaborators = (selectedServices: string[], selectedAreas: string[]) => {
    const [memberList, setMemberList] = useState<Collaborator[]>([]);

    useEffect(() => {
        if (selectedServices.length === 0 || selectedAreas.length === 0) {
            setMemberList([]);
            return;
        }

        const fetchCollaborators = async () => {
            try {
                const collaboratorsRes = await getCollaborators(selectedServices, selectedAreas, '');
                setMemberList('data' in collaboratorsRes ? collaboratorsRes.data : []);
            } catch (error) {
                console.error("Error fetching collaborators:", error);
                setMemberList([]);
                showNotification('error', 'Lỗi khi tải danh sách cộng tác viên');
            }
        };

        fetchCollaborators();
    }, [selectedServices, selectedAreas]);

    return memberList;
};

export default function AddGroupModal({ open, setOpen, setLoading, onSuccess, editGroup, mode = 'create' }: AddGroupModalProps) {
    // Form state
    const [form] = Form.useForm<FormValues>();

    // Search filters
    const [serviceFilter, setServiceFilter] = useState<string>("");
    const [areaFilter, setAreaFilter] = useState<string>("");

    // Selection states
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
    const [selectedLeader, setSelectedLeader] = useState<string | undefined>(undefined);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    // Custom hooks
    const { serviceCategories, areas } = useFormData(setLoading);
    const memberList = useCollaborators(selectedServices, selectedAreas);

    // Effect to populate form when editing
    useEffect(() => {
        if (mode === 'edit' && editGroup && open) {

            // Helper function to safely extract ID
            const extractId = (item: string | { _id?: string; id?: string } | null | undefined): string | undefined => {
                if (typeof item === 'string') return item;
                return item?._id || item?.id;
            };

            // Helper function to safely extract IDs from array
            const extractIds = (items: Array<string | { _id?: string; id?: string }> | null | undefined): string[] => {
                if (!Array.isArray(items)) return [];
                return items.map(extractId).filter((id): id is string => Boolean(id));
            };

            // Prepare form values with safe extraction
            const formValues = {
                name: editGroup.name || '',
                serviceType: extractIds(editGroup.serviceType || []),
                areas: extractIds(editGroup.areas || []),
                leaderId: extractId(editGroup.leaderId),
                memberIds: extractIds(editGroup.memberIds || []),
                description: editGroup.description || '',
            };

            // Set form values with a small delay to ensure form is rendered
            setTimeout(() => {
                form.setFieldsValue(formValues);
                // Force form to update
                form.validateFields().catch(() => { });
            }, 100);

            // Set selection states immediately
            setSelectedServices(formValues.serviceType);
            setSelectedAreas(formValues.areas);
            setSelectedLeader(formValues.leaderId);
            setSelectedMembers(formValues.memberIds);
        } else if (mode === 'create' && open) {
            // Reset form for create mode
            form.resetFields();
            setSelectedServices([]);
            setSelectedAreas([]);
            setSelectedLeader(undefined);
            setSelectedMembers([]);
            setServiceFilter("");
            setAreaFilter("");
        }
    }, [mode, editGroup, open, form]);



    // Memoized filtered data
    const filteredServices = useMemo(() => {
        if (!serviceFilter.trim()) return serviceCategories;
        const normalizedFilter = normalizeVietnamese(serviceFilter);
        return serviceCategories.filter(service => {
            const normalizedServiceName = normalizeVietnamese(service.name);
            return normalizedServiceName.includes(normalizedFilter);
        });
    }, [serviceCategories, serviceFilter]);

    const filteredAreas = useMemo(() => {
        if (!areaFilter.trim()) return areas;
        const normalizedFilter = normalizeVietnamese(areaFilter);
        return areas.filter(area => {
            const normalizedAreaCode = normalizeVietnamese(area.code);
            return normalizedAreaCode.includes(normalizedFilter);
        });
    }, [areas, areaFilter]);

    // Filter available members and leaders
    const availableMembers = useMemo(() =>
        memberList.filter(collaborator => collaborator._id !== selectedLeader),
        [memberList, selectedLeader]
    );

    const availableLeaders = useMemo(() =>
        memberList.filter(collaborator => !selectedMembers.includes(collaborator._id)),
        [memberList, selectedMembers]
    );

    // Event handlers
    const handleOk = useCallback(() => {
        form.submit();
    }, [form]);

    const handleCancel = useCallback(() => {
        setOpen(false);
        form.resetFields();
        setSelectedServices([]);
        setSelectedAreas([]);
        setSelectedLeader(undefined);
        setSelectedMembers([]);
        setServiceFilter("");
        setAreaFilter("");
    }, [setOpen, form]);



    const handleFinish = useCallback(async (values: FormValues) => {
        try {
            setLoading(true);
            let res;

            if (mode === 'edit' && editGroup) {
                // Update existing group
                res = await updateCollaboratorGroup(editGroup._id, values);
            } else {
                // Create new group
                res = await createCollaboratorGroup(values);
            }

            if ('data' in res && res.data) {
                const groupData = res.data as Group;
                const isEdit = mode === 'edit';

                showNotification('success', isEdit ? 'Cập nhật nhóm thành công' : 'Tạo nhóm thành công');

                // Call the success callback with the group data
                onSuccess(groupData);

                handleCancel();
            } else {
                const errorMessage = res && 'message' in res
                    ? String(res.message)
                    : mode === 'edit' ? 'Cập nhật nhóm thất bại' : 'Tạo nhóm thất bại';
                showNotification('error', errorMessage);
            }
        } catch (error) {
            const isEdit = mode === 'edit';
            console.error(`Error ${isEdit ? 'updating' : 'creating'} group:`, error);
            showNotification('error', `Có lỗi xảy ra khi ${isEdit ? 'cập nhật' : 'tạo'} nhóm. Vui lòng thử lại.`);
        } finally {
            setLoading(false);
        }
    }, [mode, editGroup, onSuccess, handleCancel, setLoading]);

    // Reset selections utility function
    const resetCollaboratorSelections = useCallback(() => {
        setSelectedLeader(undefined);
        setSelectedMembers([]);
        form.resetFields(['leaderId', 'memberIds']);
    }, [form]);

    const handleServiceChange = useCallback((values: string[]) => {
        setSelectedServices(values);
        resetCollaboratorSelections();
    }, [resetCollaboratorSelections]);

    const handleAreaChange = useCallback((values: string[]) => {
        setSelectedAreas(values);
        resetCollaboratorSelections();
    }, [resetCollaboratorSelections]);

    const handleLeaderChange = useCallback((value: string) => {
        setSelectedLeader(value);
        // Remove leader from members if they were selected
        setSelectedMembers(prevMembers => {
            const newMembers = prevMembers.filter(memberId => memberId !== value);
            if (newMembers.length !== prevMembers.length) {
                // Only update form if there was a change
                form.setFieldValue('memberIds', newMembers);
            }
            return newMembers;
        });
    }, [form]);

    const handleMembersChange = useCallback((values: string[]) => {
        // Remove leader from members if they try to select the leader as member
        const filteredValues = selectedLeader ? values.filter(memberId => memberId !== selectedLeader) : values;
        setSelectedMembers(filteredValues);

        // Update form if values were filtered
        if (filteredValues.length !== values.length) {
            form.setFieldValue('memberIds', filteredValues);
        }
    }, [selectedLeader, form]);

    const canSelectCollaborators = selectedAreas.length > 0 && selectedServices.length > 0;
    const modalTitle = mode === 'edit' ? 'Cập nhật nhóm' : 'Tạo nhóm mới';

    return (
        <Modal
            title={modalTitle}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={600}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                preserve={false}
            >
                <Form.Item
                    label="Tên nhóm"
                    name="name"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tên nhóm' },
                        { min: 2, message: 'Tên nhóm phải có ít nhất 2 ký tự' }
                    ]}
                >
                    <Input placeholder="Nhập tên nhóm" />
                </Form.Item>

                <Form.Item
                    label="Chọn dịch vụ"
                    name="serviceType"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một dịch vụ' }]}
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
                                {service.name} - {service.type === 'business' ? 'DV doanh nghiệp' : 'DV cá nhân'}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Chọn khu vực"
                    name="areas"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một khu vực' }]}
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
                    label="Chọn nhóm trưởng"
                    name="leaderId"
                    rules={[{ required: true, message: 'Vui lòng chọn nhóm trưởng' }]}
                >
                    <Select
                        showSearch
                        placeholder="Chọn nhóm trưởng"
                        allowClear
                        onChange={handleLeaderChange}
                        disabled={!canSelectCollaborators}
                        filterOption={(input, option) => {
                            const collaborator = availableLeaders.find(c => c._id === option?.value);
                            if (!collaborator) return false;
                            const searchText = normalizeVietnamese(input);
                            const name = normalizeVietnamese(collaborator.userId.fullName);
                            const code = normalizeVietnamese(collaborator.code);
                            return name.includes(searchText) || code.includes(searchText);
                        }}
                    >
                        {availableLeaders.map(collaborator => (
                            <Select.Option key={collaborator._id} value={collaborator._id}>
                                {`${collaborator.userId.fullName} - ${collaborator.code}`}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Thêm thành viên"
                    name="memberIds"
                >
                    <Select
                        mode="multiple"
                        showSearch
                        placeholder="Chọn thành viên"
                        allowClear
                        onChange={handleMembersChange}
                        disabled={!canSelectCollaborators}
                        filterOption={(input, option) => {
                            const collaborator = availableMembers.find(c => c._id === option?.value);
                            if (!collaborator) return false;
                            const searchText = normalizeVietnamese(input);
                            const name = normalizeVietnamese(collaborator.userId.fullName);
                            const code = normalizeVietnamese(collaborator.code);
                            return name.includes(searchText) || code.includes(searchText);
                        }}
                    >
                        {availableMembers.map(collaborator => (
                            <Select.Option key={collaborator._id} value={collaborator._id}>
                                {`${collaborator.userId.fullName} - ${collaborator.code}`}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                >
                    <Input.TextArea
                        placeholder="Nhập mô tả"
                        autoSize={{ minRows: 3, maxRows: 6 }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}