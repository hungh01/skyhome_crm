import { useCallback, useEffect, useState } from "react";

import { isDetailResponse } from "@/utils/response-handler";
import { getAllNews } from "../api/news-api";
import { useNewsContext } from "../provider/news-provider";


export function useNewsList() {
    const [loading, setLoading] = useState<boolean>(false);
    const { data, setData, page, search, category, status, setRefetch } = useNewsContext();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Giả sử có hàm getAllNews để lấy dữ liệu bài viết
            const response = await getAllNews(page, 10, search, category, status);
            if (isDetailResponse(response)) {
                setData(response);
            } else {
                setData({ data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });
            }
        } catch (error) {
            console.error("Error fetching News:", error);
            setData({ data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });
        } finally {
            setLoading(false);
        }
    }, [page, search, category, status, setData]);

    // Tự động gọi fetchData khi các tham số thay đổi
    useEffect(() => {
        fetchData();
    }, [page, search, category, status]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    // Hook đăng ký function refetch vào context
    useEffect(() => {
        setRefetch(() => refetch); // Lưu function vào state
        return () => setRefetch(null); // Cleanup khi unmount
    }, [refetch, setRefetch]);

    return {
        data,
        loading,
    };
}