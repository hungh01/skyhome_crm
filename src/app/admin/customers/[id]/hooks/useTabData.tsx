import { useCallback, useEffect, useState } from "react";
import { useCustomerDetailContext } from "../provider/customer-detail-provider";
import { getOrderListByUserIdApi, getTransactionListByUserIdApi, likeOrUlikeOfUserApi } from "@/api/user/customer-api";

export function useTabData(customerId: string) {
    const [dataLoading, setDataLoading] = useState(false);
    const { activeTab, page, day, favoriteStatus, orders, setOrders, transactions, setTransactions, userFavoriteCollaborators, setUserFavoriteCollaborators } = useCustomerDetailContext();

    const fetchTabData = useCallback(async () => {
        if (!customerId) return;

        setDataLoading(true);
        try {
            switch (activeTab) {
                case 'Đơn hàng': {
                    const response = await getOrderListByUserIdApi(customerId, page, 3, day);
                    if ('data' in response) {
                        setOrders(response);
                    }
                    break;
                }
                case 'Lịch sử tài chính': {
                    const response = await getTransactionListByUserIdApi(customerId, page, 3);
                    if ('data' in response) {
                        setTransactions(response);
                    }
                    break;
                }
                case 'Yêu thích/hạn chế': {
                    const response = await likeOrUlikeOfUserApi(customerId, favoriteStatus, page, 3);
                    if ('data' in response) {
                        setUserFavoriteCollaborators(response);
                    }
                    break;
                }
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab} data:`, error);
        } finally {
            setDataLoading(false);
        }
    }, [activeTab, page, day, customerId, favoriteStatus]);

    useEffect(() => {
        fetchTabData();
    }, [fetchTabData]);

    return { orders, transactions, userFavoriteCollaborators, dataLoading };
}



// // Custom hook for tab data management
// const useTabData = (customerId: string, activeTab: TabOption, page: number, day: string, favoriteStatus: 'liked' | 'disliked') => {
    
// };
