import { DataSource } from "typeorm";
import { Transaction } from "../db/entity/Transaction.js";
import TransactionService from "./TransactionService.js";

export interface TransactionChartData {
    category: string;
    amount: number;
    fixedAmount: number;
    target: number | null;
    fill: string | null;
    paymentMethodName: string | null;
    type: 'income' | 'expense';
    rawTransactions: Transaction[];
}

export default class AnalysisService {
    private transactionService: TransactionService;

    constructor(dataSource: DataSource) {
        this.transactionService = new TransactionService(dataSource);
    }

    async getTransactionsChartDataByMonth(year: number, month: number): Promise<TransactionChartData[]> {
        const transactions = await this.transactionService.findAllByMonth(year, month);
        const chartData = this.makeTransactionToChartData(transactions);

        return chartData;
    }

    async getTransactionsChartDataByPaymentDay(year: number, month: number): Promise<TransactionChartData[]> {
        const previousMonthTransactions = await this.transactionService.findAllByPreviousMonthAndCredit(year, month);
        const currentMonthTransactions = await this.transactionService.findAllByMonth(year, month);

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
        
        // Map의 value 타입에 rawTransactions 배열 추가
        const categoryAmounts = new Map<string, {
            amount: number;
            fixedAmount: number;
            type: 'income' | 'expense';
            paymentMethodName: string | null;
            rawTransactions: Transaction[];
            target: number | null;
        }>();
    
        transactions.forEach(transaction => {
            const category = transaction.type === 'income' 
                ? (transaction.incomeCategory?.name ?? '기타')
                : (transaction.expenseCategory?.name ?? '기타');
    
            const currentData = categoryAmounts.get(category) ?? {
                amount: 0,
                fixedAmount: 0,
                type: transaction.type,
                paymentMethodName: transaction.paymentMethod?.name,
                rawTransactions: [],
                target: transaction.type === 'expense' ? transaction.expenseCategory?.goals?.[0]?.targetAmount : null
            };

            if(transaction.fixedCostId) {
                currentData.fixedAmount += transaction.amount;
            }
    
            categoryAmounts.set(category, {
                amount: currentData.amount + transaction.amount,
                fixedAmount: currentData.fixedAmount,
                type: transaction.type,
                paymentMethodName: transaction.paymentMethod?.name ?? null,
                rawTransactions: [...currentData.rawTransactions, transaction],
                target: currentData.target ?? null
            });
        })
    
        categoryAmounts.forEach((data, category) => {
            chartData.push({ 
                category, 
                amount: data.amount,
                fixedAmount: data.fixedAmount,
                type: data.type,
                fill: null,
                paymentMethodName: data.paymentMethodName ?? null,
                rawTransactions: data.rawTransactions,
                target: data.target
            });
        });

        return chartData;
    }

}