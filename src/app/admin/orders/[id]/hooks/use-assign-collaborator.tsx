import { assignCollaboratorToOrder } from "@/api/order/order-api";
import { notify } from "@/components/Notification";
import { isDetailResponse } from "@/utils/response-handler";
import { useState } from "react";

export function useAssignCollaborator(id: string, selectedCollaboratorId: string, userId: string | undefined, tranfernote: string, refetch: () => void) {
    const [loading, setLoading] = useState(false);

    const handleAssignCollaborator = async () => {
        if (!selectedCollaboratorId) {
            notify({
                type: 'warning',
                message: 'Thông báo',
                description: 'Vui lòng chọn cộng tác viên trước khi gán!',
            });
            return;
        }
        setLoading(true);
        try {
            const response = await assignCollaboratorToOrder(id, selectedCollaboratorId, userId || '', tranfernote);
            if (isDetailResponse(response) && response.data) {
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Cộng tác viên đã được gán thành công!',
                });
                refetch();
            }
        } catch (error) {
            console.error("Error assigning collaborator:", error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Gán cộng tác viên thất bại. Vui lòng thử lại!',
            });
        } finally {
            setLoading(false);
        }
    };



    return { handleAssignCollaborator, loading };
}

