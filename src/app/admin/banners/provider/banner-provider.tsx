import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ErrorResponse } from "@/type/error";
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
    handleToggleStatus: (banner: Banner) => void;
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

    const handleCloseModal = (): void => {
        setShowCreateModal(false);
        setEditingBanner(null);
    };

    const handleToggleStatus = (banner: Banner): void => {
        // Here you would typically make an API call to update the banner status
        console.log(`Toggle status for banner ${banner._id} to ${!banner.status}`);
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
        handleToggleStatus
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