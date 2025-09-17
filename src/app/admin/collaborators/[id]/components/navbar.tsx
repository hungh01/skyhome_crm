'use client';
import { Segmented } from "antd";
import { TabOption } from "../type/tab-option";
import { TAB_OPTIONS } from "../constants/tab-options";
import { useCollaboratorDetailContext } from "../provider/collaborator-detail-provider";


export default function CollaboratorNavbar() {


    const { activeTab, setActiveTab } = useCollaboratorDetailContext();

    return (
        <div className="tab-navigation">
            <Segmented<TabOption>
                options={TAB_OPTIONS}
                value={activeTab}
                onChange={setActiveTab}
            />
        </div>
    );
}