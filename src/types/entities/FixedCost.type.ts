import type { IIncomeCategory, IExpenseCategory } from './Category.type';

// 고정 비용 타입
export interface IFixedCost {
    id: number;
    name: string;
    prospectDay: number;
    amount: number;
    type: "expense" | "income";
    incomeCategoryId?: number;
    incomeCategory?: IIncomeCategory;
    expenseCategoryId?: number;
    expenseCategory?: IExpenseCategory;
}
