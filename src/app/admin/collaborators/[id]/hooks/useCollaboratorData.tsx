import { collaboratorDetailApi } from "@/api/user/collaborator-api";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { useCallback, useEffect, useState } from "react";



// Custom hook for collaborator data management
export const useCollaboratorData = (collaboratorId: string) => {
    const [loading, setLoading] = useState(true);
    const [collaborator, setCollaborator] = useState<Collaborator>();

    const fetchCollaborator = useCallback(async () => {
        if (!collaboratorId) return;

        setLoading(true);
        try {
            const response = await collaboratorDetailApi(collaboratorId);
            if ('data' in response && response.data) {
                setCollaborator(response.data);
            } else {
                setCollaborator(undefined);
            }
        } catch (error) {
            console.error('Error fetching collaborator:', error);
            setCollaborator(undefined);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCollaborator();
    }, [collaboratorId]);

    const refetch = useCallback(() => {
        fetchCollaborator();
    }, [fetchCollaborator]);

    return { collaborator, loading, refetch };
};