'use client';
import { Card, Avatar, Typography, Tag, List, Space, Button } from "antd";
import { CheckCircleFilled, CalendarOutlined, UserOutlined, GlobalOutlined, EditOutlined } from "@ant-design/icons";
import { mockUsers } from '@/app/api/mock-userlist';
import { Segmented } from 'antd';
import { useParams } from 'next/navigation';
import { useState } from "react";
import PeopleInfor from "@/app/components/people/PeopleInfor";
import PeopleOrder from "../../../components/people/feature/order/PeopleOrder";
import { mockOrders } from "@/app/api/moc-orderlist";
import PeopleTransaction from "@/app/components/people/feature/transaction/PeopleTransaction";
import { mockTransactions } from "@/app/api/mock-transaction";
import Reviews from "../components/Reviews";
import { mockReviews } from "@/app/api/mock-reviews";

const { useRouter } = require('next/navigation');


export default function PartnerDetailPage() {

    const orders = mockOrders;
    const trans = mockTransactions;
    const reviews = mockReviews;

    const [open, setOpen] = useState(false);
    const [option, setOption] = useState('Đơn hàng');
    const handleEdit = () => {
        setOpen(true);
    };

    const params = useParams();

    const partner = mockUsers.find(user => user.id === params.id);
    if (!partner) {
        if (typeof window !== 'undefined') {
            const router = useRouter();
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
                        options={['Đơn hàng', 'Lịch sử tài chính', 'Lịch sử đánh giá']}
                        onChange={(value) => {
                            setOption(value);
                        }}
                    />
                </div>
                {/* detail */}
                <div style={{ marginTop: '20px' }}>
                    {option === 'Đơn hàng' && <PeopleOrder orders={orders} />}
                    {option === 'Lịch sử tài chính' && <PeopleTransaction trans={trans} />}
                    {option === 'Lịch sử đánh giá' && <Reviews reviews={reviews} />}
                </div>
            </div>
            {/* User Infor: 30% */}
            <div style={{ flex: '0 0 30%', margin: '20px 0', display: 'flex', alignItems: 'stretch' }}>
                <PeopleInfor user={partner} />
                <Button
                    icon={<EditOutlined />}
                    type="text"
                    onClick={handleEdit}
                    style={{ position: "absolute" }}
                >
                    Chỉnh sửa
                </Button>
            </div>
            {/* <UpdateUser open={open} setOpen={setOpen} user={user} /> */}
        </div>
    );

}


