

// hooks/usePromotionActions.ts
import { useState } from 'react';
import { addCouponApi, updateCouponApi } from '@/api/promotion/coupons-api';
import { notify } from '@/components/Notification';
import { UpdatePromotion } from '@/type/promotion/promotion';
import { isDetailResponse } from '@/utils/response-handler';
import { usePromotionList } from './usePromotionList';

export function usePromotionActions() {
    const [loading, setLoading] = useState(false);
    const { refetch } = usePromotionList();

    const handleSavePromotion = async (
        coupon: UpdatePromotion,
    ) => {
        setLoading(true);
        try {
            let data = {};
            let id = undefined;

            const { _id, ...rest } = coupon;
            data = { ...rest };
            if (_id !== '' && _id !== undefined && _id !== null) {
                id = _id;
            }

            if (id) {
                const updateData = await updateCouponApi(id, data);
                if (updateData.data) {
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Cập nhật khuyến mãi thành công!',
                    });
                    refetch();
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Cập nhật khuyến mãi thất bại!',
                    });
                }
            } else {
                // Create new promotion
                const newData = await addCouponApi(data);
                if (isDetailResponse(newData)) {
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Tạo khuyến mãi thành công!',
                    });
                    refetch();
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Tạo khuyến mãi thất bại!',
                    });
                }
            }
        } catch (error) {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại!',
            });
        } finally {
            setLoading(false);
        }
    };

    const getPromotion = async () => {
        setLoading(true);
        try {
            // Fetch promotion logic here
        } catch (error) {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: error instanceof Error ? error.message : 'Có lỗi xảy ra, vui lòng thử lại!',
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        handleSavePromotion,
        getPromotion,
        loading
    };
}