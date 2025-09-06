'use client';

import { Button, Segmented, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
    collaboratorDetailApi,
    getOrderListByCollaboratorIdApi,
    getTransactionListByCollaboratorIdApi
} from '@/api/user/collaborator-api';
import PeopleInfor from '@/components/people/PeopleInfor';
import PeopleOrder from '@/components/people/feature/order/PeopleOrder';
import PeopleTransaction from '@/components/people/feature/transaction/PeopleTransaction';
import UpdateUser from '../../customers/[id]/components/detail-components/UpdateUser';
import { PAGE_SIZE } from '@/common/page-size';
import { DetailResponse } from '@/type/detailResponse/detailResponse';
import { Order } from '@/type/order/order';
import { Transaction } from '@/type/transaction/transaction';
import { Collaborator } from '@/type/user/collaborator/collaborator';
import { PeopleInfoType } from '@/type/user/people-info';

// Types and constants
type TabOption = 'Đơn hàng' | 'Lịch sử tài chính';

const TAB_OPTIONS: TabOption[] = ['Đơn hàng', 'Lịch sử tài chính'];
const INITIAL_PAGINATION = { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 };

// Styles constants
const STYLES = {
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
    },
    mainContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        width: '100%'
    },
    contentSection: {
        flex: '0 0 70%',
        padding: '20px',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        backgroundColor: '#fff',
        maxWidth: '800px',
        margin: '20px 0'
    },
    sidebarSection: {
        flex: '0 0 30%',
        margin: '20px 0',
        display: 'flex',
        alignItems: 'stretch',
        position: 'relative' as const
    },
    editButton: {
        position: 'absolute' as const,
        top: 0,
        right: 0,
        zIndex: 1
    },
    tabNavigation: {
        display: 'flex',
        justifyContent: 'center'
    },
    tabContent: {
        marginTop: '20px'
    }
} as const;

// Custom hook for collaborator data management
const useCollaboratorData = (collaboratorId: string) => {
    const [loading, setLoading] = useState(true);
    const [collaborator, setCollaborator] = useState<Collaborator>();

    useEffect(() => {
        const fetchCollaborator = async () => {
            if (!collaboratorId) return;

            setLoading(true);
            try {
                const response = await collaboratorDetailApi(collaboratorId);
                if ('data' in response && response.data) {
                    setCollaborator(response.data);
                } else {
                    setCollaborator(undefined);
                }
            } catch (error) {
                console.error('Error fetching collaborator:', error);
                setCollaborator(undefined);
            } finally {
                setLoading(false);
            }
        };

        fetchCollaborator();
    }, [collaboratorId]);

    return { collaborator, loading };
};

// Custom hook for tab data management
const useTabData = (collaboratorId: string, activeTab: TabOption, page: number, dateWork: string) => {
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

// Loading component
const LoadingSpinner: React.FC = () => (
    <div style={STYLES.loadingContainer}>
        <Spin size="large" />
    </div>
);

// Error component
const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
    <div style={STYLES.loadingContainer}>
        <div>{message}</div>
    </div>
);

// Tab content renderer component
const TabContentRenderer: React.FC<{
    activeTab: TabOption;
    orders: DetailResponse<Order[]>;
    transactions: DetailResponse<Transaction[]>;
    page: number;
    setPage: (page: number) => void;
    dateWork: string;
    onFilterChange: (value: string) => void;
}> = ({ activeTab, orders, transactions, setPage, dateWork, onFilterChange }) => {
    switch (activeTab) {
        case 'Đơn hàng':
            return orders.pagination ? (
                <PeopleOrder
                    orders={orders.data}
                    pagination={orders.pagination}
                    setPage={setPage}
                    day={dateWork}
                    setDay={onFilterChange}
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
        default:
            return null;
    }
};

export default function CollaboratorDetailPage() {
    const params = useParams();
    const collaboratorId = params.id as string;

    // State management
    const [activeTab, setActiveTab] = useState<TabOption>('Đơn hàng');
    const [page, setPage] = useState(1);
    const [dateWork, setDateWork] = useState<string>('');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // Custom hooks
    const { collaborator, loading } = useCollaboratorData(collaboratorId);
    const { orders, transactions } = useTabData(collaboratorId, activeTab, page, dateWork);

    // Event handlers
    const handleTabChange = useCallback((value: TabOption) => {
        setActiveTab(value);
        setPage(1);
    }, []);

    const handleEditClick = useCallback(() => {
        setIsUpdateModalOpen(true);
    }, []);

    const handleFilterChange = useCallback((value: string) => {
        setDateWork(value);
        setPage(1);
    }, []);

    // Computed values
    const userInfo: PeopleInfoType = useMemo(() => ({
        ...collaborator?.userId,
        code: collaborator?.code || '',
    } as PeopleInfoType), [collaborator]);

    // Loading and error states
    if (loading) {
        return <LoadingSpinner />;
    }

    if (!collaborator) {
        return <ErrorMessage message="Không tìm thấy thông tin cộng tác viên" />;
    }


    return (
        <div style={STYLES.mainContainer}>
            {/* Main Content: 70% */}
            <div style={STYLES.contentSection}>
                {/* Tab Navigation */}
                <div style={STYLES.tabNavigation}>
                    <Segmented<TabOption>
                        options={TAB_OPTIONS}
                        value={activeTab}
                        onChange={handleTabChange}
                    />
                </div>

                {/* Tab Content */}
                <div style={STYLES.tabContent}>
                    <TabContentRenderer
                        activeTab={activeTab}
                        orders={orders}
                        transactions={transactions}
                        page={page}
                        setPage={setPage}
                        dateWork={dateWork}
                        onFilterChange={handleFilterChange}
                    />
                </div>
            </div>

            {/* User Info Sidebar: 30% */}
            <div style={STYLES.sidebarSection}>
                <PeopleInfor user={userInfo} />
                <Button
                    icon={<EditOutlined />}
                    type="text"
                    onClick={handleEditClick}
                    style={STYLES.editButton}
                >
                    Chỉnh sửa
                </Button>
            </div>

            {/* Update Modal */}
            <UpdateUser
                open={isUpdateModalOpen}
                setOpen={setIsUpdateModalOpen}
                collaborator={collaborator}
            />
        </div>
    );
}