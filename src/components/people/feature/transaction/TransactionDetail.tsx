import { Transaction } from "@/type/transaction";
import { Modal, Descriptions, Tag, Typography, Space, Divider } from "antd";
import {
    CreditCardOutlined,
    BankOutlined,
    WalletOutlined,
    DollarOutlined,
    CalendarOutlined,
    UserOutlined,
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
                    {getTransactionIcon(trans.paymentMethod)}
                    <span>Chi tiết giao dịch</span>
                </Space>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
        >
            <div style={{ padding: "16px 0" }}>
                {/* Transaction Header */}
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title
                        level={3}
                        style={{
                            margin: 0,
                            color: trans.amount < 0 ? "#ff4d4f" : "#52c41a",
                        }}
                    >
                        {trans.amount}
                    </Title>
                    <Text type="secondary">{getTransactionType(trans.amount)}</Text>
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
                    <Descriptions.Item
                        label={
                            <Space>
                                <UserOutlined />
                                Mã giao dịch
                            </Space>
                        }
                    >
                        <Text copyable>{trans._id}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Mô tả">
                        <Text strong>{trans.paymentStatus}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        <Tag color={getStatusColor(trans.paymentStatus)} style={{ borderRadius: 12 }}>
                            {trans.paymentStatus}
                        </Tag>
                    </Descriptions.Item>

                    <Descriptions.Item
                        label={
                            <Space>
                                <CalendarOutlined />
                                Thời gian
                            </Space>
                        }
                    >
                        {new Date(trans.createdAt).toLocaleString("vi-VN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </Descriptions.Item>

                    <Descriptions.Item label="Phương thức thanh toán">
                        <Space>
                            {getTransactionIcon(trans.paymentMethod)}
                            <Text>{trans.paymentMethod}</Text>
                        </Space>
                    </Descriptions.Item>

                    {trans.paymentMethod && (
                        <Descriptions.Item label="Ngân hàng">
                            <Text>{trans.paymentMethod}</Text>
                        </Descriptions.Item>
                    )}

                    {trans.paymentMethod && (
                        <Descriptions.Item label="Số tài khoản">
                            <Text>{trans.paymentMethod}</Text>
                        </Descriptions.Item>
                    )}

                    <Descriptions.Item label="ID người dùng">
                        <Text copyable>{trans.userId}</Text>
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
