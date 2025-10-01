import { useState } from "react";
import { useBannerList } from "./useBannerList";
import { updateBanner } from "../api/banner-api";
import { isDetailResponse } from "@/utils/response-handler";
import { Banner } from "../type/banner";
import { notify } from "@/components/Notification";


export const useStatusChange = () => {
    const { refetch } = useBannerList();
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (bannerId: string, checked: boolean) => {
        setLoading(true);
        try {
            const response = await updateBanner(bannerId, { status: checked });
            if (isDetailResponse<Banner>(response)) {
                refetch();
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Cập nhật trạng thái banner thành công!',
                });
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: 'Cập nhật trạng thái banner thất bại!',
                });
            }
        } catch (error) {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Đã xảy ra lỗi khi cập nhật trạng thái banner!',
            });
        } finally {
            setLoading(false);
        }
    };

    return { loading, handleStatusChange };
};