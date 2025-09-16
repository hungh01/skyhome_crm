import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { News } from "../type/news";
import { createContext, ReactNode, useContext, useState } from "react";


interface newsProviderType {
    data: DetailResponse<News[]>;
    setData: (data: DetailResponse<News[]>) => void;

    page: number;
    setPage: (page: number) => void;
    search: string;
    setSearch: (search: string) => void;
    category: string | undefined;
    setCategory: (category: string | undefined) => void;
    status: boolean | undefined;
    setStatus: (status: boolean | undefined) => void;

    showCreateModal: boolean;
    setShowCreateModal: (showCreateModal: boolean) => void;
    editingNews: News | null;
    setEditingNews: (editingNews: News | null) => void;

    refetch: (() => void);
    setRefetch: (refetch: (() => void)) => void;

    handleEditNews: (news: News) => void;
    handleCreateNews: (news: News) => void;
    handleCloseModal: () => void;
}

export const NewsContext = createContext<newsProviderType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {

    const [data, setData] = useState<DetailResponse<News[]>>({ data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<boolean | undefined>(undefined);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingNews, setEditingNews] = useState<News | null>(null);
    const [refetch, setRefetch] = useState<() => void>(() => { });

    const handleEditNews = (news: News): void => {
        setEditingNews(news);
        setShowCreateModal(true);
    };

    const handleCreateNews = (): void => {
        setEditingNews(null);
        setShowCreateModal(true);
    }

    const handleCloseModal = (): void => {
        setShowCreateModal(false);
        setEditingNews(null);
    };


    const value: newsProviderType = {
        data,
        setData,
        page,
        setPage,
        search,
        setSearch,
        category,
        setCategory,
        status,
        setStatus,
        showCreateModal,
        setShowCreateModal,
        editingNews,
        setEditingNews,
        refetch,
        setRefetch,
        handleEditNews,
        handleCreateNews,
        handleCloseModal,
    };

    return (
        <NewsContext.Provider value={value}>
            {children}
        </NewsContext.Provider>
    );
}

export function useNewsContext() {
    const context = useContext(NewsContext);
    if (!context) {
        throw new Error("useNewsContext must be used within a NewsProvider");
    }
    return context;
}