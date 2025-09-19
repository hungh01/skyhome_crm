import { getOrderById } from "@/api/order/order-api";
import { Order } from "@/type/order/order";
import { isDetailResponse } from "@/utils/response-handler";
import { useCallback, useEffect, useState } from "react";


export function useOrder(id: string, setOrder: (order: Order) => void) {
    const [loading, setLoading] = useState(false);

    const fetchOrder = async () => {
        setLoading(true);
        try {
            const response = await getOrderById(id);
            if (isDetailResponse(response) && response.data) {
                setOrder(response.data);
            } else {
                throw new Error('Failed to fetch order data');
            }
        } catch (error) {
            console.error("Error fetching order:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchOrder();
    }, [id]);

    const refetch = useCallback(() => {
        fetchOrder();
    }, [id]);

    return { loading, refetch };

}