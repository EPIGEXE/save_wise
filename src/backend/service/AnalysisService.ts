import { DataSource } from "typeorm";
import { Transaction } from "../db/entity/Transaction.js";
import TransactionService from "./TransactionService.js";
import { TransactionChartData } from "@/types/dto/ChartDataDto";

// TransactionChartData는 이제 공유 타입에서 import
export { TransactionChartData };

// 분석 서비스
export default class AnalysisService {
    private transactionService: TransactionService; // 거래 내역 서비스

    constructor(dataSource: DataSource) {
        this.transactionService = new TransactionService(dataSource);
    }

    // 월별 거래 차트 데이터 가져오기
    async getTransactionsChartDataByMonth(year: number, month: number): Promise<TransactionChartData[]> {
        const transactions = await this.transactionService.findAllByMonth(year, month);
        const chartData = this.makeTransactionToChartData(transactions);

        return chartData;
    }

    // 결제 날짜별 거래 차트 데이터 가져오기
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

    // 거래 내역을 차트 데이터로 변환
    private makeTransactionToChartData(transactions: Transaction[]): TransactionChartData[] {
        const chartData: TransactionChartData[] = [];
        
        // Map의 value 타입에 rawTransactions 배열 추가
        const categoryAmounts = new Map<string, {
            amount: number;
            fixedAmount: number;
            type: 'income' | 'expense';
            paymentMethodName?: string;
            rawTransactions: Transaction[];
            target?: number;
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
                target: transaction.type === 'expense' ? transaction.expenseCategory?.goals?.[0]?.targetAmount : undefined
            };

            if(transaction.fixedCostId) {
                currentData.fixedAmount += transaction.amount;
            }

            categoryAmounts.set(category, {
                amount: currentData.amount + transaction.amount,
                fixedAmount: currentData.fixedAmount,
                type: transaction.type,
                paymentMethodName: transaction.paymentMethod?.name,
                rawTransactions: [...currentData.rawTransactions, transaction],
                target: currentData.target
            });
        })
    
        categoryAmounts.forEach((data, category) => {
            chartData.push({
                category,
                amount: data.amount,
                fixedAmount: data.fixedAmount,
                type: data.type,
                fill: undefined,
                paymentMethodName: data.paymentMethodName ?? undefined,
                rawTransactions: data.rawTransactions,
                target: data.target ?? undefined
            });
        });

        return chartData;
    }

}