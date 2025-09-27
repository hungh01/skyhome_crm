'use client';

import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { OptionalService } from "@/type/services/optional";
import { createContext, ReactNode, useContext, useState } from "react";



interface OptionalServiceProviderType {
    data: DetailResponse<OptionalService[]>;
    setData: (data: DetailResponse<OptionalService[]>) => void;
}


const OptionalServiceProviderContext = createContext<OptionalServiceProviderType | undefined>(undefined);


export function OptionalServiceProvider({ children }: { children: ReactNode; }) {

    const [data, setData] = useState<DetailResponse<OptionalService[]>>({ data: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 } });

    return (
        <OptionalServiceProviderContext.Provider value={{ data, setData }}>
            {children}
        </OptionalServiceProviderContext.Provider>
    );
}

export const useOptionalServiceProvider = () => {
    const context = useContext(OptionalServiceProviderContext);
    if (!context) {
        throw new Error("useOptionalServiceProvider must be used within a OptionalServiceProvider");
    }
    return context;
};
