'use client';
import { Dayjs } from "dayjs";

import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { ServiceCategory } from "@/type/services/service-category";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { debounce } from "lodash";
import { Area } from "@/type/area/area";




interface CollaboratorProviderType {
    open: boolean;
    setOpen: (open: boolean) => void;

    dataFilter: {
        areas: Area[];
        services: ServiceCategory[];
    };
    setDataFilter: (dataFilter: { areas: Area[]; services: ServiceCategory[] }) => void;

    data: DetailResponse<Collaborator[]> | null;
    setData: (data: DetailResponse<Collaborator[]> | null) => void;

    page: number;
    setPage: (page: number) => void;
    searchName: string;
    setSearchName: (searchName: string) => void;
    debouncedSearchName: string;
    setDebouncedSearchName: (debouncedSearchName: string) => void;
    isSearching: boolean;
    setIsSearching: (isSearching: boolean) => void;
    searchAreas: string[];
    setSearchAreas: (searchAreas: string[]) => void;
    searchActiveDate: Dayjs | null;
    setSearchActiveDate: (searchActiveDate: Dayjs | null) => void;
    searchServices: string[];
    setSearchServices: (searchServices: string[]) => void;
    statusFilter: string;
    setStatusFilter: (statusFilter: string) => void;
    handleSearchNameChange: (value: string) => void;

}

const CollaboratorContext = createContext<CollaboratorProviderType | undefined>(undefined);

export function CollaboratorProvider({ children }: { children: ReactNode }) {

    const [open, setOpen] = useState(false);

    const [dataFilter, setDataFilter] = useState<{
        areas: Area[];
        services: ServiceCategory[];
    }>({
        areas: [],
        services: []
    });


    const [data, setData] = useState<DetailResponse<Collaborator[]> | null>(null);

    const [page, setPage] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [debouncedSearchName, setDebouncedSearchName] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchAreas, setSearchAreas] = useState<string[]>([]);
    const [searchActiveDate, setSearchActiveDate] = useState<Dayjs | null>(null);
    const [searchServices, setSearchServices] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState("");



    // Create debounced function using lodash
    const debouncedSetSearchName = useCallback(
        debounce((value: string) => {
            setDebouncedSearchName(value);
            setPage(1); // Reset to first page when search changes
            setIsSearching(false); // End loading when debounce completes
        }, 500), // 500ms delay
        []
    );

    // Handle search name change
    const handleSearchNameChange = useCallback((value: string) => {
        setSearchName(value);
        if (value === "") {
            // If clearing the search, immediately update and stop loading
            setDebouncedSearchName("");
            setIsSearching(false);
            setPage(1);
        } else if (value !== debouncedSearchName) {
            setIsSearching(true); // Start loading when user types
        }
        debouncedSetSearchName(value);
    }, [debouncedSetSearchName, debouncedSearchName]);

    useEffect(() => {
        handleSearchNameChange(searchName);
    }, [searchName, handleSearchNameChange]);

    const value = {
        open, setOpen,

        dataFilter, setDataFilter,
        data, setData,
        page, setPage,
        searchName, setSearchName,
        debouncedSearchName, setDebouncedSearchName,
        isSearching, setIsSearching,
        searchAreas, setSearchAreas,
        searchActiveDate, setSearchActiveDate,
        searchServices, setSearchServices,
        statusFilter, setStatusFilter,
        handleSearchNameChange
    };
    return (
        <CollaboratorContext.Provider value={value}>
            {children}
        </CollaboratorContext.Provider>
    );
}

export function useCollaboratorContext() {
    const context = useContext(CollaboratorContext);
    if (context === undefined) {
        throw new Error("useCollaboratorContext must be used within a CollaboratorProvider");
    }
    return context;
}