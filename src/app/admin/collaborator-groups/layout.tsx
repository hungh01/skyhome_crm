import { ReactNode } from "react";
import { CollaboratorGroupProvider } from "./provider/collaborator-group-provider";

export default function CollaboratorGroupLayout({ children }: { children: ReactNode }) {
    return (
        <CollaboratorGroupProvider>
            {children}
        </CollaboratorGroupProvider>
    );
}