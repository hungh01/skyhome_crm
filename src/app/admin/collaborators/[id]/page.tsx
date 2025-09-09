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
import UpdatePeople from '@/components/people/UpdatePeople';

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
        width: '100%',
        flexWrap: 'wrap' as const
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
        minWidth: '300px',
        margin: '20px 0',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'stretch',
        position: 'relative' as const,
        gap: '12px'
    },
    editButton: {
        alignSelf: 'stretch',
        width: '100%',
        maxWidth: '350px',
        height: 'fit-content',
        minHeight: '44px',
        borderRadius: '8px',
        border: '1px solid #d9d9d9',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 500
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

    const fetchCollaborator = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        fetchCollaborator();
    }, [collaboratorId]);

    return { collaborator, loading, fetchCollaborator };
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
    const { collaborator, loading, fetchCollaborator } = useCollaboratorData(collaboratorId);
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
        <div style={STYLES.mainContainer} className="main-container">
            {/* Main Content: 70% */}
            <div style={STYLES.contentSection} className="content-section">
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
            <div style={STYLES.sidebarSection} className="sidebar-section">
                <PeopleInfor user={userInfo} />
                <Button
                    icon={<EditOutlined />}
                    type="default"
                    onClick={handleEditClick}
                    style={STYLES.editButton}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#1890ff';
                        e.currentTarget.style.color = '#1890ff';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#d9d9d9';
                        e.currentTarget.style.color = '';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    }}
                >
                    Chỉnh sửa
                </Button>
            </div>
            {/* Update Modal */}
            <UpdatePeople
                open={isUpdateModalOpen}
                setOpen={setIsUpdateModalOpen}
                user={collaborator?.userId}
                updateSuccess={fetchCollaborator}
            />

            {/* Responsive Styles */}
            <style jsx>{`
                @media (max-width: 768px) {
                    .main-container {
                        flex-direction: column;
                        align-items: center;
                        padding: 0 16px;
                    }
                    
                    .sidebar-section {
                        flex: none !important;
                        width: 100%;
                        max-width: 400px;
                        margin: 10px 0;
                    }
                    
                    .content-section {
                        flex: none !important;
                        width: 100%;
                        max-width: none;
                        margin: 10px 0;
                    }
                }
                
                @media (max-width: 480px) {
                    .sidebar-section {
                        min-width: auto;
                        max-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}