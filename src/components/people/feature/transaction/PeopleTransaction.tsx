'use client';

import { useState, useMemo, useCallback } from "react";
import { Timeline, Typography, Tag, Pagination } from "antd";
import { CreditCardOutlined, BankOutlined, WalletOutlined, DollarOutlined } from "@ant-design/icons";
import TransactionDetail from "./TransactionDetail";
import { Transaction } from "@/type/transaction/transaction";
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
        case "done":
        case "completed":
        case "success":
        case "thành công":
            return { name: "Thành công", color: "green" };
        case "pending":
        case "đang xử lý":
            return { name: "Đang xử lý", color: "orange" };
        case "processing":
            return { name: "Đang xử lý", color: "blue" };
        case "failed":
        case "thất bại":
            return { name: "Thất bại", color: "red" };
        case "cancel":
        case "cancelled":
            return { name: "Đã hủy", color: "gray" };
        case "refund":
        case "hoàn tiền":
            return { name: "Hoàn tiền", color: "purple" };
        default:
            return { name: status, color: "blue" };
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
                dot: getTransactionIcon(transaction.paymentIn),
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
                                    {transaction.title}
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Mã đơn hàng: {transaction.idView}
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Ngày tạo: {new Date(transaction.createdAt).toLocaleString("vi-VN")}
                                </Text>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <Text
                                    strong
                                    style={{
                                        fontSize: 14,
                                        color: transaction.money < 0
                                            ? "#ff4d4f"
                                            : "#52c41a",
                                    }}
                                >
                                    {typeof transaction.money === 'number' ? transaction.money.toLocaleString() : '-'} VND
                                </Text>
                                <br />
                                <Tag
                                    color={getStatusColor(transaction.status).color}
                                    style={{ fontSize: 11, marginTop: 4 }}
                                >
                                    {getStatusColor(transaction.status).name}
                                </Tag>
                                <br />
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                    <strong>Phương thức:</strong> {transaction.paymentIn}
                                </Text>
                            </div>
                        </div>
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