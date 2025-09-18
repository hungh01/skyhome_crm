import { customerDetailApi } from "@/api/user/customer-api";
import { useCallback, useEffect, useState } from "react";
import { useCustomerDetailContext } from "../provider/customer-detail-provider";

// Custom hook for customer data management
export function useCustomerData(customerId: string) {
    const [loading, setLoading] = useState(true);
    const { customer, setCustomer } = useCustomerDetailContext();


    const fetchCustomer = useCallback(async () => {
        if (!customerId) return;

        setLoading(true);
        try {
            const response = await customerDetailApi(customerId);
            if ('data' in response && response.data) {
                setCustomer(response.data);
            } else {
                setCustomer(undefined);
            }
        } catch (error) {
            console.error('Error fetching customer:', error);
            setCustomer(undefined);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    const refetch = useCallback(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    return { customer, loading, refetch };
};