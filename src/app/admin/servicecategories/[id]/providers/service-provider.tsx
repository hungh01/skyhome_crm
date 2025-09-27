'use client';
import { Service } from "@/type/services/services";
import { createContext, ReactNode, useContext, useState } from "react";



interface serviceProviderType {
    services: Service[];
    setServices: (data: Service[]) => void;
    selectedService: Service | null;
    setSelectedService: (service: Service | null) => void;
}
const ServiceProviderContext = createContext<serviceProviderType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode; }) {

    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);


    return (
        <ServiceProviderContext.Provider value={{ services, setServices, selectedService, setSelectedService }}>
            {children}
        </ServiceProviderContext.Provider>
    );
}

export const useServiceContext = () => {
    const context = useContext(ServiceProviderContext);
    if (!context) {
        throw new Error("useServiceProvider must be used within a ServiceProvider");
    }
    return context;
};
