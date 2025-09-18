'use client';

import AddGroupModal from "./component/AddGroupModal";
import { Header } from "./component/header";
import CollaboratorGroups from "./component/collaborator-groups";

export default function LeadersPage() {


    return (
        <div style={{ padding: 24 }}>
            {/* Header */}
            <Header />
            {/* Create Group Modal */}
            <AddGroupModal
                mode="create"
            />

            {/* Edit Group Modal */}
            <AddGroupModal
                mode="edit"
            />


            {/* Content */}
            <CollaboratorGroups />
        </div>
    );
}