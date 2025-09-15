import { useState } from "react";
import { News } from "../type/news";



export function useNewsActions() {
    const [loading, setLoading] = useState<boolean>(false);

    const handleToggleStatus = (news: News): void => {
        // Here you would typically make an API call to update the News status
        console.log("Toggling status for News:", news);
    };

    const handleEditNews = (news: News): void => {
        // Logic for editing a news News
        console.log("Editing News:", news);
    };

    const handleDeleteNews = (news: News): void => {
        // Logic for deleting a news News
        console.log("Deleting News:", news);
    };

    return { loading, setLoading, handleToggleStatus, handleEditNews, handleDeleteNews };
}
