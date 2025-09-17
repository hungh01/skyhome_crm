import PeopleOrder from "@/components/people/feature/order/PeopleOrder";
import { useCollaboratorDetailContext } from "../provider/collaborator-detail-provider";
import PeopleTransaction from "@/components/people/feature/transaction/PeopleTransaction";
import { useTabData } from "../hooks/useTabData";

interface TabContentProps {
    collaboratorId?: string;
}


// Tab content renderer component
export default function TabContentRenderer({ collaboratorId }: TabContentProps) {

    const { activeTab, setPage, dateWork, setDateWork } = useCollaboratorDetailContext();

    const { orders, transactions, } = useTabData(collaboratorId || '');

    switch (activeTab) {
        case 'Đơn hàng':
            return orders.pagination ? (
                <div className="tab-content">
                    <PeopleOrder
                        orders={orders.data}
                        pagination={orders.pagination}
                        setPage={setPage}
                        day={dateWork}
                        setDay={setDateWork}
                    />
                </div>
            ) : null;
        case 'Lịch sử tài chính':
            return transactions.pagination ? (
                <div className="tab-content">
                    <PeopleTransaction
                        trans={transactions.data}
                        pagination={transactions.pagination}
                        setPage={setPage}
                    />
                </div>
            ) : null;
        default:
            return null;
    }


};
