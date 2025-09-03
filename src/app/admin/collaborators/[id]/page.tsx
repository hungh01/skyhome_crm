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

type TabOption = 'Đơn hàng' | 'Lịch sử tài chính';

const TAB_OPTIONS: TabOption[] = ['Đơn hàng', 'Lịch sử tài chính'];

const INITIAL_PAGINATION = { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 };

export default function CollaboratorDetailPage() {
    const params = useParams();
    const collaboratorId = params.id as string;

    // Loading states
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);

    // Main data
    const [collaborator, setCollaborator] = useState<Collaborator>();

    // Tab and pagination
    const [activeTab, setActiveTab] = useState<TabOption>('Đơn hàng');
    const [page, setPage] = useState(1);

    // Filters
    const [filters, setFilters] = useState({
        day: '',
        service: '',
        location: ''
    });

    // Component data
    const [orders, setOrders] = useState<DetailResponse<Order[]>>({
        data: [],
        pagination: INITIAL_PAGINATION
    });
    const [transactions, setTransactions] = useState<DetailResponse<Transaction[]>>({
        data: [],
        pagination: INITIAL_PAGINATION
    });

    // Modal state
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);


    // Fetch collaborator details
    useEffect(() => {
        const fetchCollaborator = async () => {
            setLoading(true);
            try {
                const res = await collaboratorDetailApi(collaboratorId);
                if ('data' in res && res.data) {
                    setCollaborator(res.data);
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

        if (collaboratorId) {
            fetchCollaborator();
        }
    }, [collaboratorId]);

    // Fetch data based on active tab
    const fetchTabData = useCallback(async () => {
        if (!collaboratorId) return;

        setDataLoading(true);
        try {
            switch (activeTab) {
                case 'Đơn hàng': {
                    const res = await getOrderListByCollaboratorIdApi(
                        collaboratorId,
                        page,
                        PAGE_SIZE,
                        filters.day,
                        filters.service,
                        filters.location
                    );
                    if ('data' in res) {
                        setOrders(res);
                    }
                    break;
                }
                case 'Lịch sử tài chính': {
                    const res = await getTransactionListByCollaboratorIdApi(
                        collaboratorId,
                        page,
                        PAGE_SIZE
                    );
                    if ('data' in res) {
                        setTransactions(res);
                    }
                    break;
                }
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab} data:`, error);
        } finally {
            setDataLoading(false);
        }
    }, [activeTab, page, filters.day, filters.service, filters.location, collaboratorId]);

    useEffect(() => {
        fetchTabData();
    }, [fetchTabData]);

    // Handlers
    const handleTabChange = useCallback((value: TabOption) => {
        setActiveTab(value);
        setPage(1); // Reset page when switching tabs
    }, []);

    const handleEditClick = useCallback(() => {
        setIsUpdateModalOpen(true);
    }, []);

    const handleFilterChange = useCallback((filterType: keyof typeof filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setPage(1); // Reset page when filters change
    }, []);

    // Computed values
    const userInfo: PeopleInfoType = useMemo(() => ({
        ...collaborator?.userId,
        code: collaborator?.code || '',
    } as PeopleInfoType), [collaborator]);

    // Loading state
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px'
            }}>
                <Spin size="large" />
            </div>
        );
    }

    // Error state
    if (!collaborator) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px'
            }}>
                <div>Không tìm thấy thông tin cộng tác viên</div>
            </div>
        );
    }

    // Render content based on active tab
    const renderTabContent = () => {
        if (dataLoading) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '200px'
                }}>
                    <Spin size="large" />
                </div>
            );
        }

        switch (activeTab) {
            case 'Đơn hàng':
                return orders.pagination && (
                    <PeopleOrder
                        orders={orders.data}
                        pagination={orders.pagination}
                        setPage={setPage}
                        day={filters.day}
                        setDay={(value) => handleFilterChange('day', value)}
                        service={filters.service}
                        setService={(value) => handleFilterChange('service', value)}
                        location={filters.location}
                        setLocation={(value) => handleFilterChange('location', value)}
                    />
                );
            case 'Lịch sử tài chính':
                return transactions.pagination && (
                    <PeopleTransaction
                        trans={transactions.data}
                        pagination={transactions.pagination}
                        setPage={setPage}
                    />
                );
            // case 'Lịch sử đánh giá':
            //     return reviews.pagination && (
            //         <Reviews
            //             reviews={reviews}
            //             setPage={setPage}
            //         />
            //     );
            default:
                return null;
        }
    };


    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            width: '100%'
        }}>
            {/* Main Content: 70% */}
            <div style={{
                flex: '0 0 70%',
                padding: '20px',
                border: '1px solid #e8e8e8',
                borderRadius: '8px',
                backgroundColor: '#fff',
                maxWidth: '800px',
                margin: '20px 0'
            }}>
                {/* Tab Navigation */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Segmented<TabOption>
                        options={TAB_OPTIONS}
                        value={activeTab}
                        onChange={handleTabChange}
                    />
                </div>

                {/* Tab Content */}
                <div style={{ marginTop: '20px' }}>
                    {renderTabContent()}
                </div>
            </div>

            {/* User Info Sidebar: 30% */}
            <div style={{
                flex: '0 0 30%',
                margin: '20px 0',
                display: 'flex',
                alignItems: 'stretch',
                position: 'relative'
            }}>
                <PeopleInfor user={userInfo} />
                <Button
                    icon={<EditOutlined />}
                    type="text"
                    onClick={handleEditClick}
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        zIndex: 1
                    }}
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