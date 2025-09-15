import { Modal } from "antd";



import { useNewsContext } from "../provider/news-provider";
import CreateNews from "./CreateNews";


export default function CreateNewsModal() {
    const { showCreateModal, editingNews, handleCloseModal } = useNewsContext();
    return (
        <Modal
            title={editingNews ? "Chỉnh sửa Tin tức" : "Tạo Tin tức mới"}
            open={showCreateModal}
            onCancel={handleCloseModal}
            footer={null}
            width={1000}
            style={{ top: 20 }}
        >
            <CreateNews
                onSuccess={handleCloseModal}
                initialData={editingNews || undefined}
            />
        </Modal>
    );
}