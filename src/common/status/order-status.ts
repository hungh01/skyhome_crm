
export const getStatusText = (status: string) => {
    switch (status) {
        case 'pending': return 'Đã nhận';
        case 'confirm': return 'CTV nhận đơn';
        case 'doing': return 'Đang thực hiện';
        case 'done': return 'Hoàn thành';
        case 'cancel': return 'Đã hủy';
        default: return status;
    }
};


export const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending': return 'orange';
        case 'confirm': return 'blue';
        case 'doing': return 'purple';
        case 'done': return 'green';
        case 'cancel': return 'red';
        default: return 'default';
    }
};

