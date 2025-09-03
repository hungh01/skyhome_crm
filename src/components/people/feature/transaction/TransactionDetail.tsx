import { Transaction } from "@/type/transaction/transaction";
import { Modal, Descriptions, Tag, Typography, Space, Divider } from "antd";
import {
    CreditCardOutlined,
    BankOutlined,
    WalletOutlined,
    DollarOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface Props {
    trans: Transaction | null;
    open: boolean;
    onClose: () => void;
}

const getTransactionIcon = (paymentMethod: string) => {
    const method = paymentMethod.toLowerCase();
    if (["vnpay", "momo"].includes(method))
        return <WalletOutlined style={{ color: "#1890ff", fontSize: 16 }} />;
    if (["bank transfer", "banking"].includes(method))
        return <BankOutlined style={{ color: "#52c41a", fontSize: 16 }} />;
    if (method === "credit card")
        return <CreditCardOutlined style={{ color: "#722ed1", fontSize: 16 }} />;
    return <DollarOutlined style={{ color: "#faad14", fontSize: 16 }} />;
};

const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (["completed", "success", "thành công"].includes(s)) return "green";
    if (["pending", "đang xử lý"].includes(s)) return "orange";
    if (["failed", "thất bại"].includes(s)) return "red";
    return "blue";
};

const getTransactionType = (amount: number) =>
    amount < 0 ? "Hoàn tiền" : "Thanh toán";

export default function TransactionDetail({ trans, open, onClose }: Props) {
    if (!trans) return null;

    return (
        <Modal
            title={
                <Space>
                    {getTransactionIcon(trans.paymentIn)}
                    <span>Chi tiết giao dịch</span>
                </Space>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
        >
            <div style={{ padding: "16px 0" }}>
                {/* Transaction Header */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title
                        level={3}
                        style={{
                            margin: 0,
                            color: trans.money < 0 ? "#ff4d4f" : "#52c41a",
                        }}
                    >
                        {typeof trans.money === 'number' ? trans.money.toLocaleString() : '-'} VND
                    </Title>
                    <Text type="secondary">{getTransactionType(trans.money)}</Text>
                </div>
                <Divider />
                {/* Transaction Details */}
                <Descriptions
                    column={1}
                    styles={{
                        label: { fontWeight: 600, width: "30%" },
                        content: { color: "#666" },
                    }}
                >
                    <Descriptions.Item label="Mã giao dịch">
                        <Text copyable>{trans._id}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Mã hiển thị">
                        <Text copyable>{trans.idView}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tiêu đề">
                        <Text>{trans.title}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại giao dịch">
                        <Tag color="blue">{trans.kindTransaction}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Kiểu giao dịch">
                        <Tag color="purple">{trans.typeTransaction}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={getStatusColor(trans.status)} style={{ borderRadius: 12 }}>
                            {trans.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Số tiền giao dịch">
                        <Text strong>{typeof trans.money === 'number' ? trans.money.toLocaleString() : '-'} VND</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ghi chú chuyển khoản">
                        <Text>{trans.transferNote}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời gian xác nhận">
                        <Text>{trans.dateVerify ? new Date(trans.dateVerify).toLocaleString('vi-VN') : ''}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Thời gian tạo">
                        <Text>{new Date(trans.createdAt)?.toLocaleString('vi-VN')}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương thức thanh toán">
                        <Space>
                            {getTransactionIcon(trans.paymentIn)}
                            <Text>{trans.paymentIn}</Text>
                        </Space>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái thanh toán">
                        <Tag color={getStatusColor(trans.status)}>{trans.status}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ đơn hàng">
                        <Text>{trans.idOrder?.address}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="ID đơn hàng">
                        <Text copyable>{trans.idOrder?._id}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Loại đơn hàng">
                        <Text>{trans.idOrder?.type}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái đơn hàng">
                        <Text>{trans.idOrder?.status}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Người tạo giao dịch">
                        <Text>{trans.idStaffCreated}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Người xác nhận giao dịch">
                        <Text>{trans.idStaffVerify}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Người dùng">
                        <Text strong>{trans.idCustomer?.userId.fullName}</Text> <Text>({trans.idCustomer?.userId.phone})</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="ID người dùng">
                        <Text copyable>{trans.idCustomer?.code}</Text>
                    </Descriptions.Item>
                </Descriptions>
                {/* Additional Info */}
                <div
                    style={{
                        marginTop: 24,
                        padding: 16,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 8,
                    }}
                >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <strong>Lưu ý:</strong> Thông tin giao dịch được mã hóa và bảo mật theo
                        tiêu chuẩn ngân hàng. Vui lòng liên hệ bộ phận hỗ trợ nếu có bất kỳ
                        thắc mắc nào.
                    </Text>
                </div>
            </div>
        </Modal>
    );
}
