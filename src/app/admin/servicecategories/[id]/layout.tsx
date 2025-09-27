import { ReactNode } from "react";
import { ServiceProvider } from "./providers/service-provider";
import { OptionalServiceProvider } from "./providers/optional-service-provider";




export default function ServiceDetailLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <ServiceProvider>
                <OptionalServiceProvider>
                    {children}
                </OptionalServiceProvider>
            </ServiceProvider>
        </>
    );
}