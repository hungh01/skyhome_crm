'use client';
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Customer } from "@/type/user/customer/customer";
import { debounce } from "lodash";
import { createContext, useCallback, useContext, useState, ReactNode } from "react";

interface CustomerProviderType {
    open: boolean;
    setOpen: (open: boolean) => void;
    data: DetailResponse<Customer[]> | undefined;
    setData: (data: DetailResponse<Customer[]>) => void;
    page: number;
    setPage: (page: number) => void;
    searchCustomerName: string;
    setSearchCustomerName: (name: string) => void;
    searchAddress: string;
    setSearchAddress: (address: string) => void;
    searchCustomerCode: string;
    setSearchCustomerCode: (code: string) => void;
    searchCreatedAt: string;
    setSearchCreatedAt: (date: string) => void;
    handleCodeSearch: (value: string) => void;
    handleCustomerNameSearch: (value: string) => void;
}

const CustomerContext = createContext<CustomerProviderType | undefined>(undefined);

export function CustomerProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState<DetailResponse<Customer[]>>();
    const [searchCustomerName, setSearchCustomerName] = useState("");
    const [searchAddress, setSearchAddress] = useState<string>("");
    const [searchCustomerCode, setSearchCustomerCode] = useState("");
    const [searchCreatedAt, setSearchCreatedAt] = useState("");
    const [page, setPage] = useState(1);

    // Debounced search functions
    const debouncedSearchCode = useCallback(
        debounce((value: string) => {
            setSearchCustomerCode(value);
            setPage(1);
        }, 500),
        []
    );

    const debouncedSearchCustomerName = useCallback(
        debounce((value: string) => {
            setSearchCustomerName(value);
            setPage(1);
        }, 500),
        []
    );

    // Handlers
    const handleCodeSearch = (value: string) => {
        debouncedSearchCode(value);
    };

    const handleCustomerNameSearch = (value: string) => {
        debouncedSearchCustomerName(value);
    };

    const value: CustomerProviderType = {
        open,
        setOpen,
        data,
        setData,
        page,
        setPage,
        searchCustomerName,
        setSearchCustomerName,
        searchAddress,
        setSearchAddress,
        searchCustomerCode,
        setSearchCustomerCode,
        searchCreatedAt,
        setSearchCreatedAt,
        handleCodeSearch,
        handleCustomerNameSearch,
    };

    return (
        <CustomerContext.Provider value={value}>
            {children}
        </CustomerContext.Provider>
    );
}

export function useCustomerContext() {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error("useCustomerContext must be used within a CustomerProvider");
    }
    return context;
}
