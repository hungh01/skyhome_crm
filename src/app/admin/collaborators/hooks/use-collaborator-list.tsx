'use client';
import dayjs from "dayjs";

import { collaboratorListApi } from "@/api/user/collaborator-api";
import { isDetailResponse } from "@/utils/response-handler";
import { useCallback, useEffect, useState } from "react";
import { useCollaboratorContext } from "../provider/collaborator-provider";
import { PAGE_SIZE } from "@/common/page-size";

export function useCollaboratorList() {

    const [loading, setLoading] = useState(false);

    const { data, setData, page, debouncedSearchName, searchAreas, searchActiveDate, searchServices, statusFilter } = useCollaboratorContext();

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await collaboratorListApi(
                page,
                PAGE_SIZE,
                searchActiveDate ? dayjs(searchActiveDate).format('YYYY-MM-DD') : '',
                debouncedSearchName,
                searchAreas,
                searchServices,
                statusFilter
            );
            if (isDetailResponse(response)) {
                setData(response);
            } else {
                setData({ data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });
            }
        } catch (error) {
            console.error("Error fetching collaborators:", error);
            setData({ data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearchName, searchAreas, searchActiveDate, searchServices, statusFilter, setData]);

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