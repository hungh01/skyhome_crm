

// hooks/usePromotionActions.ts
import { useState } from 'react';
import { addCouponApi, updateCouponApi } from '@/api/promotion/coupons-api';
import { notify } from '@/components/Notification';
import { Promotion } from '@/type/promotion/promotion';

export function usePromotionActions() {
    const [loading, setLoading] = useState(false);

    const handleSavePromotion = async (
        coupon: Promotion,
    ) => {
        setLoading(true);
        try {
            if (coupon._id) {
                // Update existing promotion
                const { _id, ...rest } = coupon;
                const updateData = await updateCouponApi(_id, rest);

                if (updateData.data) {
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Cập nhật khuyến mãi thành công!',
                    });
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Cập nhật khuyến mãi thất bại!',
                    });
                }
            } else {
                // Create new promotion
                const newData = await addCouponApi(coupon);
                if (newData) {
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Tạo khuyến mãi thành công!',
                    });
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
                description: 'Có lỗi xảy ra, vui lòng thử lại!',
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
                description: 'Có lỗi xảy ra khi tải khuyến mãi, vui lòng thử lại!',
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