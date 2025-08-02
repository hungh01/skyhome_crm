'use client';

import { Segmented } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

import LikeOrUlikeOfUser from "./components/LikeOrUlikeOfUser";


import PeopleOrder from "@/components/people/feature/order/PeopleOrder";
import PeopleInfor from "@/components/people/PeopleInfor";
import PeopleTransaction from "@/components/people/feature/transaction/PeopleTransaction";
import { Order } from '@/type/order';
import { getOrderListByUserIdApi, getTransactionListByUserIdApi } from '@/api/user/customer-api';
import { DetailResponse } from '@/type/detailResponse/detailResponse';

import { Transaction } from '@/type/transaction';

const PAGE_SIZE = 3;
export default function UserDetailPage() {

    const [option, setOption] = useState('Đơn hàng');
    const params = useParams();


    // State for Orders Component
    const [orders, setOrders] = useState<DetailResponse<Order[]>>({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });
    const [page, setPage] = useState(1);
    const [day, setDay] = useState('');
    const [service, setService] = useState('');
    const [location, setLocation] = useState('');

    // State for Transactions Component
    const [transactions, setTransactions] = useState<DetailResponse<Transaction[]>>({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });

    // useEffect to fetch data for Orders Component
    useEffect(() => {
        if (option === 'Đơn hàng') {
            const fetchData = async () => {
                const res = await getOrderListByUserIdApi(params.id as string, page, PAGE_SIZE, day, service, location);
                if (res.data) {
                    setOrders(res);
                }
            };
            fetchData();
        } else
            if (option === 'Lịch sử tài chính') {
                const fetchData = async () => {
                    const res = await getTransactionListByUserIdApi(params.id as string, page, PAGE_SIZE);
                    if (res.data) {
                        setTransactions(res);
                    }
                };
                fetchData();
            }
    }, [option, page, day, service, location, params.id]);


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
                <div style={{ marginTop: '20px' }}>
                    {option === 'Đơn hàng' && orders.pagination && <PeopleOrder orders={orders.data} pagination={orders.pagination} setPage={setPage} day={day} setDay={setDay} service={service} setService={setService} location={location} setLocation={setLocation} />}
                    {option === 'Lịch sử tài chính' && transactions.pagination && <PeopleTransaction trans={transactions.data} pagination={transactions.pagination} setPage={setPage} />}
                    {option === 'Yêu thích/hạn chế' && <LikeOrUlikeOfUser />}
                </div>
            </div>
            {/* User Infor: 30% */}
            <div style={{ flex: '0 0 30%', margin: '20px 0', display: 'flex', alignItems: 'stretch' }}>
                <PeopleInfor id={params.id as string} />
            </div>
        </div>
    );

}


