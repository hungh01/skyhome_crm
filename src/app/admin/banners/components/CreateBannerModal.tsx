import { Modal } from "antd";
import CreateBanner from "./CreateBanner";
import { useBannerContext } from "../provider/banner-provider";



export default function CreateBannerModal() {
    const { showCreateModal, handleCloseModal, editingBanner } = useBannerContext();
    return (
        <Modal
            title={editingBanner ? "Chỉnh sửa Banner" : "Tạo Banner mới"}
            open={showCreateModal}
            onCancel={handleCloseModal}
            footer={null}
            width={1000}
            style={{ top: 20 }}
        >
            <CreateBanner />
        </Modal>
    );
}