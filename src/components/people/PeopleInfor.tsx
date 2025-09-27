
import { Avatar, Button, Card, List, Space, Typography } from "antd";
import { CalendarOutlined, EditOutlined } from "@ant-design/icons";

import { useRouter } from "next/navigation";
import { PeopleInfoType } from "@/type/user/people-info";
import UpdatePeople from "./UpdatePeople";
import { useState } from "react";
import { User } from "@/type/user/user";

interface props {
    userInfor: PeopleInfoType;
    refetch: () => void;
}

export default function PeopleInfor({ userInfor, refetch }: props) {
    const router = useRouter();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const { code, ...user } = userInfor;

    if (!userInfor) {
        return null;
    }

    if (!userInfor) {
        if (typeof window !== 'undefined') {
            router.push('/admin');
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
                        src={userInfor.image}
                        size={80}
                        style={{ border: "4px solid #fff", background: "#fff" }}
                    />
                    <Space align="center" style={{ marginTop: 12 }}>
                        <Typography.Title level={4} style={{ margin: 0 }}>
                            {userInfor.fullName}
                        </Typography.Title>
                    </Space>
                    <Typography.Text type="secondary">{userInfor.phone}</Typography.Text>
                </div>
                <List
                    size="small"
                    style={{ padding: 24, paddingTop: 16 }}
                    itemLayout="horizontal"
                    dataSource={[
                        {
                            label: "Mã số",
                            value: code,
                        },
                        {
                            label: "Tuổi",
                            value: userInfor.age,
                        },
                        {
                            label: "Giới tính",
                            value: userInfor.gender === 1 ? 'Nam' : 'Nữ',
                        },
                        {
                            label: "Mã giới thiệu",
                            value: userInfor.referralCode,
                        },
                        {
                            label: "Ngày sinh",
                            value: userInfor.birthDate ? new Date(userInfor.birthDate).toLocaleDateString() : '',
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
                            value: userInfor.address,
                        },
                        {
                            label: "Ngày tạo",
                            value: (
                                <Space>
                                    <CalendarOutlined />
                                    {new Date(userInfor.createdAt).toLocaleDateString()}
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
                type="default"
                onClick={() => setIsUpdateModalOpen(true)}
                className="edit-button"
            >
                Chỉnh sửa
            </Button>
            {/* Update Modal */}
            <UpdatePeople
                open={isUpdateModalOpen}
                setOpen={setIsUpdateModalOpen}
                user={user as User}
                updateSuccess={refetch}
            />
        </>

    );
}