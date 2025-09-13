
import { useState, useEffect, useCallback } from "react";

import { isDetailResponse } from "@/utils/response-handler";
import { ServiceCategory } from "@/type/services/service-category";
import { getServiceCategory } from "@/api/service/service-categories-api";

let cachedServiceCategories: ServiceCategory[] | null = null;
let cacheTime: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes


export function useServiceCategoryFilter(enableCache: boolean = true) {
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchServiceCategories = useCallback(async (forceRefresh = false) => {
        // Check cache 
        if (enableCache && !forceRefresh && cachedServiceCategories && cacheTime) {
            const now = Date.now();
            if (now - cacheTime < CACHE_DURATION) {
                setServiceCategories(cachedServiceCategories);
                return;
            }
        }

        setLoading(true);
        setError(null);
        try {
            const result = await getServiceCategory();
            if (isDetailResponse(result)) {
                setServiceCategories(result.data);

                // Update cache
                if (enableCache) {
                    cachedServiceCategories = result.data;
                    cacheTime = Date.now();
                }
            } else {
                setError("Failed to fetch service categories");
                console.error("Failed to fetch service categories:", result);
            }
        } catch (error) {
            setError("Error fetching service categories");
            console.error("Error fetching service categories:", error);
        } finally {
            setLoading(false);
        }
    }, [enableCache]);

    useEffect(() => {
        fetchServiceCategories();
    }, [fetchServiceCategories]);

    const refetch = useCallback(() => {
        return fetchServiceCategories(true); // Force refresh
    }, [fetchServiceCategories]);

    const clearCache = useCallback(() => {
        cachedServiceCategories = null;
        cacheTime = null;
    }, []);

    return {
        serviceCategories,
        loading,
        error,
        refetch,
        clearCache
    };
}

export function useServiceCategoryWithCache() {
    return useServiceCategoryFilter(true);
}

export function useServiceCategoryWithoutCache() {
    return useServiceCategoryFilter(false);
}