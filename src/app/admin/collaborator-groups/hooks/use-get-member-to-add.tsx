import { getMembersForGroup } from "@/api/user/collaborator-group-api";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { useEffect, useState } from "react";


export const useGetMemberToAdd = ({ selectedServices, selectedAreas, groupId, setCollaborators }: { selectedServices: string[], selectedAreas: string[], groupId: string, setCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>> }) => {
    const [loading, setLoading] = useState(false);


    const fetchCollaborators = async () => {
        try {
            setLoading(true);
            const response = await getMembersForGroup(selectedServices, selectedAreas, groupId);
            if ('data' in response) {
                setCollaborators(response.data);
            } else {
                setCollaborators([]);
            }
        } catch (error) {
            console.error('Error fetching collaborators:', error);
            setCollaborators([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollaborators();
    }, [groupId]);

    return { loading };
};