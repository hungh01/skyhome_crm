'use client';

import { useState, useMemo, useCallback } from "react";
import { Timeline, Typography, Tag, Space, Pagination } from "antd";
import { CreditCardOutlined, BankOutlined, WalletOutlined, DollarOutlined } from "@ant-design/icons";
import TransactionDetail from "./TransactionDetail";
import { Transaction } from "@/type/transaction";
import type { Pagination as PaginationType } from "@/type/other/pagination";

const { Text, Title } = Typography;


const PAGE_SIZE = 5;

const getTransactionIcon = (paymentMethod: string) => {
    switch (paymentMethod.toLowerCase()) {
        case "vnpay":
        case "momo":
            return <WalletOutlined style={{ color: "#1890ff" }} />;
        case "bank transfer":
        case "banking":
            return <BankOutlined style={{ color: "#52c41a" }} />;
        case "credit card":
            return <CreditCardOutlined style={{ color: "#722ed1" }} />;
        default:
            return <DollarOutlined style={{ color: "#faad14" }} />;
    }
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "completed":
        case "success":
        case "thành công":
            return "green";
        case "pending":
        case "đang xử lý":
            return "orange";
        case "failed":
        case "thất bại":
        case "refund":
            return "red";
        default:
            return "blue";
    }
};


interface TransactionProps {
    trans: Transaction[];
    pagination: PaginationType;
    setPage: (page: number) => void;
}

export default function PeopleTransaction({ trans, pagination, setPage }: TransactionProps) {

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [modalOpen, setModalOpen] = useState(false);



    const handleTimelineItemClick = useCallback(
        (transaction: Transaction) => {
            setSelectedTransaction(transaction);
            setModalOpen(true);
        },
        []
    );

    const timelineItems = useMemo(
        () =>
            trans.map((transaction) => ({
                dot: getTransactionIcon(transaction.paymentMethod),
                children: (
                    <div
                        style={{ marginLeft: 8, cursor: "pointer" }}
                        onClick={() => handleTimelineItemClick(transaction)}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                marginBottom: 8,
                            }}
                        >
                            <div>
                                <Text strong style={{ fontSize: 14 }}>
                                    {transaction.orderStatus}
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    {new Date(transaction.createdAt).toLocaleString("vi-VN")}
                                </Text>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <Text
                                    strong
                                    style={{
                                        fontSize: 14,
                                        color: transaction.amount < 0
                                            ? "#ff4d4f"
                                            : "#52c41a",
                                    }}
                                >
                                    {transaction.amount}
                                </Text>
                                <br />
                                <Tag
                                    color={getStatusColor(transaction.paymentStatus)}
                                    style={{ fontSize: 11, marginTop: 4 }}
                                >
                                    {transaction.paymentStatus}
                                </Tag>
                            </div>
                        </div>
                        <Space size={16} style={{ marginTop: 8 }}>
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                <strong>Phương thức:</strong> {transaction.paymentMethod}
                            </Text>
                            {transaction.paymentMethod && (
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    <strong>Ngân hàng:</strong> {transaction.paymentMethod}
                                </Text>
                            )}
                            {transaction.paymentStatus && (
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    <strong>STK:</strong> **** {transaction.paymentStatus.slice(-4)}
                                </Text>
                            )}
                        </Space>
                    </div>
                ),
            })),
        [trans, handleTimelineItemClick]
    );

    return (
        <div
            style={{
                padding: 24,
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 0 40px rgba(0,0,0,0.07)",
            }}
        >
            <TransactionDetail
                trans={selectedTransaction}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
            <Title level={4} style={{ marginBottom: 24 }}>
                Lịch sử giao dịch
            </Title>
            {trans.length > 0 ? (
                <>
                    <Timeline mode="left" items={timelineItems} style={{ marginTop: 16 }} />
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                        <Pagination
                            current={pagination.page}
                            total={pagination.total}
                            pageSize={PAGE_SIZE}
                            onChange={setPage}
                            showSizeChanger={false}
                            showQuickJumper={false}
                        />
                    </div>
                </>
            ) : (
                <div style={{ textAlign: "center", padding: 40 }}>
                    <Text type="secondary">Không có giao dịch nào.</Text>
                </div>
            )}
        </div>
    );
}