'use client';

import CollaboratorList from "./components/CollaboratorList";
import CreateCollaborator from "./components/CreateCollaborator";
import Header from "./components/Header";
import { CollaboratorProvider } from "./provider/collaborator-provider";


export default function CollaboratorsPage() {
    return (
        <div style={{ padding: 24 }}>
            <CollaboratorProvider>
                <Header />
                <CreateCollaborator />
                <CollaboratorList />
            </CollaboratorProvider>
        </div>

    );
}
