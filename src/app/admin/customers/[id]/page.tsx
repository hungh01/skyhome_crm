'use client';

import { Segmented, Spin } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

import LikeOrUlikeOfUser from "./components/LikeOrUlikeOfUser";


import PeopleOrder from "@/components/people/feature/order/PeopleOrder";
import PeopleInfor from "@/components/people/PeopleInfor";
import PeopleTransaction from "@/components/people/feature/transaction/PeopleTransaction";
import { Order } from '@/type/order';
import { customerDetailApi, getOrderListByUserIdApi, getTransactionListByUserIdApi, likeOrUlikeOfUserApi } from '@/api/user/customer-api';
import { DetailResponse } from '@/type/detailResponse/detailResponse';

import { Transaction } from '@/type/transaction';
import { Customer } from '@/type/user/customer/customer';
import { PeopleInfoType } from '@/type/user/people-info';
import { FavoriteCollaborator } from '@/type/favorite-partner';

const PAGE_SIZE = 3;
export default function UserDetailPage() {

    const [option, setOption] = useState('Đơn hàng');
    const params = useParams();

    const [page, setPage] = useState(1);
    const [day, setDay] = useState('');
    const [service, setService] = useState('');
    const [location, setLocation] = useState('');

    const [loading, setLoading] = useState(false);

    const [customer, setCustomer] = useState<Customer>();

    // State for Orders Component
    const [orders, setOrders] = useState<DetailResponse<Order[]>>({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });
    // State for Transactions Component
    const [transactions, setTransactions] = useState<DetailResponse<Transaction[]>>({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });

    // State for LikeOrUlikeOfUser Component
    const [favoriteStatus, setFavoriteStatus] = useState<'liked' | 'disliked'>('liked');
    const [userFavoriteCollaborators, setUserFavoriteCollaborators] = useState<DetailResponse<FavoriteCollaborator[]>>({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });

    console.log("loading", loading);
    useEffect(() => {
        const fetchUser = async () => {
            const res = await customerDetailApi(params.id as string);
            if ('data' in res && res.data) {
                setCustomer(res.data);
            } else {
                setCustomer(undefined);
            }
        };
        fetchUser();
    }, [params.id]);

    const userInfo: PeopleInfoType = {
        ...customer?.userId,
        code: customer?.code || '',
    } as PeopleInfoType;

    // useEffect to fetch data for Orders Component
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (option === 'Đơn hàng') {
                    const res = await getOrderListByUserIdApi(params.id as string, page, PAGE_SIZE, day, service, location);
                    if (res.data) {
                        setOrders(res);
                    }
                } else if (option === 'Lịch sử tài chính') {
                    const res = await getTransactionListByUserIdApi(params.id as string, page, PAGE_SIZE);
                    if (res.data) {
                        setTransactions(res);
                    }
                } else if (option === 'Yêu thích/hạn chế') {
                    const res = await likeOrUlikeOfUserApi(params.id as string, favoriteStatus, page, PAGE_SIZE);
                    if ('data' in res && res.data) {
                        setUserFavoriteCollaborators(res);
                    }
                } else {
                    setOrders({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });
                    setTransactions({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });
                    setUserFavoriteCollaborators({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [option, page, day, service, location, params.id, favoriteStatus]);

    useEffect(() => {
        setPage(1);
        setDay('');
        setService('');
        setLocation('');
    }, [option]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', width: '100%' }}>
            {/* Left: 70% */}
            <div style={{ flex: '0 0 70%', padding: '20px', border: '1px solid #e8e8e8', borderRadius: '8px', backgroundColor: '#fff', maxWidth: '800px', margin: '20px 0' }}>
                {/* Header */}
                <div>
                    <Segmented<string>
                        options={['Đơn hàng', 'Lịch sử tài chính', 'Yêu thích/hạn chế']}
                        onChange={(value) => {
                            setOption(value);
                        }}
                    />
                </div>
                {/* detail */}
                {
                    loading ? (
                        <Spin spinning={true} style={{ display: 'block', margin: '20px auto' }} />
                    ) : (
                        <div style={{ marginTop: '20px' }}>
                            {option === 'Đơn hàng' && orders.pagination && <PeopleOrder orders={orders.data} pagination={orders.pagination} setPage={setPage} day={day} setDay={setDay} service={service} setService={setService} location={location} setLocation={setLocation} />}
                            {option === 'Lịch sử tài chính' && transactions.pagination && <PeopleTransaction trans={transactions.data} pagination={transactions.pagination} setPage={setPage} />}
                            {option === 'Yêu thích/hạn chế' && <LikeOrUlikeOfUser userFavoriteCollaborators={userFavoriteCollaborators} page={page} setPage={setPage} status={favoriteStatus} setStatus={setFavoriteStatus} />}
                        </div>
                    )
                }

            </div>
            {/* User Infor: 30% */}
            <div style={{ flex: '0 0 30%', margin: '20px 0', display: 'flex', alignItems: 'stretch' }}>
                <PeopleInfor user={userInfo} />
            </div>
        </div>
    );

}


