import { Modal, Select, Form, message } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { getCollaborators, addMemberToGroup } from '@/api/user/collaborator-group-api';

interface AddMemberModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    groupId: string;
    groupName: string;
    existingMemberIds: string[];
    onMemberAdded?: () => void;
}

interface Collaborator {
    _id: string;
    code: string;
    fullName: string;
    userId?: {
        phone?: string;
        email?: string;
    };
}

export default function AddMemberModal({
    open,
    setOpen,
    groupId,
    groupName,
    existingMemberIds,
    onMemberAdded
}: AddMemberModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
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

    // Fetch available collaborators
    useEffect(() => {
        const fetchCollaborators = async () => {
            if (open) {
                try {
                    setLoading(true);
                    const response = await getCollaborators([], []);
                    if ('data' in response) {
                        setCollaborators(response.data);
                    } else {
                        setCollaborators([]);
                    }
                } catch (error) {
                    console.error('Error fetching collaborators:', error);
                    message.error('Không thể tải danh sách cộng tác viên');
                    setCollaborators([]);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCollaborators();
    }, [open]);

    // Filter available collaborators (exclude existing members)
    const availableCollaborators = collaborators.filter(
        collaborator => !existingMemberIds.includes(collaborator._id)
    );

    // Filter collaborators based on search
    const filteredCollaborators = availableCollaborators.filter(collaborator => {
        if (!searchValue) return true;

        const normalizedSearch = normalizeVietnamese(searchValue);
        const normalizedName = normalizeVietnamese(collaborator.fullName);
        const normalizedCode = normalizeVietnamese(collaborator.code);
        const normalizedPhone = collaborator.userId?.phone ? normalizeVietnamese(collaborator.userId.phone) : '';

        return normalizedName.includes(normalizedSearch) ||
            normalizedCode.includes(normalizedSearch) ||
            normalizedPhone.includes(normalizedSearch);
    });

    const handleOk = useCallback(async () => {
        try {
            const values = await form.validateFields();
            const { memberIds } = values;

            if (!memberIds || memberIds.length === 0) {
                message.warning('Vui lòng chọn ít nhất một thành viên');
                return;
            }

            setLoading(true);

            // Add members to group (assuming API accepts array of member IDs)
            const response = await addMemberToGroup(groupId, memberIds);

            if (response && 'success' in response && response.success) {
                message.success(`Đã thêm ${memberIds.length} thành viên vào nhóm "${groupName}"`);
                form.resetFields();
                setSearchValue('');
                setOpen(false);

                // Callback to refresh parent component
                if (onMemberAdded) {
                    onMemberAdded();
                }
            } else {
                message.error('Không thể thêm thành viên vào nhóm');
            }

        } catch (error) {
            console.error('Error adding members to group:', error);
            message.error('Có lỗi xảy ra khi thêm thành viên');
        } finally {
            setLoading(false);
        }
    }, [form, groupId, groupName, onMemberAdded, setOpen]);

    const handleCancel = useCallback(() => {
        form.resetFields();
        setSearchValue('');
        setOpen(false);
    }, [form, setOpen]);

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
                        loading={loading}
                        showSearch
                        searchValue={searchValue}
                        onSearch={setSearchValue}
                        filterOption={false}
                        style={{ width: '100%' }}
                        maxTagCount="responsive"
                        notFoundContent={loading ? 'Đang tải...' : 'Không tìm thấy cộng tác viên nào'}
                    >
                        {filteredCollaborators.map(collaborator => (
                            <Select.Option
                                key={collaborator._id}
                                value={collaborator._id}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>
                                            {collaborator.fullName}
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
