'use client';
import { Service } from "@/type/services";
import { Button, Card, Switch, Table, Typography } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useRouter } from "next/navigation";



const { Text } = Typography;
function orderColumns(
    router: ReturnType<typeof useRouter>
): ColumnsType<Service> {
    return [

        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Dịch vụ</div>,
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Text>{text}</Text>,
            align: 'center',
            width: 120,
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Trạng thái</div>,
            key: "action",
            width: 80,
            render: (record) => (
                <Switch
                    style={{ margin: '0 auto', display: 'block' }}
                    checked={record.status}
                    onChange={(checked) => {
                        // Handle switch change logic here
                        console.log(`Switch for ${record.name} is now ${checked ? 'ON' : 'OFF'}`);
                    }}
                />
            ),
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}></div>,
            key: "action",
            width: 80,
            render: (record) => (
                <Button
                    type="primary"
                    style={{
                        margin: '0 auto',
                        display: 'block',
                        borderRadius: '20px',
                        background: 'linear-gradient(135deg, #6253e1, #04befe)'
                    }}
                    onClick={() => {
                        // Navigate to the service detail page
                        router.push(`/admin/services/${record.id}`);
                    }}

                >
                    Điều chỉnh <RightOutlined />
                </Button>
            ),
        }
    ];
}

interface ServiceListProps {
    services: Service[];
}

export default function ServiceList({ services }: ServiceListProps) {
    const router = useRouter();
    return (
        <>

            {/* Table */}
            <Card style={{ borderRadius: 12, overflow: 'hidden' }}
            >
                <Table
                    dataSource={services}
                    columns={orderColumns(
                        router
                    )}
                    rowKey="id"
                    size="large"
                    className="small-font-table"
                    pagination={false}
                />
                <style jsx>{`
                    :global(.small-font-table .ant-table-tbody > tr > td),
                    :global(.small-font-table .ant-table-thead > tr > th) {
                        font-size: 16px !important;
                    }
                    :global(.small-font-table .ant-typography) {
                        font-size: 16px !important;
                    }
                    :global(.small-font-table .ant-tag) {
                        font-size: 14px !important;
                    }
                    :global(.small-font-table .ant-table-thead > tr > th > div) {
                        font-size: 16px !important;
                        font-weight: 600 !important;
                    }
                    :global(.small-font-table .ant-table-tbody > tr:nth-child(even)) {
                        background-color: #fafafa;
                    }
                `}</style>
            </Card>
        </>
    );
}