import { Transaction } from "@/app/type/transaction";

interface TransactionProps {
    ts: Transaction;
}

export default function UserTransaction({ ts }: TransactionProps) {
    return (
        <div style={{ padding: 24, background: '#fff', borderRadius: 16, boxShadow: '0 0 40px rgba(0,0,0,0.07)' }}>
            <h2>Transaction History</h2>
            <p>No transactions found.</p>
        </div>
    );
}