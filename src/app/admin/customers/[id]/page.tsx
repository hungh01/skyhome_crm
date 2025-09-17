'use client';

import { Button, Segmented, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import LikeOrUlikeOfUser from "./components/LikeOrUlikeOfUser";
import PeopleOrder from "@/components/people/feature/order/PeopleOrder";
import PeopleTransaction from "@/components/people/feature/transaction/PeopleTransaction";
import PeopleInfor from "@/components/people/PeopleInfor";
import UpdatePeople from "@/components/people/UpdatePeople";
import { Order } from '@/type/order/order';
import { customerDetailApi, getOrderListByUserIdApi, getTransactionListByUserIdApi, likeOrUlikeOfUserApi } from '@/api/user/customer-api';
import { DetailResponse } from '@/type/detailResponse/detailResponse';
import { Transaction } from '@/type/transaction/transaction';
import { Customer } from '@/type/user/customer/customer';
import { PeopleInfoType } from '@/type/user/people-info';
import { FavoriteCollaborator } from '@/type/favorite-partner';

// Types and constants
type TabOption = 'Đơn hàng' | 'Lịch sử tài chính' | 'Yêu thích/hạn chế';

const TAB_OPTIONS: TabOption[] = ['Đơn hàng', 'Lịch sử tài chính', 'Yêu thích/hạn chế'];
const INITIAL_PAGINATION = { page: 1, pageSize: 3, total: 0, totalPages: 0 };

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
// Custom hook for customer data management
const useCustomerData = (customerId: string) => {
    const [loading, setLoading] = useState(true);
    const [customer, setCustomer] = useState<Customer>();

    const fetchCustomer = useCallback(async () => {
        if (!customerId) return;

        setLoading(true);
        try {
            const response = await customerDetailApi(customerId);
            if ('data' in response && response.data) {
                setCustomer(response.data);
            } else {
                setCustomer(undefined);
            }
        } catch (error) {
            console.error('Error fetching customer:', error);
            setCustomer(undefined);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        fetchCustomer();
    }, [fetchCustomer]);

    return { customer, loading, fetchCustomer };
};

// Custom hook for tab data management
const useTabData = (customerId: string, activeTab: TabOption, page: number, day: string, favoriteStatus: 'liked' | 'disliked') => {
    const [dataLoading, setDataLoading] = useState(false);
    const [orders, setOrders] = useState<DetailResponse<Order[]>>({ data: [], pagination: INITIAL_PAGINATION });
    const [transactions, setTransactions] = useState<DetailResponse<Transaction[]>>({ data: [], pagination: INITIAL_PAGINATION });
    const [userFavoriteCollaborators, setUserFavoriteCollaborators] = useState<DetailResponse<FavoriteCollaborator[]>>({ data: [], pagination: INITIAL_PAGINATION });

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
    userFavoriteCollaborators: DetailResponse<FavoriteCollaborator[]>;
    page: number;
    setPage: (page: number) => void;
    day: string;
    onFilterChange: (value: string) => void;
    favoriteStatus: 'liked' | 'disliked';
    onFavoriteStatusChange: (status: 'liked' | 'disliked') => void;
    loading: boolean;
}> = ({
    activeTab,
    orders,
    transactions,
    userFavoriteCollaborators,
    setPage,
    day,
    onFilterChange,
    favoriteStatus,
    onFavoriteStatusChange,
    loading
}) => {
        if (loading) {
            return <LoadingSpinner />;
        }

        switch (activeTab) {
            case 'Đơn hàng':
                return orders.pagination ? (
                    <PeopleOrder
                        orders={orders.data}
                        pagination={orders.pagination}
                        setPage={setPage}
                        day={day}
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
            case 'Yêu thích/hạn chế':
                return (
                    <LikeOrUlikeOfUser
                        userFavoriteCollaborators={userFavoriteCollaborators}
                        page={1}
                        setPage={setPage}
                        status={favoriteStatus}
                        setStatus={onFavoriteStatusChange}
                    />
                );
            default:
                return null;
        }
    };

export default function CustomerDetailPage() {
    const params = useParams();
    const customerId = params.id as string;

    // State management
    const [activeTab, setActiveTab] = useState<TabOption>('Đơn hàng');
    const [page, setPage] = useState(1);
    const [day, setDay] = useState<string>('');
    const [favoriteStatus, setFavoriteStatus] = useState<'liked' | 'disliked'>('liked');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    // Custom hooks
    const { customer, loading, fetchCustomer } = useCustomerData(customerId);
    const { orders, transactions, userFavoriteCollaborators, dataLoading } = useTabData(
        customerId, activeTab, page, day, favoriteStatus
    );

    // Event handlers
    const handleTabChange = useCallback((value: TabOption) => {
        setActiveTab(value);
        setPage(1);
        setDay('');
    }, []);

    const handleEditClick = useCallback(() => {
        setIsUpdateModalOpen(true);
    }, []);

    const handleFilterChange = useCallback((value: string) => {
        setDay(value);
        setPage(1);
    }, []);

    const handleFavoriteStatusChange = useCallback((status: 'liked' | 'disliked') => {
        setFavoriteStatus(status);
        setPage(1);
    }, []);

    // Computed values
    const userInfo: PeopleInfoType = useMemo(() => ({
        ...customer?.userId,
        code: customer?.code || '',
        referralCode: customer?.referralCode || '',
    } as PeopleInfoType), [customer]);

    // Loading and error states
    if (loading) {
        return <LoadingSpinner />;
    }

    if (!customer) {
        return <ErrorMessage message="Không tìm thấy thông tin khách hàng" />;
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
                        userFavoriteCollaborators={userFavoriteCollaborators}
                        page={page}
                        setPage={setPage}
                        day={day}
                        onFilterChange={handleFilterChange}
                        favoriteStatus={favoriteStatus}
                        onFavoriteStatusChange={handleFavoriteStatusChange}
                        loading={dataLoading}
                    />
                </div>
            </div>

            {/* User Info Sidebar: 30% */}
            <div style={STYLES.sidebarSection} className="sidebar-section">
                {/* <PeopleInfor userInfor={userInfo} /> */}
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
                user={{
                    _id: customer?.userId?._id || '',
                    phone: customer?.userId?.phone || '',
                    fullName: customer?.userId?.fullName || '',
                    status: 1,
                    address: customer?.userId?.address || '',
                    customerCode: customer?.code || '',
                    age: customer?.userId?.age || 0,
                    gender: customer?.userId?.gender || 0,
                    referralCode: customer?.referralCode || '',
                    image: '',
                    birthDate: customer?.userId?.birthDate || '',
                    createdAt: customer?.userId?.createdAt || '',
                    customerType: 'individual' as const
                }}
                updateSuccess={fetchCustomer}
            />

        </div>
    );
}


