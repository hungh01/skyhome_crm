import { getCollaboratorForOrder } from "@/api/order/order-api";
import { Order } from "@/type/order/order";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { isDetailResponse } from "@/utils/response-handler";
import { useState } from "react";



export default function useCollaboratorForOrder(id: string, setOrder: (order: Order) => void, setCollaborators: (collaborators: Collaborator[]) => void) {

    const [loading, setLoading] = useState(false);

    const fetchCollaborators = async () => {
        try {
            setLoading(true);
            const res = await getCollaboratorForOrder(id);
            if (isDetailResponse(res) && res.data) {
                setCollaborators(res.data);
            }
        } catch (error) {
            console.error("Error fetching collaborators:", error);
        } finally {
            setLoading(false);
        }
    };

    Promise.all([fetchCollaborators()]);

    return { loading };
}