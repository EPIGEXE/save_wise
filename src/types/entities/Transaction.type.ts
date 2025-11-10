import type { IPaymentMethod } from './PaymentMethod.type';
import type { IIncomeCategory, IExpenseCategory } from './Category.type';
import type { IFixedCost } from './FixedCost.type';

// 거래 내역 타입
export interface ITransaction {
    id: number;
    date: string;
    amount: number;
    description: string;
    type: "income" | "expense";
    paymentMethodId?: number;
    paymentMethod?: IPaymentMethod;
    incomeCategoryId?: number;
    incomeCategory?: IIncomeCategory;
    expenseCategoryId?: number;
    expenseCategory?: IExpenseCategory;
    fixedCostId?: number;
    fixedCost?: IFixedCost;
}
