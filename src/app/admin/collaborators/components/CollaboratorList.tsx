'use client';

import { Table, Input, DatePicker, Avatar, Rate, Select, Dropdown, Button, Card } from "antd";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import NotificationModal from "@/components/Modal";
import { ServiceSummary } from "@/type/services";
import { UserOutlined, EllipsisOutlined, EyeOutlined, StopOutlined } from "@ant-design/icons";
import { mockServices } from "@/api/mock-services";
import { useRouter } from "next/navigation";
import { collaboratorListApi } from "@/api/user/collaborator-api";

import { PAGE_SIZE } from "@/common/page-size";
import { Collaborator } from "@/type/user/collaborator/collaborator";
import { CollaboratorListResponse } from "@/type/user/collaborator/collaborator-list-response";



function getColumns(
    searchName: string, setSearchName: (v: string) => void,
    searchAddress: string, setSearchAddress: (v: string) => void,
    searchCode: string, setSearchCode: (v: string) => void,
    searchActiveDate: Dayjs | null, setSearchActiveDate: (v: Dayjs | null) => void,
    searchServices: string[], setSearchServices: (v: string[]) => void,
    setOpen: (open: boolean) => void,
    setMessage: (message: string) => void,
    setPartnerIdToDelete: (userId: string) => void,
    router: ReturnType<typeof useRouter>
) {

    return [
        {
            title: (<div style={{ textAlign: 'center' }}>STT</div>),
            dataIndex: "stt",
            key: "stt",
            render: (_: unknown, __: Collaborator, index: number) => index + 1,
            width: 60,
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Mã CTV
                    <br />
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
                <div style={{ textAlign: 'center' }}>
                    Ngày kích hoạt
                    <br />
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
            dataIndex: "joinedAt",
            key: "joinedAt",
            width: 180,
            render: (joinedAt: string) => new Date(joinedAt).toLocaleDateString(),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Cộng tác viên
                    <br />
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
            render: (_: unknown, record: Collaborator) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Avatar
                        size={50}
                        src={record.userId.image}
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
                            {record.userId.fullName}
                        </div>
                        <div style={{
                            color: "#888",
                            fontSize: '12px',
                            marginBottom: 4
                        }}>
                            {record.userId.phone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Rate
                                disabled
                                value={record.commissionRate}
                                style={{ fontSize: '12px' }}
                            />
                            <span style={{
                                fontSize: '12px',
                                color: '#666',
                                fontWeight: 500
                            }}>
                                {record.commissionRate}
                            </span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
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
            dataIndex: "areas",
            key: "areas",
            render: (areas: { _id: string; ward: string; city: string; code: string }[]) => (
                <div>
                    {areas?.map((a) => `(${a.code})`).join(", ")}
                </div>
            ),
        },
        {
            title: (
                <div style={{ textAlign: 'center' }}>
                    Dịch vụ đăng ký
                    <br />
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
            render: (services: ServiceSummary[]) => (
                <div>
                    {services?.map((s) => s.name).join(", ")}
                </div>
            ),
        },
        {
            title: "",
            key: "action",
            width: 80,
            render: (_: unknown, record: Collaborator) => {
                const items = [
                    {
                        key: 'detail',
                        label: 'Chi tiết',
                        icon: <EyeOutlined />,
                        onClick: () => {
                            router.push(`/admin/collaborators/${record._id}`);
                        }
                    },
                    {
                        key: 'disable',
                        label: 'Vô hiệu hóa',
                        icon: <StopOutlined />,
                        onClick: () => {
                            setPartnerIdToDelete(record._id);
                            setMessage(`Bạn có chắc chắn muốn vô hiệu hóa cộng tác viên "${record.userId.fullName}"?`);
                            setOpen(true);
                        }
                    }
                ];

                return (
                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={<EllipsisOutlined />}
                            style={{
                                border: 'none',
                                boxShadow: 'none'
                            }}
                        />
                    </Dropdown>
                );
            },
        }
    ];
}

const onChange = () => { };

export default function CollaboratorList() {
    const router = useRouter();

    const [page, setPage] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [searchAddress, setSearchAddress] = useState("");
    const [searchCode, setSearchCode] = useState("");
    const [searchActiveDate, setSearchActiveDate] = useState<Dayjs | null>(null);
    const [searchServices, setSearchServices] = useState<string[]>([]);

    const [data, setData] = useState<CollaboratorListResponse>();

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [partnerIdToDelete, setPartnerIdToDelete] = useState<string>();

    useEffect(() => {
        const fetchCollaborators = async () => {
            const response = await collaboratorListApi(page, PAGE_SIZE, searchCode, searchActiveDate ? dayjs(searchActiveDate).format('YYYY-MM-DD') : '', searchName, '', searchAddress);
            if (response) {
                console.log("Fetched collaborators:", response);
                setData(response);
            } else {
                console.error("Failed to fetch collaborators:", response);
            }
        };

        fetchCollaborators();
    }, [page, searchName, searchAddress, searchCode, searchActiveDate, searchServices]);

    const handleDelete = (id: string) => {
        // call-api logic to disable partner by id
        console.log(`Partner with ID ${id} deleted successfully`);
    };

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
        <Card style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8 }}>
            <NotificationModal open={open} setOpen={setOpen} message={message} onOk={handleOk} />
            <Table<Collaborator>
                rowKey="code"
                size="small"
                pagination={{
                    current: page,
                    onChange: (page) => setPage(page),
                    pageSize: PAGE_SIZE,
                    total: data?.pagination.total,
                    position: ['bottomCenter'],
                }}
                columns={getColumns(
                    searchName, setSearchName,
                    searchAddress, setSearchAddress,
                    searchCode, setSearchCode,
                    searchActiveDate, setSearchActiveDate,
                    searchServices, setSearchServices,
                    setOpen, setMessage, setPartnerIdToDelete,
                    router
                )}
                dataSource={data?.data}
                onChange={onChange}
                showSorterTooltip={{ target: 'sorter-icon' }}
                rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'}
            />
            <style jsx>{`
                :global(.table-row-light) {
                    background-color: #ffffff !important;
                }
                :global(.table-row-dark) {
                    background-color: #fafafa !important;
                }
                :global(.table-row-light:hover),
                :global(.table-row-dark:hover) {
                    background-color: #e6f7ff !important;
                }
            `}</style>
        </Card>
    );
}
