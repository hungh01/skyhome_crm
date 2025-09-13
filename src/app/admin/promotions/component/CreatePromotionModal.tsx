'use client';

import { Modal } from "antd";
import CreatePromotion from "./CreatePromotion";
import { usePromotionContext } from "../provider/promotions-provider";
import { usePromotionActions } from "../hooks/usePromotionActions";


export default function CreatePromotionModal() {


    const { showCreateModal, editingPromotion, handleCloseModal } = usePromotionContext();

    const { handleSavePromotion } = usePromotionActions();
    return (
        <Modal
            title={editingPromotion ? "Chỉnh sửa chương trình khuyến mãi" : "Tạo chương trình khuyến mãi mới"}
            open={showCreateModal}
            onCancel={handleCloseModal}
            footer={null}
            width={1000}
            style={{ top: 20 }}
        >
            <CreatePromotion
                handleCloseModal={handleCloseModal}
                onSuccess={handleSavePromotion}
                initialData={editingPromotion || undefined}
            />
        </Modal>
    )
}