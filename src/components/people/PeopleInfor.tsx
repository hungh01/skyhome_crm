
import { Avatar, Button, Card, List, Space, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { User } from "@/type/user/user";

import UpdateUser from "@/app/admin/customers/[id]/components/detail-components/UpdateUser";
import { useRouter } from "next/navigation";
import { customerDetailApi } from "@/api/user/customer-api";

interface props {
    id: string;
}

export default function PeopleInfor({ id }: props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState<User>();


    useEffect(() => {
        const fetchUser = async () => {
            const res = await customerDetailApi(id);
            setUser(res.data);
        };
        fetchUser();
    }, [id]);

    if (!user) {
        // if (typeof window !== 'undefined') {
        //     router.push('/admin/customers');
        // }
        return null;
    }



    const handleEdit = () => {
        setOpen(true);
    };


    if (!user) {
        if (typeof window !== 'undefined') {
            router.push('/admin/customers');
        }
        return null;
    }


    return (
        <>
            <Card
                style={{
                    borderRadius: 16,
                    boxShadow: "0 0 40px rgba(0,0,0,0.07)",
                    padding: 0,
                    width: '100%',
                    border: '1px solid #e8e8e8',
                    backgroundColor: '#fff',
                    maxWidth: '350px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'stretch'
                }}
                styles={{
                    body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column' }
                }}
            >
                <div style={{ background: "#fdeee6", borderRadius: "16px 16px 0 0", height: 80 }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -40 }}>
                    <Avatar
                        src={user.image}
                        size={80}
                        style={{ border: "4px solid #fff", background: "#fff" }}
                    />
                    <Space align="center" style={{ marginTop: 12 }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            {user.fullName}
                        </Typography.Title>
                    </Space>
                    <Typography.Text type="secondary">{user.phone}</Typography.Text>
                </div>
                <List
                    size="small"
                    style={{ padding: 24, paddingTop: 16 }}
                    itemLayout="horizontal"
                    dataSource={[
                        {
                            label: "Mã số",
                            value: user.customerCode,
                        },
                        {
                            label: "Tuổi",
                            value: user.age,
                        },
                        {
                            label: "Giới tính",
                            value: user.gender === 1 ? 'Nam' : 'Nữ',
                        },
                        {
                            label: "Mã giới thiệu",
                            value: user.referralCode,
                        },
                        {
                            label: "Ngày sinh",
                            value: user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '',
                        },
                        // {
                        //     label: "Tên chủ thẻ",
                        //     value: user.cardHolderName,
                        // },
                        // {
                        //     label: "Ngân hàng",
                        //     value: user.bankName,
                        // },
                        // {
                        //     label: "Số tài khoản",
                        //     value: user.bankAccountNumber,
                        // },
                        {
                            label: "Địa chỉ",
                            value: user.address,
                        },
                        {
                            label: "Ngày tạo",
                            value: (
                                <Space>
                                    <CalendarOutlined />
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </Space>
                            ),
                        },
                    ]}
                    renderItem={item => (
                        <List.Item style={{ display: "flex", alignItems: "center", padding: "4px 0" }}>
                            <Typography.Text
                                type="secondary"
                                style={{
                                    minWidth: 120,
                                    flex: "0 0 120px",
                                    textAlign: "left",
                                    marginRight: 8,
                                    display: "inline-block"
                                }}
                            >
                                {item.label}:
                            </Typography.Text>
                            <div style={{ flex: 1 }}>{item.value}</div>
                        </List.Item>
                    )}

                />
            </Card>
            <Button
                icon={<EditOutlined />}
                type="text"
                onClick={handleEdit}
                style={{ position: "absolute" }}
            >
                Chỉnh sửa
            </Button>
            <UpdateUser open={open} setOpen={setOpen} user={user} />
        </>

    );
}