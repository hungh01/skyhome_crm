import { useState } from "react";
import { FormValues } from "../type/form-value";
import { notify } from "@/components/Notification";
import { createCollaboratorGroup, updateCollaboratorGroup } from "@/api/user/collaborator-group-api";
import { Group } from "@/type/user/collaborator/group";
import { useCollaboratorGroups } from "./useCollaboratorGroups";
import { useGroupCollaboratorContext } from "../provider/collaborator-group-provider";



export function useAddGroup(mode: 'create' | 'edit', handleCancel: () => void, editGroup?: Group) {
    const [loading, setLoading] = useState(false);
    const { refetch } = useCollaboratorGroups();

    const handleCreateOrEditFinish = async (values: FormValues) => {
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

                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: mode === 'edit' ? 'Cập nhật nhóm cộng tác viên thành công!' : 'Tạo nhóm cộng tác viên thành công!',
                });
                refetch();
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: mode === 'edit' ? 'Cập nhật nhóm cộng tác viên thất bại!' : 'Tạo nhóm cộng tác viên thất bại!',
                });
            }
        } catch (error) {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra, vui lòng thử lại!',
            });
            console.error('Error creating/updating collaborator group:', error);
        } finally {
            setLoading(false);
            handleCancel();
        }
    }
    return { handleCreateOrEditFinish, loading };
}