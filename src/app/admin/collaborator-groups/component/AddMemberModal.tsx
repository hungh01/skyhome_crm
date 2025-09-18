import { Modal, Select, Form, message } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { addMemberToGroup } from '@/api/user/collaborator-group-api';
import { notify } from '@/components/Notification';
import { Collaborator } from '@/type/user/collaborator/collaborator';
import { DetailResponse } from '@/type/detailResponse/detailResponse';
import { Group } from '@/type/user/collaborator/group';
import { useGetMemberToAdd } from '../hooks/use-get-member-to-add';
import { useAddMember } from '../hooks/use-add-member';

interface AddMemberModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    groupId: string;
    groupName: string;
    existingMemberIds: string[];
    refetch: () => void;
}


export default function AddMemberModal({
    open,
    setOpen,
    groupId,
    groupName,
    existingMemberIds,
    refetch,
}: AddMemberModalProps) {
    const [form] = Form.useForm();
    const [memberIds, setMemberIds] = useState<string[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [searchValue, setSearchValue] = useState('');

    // Function to normalize Vietnamese text (remove diacritics)
    const normalizeVietnamese = (str: string) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase();
    };

    const { loading: loadingCollaborators } = useGetMemberToAdd({ selectedServices: [], selectedAreas: [], groupId, setCollaborators });


    // Filter available collaborators (exclude existing members)
    const availableCollaborators = collaborators.filter(
        collaborator => !existingMemberIds.includes(collaborator._id)
    );

    // Filter collaborators based on search
    const filteredCollaborators = availableCollaborators.filter(collaborator => {
        if (!searchValue) return true;

        const normalizedSearch = normalizeVietnamese(searchValue);
        const normalizedName = normalizeVietnamese(collaborator.userId.fullName);
        const normalizedCode = normalizeVietnamese(collaborator.code);
        const normalizedPhone = collaborator.userId?.phone ? normalizeVietnamese(collaborator.userId.phone) : '';

        return normalizedName.includes(normalizedSearch) ||
            normalizedCode.includes(normalizedSearch) ||
            normalizedPhone.includes(normalizedSearch);
    });


    const handleCancel = useCallback(() => {
        form.resetFields();
        setSearchValue('');
        setOpen(false);
        refetch();
        setMemberIds([]);
    }, [form, setOpen]);

    const { handleOk, loading } = useAddMember({
        groupId,
        values: { memberIds: memberIds },
        onsuccess: handleCancel
    });

    return (
        <Modal
            title={`Thêm thành viên vào nhóm "${groupName}"`}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={loading}
            width={600}
            okText="Thêm thành viên"
            cancelText="Hủy"
        >
            <Form
                form={form}
                layout="vertical"
                style={{ marginTop: 16 }}
            >
                <Form.Item
                    label="Chọn thành viên"
                    name="memberIds"
                    rules={[
                        { required: true, message: 'Vui lòng chọn ít nhất một thành viên' }
                    ]}

                >
                    <Select
                        mode="multiple"
                        placeholder="Tìm kiếm và chọn thành viên..."
                        loading={loadingCollaborators}
                        showSearch
                        searchValue={searchValue}
                        onSearch={setSearchValue}
                        onChange={(value) => setMemberIds(value)}
                        value={memberIds}
                        filterOption={false}
                        style={{ width: '100%' }}
                        maxTagCount="responsive"
                        notFoundContent={loadingCollaborators ? 'Đang tải...' : 'Không tìm thấy cộng tác viên nào'}
                    >
                        {filteredCollaborators.map(collaborator => (
                            <Select.Option
                                key={collaborator._id}
                                value={collaborator._id}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>
                                            {collaborator.userId.fullName}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            Mã: {collaborator.code}
                                            {collaborator.userId?.phone && ` • ${collaborator.userId.phone}`}
                                        </div>
                                    </div>
                                </div>
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {availableCollaborators.length === 0 && !loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: '#666',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '6px',
                        marginTop: '8px'
                    }}>
                        Tất cả cộng tác viên đã là thành viên của nhóm này
                    </div>
                )}

                {filteredCollaborators.length > 0 && (
                    <div style={{
                        fontSize: '12px',
                        color: '#666',
                        marginTop: '8px'
                    }}>
                        Tìm thấy {filteredCollaborators.length} cộng tác viên có thể thêm vào nhóm
                    </div>
                )}
            </Form>
        </Modal>
    );
}
