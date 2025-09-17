import { customerListApi } from "@/api/user/customer-api";
import { useCallback, useEffect, useState } from "react";
import { useCustomerContext } from "../provider/customer-provider";
import { PAGE_SIZE } from "@/common/page-size";


export function useCustomerList() {
    const [loading, setLoading] = useState(false);
    const { data, page, searchCustomerName, searchAddress, searchCustomerCode, searchCreatedAt, setData } = useCustomerContext();


    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await customerListApi(
                page,
                PAGE_SIZE,
                searchCustomerCode,
                searchCreatedAt,
                searchCustomerName,
                searchAddress,
            );
            if ('data' in res) {
                setData(res);
            } else {
                console.error("Failed to fetch customers:", res);
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchCustomers();
    }, [
        page,
        searchCustomerName,
        searchAddress,
        searchCustomerCode,
        searchCreatedAt
    ]);

    const refetch = useCallback(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    return {
        data,
        loading,
        refetch
    };
}
