import { addMemberToGroup } from "@/api/user/collaborator-group-api";
import { notify } from "@/components/Notification";
import { useCallback, useState } from "react";


export function useAddMember({
    groupId,
    values,
    onsuccess,
}: {
    groupId: string;
    values: { memberIds: string[] };
    onsuccess: () => void;
}) {
    console.log('useAddMember values:', values);
    const [loading, setLoading] = useState(false);

    const handleOk = useCallback(async () => {
        try {

            const { memberIds } = values;

            if (!memberIds || memberIds.length === 0) {
                notify({
                    type: 'warning',
                    message: 'Thông báo',
                    description: 'Vui lòng chọn ít nhất một thành viên để thêm vào nhóm'
                });
                return;
            }

            setLoading(true);

            // Add members to group (assuming API accepts array of member IDs)
            const response = await addMemberToGroup(groupId, memberIds);

            if (response && 'success' in response && response.success) {
                // Update local data: find the group and add new members to its memberIds
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: `Đã thêm ${memberIds.length} thành viên vào nhóm thành công!`
                })
                // form.resetFields();
                // setSearchValue('');
                // setOpen(false);
                onsuccess();
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: 'Không thể thêm thành viên vào nhóm'
                })
            }

        } catch (error) {
            console.error('Error adding members to group:', error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi thêm thành viên'
            });
        } finally {
            setLoading(false);
        }
    }, [groupId, values, onsuccess]);

    return { handleOk, loading };
}