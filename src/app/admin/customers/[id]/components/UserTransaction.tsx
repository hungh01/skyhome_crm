import { Transaction } from "@/app/type/transaction";
import { Timeline, Typography, Tag, Space, Pagination } from "antd";
import { CreditCardOutlined, BankOutlined, WalletOutlined, DollarOutlined } from "@ant-design/icons";
import { mockTransactions } from "@/app/api/mock-transaction";
import { useState } from "react";
import DetailTransaction from "./DetailTransaction";

const { Text, Title } = Typography;

interface TransactionProps {
    userId: string;
}

export default function UserTransaction({ userId }: TransactionProps) {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 5;

    const userTransactions = mockTransactions
        //.filter(transaction => transaction.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Calculate pagination
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = userTransactions.slice(startIndex, endIndex);

    const getTransactionIcon = (paymentMethod: string) => {
        switch (paymentMethod.toLowerCase()) {
            case 'vnpay':
            case 'momo':
                return <WalletOutlined style={{ color: '#1890ff' }} />;
            case 'bank transfer':
            case 'banking':
                return <BankOutlined style={{ color: '#52c41a' }} />;
            case 'credit card':
                return <CreditCardOutlined style={{ color: '#722ed1' }} />;
            default:
                return <DollarOutlined style={{ color: '#faad14' }} />;
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
            case 'refund':
                return 'red'
            default:
                return 'blue';
        }
    };

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [modalOpen, setModalOpen] = useState(false);



    const timelineItems = paginatedTransactions.map(transaction => ({
        dot: getTransactionIcon(transaction.paymentMethod),
        children: (
            <div style={{ marginLeft: 8, cursor: 'pointer' }} onClick={() => { setModalOpen(true); setSelectedTransaction(transaction); }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                        <Text strong style={{ fontSize: 14 }}>{transaction.message}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {new Date(transaction.createdAt).toLocaleString('vi-VN')}
                        </Text>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Text strong style={{ fontSize: 14, color: transaction.price.startsWith('-') ? '#ff4d4f' : '#52c41a' }}>
                            {transaction.price}
                        </Text>
                        <br />
                        <Tag color={getStatusColor(transaction.status)} style={{ fontSize: 11, marginTop: 4 }}>
                            {transaction.status}
                        </Tag>
                    </div>
                </div>

                <Space size={16} style={{ marginTop: 8 }}>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                        <strong>Phương thức:</strong> {transaction.paymentMethod}
                    </Text>
                    {transaction.bankName && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            <strong>Ngân hàng:</strong> {transaction.bankName}
                        </Text>
                    )}
                    {transaction.bankAccountNumber && (
                        <Text type="secondary" style={{ fontSize: 11 }}>
                            <strong>STK:</strong> ****{transaction.bankAccountNumber.slice(-4)}
                        </Text>
                    )}
                </Space>
            </div>
        ),
    }));

    return (
        <div style={{ padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 0 40px rgba(0,0,0,0.07)' }}>
            <DetailTransaction
                trans={selectedTransaction}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
            <Title level={4} style={{ marginBottom: 24 }}>Lịch sử giao dịch</Title>
            {userTransactions.length > 0 ? (
                <>
                    <Timeline
                        mode="left"
                        items={timelineItems}
                        style={{ marginTop: 16 }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                        <Pagination
                            current={currentPage}
                            total={userTransactions.length}
                            pageSize={pageSize}
                            onChange={setCurrentPage}
                            showSizeChanger={false}
                            showQuickJumper={false}
                        />
                    </div>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: 40 }}>
                    <Text type="secondary">Không có giao dịch nào.</Text>
                </div>
            )}
        </div>
    );
}