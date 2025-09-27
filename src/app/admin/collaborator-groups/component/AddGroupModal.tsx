
'use client';

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Form, Input, Modal, Select } from "antd";

import { Collaborator } from "@/type/user/collaborator/collaborator";

import { useGetMemberToAdd } from "../hooks/use-get-member-to-add";
import { useAreasFilterWithCache } from "@/hooks/useAreasFilter";
import { useServiceCategoryFilter } from "@/hooks/useServiceTypeFilter";
import { useAddGroup } from "../hooks/use-add-group";
import { FormValues } from "../type/form-value";
import { useGroupCollaboratorContext } from "../provider/collaborator-group-provider";

interface AddGroupModalProps {
    mode?: 'create' | 'edit';
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


export default function AddGroupModal({ mode = 'create' }: AddGroupModalProps) {

    const { openCreateGroupModal, setOpenCreateGroupModal, editingGroup } = useGroupCollaboratorContext();
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

    const [memberList, setMemberList] = useState<Collaborator[]>([]);

    // Custom hooks
    const { areas, loading: areasFilterLoading } = useAreasFilterWithCache();
    const { serviceCategories, loading: serviceCategoriesLoading } = useServiceCategoryFilter();
    const { loading: memberLoading } = useGetMemberToAdd({ selectedServices, selectedAreas, groupId: '', setCollaborators: setMemberList });

    // Effect to populate form when editing
    useEffect(() => {
        if (mode === 'edit' && editingGroup && openCreateGroupModal) {

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
                name: editingGroup.name || '',
                serviceType: extractIds(editingGroup.serviceType || []),
                areas: extractIds(editingGroup.areas || []),
                leaderId: extractId(editingGroup.leaderId),
                memberIds: extractIds(editingGroup.memberIds || []),
                description: editingGroup.description || '',
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
        } else if (mode === 'create' && openCreateGroupModal) {
            // Reset form for create mode
            form.resetFields();
            setSelectedServices([]);
            setSelectedAreas([]);
            setSelectedLeader(undefined);
            setSelectedMembers([]);
            setServiceFilter("");
            setAreaFilter("");
        }
    }, [mode, editingGroup, open, form]);



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
        setOpenCreateGroupModal(false);
        form.resetFields();
        setSelectedServices([]);
        setSelectedAreas([]);
        setSelectedLeader(undefined);
        setSelectedMembers([]);
        setServiceFilter("");
        setAreaFilter("");
    }, [setOpenCreateGroupModal, form]);

    const { handleCreateOrEditFinish, loading: submitting } = useAddGroup(mode, handleCancel, editingGroup);


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
            open={openCreateGroupModal}
            onOk={handleOk}
            confirmLoading={submitting}
            onCancel={handleCancel}
            width={600}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateOrEditFinish}
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
                        loading={serviceCategoriesLoading}
                    >
                        {serviceCategories.filter(service => {
                            const normalizedServiceName = normalizeVietnamese(service.name);
                            return normalizedServiceName.includes(normalizeVietnamese(serviceFilter));
                        }).map(service => (
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
                        loading={areasFilterLoading}
                    >
                        {areas.map(area => (
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
                        loading={memberLoading}
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
                        loading={memberLoading}
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