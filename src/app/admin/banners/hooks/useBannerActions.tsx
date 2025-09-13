import { notify } from "@/components/Notification";
import { useState } from "react";
import { BannerRequest } from "../type/banner";
import { createBanner, updateBanner } from "../api/banner-api";
import { isDetailResponse } from "@/utils/response-handler";
import { useBannerContext } from "../provider/banner-provider";


export function useBannerActions() {
    const [loading, setLoading] = useState(false);
    const { setShowCreateModal, refetch } = useBannerContext();

    const handleSaveBanner = async (data: BannerRequest) => {
        setLoading(true);
        try {
            if (data._id) {
                const response = await updateBanner(data._id, data);
                if (isDetailResponse(response)) {
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Cập nhật banner thành công!',
                    });
                    setShowCreateModal(false);
                    // Refetch data after successful update
                    if (refetch) {
                        refetch();
                    }
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Cập nhật banner thất bại!',
                    });
                }
            } else {
                const response = await createBanner(data);
                if (isDetailResponse(response)) {
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Tạo banner thành công!',
                    });
                    setShowCreateModal(false);
                    // Refetch data after successful create
                    if (refetch) {
                        refetch();
                    }
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Tạo banner thất bại!',
                    });
                }
            }
        } catch (error) {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra, vui lòng thử lại!',
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSaveBanner,
        loading,
    };
}