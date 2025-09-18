import PeopleTransaction from "@/components/people/feature/transaction/PeopleTransaction";
import { useCustomerDetailContext } from "../provider/customer-detail-provider";
import LikeOrUlikeOfUser from "./LikeOrUlikeOfUser";
import PeopleOrder from "@/components/people/feature/order/PeopleOrder";
import Loading from "@/components/Loading";
import { useTabData } from "../hooks/useTabData";

// Tab content renderer component
export function TabContentRenderer({ customerId }: { customerId: string }) {
    const { activeTab, setPage, day, favoriteStatus, handleFilterChange, handleFavoriteStatusChange } = useCustomerDetailContext();

    const { orders, transactions, userFavoriteCollaborators, dataLoading } = useTabData(customerId);

    if (dataLoading) {
        return <Loading />;
    }

    switch (activeTab) {
        case 'Đơn hàng':
            return orders.pagination ? (
                <PeopleOrder
                    orders={orders.data}
                    pagination={orders.pagination}
                    setPage={setPage}
                    day={day}
                    setDay={handleFilterChange}
                />
            ) : null;
        case 'Lịch sử tài chính':
            return transactions.pagination ? (
                <PeopleTransaction
                    trans={transactions.data}
                    pagination={transactions.pagination}
                    setPage={setPage}
                />
            ) : null;
        case 'Yêu thích/hạn chế':
            return (
                <LikeOrUlikeOfUser
                    userFavoriteCollaborators={userFavoriteCollaborators}
                    page={1}
                    setPage={setPage}
                    status={favoriteStatus}
                    setStatus={handleFavoriteStatusChange}
                />
            );
        default:
            return null;
    }
};
