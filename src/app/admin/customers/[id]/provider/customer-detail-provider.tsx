'use client';
import { INITIAL_PAGINATION } from "@/common/initital/pagination";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { FavoriteCollaborator } from "@/type/favorite-partner";
import { Order } from "@/type/order/order";
import { Transaction } from "@/type/transaction/transaction";
import { Customer } from "@/type/user/customer/customer";
import React, { createContext, useCallback, useContext, useState } from "react";
import { TabOption } from "../type/tab-option";

interface CustomerDetailContextProps {
    customer: Customer | undefined;
    setCustomer: (customer: Customer | undefined) => void;

    orders: DetailResponse<Order[]>;
    setOrders: (orders: DetailResponse<Order[]>) => void;

    transactions: DetailResponse<Transaction[]>;
    setTransactions: (transactions: DetailResponse<Transaction[]>) => void;

    userFavoriteCollaborators: DetailResponse<FavoriteCollaborator[]>;
    setUserFavoriteCollaborators: (userFavoriteCollaborators: DetailResponse<FavoriteCollaborator[]>) => void;

    // Additional state management
    activeTab: TabOption;
    setActiveTab: (tab: TabOption) => void;
    page: number;
    setPage: (page: number) => void;
    day: string;
    setDay: (day: string) => void;
    favoriteStatus: 'liked' | 'disliked';
    setFavoriteStatus: (status: 'liked' | 'disliked') => void;
    handleTabChange: (tab: TabOption) => void;

    handleFilterChange: (day: string) => void;
    handleFavoriteStatusChange: (status: 'liked' | 'disliked') => void;
}

const CustomerDetailContext = createContext<CustomerDetailContextProps | undefined>(undefined);

export const useCustomerDetailContext = () => {
    const context = useContext(CustomerDetailContext);
    if (!context) throw new Error("useCustomerDetailContext must be used within CustomerDetailProvider");
    return context;
};

export const CustomerDetailProvider = ({ children }: { children: React.ReactNode }) => {
    const [customer, setCustomer] = useState<Customer | undefined>();

    const [orders, setOrders] = useState<DetailResponse<Order[]>>({ data: [], pagination: INITIAL_PAGINATION });
    const [transactions, setTransactions] = useState<DetailResponse<Transaction[]>>({ data: [], pagination: INITIAL_PAGINATION });
    const [userFavoriteCollaborators, setUserFavoriteCollaborators] = useState<DetailResponse<FavoriteCollaborator[]>>({ data: [], pagination: INITIAL_PAGINATION });

    // State management
    const [activeTab, setActiveTab] = useState<TabOption>('Đơn hàng');
    const [page, setPage] = useState(1);
    const [day, setDay] = useState<string>('');
    const [favoriteStatus, setFavoriteStatus] = useState<'liked' | 'disliked'>('liked');


    // Event handlers
    const handleTabChange = useCallback((value: TabOption) => {
        setActiveTab(value);
        setPage(1);
        setDay('');
    }, []);


    const handleFilterChange = useCallback((value: string) => {
        setDay(value);
        setPage(1);
    }, []);

    const handleFavoriteStatusChange = useCallback((status: 'liked' | 'disliked') => {
        setFavoriteStatus(status);
        setPage(1);
    }, []);

    const value: CustomerDetailContextProps = {
        customer,
        setCustomer,
        orders,
        setOrders,
        transactions,
        setTransactions,
        userFavoriteCollaborators,
        setUserFavoriteCollaborators,

        // Additional state management
        activeTab,
        setActiveTab,
        page,
        setPage,
        day,
        setDay,
        favoriteStatus,
        setFavoriteStatus
        , handleTabChange, handleFilterChange, handleFavoriteStatusChange
    };

    return (
        <CustomerDetailContext.Provider value={value}>
            {children}
        </CustomerDetailContext.Provider>
    );
};
