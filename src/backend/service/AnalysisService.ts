import { DataSource } from "typeorm";
import { TransactionRepository } from "../repository/TransactionRepository.js";
import { Transaction } from "../db/entity/Transaction.js";

export interface TransactionChartData {
    category: string;
    amount: number;
    fill: string | null;
    paymentMethodName: string | null;
    type: 'income' | 'expense';
}

export default class AnalysisService {
    private transactionRepository: TransactionRepository;

    constructor(dataSource: DataSource) {
        this.transactionRepository = new TransactionRepository(dataSource);
    }

    async getTransactionsChartDataByMonth(year: number, month: number): Promise<TransactionChartData[]> {
        const transactions = await this.transactionRepository.findAllByMonth(year, month);
        const chartData = this.makeTransactionToChartData(transactions);

        return chartData;
    }

    async getTransactionsChartDataByPaymentDay(year: number, month: number): Promise<TransactionChartData[]> {
        const previousMonthTransactions = await this.transactionRepository.findAllByPreviousMonthAndCredit(year, month);
        const currentMonthTransactions = await this.transactionRepository.findAllByMonth(year, month);

        const currentMonthTargetData: Transaction[] = [...previousMonthTransactions];

        const filteredTransactions = currentMonthTransactions.filter(
            transaction => 
                transaction.type === 'income' || // 모든 수입
                (transaction.type === 'expense' && transaction.paymentMethod?.type === 'cash') // 현금 지출
        );

        currentMonthTargetData.push(...filteredTransactions);

        return this.makeTransactionToChartData(currentMonthTargetData);

    }

    private makeTransactionToChartData(transactions: Transaction[]): TransactionChartData[] {
        const chartData: TransactionChartData[] = [];

        const categoryAmounts = new Map<string, { amount: number; type: 'income' | 'expense'; paymentMethodName: string | null }>();

        transactions.forEach(transaction => {
            const category = transaction.type === 'income' 
                ? (transaction.incomeCategory?.name ?? '기타')
                : (transaction.expenseCategory?.name ?? '기타');

            const currentData = categoryAmounts.get(category) ?? { amount: 0, type: transaction.type, paymentMethodName: transaction.paymentMethod?.name };
            categoryAmounts.set(category, {
                amount: currentData.amount + transaction.amount,
                type: transaction.type,
                paymentMethodName: transaction.paymentMethod?.name ?? null
            });
        })

        let index = 0;
        categoryAmounts.forEach((data, category) => {
            const fill = `hsl(var(--chart-${index + 1}))`;
            chartData.push({ 
                category, 
                amount: data.amount,
                fill,
                type: data.type,
                paymentMethodName: data.paymentMethodName ?? null
            });
            index++;
        });

        return chartData;
    }

}