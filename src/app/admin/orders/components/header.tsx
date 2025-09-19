import { isDetailResponse } from "@/utils/response-handler";
import { Button, Card, DatePicker, Input, Select } from "antd";
import dayjs from "dayjs";

import { Typography } from "antd";
import { useRouter } from "next/navigation";
import { useOrderContext } from "../provider/order-provider";
import { useOrderList } from "../hooks/use-order-list";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Header() {
    const router = useRouter();
    const { orderSearch, setOrderSearch, createdAtStart, setCreatedAtStart,
        createdAtEnd, setCreatedAtEnd,
        statusSearch, setStatusSearch, data }
        = useOrderContext();

    const { loading } = useOrderList();
    return (
        <Card style={{
            marginBottom: 16,
            borderRadius: 12,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
        }}>
            <div style={{ marginBottom: 16 }}>
                <Title level={2} style={{ margin: 0 }}>
                    Quản lý đơn hàng
                </Title>
                <Typography.Text type="secondary">
                    Quản lý và theo dõi tất cả các đơn hàng trong hệ thống
                </Typography.Text>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '8px',
                alignItems: 'end',
                marginBottom: '12px',
            }}>
                <div >
                    <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                        Mã đơn hàng
                    </Text>
                    <Input
                        placeholder="Mã đơn..."
                        allowClear
                        value={orderSearch}
                        onChange={e => setOrderSearch(e.target.value)}
                        size="small"
                        style={{ width: '100%' }}
                    />
                </div>

                <div >
                    <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                        Ngày tạo
                    </Text>
                    <RangePicker
                        placeholder={['Từ', 'Đến']}
                        allowClear
                        value={[
                            createdAtStart ? dayjs(createdAtStart) : null,
                            createdAtEnd ? dayjs(createdAtEnd) : null
                        ]}
                        onChange={(dates) => {
                            if (dates && dates[0] && dates[1]) {
                                setCreatedAtStart(dates[0].format('YYYY-MM-DD'));
                                setCreatedAtEnd(dates[1].format('YYYY-MM-DD'));
                            } else {
                                setCreatedAtStart("");
                                setCreatedAtEnd("");
                            }
                        }}
                        size="small"
                        style={{ width: '100%' }}
                        format="DD/MM/YYYY"
                    />
                </div>


                <div >
                    <Text style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '4px' }}>
                        Trạng thái
                    </Text>
                    <Select
                        placeholder="Chọn TT"
                        allowClear
                        value={statusSearch || undefined}
                        onChange={(value) => setStatusSearch(value || "")}
                        size="small"
                        style={{ width: '100%' }}
                    >
                        <Select.Option value="done">Hoàn thành</Select.Option>
                        <Select.Option value="doing">Đang làm</Select.Option>
                        <Select.Option value="confirm">Chờ làm</Select.Option>
                        <Select.Option value="pending">Đã nhận</Select.Option>
                        <Select.Option value="cancel">Đã hủy</Select.Option>
                    </Select>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                    Tìm thấy {isDetailResponse(data) ? data.pagination?.total : 0} đơn hàng
                </Typography.Text>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        size="small"
                        loading={loading}
                        onClick={() => {
                            setOrderSearch("");
                            setCreatedAtStart("");
                            setCreatedAtEnd("");
                            setStatusSearch("");
                        }}
                    >
                        Xóa bộ lọc
                    </Button>
                    <Button type="primary" size="small"
                        loading={loading}
                        onClick={() => router.push('/admin/orders/create-customer-order')}
                    >
                        Tạo đơn hàng cá nhân
                    </Button>
                    <Button type="primary" size="small"
                        loading={loading}
                        onClick={() => router.push('/admin/orders/create-business-order')}
                    >
                        Tạo đơn hàng doanh nghiệp
                    </Button>
                </div>
            </div>
        </Card>

    );
}