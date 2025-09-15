import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Banner } from "@/app/admin/banners/type/banner";
import { createContext, ReactNode, useContext, useState } from "react";


interface bannerProviderType {
    data: DetailResponse<Banner[]>;
    setData: (data: DetailResponse<Banner[]>) => void;

    page: number;
    setPage: (page: number) => void;
    search: string;
    setSearch: (search: string) => void;
    type: string | undefined;
    setType: (type: string | undefined) => void;
    status: boolean | undefined;
    setStatus: (status: boolean | undefined) => void;

    showCreateModal: boolean;
    setShowCreateModal: (showCreateModal: boolean) => void;

    editingBanner: Banner | null;
    setEditingBanner: (editingBanner: Banner | null) => void;

    refetch: (() => void) | null;
    setRefetch: (refetch: (() => void) | null) => void;

    handleEditBanner: (banner: Banner) => void;
    handleCloseModal: () => void;

    handleCreateBanner: () => void;
}

const BannerProvider = createContext<bannerProviderType | undefined>(undefined);

export function BannersProvider({ children }: { children: ReactNode }) {

    const [data, setData] = useState<DetailResponse<Banner[]>>({ data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [type, setType] = useState<string | undefined>(undefined);
    const [status, setStatus] = useState<boolean | undefined>(undefined);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
    const [refetch, setRefetch] = useState<(() => void) | null>(null);

    const handleEditBanner = (banner: Banner): void => {
        setEditingBanner(banner);
        setShowCreateModal(true);
    };

    const handleCreateBanner = (): void => {
        setEditingBanner(null);
        setShowCreateModal(true);
    };


    const handleCloseModal = (): void => {
        setEditingBanner(null);
        setShowCreateModal(false);
    };

    const value: bannerProviderType = {
        data,
        setData,
        page,
        setPage,
        search,
        setSearch,
        type,
        setType,
        status,
        setStatus,
        showCreateModal,
        setShowCreateModal,
        editingBanner,
        setEditingBanner,
        refetch,
        setRefetch,
        handleEditBanner,
        handleCloseModal,
        handleCreateBanner
    };
    return (
        <BannerProvider.Provider value={value}>
            {children}
        </BannerProvider.Provider>
    )
}

export function useBannerContext() {
    const context = useContext(BannerProvider);
    if (context === undefined) {
        throw new Error("useBannerContext must be used within a BannerProvider");
    }
    return context;
}