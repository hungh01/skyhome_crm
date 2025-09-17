'use client';
import { updateCollaboratorStatusApi } from "@/api/user/collaborator-api";
import { notify } from "@/components/Notification";
import { isDetailResponse } from "@/utils/response-handler";
import { useState } from "react";



export function useUpdateCollabStatus() {

    const [loading, setLoading] = useState(false);

    const handleUpdateStatus = async (
        partnerIdToUpdate: string | undefined,
        statusToUpdate: string | undefined,
        finallyUpdate: () => void = () => { }
    ) => {
        try {
            setLoading(true);
            if (!partnerIdToUpdate || !statusToUpdate) {
                console.error("No user ID or status provided for action");
                return;
            }
            const response = await updateCollaboratorStatusApi(partnerIdToUpdate, statusToUpdate);

            if (isDetailResponse(response)) {
                // Update local state
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Cập nhật trạng thái thành công',
                });
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: 'Cập nhật trạng thái không thành công',
                });
            }

        } catch (error) {
            console.error("Error performing action:", error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi thực hiện thao tác',
            });
        } finally {
            setLoading(false);
            finallyUpdate();
        }
    };
    return { handleUpdateStatus, loading };
}