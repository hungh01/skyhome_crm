

// hooks/usePromotions.tsx
import { useEffect, useState } from 'react';
import { couponListApi } from '@/api/promotion/coupons-api';
import { isDetailResponse } from '@/utils/response-handler';
import { usePromotionContext } from '../provider/promotions-provider';

export function usePromotionList() {
    const context = usePromotionContext();
    const [loading, setLoading] = useState(false);

    if (!context) {
        throw new Error('usePromotions must be used within PromotionProvider');
    }

    const {
        // Dependencies from context
        page,
        search,
        status,
        type,
        dateRange,
        // Data setters
        setData,
        data
    } = context;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await couponListApi(
                    page,
                    10,
                    search,
                    status || "",
                    type || "",
                    dateRange ? dateRange[0] as string : "",
                    dateRange ? dateRange[1] as string : ""
                );

                if (isDetailResponse(response)) {
                    setData(response);
                }
            } catch (error) {
                console.error('Error fetching promotions:', error);
                // Handle error appropriately
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [page, search, status, type, dateRange, setData, setLoading]);

    return {
        data,
        loading
    };
}