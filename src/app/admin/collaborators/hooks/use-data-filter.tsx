import { useEffect, useState } from "react";
import { useCollaboratorContext } from "../provider/collaborator-provider";
import { collaboratorAreasApi, collaboratorServicesApi } from "@/api/user/collaborator-api";



export function useDataFilter() {

    const [loading, setLoading] = useState(false);
    const { dataFilter, setDataFilter } = useCollaboratorContext();

    useEffect(() => {
        const fetchServicesAndAreas = async () => {
            try {
                setLoading(true);
                const [areasRes, servicesRes] = await Promise.all([
                    collaboratorAreasApi(),
                    collaboratorServicesApi()
                ]);
                setDataFilter({
                    areas: Array.isArray(areasRes.data) ? areasRes.data : [],
                    services: Array.isArray(servicesRes.data) ? servicesRes.data : []
                });
            } catch (error) {
                console.error("Error fetching services or areas:", error);
                setDataFilter({
                    areas: [],
                    services: []
                });
            }
            finally {
                setLoading(false);
            }
        }
        fetchServicesAndAreas();
    }, []);
    return {
        dataFilter,
        loading
    }
}