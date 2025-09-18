import { useState } from "react";
import { useCollaboratorGroups } from "./useCollaboratorGroups";
import { useGroupCollaboratorContext } from "../provider/collaborator-group-provider";
import { deleteGroup, deleteMemberOfGroup, updateGroupStatus } from "@/api/user/collaborator-group-api";
import { notify } from "@/components/Notification";


export function useDeleteMember() {
    const [loading, setLoading] = useState(false);

    const { refetch } = useCollaboratorGroups();
    const { actionType, partnerIdToDelete, currentGroupId, statusToUpdate, handleCloseDeleteModal, handleCloseUpdateStatusModal } = useGroupCollaboratorContext();

    const handleDelMemberOk = async () => {
        try {
            setLoading(true);
            if (!actionType) {
                console.error("No action type specified");
                return;
            }

            if (actionType === 'delete-member') {
                if (!partnerIdToDelete || !currentGroupId) {
                    console.error("No user ID or group ID provided for member deletion");
                    return;
                }

                const res = await deleteMemberOfGroup(currentGroupId, partnerIdToDelete);

                if (res && 'success' in res && res.success) {
                    // Update local state: remove member from the group's memberIds
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Xoá thành viên thành công',
                    });
                    refetch();
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Xoá thành viên không thành công',
                    });
                }
            } else if (actionType === 'update-status') {
                if (!partnerIdToDelete || !statusToUpdate) {
                    console.error("No group ID or status provided for status update");
                    return;
                }

                const res = await updateGroupStatus(partnerIdToDelete, statusToUpdate as 'active' | 'inactive' | 'restricted');

                if (res && 'success' in res && res.success) {
                    // Update local state: update group status
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Cập nhật trạng thái nhóm thành công',
                    });
                    refetch();
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Cập nhật trạng thái nhóm không thành công',
                    });
                }
            } else if (actionType === 'delete-group') {
                if (!partnerIdToDelete) {
                    console.error("No group ID provided for group deletion");
                    return;
                }

                const res = await deleteGroup(partnerIdToDelete);

                if (res && 'success' in res && res.success) {
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Xoá nhóm thành công',
                    });
                    refetch();
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Xoá nhóm không thành công',
                    });
                }
            }

        } catch (error) {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi thực hiện thao tác',
            });
            console.error("Error performing action:", error);
        } finally {
            handleCloseDeleteModal();
            handleCloseUpdateStatusModal();
            setLoading(false);
        }
    };

    return { handleDelMemberOk, loading };
}