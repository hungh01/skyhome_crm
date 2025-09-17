import { createCollaboratorApi } from "@/api/user/collaborator-api";
import { notify } from "@/components/Notification";
import { CollaboratorFormData } from "@/type/user/collaborator/collaborator";

import { useState } from "react";
import { useCollaboratorList } from "./use-collaborator-list";
import { useCollaboratorContext } from "../provider/collaborator-provider";


export function useCreateCollaborator(onSuccess: () => void) {

    const [loading, setLoading] = useState(false);
    const { refetch } = useCollaboratorList();
    const { setOpen } = useCollaboratorContext();

    const handleFinish = async (values: CollaboratorFormData) => {
        try {
            setLoading(true);
            const result = await createCollaboratorApi(values);
            if (result && ('data' in result)) {
                notify({
                    type: 'success',
                    message: 'Thông báo',
                    description: 'Tạo cộng tác viên thành công.',
                });
                refetch();
                onSuccess(); // Gọi callback khi thành công
            } else {
                notify({
                    type: 'error',
                    message: 'Thông báo',
                    description: (result && 'message' in result ? result.message : 'Có lỗi xảy ra khi tạo cộng tác viên, vui lòng thử lại sau.'),
                });
            }
        } catch {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Có lỗi xảy ra khi tạo cộng tác viên, vui lòng thử lại sau.',
            });
        }
        finally {
            setLoading(false);
            setOpen(false);
        }
    };
    return {
        handleFinish,
        loading
    }
}