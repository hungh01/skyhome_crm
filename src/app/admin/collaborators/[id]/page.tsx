'use client';
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { Segmented } from 'antd';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";


import UpdateUser from "../../customers/[id]/components/detail-components/UpdateUser";
import { collaboratorDetailApi } from "@/api/user/collaborator-api";

import { Collaborator } from "@/type/user/collaborator/collaborator";


export default function CollaboratorDetailPage() {


    const [collaborator, setCollaborator] = useState<Collaborator>();

    const [open, setOpen] = useState(false);
    const [option, setOption] = useState('Đơn hàng');
    console.log('option', option);
    const params = useParams();
    const handleEdit = () => {
        setOpen(true);
    };

    useEffect(() => {
        const fetchUser = async () => {
            const data = await collaboratorDetailApi(params.id as string);
            setCollaborator(data);
        };
        fetchUser();
    }, [params.id]);

    if (!collaborator) {
        // if (typeof window !== 'undefined') {
        //     router.push('/admin/customers');
        // }
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
                {/* <div style={{ marginTop: '20px' }}>
                    {option === 'Đơn hàng' && <PeopleOrder orders={orders} />}
                    {option === 'Lịch sử tài chính' && <PeopleTransaction trans={trans} />}
                    {option === 'Lịch sử đánh giá' && <Reviews reviews={reviews} />}
                </div> */}
            </div>
            {/* User Infor: 30% */}
            <div style={{ flex: '0 0 30%', margin: '20px 0', display: 'flex', alignItems: 'stretch' }}>
                {/* <PeopleInfor user={collaborator.user} /> */}
                <Button
                    icon={<EditOutlined />}
                    type="text"
                    onClick={handleEdit}
                    style={{ position: "absolute" }}
                >
                    Chỉnh sửa
                </Button>
            </div>
            <UpdateUser open={open} setOpen={setOpen} user={collaborator.user} />
        </div>
    );

}


