export interface WalletTransaction {
    id: string;
    type: 'income' | 'expense';
    category: 'equipment' | 'maintenance' | 'purchase' | 'repair' | 'rental' | 'other';
    amount: number;
    description: string;
    equipmentName: string;
    equipmentId?: string;
    date: string;
    status: 'completed' | 'pending' | 'cancelled';
    createdBy: string;
    paymentMethod: 'cash' | 'bank_transfer' | 'credit_card' | 'other';
    reference?: string;
    attachments?: string[];
    notes?: string;
}

export interface WalletFilter {
    type?: 'income' | 'expense' | 'all';
    category?: string;
    status?: 'completed' | 'pending' | 'cancelled' | 'all';
    paymentMethod?: string;
    dateRange?: string[];
    amountRange?: [number, number];
}

export interface WalletSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    transactionCount: number;
}
