'use client';
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Order } from "@/type/order/order";
import { debounce } from "lodash";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

interface OrderProviderType {
    orderSearch: string;
    setOrderSearch: (orderSearch: string) => void;

    debouncedOrderSearch: string;
    setDebouncedOrderSearch: (debouncedOrderSearch: string) => void;

    createdAtStart: string;
    setCreatedAtStart: (createdAtStart: string) => void;

    createdAtEnd: string;
    setCreatedAtEnd: (createdAtEnd: string) => void;

    statusSearch: string;
    setStatusSearch: (statusSearch: string) => void;

    page: number;
    setPage: (page: number) => void;

    data: DetailResponse<Order[]>;
    setData: (data: DetailResponse<Order[]>) => void;

}

const OrderContext = createContext<OrderProviderType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
    const [orderSearch, setOrderSearch] = useState("");
    const [debouncedOrderSearch, setDebouncedOrderSearch] = useState("");
    const [createdAtStart, setCreatedAtStart] = useState("");
    const [createdAtEnd, setCreatedAtEnd] = useState("");
    const [statusSearch, setStatusSearch] = useState("");
    const [page, setPage] = useState(1);
    const [data, setData] = useState<DetailResponse<Order[]>>({ data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });


    const debouncedSearchOrder = useCallback(
        debounce((value: string) => {
            setDebouncedOrderSearch(value);
            setPage(1);
        }, 500),
        []
    );

    // Handlers
    const handleOrderSearch = (value: string) => {
        debouncedSearchOrder(value);
    };
    useEffect(() => {
        handleOrderSearch(orderSearch);
    }, [orderSearch, handleOrderSearch]);


    const values = {
        orderSearch,
        setOrderSearch,
        debouncedOrderSearch,
        setDebouncedOrderSearch,
        createdAtStart,
        setCreatedAtStart,
        createdAtEnd,
        setCreatedAtEnd,
        statusSearch,
        setStatusSearch,
        page,
        setPage,
        data,
        setData
    }
    return (
        <OrderContext.Provider value={values}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrderContext() {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error("useOrderContext must be used within a OrderProvider");
    }
    return context;
}