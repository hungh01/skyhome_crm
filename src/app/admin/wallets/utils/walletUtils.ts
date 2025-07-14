import { WalletTransaction } from '@/type/wallet';

export const exportToExcel = (transactions: WalletTransaction[], filename: string = 'wallet-transactions') => {
    // Create CSV content
    const headers = [
        'Mã giao dịch',
        'Loại',
        'Danh mục',
        'Thiết bị',
        'Mã thiết bị',
        'Mô tả',
        'Số tiền (VNĐ)',
        'Trạng thái',
        'Phương thức thanh toán',
        'Ngày giao dịch',
        'Người tạo',
        'Mã tham chiếu',
        'Ghi chú'
    ];

    const categoryLabels = {
        equipment: 'Thiết bị',
        maintenance: 'Bảo trì',
        purchase: 'Mua sắm',
        repair: 'Sửa chữa',
        rental: 'Cho thuê',
        other: 'Khác'
    };

    const paymentMethodLabels = {
        cash: 'Tiền mặt',
        bank_transfer: 'Chuyển khoản',
        credit_card: 'Thẻ tín dụng',
        other: 'Khác'
    };

    const statusLabels = {
        completed: 'Hoàn thành',
        pending: 'Chờ xử lý',
        cancelled: 'Đã hủy'
    };

    const csvData = transactions.map(transaction => [
        transaction.id,
        transaction.type === 'income' ? 'Thu' : 'Chi',
        categoryLabels[transaction.category as keyof typeof categoryLabels] || transaction.category,
        transaction.equipmentName,
        transaction.equipmentId || '',
        transaction.description,
        transaction.amount,
        statusLabels[transaction.status as keyof typeof statusLabels] || transaction.status,
        paymentMethodLabels[transaction.paymentMethod as keyof typeof paymentMethodLabels] || transaction.paymentMethod,
        new Date(transaction.date).toLocaleDateString('vi-VN'),
        transaction.createdBy,
        transaction.reference || '',
        transaction.notes || ''
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

    // Add BOM for UTF-8 encoding
    const BOM = '\uFEFF';
    const csvWithBOM = BOM + csvContent;

    // Create and download file
    const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

export const generateTransactionId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TXN-${timestamp}-${random}`;
};
