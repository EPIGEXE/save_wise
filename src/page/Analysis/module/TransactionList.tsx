import { Transaction } from '@/backend/db/entity/Transaction';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMemo } from 'react';

interface TransactionListProps {
    transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
    // 정렬된 트랜잭션 목록을 메모이제이션
    const sortedTransactions = useMemo(() => 
        [...transactions].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
        ), 
        [transactions]
    );

    return (
        <div className="space-y-2">
            {sortedTransactions.map((transaction) => (
                <div 
                    key={transaction.id} 
                    className="flex justify-between items-center p-2 text-sm text-muted-foreground"
                >
                    <div className="flex items-center gap-2">
                        <span>
                            {format(new Date(transaction.date), 'M월 d일', { locale: ko })}
                        </span>
                        <div className="text-black">
                            {transaction.description}
                        </div>
                    </div>
                    <span>{transaction.amount.toLocaleString()}원</span>
                </div>
            ))}
        </div>
    );
};