export interface AffiliateTransaction {
    id: string;
    type: 'commission' | 'bonus' | 'withdrawal' | 'refund';
    amount: number;
    description: string;
    affiliateId: string;
    affiliateName: string;
    affiliateLevel: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    orderId?: string;
    customerId?: string;
    customerName?: string;
    date: string;
    status: 'completed' | 'pending' | 'cancelled' | 'processing';
    paymentMethod: 'bank_transfer' | 'e_wallet' | 'cash' | 'crypto';
    reference?: string;
    commissionRate?: number;
    notes?: string;
    processedBy?: string;
    processedAt?: string;
}

export interface AffiliateFilter {
    type?: 'commission' | 'bonus' | 'withdrawal' | 'refund' | 'all';
    status?: 'completed' | 'pending' | 'cancelled' | 'processing' | 'all';
    affiliateLevel?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'all';
    paymentMethod?: string;
    dateRange?: string[];
    amountRange?: [number, number];
    affiliateId?: string;
}

export interface AffiliateSummary {
    totalCommission: number;
    totalBonus: number;
    totalWithdrawal: number;
    totalRefund: number;
    netAmount: number;
    transactionCount: number;
    pendingAmount: number;
    completedAmount: number;
}
