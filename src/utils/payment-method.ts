
export const getPaymentMethodText = (method: string) => {
    switch (method) {
        case 'cash': return 'Tiền mặt';
        case 'bank_transfer': return 'Chuyển khoản';
        case 'credit_card': return 'Thẻ tín dụng';
        default: return method;
    }
};
