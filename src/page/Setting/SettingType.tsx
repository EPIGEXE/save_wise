import { IExpenseCategory, IIncomeCategory } from "@/types";

export interface Categories {
    income: IIncomeCategory[];
    expense: IExpenseCategory[];
}

export interface NewCategoryName {
    income: string;
    expense: string;
}

export interface EditingCategoryId {
    income: number | null;
    expense: number | null;
}