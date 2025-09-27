import { getCollaboratorGroups } from "@/api/user/collaborator-group-api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useGroupCollaboratorContext } from "../provider/collaborator-group-provider";


export function useCollaboratorGroups() {
    const [loading, setLoading] = useState(false);
    const { data, setData, page, debouncedSearchName, selectedAreas, selectedServices, statusFilter } = useGroupCollaboratorContext();

    // Create stable string representations for arrays to avoid useEffect dependency issues
    const selectedAreasString = useMemo(() => selectedAreas.join(','), [selectedAreas]);
    const selectedServicesString = useMemo(() => selectedServices.join(','), [selectedServices]);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            // Ensure arrays are never undefined/null
            const areasParam = selectedAreas || [];
            const servicesParam = selectedServices || [];

            const res = await getCollaboratorGroups(page, 10, debouncedSearchName, areasParam, servicesParam, statusFilter);
            if ('data' in res) {
                setData(res);
            } else {
                setData({ data: [] });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearchName, selectedAreasString, selectedServicesString, statusFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, refetch };
}