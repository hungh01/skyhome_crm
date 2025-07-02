import { Transaction } from "@/app/type/transaction";
import { Modal, Descriptions, Tag, Typography, Space, Divider } from "antd";
import { CreditCardOutlined, BankOutlined, WalletOutlined, DollarOutlined, CalendarOutlined, UserOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

interface props {
    trans: Transaction | null;
    open: boolean;
    onClose: () => void;
}

export default function TransactionDetail({ trans, open, onClose }: props) {
    if (!trans) return null;

    const getTransactionIcon = (paymentMethod: string) => {
        switch (paymentMethod.toLowerCase()) {
            case 'vnpay':
            case 'momo':
                return <WalletOutlined style={{ color: '#1890ff', fontSize: 16 }} />;
            case 'bank transfer':
            case 'banking':
                return <BankOutlined style={{ color: '#52c41a', fontSize: 16 }} />;
            case 'credit card':
                return <CreditCardOutlined style={{ color: '#722ed1', fontSize: 16 }} />;
            default:
                return <DollarOutlined style={{ color: '#faad14', fontSize: 16 }} />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'success':
            case 'thành công':
                return 'green';
            case 'pending':
            case 'đang xử lý':
                return 'orange';
            case 'failed':
            case 'thất bại':
                return 'red';
            default:
                return 'blue';
        }
    };

    const getTransactionType = (price: string) => {
        return price.startsWith('-') ? 'Rút tiền' : 'Nạp tiền';
    };

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
            <div style={{ padding: '16px 0' }}>
                {/* Transaction Header */}
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3} style={{
                        margin: 0,
                        color: trans.price.startsWith('-') ? '#ff4d4f' : '#52c41a'
                    }}>
                        {trans.price}
                    </Title>
                    <Text type="secondary">{getTransactionType(trans.price)}</Text>
                </div>

                <Divider />

                {/* Transaction Details */}
                <Descriptions
                    column={1}
                    styles={{
                        label: { fontWeight: 600, width: '30%' },
                        content: { color: '#666' }
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
                        <Text copyable>{trans.id}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Mô tả">
                        <Text strong>{trans.message}</Text>
                    </Descriptions.Item>

                    <Descriptions.Item label="Trạng thái">
                        <Tag color={getStatusColor(trans.status)} style={{ borderRadius: 12 }}>
                            {trans.status}
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
                        {new Date(trans.createdAt).toLocaleString('vi-VN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        })}
                    </Descriptions.Item>

                    <Descriptions.Item label="Phương thức thanh toán">
                        <Space>
                            {getTransactionIcon(trans.paymentMethod)}
                            <Text>{trans.paymentMethod}</Text>
                        </Space>
                    </Descriptions.Item>

                    {trans.bankName && (
                        <Descriptions.Item label="Ngân hàng">
                            <Text>{trans.bankName}</Text>
                        </Descriptions.Item>
                    )}

                    {trans.bankAccountNumber && (
                        <Descriptions.Item label="Số tài khoản">
                            <Text>{trans.bankAccountNumber}</Text>
                        </Descriptions.Item>
                    )}

                    <Descriptions.Item label="ID người dùng">
                        <Text copyable>{trans.userId}</Text>
                    </Descriptions.Item>
                </Descriptions>

                {/* Additional Info */}
                <div style={{
                    marginTop: 24,
                    padding: 16,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 8
                }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        <strong>Lưu ý:</strong> Thông tin giao dịch được mã hóa và bảo mật theo tiêu chuẩn ngân hàng.
                        Vui lòng liên hệ bộ phận hỗ trợ nếu có bất kỳ thắc mắc nào.
                    </Text>
                </div>
            </div>
        </Modal>
    );
}