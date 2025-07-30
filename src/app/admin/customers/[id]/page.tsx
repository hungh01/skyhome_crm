'use client';
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { mockUsers } from '@/api/mock-userlist';
import { Segmented } from 'antd';
import { useParams } from 'next/navigation';
import { useState } from "react";
import UpdateUser from "./components/detail-components/UpdateUser";


import LikeOrUlikeOfUser from "./components/LikeOrUlikeOfUser";

import { mockOrders } from "@/api/moc-orderlist";

import PeopleOrder from "@/components/people/feature/order/PeopleOrder";
import PeopleInfor from "@/components/people/PeopleInfor";
import PeopleTransaction from "@/components/people/feature/transaction/PeopleTransaction";
import { mockTransactions } from "@/api/mock-transaction";
import { useRouter } from 'next/navigation';


export default function UserDetailPage() {

    const orders = mockOrders;
    const transactions = mockTransactions; // Assuming you have a mockTransactions similar to mockOrders
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [option, setOption] = useState('Đơn hàng');
    const handleEdit = () => {
        setOpen(true);
    };

    const params = useParams();

    const user = mockUsers.find(user => user._id === params.id);
    if (!user) {
        if (typeof window !== 'undefined') {
            router.push('/admin/customers');
        }
        return null;
    }

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
                <PeopleInfor user={user} />
                <Button
                    icon={<EditOutlined />}
                    type="text"
                    onClick={handleEdit}
                    style={{ position: "absolute" }}
                >
                    Chỉnh sửa
                </Button>
            </div>
            <UpdateUser open={open} setOpen={setOpen} user={user} />
        </div>
    );

}


