'use client';
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { Segmented } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";


import UpdateUser from "../../customers/[id]/components/detail-components/UpdateUser";
import { collaboratorDetailApi, getOrderListByCollaboratorIdApi, getReviewListByCollaboratorIdApi, getTransactionListByCollaboratorIdApi } from "@/api/user/collaborator-api";

import { Collaborator } from "@/type/user/collaborator/collaborator";
import PeopleInfor from "@/components/people/PeopleInfor";
import { PAGE_SIZE } from "@/common/page-size";
import { DetailResponse } from "@/type/detailResponse/detailResponse";
import { Order } from "@/type/order";
import { Transaction } from "@/type/transaction";
import PeopleOrder from "@/components/people/feature/order/PeopleOrder";
import PeopleTransaction from "@/components/people/feature/transaction/PeopleTransaction";
import Reviews from "../components/Reviews";
import { Review } from "@/type/review";


export default function CollaboratorDetailPage() {

    const params = useParams();
    const [page, setPage] = useState(1);
    const [day, setDay] = useState('');
    const [service, setService] = useState('');
    const [location, setLocation] = useState('');

    const [collaborator, setCollaborator] = useState<{ _id: string, userId: string }>();
    // State for Reviews Component
    const [reviews, setReviews] = useState<DetailResponse<Review[]>>({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });
    // State for Orders Component
    const [orders, setOrders] = useState<DetailResponse<Order[]>>({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });
    // State for Transactions Component
    const [transactions, setTransactions] = useState<DetailResponse<Transaction[]>>({ data: [], pagination: { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 } });

    const [open, setOpen] = useState(false);
    const [option, setOption] = useState('Đơn hàng');

    // useEffect to fetch data for Orders Component
    useEffect(() => {
        if (option === 'Đơn hàng') {
            const fetchData = async () => {
                const res = await getOrderListByCollaboratorIdApi(params.id as string, page, PAGE_SIZE, day, service, location);
                if ('data' in res) {
                    setOrders(res);
                }
            };
            fetchData();
        } else if (option === 'Lịch sử tài chính') {
            const fetchData = async () => {
                const res = await getTransactionListByCollaboratorIdApi(params.id as string, page, PAGE_SIZE);
                if ('data' in res) {
                    setTransactions(res);
                }
            };
            fetchData();
        } else if (option === 'Lịch sử đánh giá') {
            const fetchData = async () => {
                const res = await getReviewListByCollaboratorIdApi(params.id as string, page, PAGE_SIZE);
                if ('data' in res) {
                    setReviews(res);
                }
            };
            fetchData();
        }
    }, [option, page, day, service, location, params.id]);


    const handleEdit = () => {
        setOpen(true);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const res = await collaboratorDetailApi(params.id as string);
            if ('data' in res && res.data) {
                setCollaborator(res.data);
            } else {
                setCollaborator(undefined);
            }
        };
        fetchUser();
    }, [params.id]);

    if (!collaborator) {
        // if (typeof window !== 'undefined') {
        //     router.push('/admin/customers');
        // }
        return null;
    }
    console.log('collaborator', collaborator);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', width: '100%' }}>
            {/* Left: 70% */}
            <div style={{ flex: '0 0 70%', padding: '20px', border: '1px solid #e8e8e8', borderRadius: '8px', backgroundColor: '#fff', maxWidth: '800px', margin: '20px 0' }}>
                {/* Header */}
                <div>
                    <Segmented<string>
                        options={['Đơn hàng', 'Lịch sử tài chính', 'Lịch sử đánh giá']}
                        onChange={(value) => {
                            setOption(value);
                        }}
                    />
                </div>
                {/* detail */}
                <div style={{ marginTop: '20px' }}>
                    {option === 'Đơn hàng' && orders.pagination && <PeopleOrder orders={orders.data} pagination={orders.pagination} setPage={setPage} day={day} setDay={setDay} service={service} setService={setService} location={location} setLocation={setLocation} />}
                    {option === 'Lịch sử tài chính' && transactions.pagination && <PeopleTransaction trans={transactions.data} pagination={transactions.pagination} setPage={setPage} />}
                    {option === 'Lịch sử đánh giá' && <Reviews reviews={reviews.data} pagination={reviews.pagination ?? { page: 1, pageSize: PAGE_SIZE, total: 0, totalPages: 0 }} setPage={setPage} />}
                </div>
            </div>
            {/* User Infor: 30% */}
            <div style={{ flex: '0 0 30%', margin: '20px 0', display: 'flex', alignItems: 'stretch' }}>
                <PeopleInfor id={collaborator.userId} />
                <Button
                    icon={<EditOutlined />}
                    type="text"
                    onClick={handleEdit}
                    style={{ position: "absolute" }}
                >
                    Chỉnh sửa
                </Button>
            </div>
            {/* <UpdateUser open={open} setOpen={setOpen} user={collaborator.userId} /> */}
        </div>
    );

}


