"use client";

import { useState } from "react";
import {
    Table,
    Card,
    Button,
    Tag,
    Space,
    Typography,
    Row,
    Col,
    Input,
    Select,
    DatePicker,
    Modal,
    Form,
    InputNumber,
    message,
    Statistic,
    Tooltip
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

const { Title, Text } = Typography;

interface OtherTransaction {
    id: number;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    createdBy: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
}

const mockOtherTransactions: OtherTransaction[] = [
    {
        id: 1,
        description: "Chi phí quảng cáo Facebook",
        amount: 2000000,
        type: 'expense',
        category: 'marketing',
        date: '2025-01-15',
        createdBy: 'Admin',
        status: 'approved',
        notes: 'Quảng cáo dịch vụ dọn nhà'
    },
    {
        id: 2,
        description: "Thu nhập từ hợp tác đối tác",
        amount: 5000000,
        type: 'income',
        category: 'partnership',
        date: '2025-01-14',
        createdBy: 'Manager',
        status: 'approved'
    },
    {
        id: 3,
        description: "Chi phí văn phòng phẩm",
        amount: 500000,
        type: 'expense',
        category: 'office',
        date: '2025-01-13',
        createdBy: 'Admin',
        status: 'pending'
    },
    {
        id: 4,
        description: "Phí dịch vụ ngân hàng",
        amount: 150000,
        type: 'expense',
        category: 'banking',
        date: '2025-01-12',
        createdBy: 'Admin',
        status: 'approved'
    },
    {
        id: 5,
        description: "Thu nhập từ bán tài sản cũ",
        amount: 3000000,
        type: 'income',
        category: 'asset',
        date: '2025-01-11',
        createdBy: 'Manager',
        status: 'approved'
    }
];

const categories = [
    { value: 'marketing', label: 'Tiếp thị' },
    { value: 'office', label: 'Văn phòng' },
    { value: 'partnership', label: 'Đối tác' },
    { value: 'banking', label: 'Ngân hàng' },
    { value: 'asset', label: 'Tài sản' },
    { value: 'other', label: 'Khác' }
];

export default function OtherWalletsPage() {
    const [transactions, setTransactions] = useState<OtherTransaction[]>(mockOtherTransactions);
    const [searchText, setSearchText] = useState("");
    const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [selectedStatus, setSelectedStatus] = useState<string | undefined>(undefined);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<OtherTransaction | null>(null);
    const [form] = Form.useForm();

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.description.toLowerCase().includes(searchText.toLowerCase()) ||
            transaction.createdBy.toLowerCase().includes(searchText.toLowerCase());
        const matchesType = !selectedType || transaction.type === selectedType;
        const matchesCategory = !selectedCategory || transaction.category === selectedCategory;
        const matchesStatus = !selectedStatus || transaction.status === selectedStatus;

        return matchesSearch && matchesType && matchesCategory && matchesStatus;
    });

    // Calculate statistics
    const totalIncome = transactions
        .filter(t => t.type === 'income' && t.status === 'approved')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense' && t.status === 'approved')
        .reduce((sum, t) => sum + t.amount, 0);

    const netAmount = totalIncome - totalExpense;

    const handleAddTransaction = () => {
        setEditingTransaction(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEditTransaction = (transaction: OtherTransaction) => {
        setEditingTransaction(transaction);
        form.setFieldsValue({
            ...transaction,
            date: dayjs(transaction.date)
        });
        setIsModalVisible(true);
    };

    const handleDeleteTransaction = (id: number) => {
        Modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa giao dịch này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okType: 'danger',
            onOk: () => {
                setTransactions(transactions.filter(t => t.id !== id));
                message.success('Xóa giao dịch thành công!');
            }
        });
    };

    const handleSubmitForm = async (values: {
        description: string;
        type: 'income' | 'expense';
        category: string;
        amount: number;
        date: Dayjs;
        status: 'pending' | 'approved' | 'rejected';
        notes?: string;
    }) => {
        try {
            const transactionData = {
                ...values,
                date: values.date.format('YYYY-MM-DD'),
                createdBy: 'Admin', // In real app, get from auth context
                id: editingTransaction ? editingTransaction.id : Date.now()
            };

            if (editingTransaction) {
                setTransactions(transactions.map(t =>
                    t.id === editingTransaction.id ? transactionData : t
                ));
                message.success('Cập nhật giao dịch thành công!');
            } else {
                setTransactions([transactionData, ...transactions]);
                message.success('Thêm giao dịch thành công!');
            }
            setIsModalVisible(false);
            form.resetFields();
        } catch {
            message.error('Có lỗi xảy ra!');
        }
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_: unknown, __: unknown, index: number) => index + 1
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            width: 250,
            render: (text: string, record: OtherTransaction) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{text}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>
                        {dayjs(record.date).format('DD/MM/YYYY')}
                    </div>
                </div>
            )
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type: string) => (
                <Tag color={type === 'income' ? 'green' : 'red'}>
                    {type === 'income' ? 'Thu' : 'Chi'}
                </Tag>
            )
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            render: (category: string) => {
                const cat = categories.find(c => c.value === category);
                return <Tag color="blue">{cat?.label || category}</Tag>;
            }
        },
        {
            title: 'Số tiền (VNĐ)',
            dataIndex: 'amount',
            key: 'amount',
            width: 150,
            render: (amount: number, record: OtherTransaction) => (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Text style={{
                        color: record.type === 'income' ? '#52c41a' : '#ff4d4f',
                        fontWeight: 600
                    }}>
                        {record.type === 'income' ? '+' : '-'}{amount.toLocaleString()}
                    </Text>
                </div>
            )
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 120
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const colors = {
                    pending: 'orange',
                    approved: 'green',
                    rejected: 'red'
                };
                const labels = {
                    pending: 'Chờ duyệt',
                    approved: 'Đã duyệt',
                    rejected: 'Từ chối'
                };
                return <Tag color={colors[status as keyof typeof colors]}>
                    {labels[status as keyof typeof labels]}
                </Tag>;
            }
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 120,
            render: (record: OtherTransaction) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEditTransaction(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteTransaction(record.id)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
            <Title level={3} style={{ marginBottom: 24 }}>
                Quản lý thu chi các khoản khác
            </Title>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24, textAlign: 'center' }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tổng thu"
                            value={totalIncome}
                            suffix="VND"
                            valueStyle={{ color: '#52c41a' }}
                            formatter={(value) => `${Number(value).toLocaleString()}`}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Tổng chi"
                            value={totalExpense}
                            suffix="VND"
                            valueStyle={{ color: '#ff4d4f' }}
                            formatter={(value) => `${Number(value).toLocaleString()}`}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Chênh lệch"
                            value={netAmount}
                            suffix="VND"
                            valueStyle={{ color: netAmount >= 0 ? '#52c41a' : '#ff4d4f' }}
                            formatter={(value) => `${Number(value).toLocaleString()}`}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Filters and Actions */}
            <Card style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={6}>
                        <Input
                            placeholder="Tìm kiếm mô tả..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                        />
                    </Col>
                    <Col xs={24} sm={4}>
                        <Select
                            placeholder="Loại giao dịch"
                            value={selectedType}
                            onChange={setSelectedType}
                            allowClear
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="income">Thu</Select.Option>
                            <Select.Option value="expense">Chi</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={4}>
                        <Select
                            placeholder="Danh mục"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            allowClear
                            style={{ width: '100%' }}
                        >
                            {categories.map(cat => (
                                <Select.Option key={cat.value} value={cat.value}>
                                    {cat.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={24} sm={4}>
                        <Select
                            placeholder="Trạng thái"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            allowClear
                            style={{ width: '100%' }}
                        >
                            <Select.Option value="pending">Chờ duyệt</Select.Option>
                            <Select.Option value="approved">Đã duyệt</Select.Option>
                            <Select.Option value="rejected">Từ chối</Select.Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={6}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddTransaction}
                            style={{ width: '100%' }}
                        >
                            Thêm giao dịch
                        </Button>
                    </Col>
                </Row>
            </Card>

            {/* Transactions Table */}
            <Card>
                <Table
                    columns={columns}
                    dataSource={filteredTransactions}
                    rowKey="id"
                    pagination={{
                        total: filteredTransactions.length,
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} của ${total} giao dịch`
                    }}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                title={editingTransaction ? 'Sửa giao dịch' : 'Thêm giao dịch mới'}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmitForm}
                    initialValues={{
                        type: 'expense',
                        status: 'pending',
                        date: dayjs()
                    }}
                >
                    <Form.Item
                        label="Mô tả"
                        name="description"
                        rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                        <Input placeholder="Nhập mô tả giao dịch" />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Loại giao dịch"
                                name="type"
                                rules={[{ required: true, message: 'Vui lòng chọn loại giao dịch!' }]}
                            >
                                <Select>
                                    <Select.Option value="income">Thu</Select.Option>
                                    <Select.Option value="expense">Chi</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Danh mục"
                                name="category"
                                rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                            >
                                <Select>
                                    {categories.map(cat => (
                                        <Select.Option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Số tiền"
                                name="amount"
                                rules={[{ required: true, message: 'Vui lòng nhập số tiền!' }]}
                            >
                                <InputNumber
                                    style={{ width: '100%' }}
                                    placeholder="Nhập số tiền"
                                    min={0}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="Ngày"
                                name="date"
                                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label="Trạng thái"
                        name="status"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                        <Select>
                            <Select.Option value="pending">Chờ duyệt</Select.Option>
                            <Select.Option value="approved">Đã duyệt</Select.Option>
                            <Select.Option value="rejected">Từ chối</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="Ghi chú" name="notes">
                        <Input.TextArea rows={3} placeholder="Nhập ghi chú (tùy chọn)" />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsModalVisible(false)}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingTransaction ? 'Cập nhật' : 'Thêm mới'}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}