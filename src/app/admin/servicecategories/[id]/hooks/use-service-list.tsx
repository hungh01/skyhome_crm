import { getServicesByCategoryId } from "@/api/service/service-api";
import { isDetailResponse } from "@/utils/response-handler";
import { useCallback, useEffect, useState } from "react";
import { useServiceContext } from "../providers/service-provider";

export const useGetServiceList = (serviceCategoryId: string) => {
    const [loading, setLoading] = useState(false);
    const { services, setServices, selectedService, setSelectedService } = useServiceContext();

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getServicesByCategoryId(serviceCategoryId);
            if (isDetailResponse(response)) {
                setServices(response.data);
                // Auto select first service if exists
                if (response.data.length > 0) {
                    const firstService = response.data[0];
                    setSelectedService(firstService);
                }
            }
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    }, [serviceCategoryId, setServices, setSelectedService]);

    useEffect(() => {
        if (serviceCategoryId) {
            fetchServices();
        }
    }, [serviceCategoryId, fetchServices]);

    const refetch = async () => {
        await fetchServices();
    };

    return {
        loading,
        services,
        selectedService,
        refetch,
    };
};