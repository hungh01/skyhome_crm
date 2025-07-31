'use client';

import { Segmented } from 'antd';
import { useParams } from 'next/navigation';
import { useState } from "react";

import LikeOrUlikeOfUser from "./components/LikeOrUlikeOfUser";

import { mockOrders } from "@/api/moc-orderlist";

import PeopleOrder from "@/components/people/feature/order/PeopleOrder";
import PeopleInfor from "@/components/people/PeopleInfor";
import PeopleTransaction from "@/components/people/feature/transaction/PeopleTransaction";
import { mockTransactions } from "@/api/mock-transaction";
//import { useRouter } from 'next/navigation';


export default function UserDetailPage() {

    const orders = mockOrders;
    const transactions = mockTransactions;
    //const router = useRouter();

    const [option, setOption] = useState('Đơn hàng');

    const params = useParams();

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
                    {option === 'Đơn hàng' && <PeopleOrder orders={orders} />}
                    {option === 'Lịch sử tài chính' && <PeopleTransaction trans={transactions} />}
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


