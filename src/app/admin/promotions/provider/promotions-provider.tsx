'use client';

import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Promotion } from "@/type/promotion/promotion";
import { debounce } from "lodash";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";


interface PromotionContextType {
    page: number;
    setPage: (page: number) => void;
    search: string;
    setSearch: (search: string) => void;

    searchInput: string;
    setSearchInput: (searchInput: string) => void;
    handleSearchChange: (value: string) => void;

    status: string | undefined;
    setStatus: (status: string | undefined) => void;
    type: string | undefined;
    setType: (type: string | undefined) => void;
    dateRange: [string | null, string | null] | null;
    setDateRange: (dateRange: [string | null, string | null] | null) => void;

    data: DetailResponse<Promotion[]> | null;
    setData: (data: DetailResponse<Promotion[]> | null) => void;

    loading: boolean;
    setLoading: (loading: boolean) => void;

    showCreateModal: boolean;
    setShowCreateModal: (show: boolean) => void;

    editingPromotion: Promotion | null;
    setEditingPromotion: (promotion: Promotion | null) => void;

    handleEditPromotion: (promotion: Promotion) => void;
    handleCloseModal: () => void;
}

const PromotionContext = createContext<PromotionContextType | undefined>(undefined);

export function PromotionsProvider({ children }: { children: ReactNode }) {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [status, setStatus] = useState<string | undefined>(undefined);
    const [type, setType] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[string | null, string | null] | null>(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DetailResponse<Promotion[]> | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);


    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((value: string) => {
            setSearch(value);
            setPage(1); // Reset to first page when searching
        }, 500),
        []
    );

    // Handler for search input changes
    const handleSearchChange = useCallback((value: string) => {
        setSearchInput(value); // Immediate UI update
        debouncedSearch(value); // Debounced API call
    }, [debouncedSearch]);

    const handleEditPromotion = (promotion: Promotion): void => {
        setEditingPromotion(promotion);
        setShowCreateModal(true);
    };

    const handleCloseModal = (): void => {
        setShowCreateModal(false);
        setEditingPromotion(null);
    };

    const contextValue = {
        page,
        setPage,
        search,
        setSearch,
        searchInput,
        setSearchInput,
        handleSearchChange,
        status,
        setStatus,
        type,
        setType,
        dateRange,
        setDateRange,
        data,
        setData,
        loading,
        setLoading,
        showCreateModal,
        setShowCreateModal,
        editingPromotion,
        setEditingPromotion,
        handleEditPromotion,
        handleCloseModal
    }

    return (
        <PromotionContext.Provider value={contextValue}>
            {children}
        </PromotionContext.Provider>
    );
}

export function usePromotionContext() {
    const context = useContext(PromotionContext);
    if (!context) {
        throw new Error("usePromotionContext must be used within a PromotionsProvider");
    }
    return context;
}