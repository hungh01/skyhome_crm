import { customerListApi } from "@/api/user/customer-api";
import { Customer } from "@/type/user/customer/customer";
import { isDetailResponse } from "@/utils/response-handler";
import { useCallback, useEffect, useState } from "react";


interface UseCustomerProps {
    search?: string;
}


export function useCustomerFilter({ search }: UseCustomerProps) {
    // Implementation of the hook
    // This is a placeholder implementation; replace with actual logic as needed
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            // Replace with actual API call
            const response = await customerListApi(1, 10, '', '', search);
            if (isDetailResponse(response)) {
                setCustomers(response.data);
            } else {
                setError("Failed to fetch customers");
            }
        } catch (error) {

            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setLoading(false);
        }
    }, [search]);

    // Fetch customers when the search term changes
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);


    return { customers, loading, error };
}
