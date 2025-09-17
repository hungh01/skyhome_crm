'use client';

import { Collaborator } from "@/type/user/collaborator/collaborator";
import { TabOption } from "../type/tab-option";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";



interface CollaboratorDetailProviderType {
    collaborator: Collaborator | undefined;
    setCollaborator: (collaborator: Collaborator | undefined) => void;
    page: number;
    setPage: (page: number) => void;
    activeTab: TabOption;
    setActiveTab: (tab: TabOption) => void;
    dateWork: string;
    setDateWork: (dateWork: string) => void;
}

const CollaboratorDetailContext = createContext<CollaboratorDetailProviderType | undefined>(undefined);

export function CollaboratorDetailProvider({ children }: { children: ReactNode }) {

    const [collaborator, setCollaborator] = useState<Collaborator | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<TabOption>('Đơn hàng');
    const [dateWork, setDateWork] = useState<string>('');


    // Event handlers
    const handleTabChange = useCallback((value: TabOption) => {
        setActiveTab(value);
        setPage(1);
    }, []);

    const value = {
        collaborator,
        setCollaborator,
        page,
        setPage,
        activeTab,
        setActiveTab,
        dateWork,
        setDateWork,
    };

    return (
        <CollaboratorDetailContext.Provider value={value}>
            {children}
        </CollaboratorDetailContext.Provider>
    );
}

export function useCollaboratorDetailContext() {
    const context = useContext(CollaboratorDetailContext);
    if (context === undefined) {
        throw new Error("useCollaboratorDetail must be used within a CollaboratorDetailProvider");
    }
    return context;
}