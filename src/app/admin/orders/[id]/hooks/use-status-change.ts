import { updateOrderStatus } from "@/api/order/order-api";
import { notify } from "@/components/Notification";
import { isDetailResponse } from "@/utils/response-handler";
import { useState } from "react";


export function useStatusChange(id: string, userId: string | undefined, selectedStatus: string, statusChangeSuccess: () => void, statusChangeError: () => void) {
    const [loading, setLoading] = useState(false);

    const handleConfirmStatusChange = async () => {
        if (!selectedStatus) return;

        setLoading(true);
        try {
            const response = await updateOrderStatus(id, selectedStatus, userId || '');
            if (isDetailResponse(response) && response.data) {
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Trạng thái đơn hàng đã được cập nhật thành công!',
                });
            }
            statusChangeSuccess();
        } catch (error) {
            console.error("Error updating order status:", error);
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.',
            });
            statusChangeError();
        } finally {
            setLoading(false);
        }
    };

    return { handleConfirmStatusChange, loading };
}