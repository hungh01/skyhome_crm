'use client';

import { getOrderListByCollaboratorIdApi, getTransactionListByCollaboratorIdApi } from "@/api/user/collaborator-api";
import { PAGE_SIZE } from "@/common/page-size";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Order } from "@/type/order/order";
import { Transaction } from "@/type/transaction/transaction";
import { useCallback, useEffect, useState } from "react";

import { INITIAL_PAGINATION } from "@/common/initital/pagination";
import { useCollaboratorDetailContext } from "../provider/collaborator-detail-provider";

// Custom hook for tab data management
export const useTabData = (collaboratorId: string) => {

    const { activeTab, page, dateWork } = useCollaboratorDetailContext();
    const [dataLoading, setDataLoading] = useState(false);
    const [orders, setOrders] = useState<DetailResponse<Order[]>>({

        data: [],
        pagination: INITIAL_PAGINATION
    });
    const [transactions, setTransactions] = useState<DetailResponse<Transaction[]>>({
        data: [],
        pagination: INITIAL_PAGINATION
    });

    const fetchTabData = useCallback(async () => {
        if (!collaboratorId) return;

        setDataLoading(true);
        try {
            switch (activeTab) {
                case 'Đơn hàng': {
                    const response = await getOrderListByCollaboratorIdApi(
                        collaboratorId,
                        page,
                        3,
                        dateWork
                    );
                    if ('data' in response) {
                        setOrders(response);
                    }
                    break;
                }
                case 'Lịch sử tài chính': {
                    const response = await getTransactionListByCollaboratorIdApi(
                        collaboratorId,
                        page,
                        PAGE_SIZE
                    );
                    if ('data' in response) {
                        setTransactions(response);
                    }
                    break;
                }
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab} data:`, error);
        } finally {
            setDataLoading(false);
        }
    }, [activeTab, page, dateWork, collaboratorId]);

    useEffect(() => {
        fetchTabData();
    }, [fetchTabData]);

    return { orders, transactions, dataLoading };
};
