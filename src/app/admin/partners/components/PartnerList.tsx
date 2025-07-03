'use client';

import { Table, Input, DatePicker, Avatar, Rate, Select } from "antd";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import NotificationModal from "@/app/components/Modal";
import { Partner } from "@/app/type/partner";
import { Service } from "@/app/type/services";
import { UserOutlined } from "@ant-design/icons";
import { mockServices } from "@/app/api/mock-services";



function getColumns(
    searchName: string, setSearchName: (v: string) => void,
    searchAddress: string, setSearchAddress: (v: string) => void,
    searchCode: string, setSearchCode: (v: string) => void,
    searchActiveDate: Dayjs | null, setSearchActiveDate: (v: Dayjs | null) => void,
    searchServices: string[], setSearchServices: (v: string[]) => void,
    setOpen: (open: boolean) => void,
    setMessage: (message: string) => void,
    setPartnerIdToDelete: (userId: string) => void,
    pathname: string
) {
    const router = typeof window !== "undefined" ? require("next/navigation").useRouter() : null;

    return [
        {
            title: "STT",
            dataIndex: "stt",
            key: "stt",
            render: (_: any, __: Partner, index: number) => index + 1,
            width: 60,
        },
        {
            title: (
                <div>
                    Mã CTV
                    <Input
                        placeholder="Search code"
                        allowClear
                        value={searchCode}
                        onChange={e => setSearchCode(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 120, marginLeft: 8 }}
                    />
                </div>
            ),
            dataIndex: "code",
            key: "code",
            width: 160,
        },
        {
            title: (
                <div>
                    Ngày kích hoạt
                    <DatePicker
                        allowClear
                        value={searchActiveDate}
                        onChange={setSearchActiveDate}
                        size="small"
                        style={{ marginTop: 8, width: 140, marginLeft: 8 }}
                        format="DD/MM/YYYY"
                        placeholder="Search date"
                    />
                </div>
            ),
            dataIndex: "activeDate",
            key: "activeDate",
            width: 180,
            render: (activeDate: string) => new Date(activeDate).toLocaleDateString(),
        },
        {
            title: (
                <div>
                    Cộng tác viên
                    <Input
                        placeholder="Search name/phone"
                        allowClear
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                        size="small"
                        style={{ marginTop: 8, width: 180, marginLeft: 8 }}
                    />
                </div>
            ),
            key: "partner",
            width: 280,
            render: (_: any, record: Partner) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={50}
                        src={record.image}
                        icon={<UserOutlined />}
                        style={{
                            flexShrink: 0,
                            border: '2px solid #f0f0f0'
                        }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontWeight: 500,
                            fontSize: '14px',
                            marginBottom: 4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {record.name}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {record.phoneNumber}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Rate
                                disabled
                                value={record.rate}
                                style={{ fontSize: '12px' }}
                            />
                            <span style={{
                                fontSize: '12px',
                                color: '#666',
                                fontWeight: 500
                            }}>
                                {record.rate}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div>
                    Khu vực
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
            title: (
                <div>
                    Dịch vụ đăng ký
                    <Select
                        mode="multiple"
                        placeholder="Filter services"
                        allowClear
                        value={searchServices}
                        onChange={setSearchServices}
                        size="small"
                        style={{ marginTop: 8, width: 160, marginLeft: 8 }}
                        options={mockServices.map(service => ({
                            label: service.name,
                            value: service.name
                        }))}
                        maxTagCount="responsive"
                        showSearch={false}
                    />
                </div>
            ),
            dataIndex: "services",
            key: "services",
            render: (services: Service[]) => (
                <div>
                    {services?.map((s) => s.name).join(", ")}
                </div>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_: any, record: Partner) => (
                <div style={{ display: "flex", gap: 8 }}>
                    <a
                        onClick={e => {
                            e.preventDefault();
                            if (router) router.push(`/admin/${pathname}/${record.id}`);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        Chi tiết
                    </a>
                    <a
                        onClick={e => {
                            e.preventDefault();
                            setPartnerIdToDelete(record.id);
                            setMessage(`Are you sure you want to delete user "${record.name}"?`);
                            setOpen(true);
                        }}
                        style={{ cursor: "pointer" }}
                    >
                        Vô hiệu hoá
                    </a>
                </div>
            ),
        }
    ];
}

const onChange = () => { };

interface PartnerListProps {
    data: Partner[];
    pathname: string;
    handleDelete: (id: string) => void;
}

export default function PartnerList({ data, pathname, handleDelete }: PartnerListProps) {

    const services = mockServices

    const [searchName, setSearchName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchCode, setSearchCode] = useState("");
    const [searchActiveDate, setSearchActiveDate] = useState<Dayjs | null>(null);
    const [searchServices, setSearchServices] = useState<string[]>([]);

    const safeData = data || [];

    const filteredData = safeData.filter((partner) => {
        const nameMatch = (partner.name + partner.phoneNumber).toLowerCase().includes(searchName.toLowerCase());
        const addressMatch = partner.address.toLowerCase().includes(searchAddress.toLowerCase());
        const codeMatch = partner.code?.toLowerCase().includes(searchCode.toLowerCase());
        const activeDateMatch = searchActiveDate
            ? dayjs(partner.activeDate).isSame(searchActiveDate, "day")
            : true;
        const servicesMatch = searchServices.length > 0
            ? searchServices.some(serviceName =>
                partner.services?.some(partnerService =>
                    partnerService.name.toLowerCase() === serviceName.toLowerCase()
                )
            )
            : true;
        return nameMatch && addressMatch && codeMatch && activeDateMatch && servicesMatch;
    });

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [partnerIdToDelete, setPartnerIdToDelete] = useState<string>();

    const handleOk = () => {
        try {
            if (!partnerIdToDelete) {
                console.error("No user ID provided for deletion");
                return;
            }
            handleDelete(partnerIdToDelete);
        } catch (error) {
            console.error("Error deleting user:", error);
            setPartnerIdToDelete(undefined);
        } finally {
            setMessage("");
            setOpen(false);
            setPartnerIdToDelete(undefined);
        }
    };

    return (
        <div style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
            <NotificationModal open={open} setOpen={setOpen} message={message} onOk={handleOk} />
            <Table<Partner>
                rowKey="id"
                size="small"
                pagination={{
                    pageSize: 8,
                }}
                columns={getColumns(
                    searchName, setSearchName,
                    searchAddress, setSearchAddress,
                    searchCode, setSearchCode,
                    searchActiveDate, setSearchActiveDate,
                    searchServices, setSearchServices,
                    setOpen, setMessage, setPartnerIdToDelete,
                    pathname
                )}
                dataSource={filteredData}
                onChange={onChange}
                showSorterTooltip={{ target: 'sorter-icon' }}
            />
        </div>
    );
}
