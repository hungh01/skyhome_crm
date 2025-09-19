import { useCallback, useEffect, useState } from "react";
import { useOrderContext } from "../provider/order-provider";
import { getOrders } from "@/api/order/order-api";
import { isDetailResponse } from "@/utils/response-handler";

export function useOrderList() {

    const [loading, setLoading] = useState(false);

    const { data, setData, page, debouncedOrderSearch, statusSearch, createdAtStart, createdAtEnd } = useOrderContext();

    const fetchData = async () => {
        setLoading(true);
        try {
            setLoading(true);
            const response = await getOrders(
                page,
                debouncedOrderSearch,
                createdAtStart,
                createdAtEnd,
                statusSearch
            );

            if (isDetailResponse(response)) {
                setData(response);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [page, debouncedOrderSearch, createdAtStart, createdAtEnd, statusSearch]);
    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        refetch
    };
}