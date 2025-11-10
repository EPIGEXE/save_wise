import { IFixedCost } from "@/types";

export interface CalendarTransaction {
    id: string;
    amount: number;
    description: string;
    type: 'income' | 'expense';
    paymentMethodId: number | null;
    paymentMethod?: PaymentMethod | null;
    incomeCategoryId?: number | null | undefined;
    incomeCategory?: IncomeCategory | null;
    expenseCategoryId?: number | null | undefined;
    expenseCategory?: ExpenseCategory | null;
    fixedCostId?: number | null | undefined;
    fixedCost?: IFixedCost | null;
    fixedCostProspect?: boolean | null;
}

interface PaymentMethod {
    id: number;
    name: string;
    paymentDay?: number;
}

interface IncomeCategory {
    id: number;
    name: string;
}

interface ExpenseCategory {
    id: number;
    name: string;
}

export interface CalendarEvent {
    start: Date;
    end: Date;
    title: string;
    resource: CalendarTransaction;
}