import type { IExpenseCategory } from './Category.type';

// 목표 타입
export interface IGoal {
    id: number;
    name: string;
    targetAmount: number;
    expenseCategoryId?: number;
    expenseCategory?: IExpenseCategory;
}
