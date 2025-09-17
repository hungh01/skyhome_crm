import { ReactNode } from "react";
import { CollaboratorDetailProvider } from "./provider/collaborator-detail-provider";
import './styles/collaborator-detail.scss';

export default function CollaboratorDetailLayout({ children }: { children: ReactNode }) {
    return (
        <CollaboratorDetailProvider>
            {children}
        </CollaboratorDetailProvider>
    );
}
