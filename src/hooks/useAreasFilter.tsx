import { useEffect, useState, useCallback } from "react";
import { getAreas } from "@/api/area/area-api";
import { Area } from "@/type/area/area";
import { isDetailResponse } from "@/utils/response-handler";

// Simple cache - có thể dùng React Query cho advanced caching
let cachedAreas: Area[] | null = null;
let cacheTime: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useAreasFilter(enableCache = true) {
    const [areas, setAreas] = useState<Area[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAreas = useCallback(async (forceRefresh = false) => {
        // Check cache 
        if (enableCache && !forceRefresh && cachedAreas && cacheTime) {
            const now = Date.now();
            if (now - cacheTime < CACHE_DURATION) {
                setAreas(cachedAreas);
                return;
            }
        }

        setLoading(true);
        setError(null);
        try {
            const result = await getAreas();
            if (isDetailResponse(result)) {
                setAreas(result.data);

                // Update cache
                if (enableCache) {
                    cachedAreas = result.data;
                    cacheTime = Date.now();
                }
            } else {
                setError("Failed to fetch areas");
                console.error("Failed to fetch areas:", result);
            }
        } catch (error) {
            setError("Error fetching areas");
            console.error("Error fetching areas:", error);
        } finally {
            setLoading(false);
        }
    }, [enableCache]);

    useEffect(() => {
        fetchAreas();
    }, [fetchAreas]);

    const refetch = useCallback(() => {
        return fetchAreas(true); // Force refresh
    }, [fetchAreas]);

    const clearCache = useCallback(() => {
        cachedAreas = null;
        cacheTime = null;
    }, []);

    return {
        areas,
        loading,
        error,
        refetch,
        clearCache
    };
}

// Convenience hooks
export function useAreasFilterWithCache() {
    return useAreasFilter(true);
}

export function useAreasFilterNoCache() {
    return useAreasFilter(false);
}