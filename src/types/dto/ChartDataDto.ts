import { ITransaction } from '../entities/Transaction.type';

// 차트 데이터 DTO
export interface TransactionChartData {
    category: string;
    amount: number;
    fixedAmount: number;
    target?: number;
    fill?: string;
    paymentMethodName?: string;
    type: 'income' | 'expense';
    rawTransactions: ITransaction[];
}