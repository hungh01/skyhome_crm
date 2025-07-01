'use client';
import { User } from "@/app/type/user";
import { Table, Input, DatePicker } from "antd";
import { useState } from "react";
import NotificationModal from "../../components/Modal";
import dayjs, { Dayjs } from "dayjs";

function getColumns(
    searchCustomerName: string, setSearchCustomerName: (v: string) => void,
    searchAddress: string, setSearchAddress: (v: string) => void,
    searchCustomerCode: string, setSearchCustomerCode: (v: string) => void,
    searchCreatedAt: Dayjs | null, setSearchCreatedAt: (v: Dayjs | null) => void,
    setOpen: (open: boolean) => void,
    setMessage: (message: string) => void,
    setUserIdToDelete: (userId: string) => void
) {
    const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;

    return [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            render: (_: any, __: User, index: number) => index + 1,
            width: 60,
        },
        {
            title: "Ảnh",
            dataIndex: "image",
            key: "image",
            width: 80,
            render: (image: string, record: User) =>
                image ? (
                    <img
                        src={image}
                        alt={record.customerName}
                        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "50%" }}
                    />
                ) : (
                    <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#bbb",
                        fontSize: 18
                    }}>
                        ?
                    </div>
                ),
        },
        {
            title: (
                <div>
                    Mã khách hàng
                    <Input
                        placeholder="Search code"
                        allowClear
                        value={searchCustomerCode}
                        onChange={e => setSearchCustomerCode(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 120, marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: "customerCode",
            key: "customerCode",
            width: 160,
        },
        {
            title: (
                <div>
                    Ngày tạo
                    <DatePicker
                        allowClear
                        value={searchCreatedAt}
                        onChange={setSearchCreatedAt}
                        size="small"
                        style={{ marginTop: 8, width: 140, marginLeft: 8 }}
                        format="DD/MM/YYYY"
                        placeholder="Search date"
                    />
                </div>
            ),
            dataIndex: "createdAt",
            key: "createdAt",
            width: 180,
            render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
        },
        {
            title: (
                <div>
                    Khách hàng
                    <Input
                        placeholder="Search name/phone"
                        allowClear
                        value={searchCustomerName}
                        onChange={e => setSearchCustomerName(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                    />
                </div>
            ),
            key: "customer",
            render: (_: any, record: User) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{record.customerName}</div>
                    <div style={{ color: "#888" }}>{record.phoneNumber}</div>
                </div>
            ),
        },
        {
            title: (
                <div>
                    Địa chỉ
                    <br />
                    <Input
                        placeholder="Search address"
                        allowClear
                        value={searchAddress}
                        onChange={e => setSearchAddress(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: User) => (
                <div style={{ display: "flex", gap: 8 }}>
                    <a
                        onClick={e => {
                            e.preventDefault();
                            if (router) router.push(`/admin/customers/${record.id}`);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        Detail
                    </a>
                    <a
                        onClick={e => {
                            e.preventDefault();
                            setUserIdToDelete(record.id);
                            setMessage(`Are you sure you want to delete user "${record.customerName}"?`);
                            setOpen(true);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        Disable
                    </a>
                </div>
            ),
        }
    ];
}

const onChange = () => { };

interface ListUserProps {
    data: User[];
}

export default function ListUser({ data }: ListUserProps) {
    const [searchCustomerName, setSearchCustomerName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchCustomerCode, setSearchCustomerCode] = useState("");
    const [searchCreatedAt, setSearchCreatedAt] = useState<Dayjs | null>(null);

    const filteredData = data.filter((user) => {
        const nameMatch = (user.customerName + user.phoneNumber).toLowerCase().includes(searchCustomerName.toLowerCase());
        const addressMatch = user.address.toLowerCase().includes(searchAddress.toLowerCase());
        const codeMatch = user.customerCode?.toLowerCase().includes(searchCustomerCode.toLowerCase());
        const createdAtMatch = searchCreatedAt
            ? dayjs(user.createdAt).isSame(searchCreatedAt, "day")
            : true;
        return nameMatch && addressMatch && codeMatch && createdAtMatch;
    });

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [userIdToDelete, setUserIdToDelete] = useState<string>();

    const handleOk = () => {
        try {
            //delete user logic here
            console.log(`User ${userIdToDelete} deleted successfully`);
        } catch (error) {
            console.error("Error deleting user:", error);
            setUserIdToDelete(undefined);
        } finally {
            setMessage("");
            setOpen(false);
            setUserIdToDelete(undefined);
        }
    };

    return (
        <div style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
            <NotificationModal open={open} setOpen={setOpen} message={message} onOk={handleOk} />
            <Table<User>
                rowKey="id"
                size="small"
                pagination={{
                    pageSize: 8,
                }}
                columns={getColumns(
                    searchCustomerName, setSearchCustomerName,
                    searchAddress, setSearchAddress,
                    searchCustomerCode, setSearchCustomerCode,
                    searchCreatedAt, setSearchCreatedAt,
                    setOpen, setMessage, setUserIdToDelete
                )}
                dataSource={filteredData}
                onChange={onChange}
                showSorterTooltip={{ target: 'sorter-icon' }}
            />
        </div>
    );
}
