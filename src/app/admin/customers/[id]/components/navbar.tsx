import { Segmented } from "antd";
import { TabOption } from "../type/tab-option";
import { TAB_OPTIONS } from "../constants/tab-options";
import { useCustomerDetailContext } from "../provider/customer-detail-provider";

export default function Navbar() {
    const { activeTab, handleTabChange } = useCustomerDetailContext();
    return (
        <div className="tab-navigation">
            <Segmented<TabOption>
                options={TAB_OPTIONS}
                value={activeTab}
                onChange={handleTabChange}
            />
        </div>
    );
}