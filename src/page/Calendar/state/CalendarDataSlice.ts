import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalendarTransaction } from "../module/MyCalendar";
import { PaymentMethod } from "@/backend/db/entity/PaymentMethod";
import { IncomeCategory } from "@/backend/db/entity/IncomeCategory";
import { ExpenseCategory } from "@/backend/db/entity/ExpenseCategory";

interface CalendarDataState {
    showModal: boolean;
    editMode: boolean;
    selectedDate: string;
    currentTransaction: CalendarTransaction;
    paymentMethods: PaymentMethod[];
    incomeCategories: IncomeCategory[];
    expenseCategories: ExpenseCategory[];
}

const initialState: CalendarDataState = {
    showModal: false,
    editMode: false,
    selectedDate: '',
    currentTransaction: {
        id: '',
        amount: 0,
        description: '',
        type: 'expense',
        paymentMethodId: null,
    },
    paymentMethods: [],
    incomeCategories: [],
    expenseCategories: []
};

const CalendarDataSlice = createSlice({
    name: 'calendarData',
    initialState,
    reducers: {
        setShowModal: (state, action: PayloadAction<boolean>) => {
            state.showModal = action.payload;
        },
        setEditMode: (state, action: PayloadAction<boolean>) => {
            state.editMode = action.payload;
        },
        setSelectedDate: (state, action: PayloadAction<string>) => {
            state.selectedDate = action.payload;
        },
        setCurrentTransaction: (state, action: PayloadAction<CalendarTransaction | ((prev: CalendarTransaction) => CalendarTransaction)>) => {
            if (typeof action.payload === 'function') {
                state.currentTransaction = action.payload(state.currentTransaction);
            } else {
                state.currentTransaction = action.payload;
            }
        },
        resetTransaction: (state) => {
            state.currentTransaction = initialState.currentTransaction;
            state.editMode = false;
            state.showModal = false;
        },
        setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
            state.paymentMethods = action.payload;
        },
        setIncomeCategories: (state, action: PayloadAction<IncomeCategory[]>) => {
            state.incomeCategories = action.payload;
        },
        setExpenseCategories: (state, action: PayloadAction<ExpenseCategory[]>) => {
            state.expenseCategories = action.payload;
        }
    }
});

export const { 
    setShowModal, 
    setEditMode, 
    setSelectedDate, 
    setCurrentTransaction, 
    resetTransaction,
    setPaymentMethods,
    setIncomeCategories,
    setExpenseCategories
} = CalendarDataSlice.actions;

export default CalendarDataSlice.reducer;
