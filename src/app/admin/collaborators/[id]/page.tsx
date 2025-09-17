'use client';

import { useParams } from 'next/navigation';
import PeopleInfor from '@/components/people/PeopleInfor';
import TabContentRenderer from './components/tab-content';
import { useCollaboratorData } from './hooks/useCollaboratorData';
import Loading from '../../loading';
import ErrorMessage from '@/components/Error';
import { PeopleInfoType } from '@/type/user/people-info';
import CollaboratorNavbar from './components/navbar';


export default function CollaboratorDetailPage() {
    const params = useParams();
    const collaboratorId = params.id as string;
    const { collaborator, loading, refetch } = useCollaboratorData(collaboratorId);

    // Loading and error states
    if (loading) {
        return <Loading />;
    }

    if (!collaborator) {
        return <ErrorMessage message="Không tìm thấy thông tin cộng tác viên" />;
    }

    return (
        <div className="main-container">
            {/* Main Content: 70% */}
            <div className="content-section">
                {/* Tab Navigation */}
                <CollaboratorNavbar />
                {/* Tab Content */}
                <TabContentRenderer collaboratorId={collaboratorId} />
            </div>

            {/* User Info Sidebar: 30% */}
            <div className="sidebar-section">
                <PeopleInfor userInfor={{ ...collaborator?.userId, code: collaborator?.code || '' } as PeopleInfoType} refetch={refetch} />
            </div>
        </div>
    );
}