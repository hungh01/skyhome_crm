import { useEffect, useState, useCallback } from "react";
import { useBannerContext } from "../provider/banner-provider";
import { isDetailResponse } from "@/utils/response-handler";
import { getAllBanners } from "@/app/admin/banners/api/banner-api";



export function useBannerList() {

    const [loading, setLoading] = useState(false);

    const { data, setData, page, search, type, status } = useBannerContext();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllBanners(page, 10, search, type, status);
            if (isDetailResponse(response)) {
                setData(response);
            } else {
                setData({ data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });
            }
        } catch (error) {
            console.error("Error fetching banners:", error);
            setData({ data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });
        } finally {
            setLoading(false);
        }
    }, [page, search, type, status, setData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        refetch,
    };
}