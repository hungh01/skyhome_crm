'use client';
import { Card, Avatar, Typography, Tag, List, Space, Button } from "antd";
import { CheckCircleFilled, CalendarOutlined, UserOutlined, GlobalOutlined, EditOutlined } from "@ant-design/icons";
import { mockUsers } from '@/app/api/mock-userlist';
import { Image, Segmented } from 'antd';
import { useParams } from 'next/navigation';
import { useState } from "react";
import UpdateUser from "./components/UpdateUser";
import UserInfor from "./components/UserInfor";
import UserOrder from "./components/UserOrder";

import LikeOrUlikeOfUser from "./components/LikeOrUlikeOfUser";
import UserTransaction from "./components/UserTransaction";
const { useRouter } = require('next/navigation');


export default function UserDetailPage() {

    const [open, setOpen] = useState(false);
    const [option, setOption] = useState('Đơn hàng');
    const handleEdit = () => {
        setOpen(true);
    };

    const params = useParams();

    const user = mockUsers.find(user => user.id === params.id);
    if (!user) {
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
                        options={['Đơn hàng', 'Lịch sử tài chính', 'Yêu thích/hạn chế']}
                        onChange={(value) => {
                            setOption(value);
                        }}
                    />
                </div>
                {/* detail */}
                <div style={{ marginTop: '20px' }}>
                    {option === 'Đơn hàng' && <UserOrder userId={user.id} />}
                    {option === 'Lịch sử tài chính' && <UserTransaction userId={user.id} />}
                    {option === 'Yêu thích/hạn chế' && <LikeOrUlikeOfUser userId={user.id} />}
                </div>
            </div>
            {/* User Infor: 30% */}
            <div style={{ flex: '0 0 30%', margin: '20px 0', display: 'flex', alignItems: 'stretch' }}>
                <UserInfor user={user} />
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


