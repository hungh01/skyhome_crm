import { useState } from "react";
import { News, NewsRequest } from "../type/news";
import { createNews, updateNews } from "../api/news-api";
import { notify } from "@/components/Notification";
import { useNewsContext } from "../provider/news-provider";
import { isDetailResponse } from "@/utils/response-handler";



export function useNewsActions() {
    const [loading, setLoading] = useState<boolean>(false);

    const { refetch } = useNewsContext();

    const handleToggleStatus = (news: News): void => {
        // Here you would typically make an API call to update the News status
        console.log("Toggling status for News:", news);
    };

    const handleSaveNews = async (news: NewsRequest) => {
        try {
            setLoading(true);
            const { _id, ...rest } = news;
            if (_id) {
                const response = await updateNews(_id, rest);
                if (isDetailResponse(response)) {
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Cập nhật news thành công!',
                    });
                    refetch();
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Cập nhật news thất bại!',
                    });
                }
            } else {
                const response = await createNews(rest);
                if (isDetailResponse(response)) {
                    notify({
                        type: 'success',
                        message: 'Thông báo',
                        description: 'Tạo news thành công!',
                    });
                    refetch();
                } else {
                    notify({
                        type: 'error',
                        message: 'Thông báo',
                        description: 'Tạo news thất bại!',
                    });
                }
            }
        } catch (error) {
            notify({
                type: 'error',
                message: 'Thông báo',
                description: 'Lưu news thất bại, vui lòng thử lại!',
            });
            console.error("Error saving news:", error);
        } finally {
            setLoading(false);
        }
    };



    const handleDeleteNews = (news: News): void => {
        // Logic for deleting a news News
        console.log("Deleting News:", news);
    };

    return { loading, setLoading, handleToggleStatus, handleSaveNews, handleDeleteNews };
}
