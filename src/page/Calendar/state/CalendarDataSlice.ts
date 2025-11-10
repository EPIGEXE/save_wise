import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalendarTransaction } from "../CalendarType";
import { IExpenseCategory, IIncomeCategory, IPaymentMethod } from "@/types";

export interface CalendarDataState {
    showModal: boolean; // 다이얼로그 열림 여부
    editMode: boolean; // 수정 모드 여부
    selectedDate: string; // 선택된 날짜
    currentTransaction: CalendarTransaction; // 현재 거래
    paymentMethods: IPaymentMethod[]; // 결제 방법들
    incomeCategories: IIncomeCategory[]; // 수입 카테고리들
    expenseCategories: IExpenseCategory[]; // 지출 카테고리들
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
        setPaymentMethods: (state, action: PayloadAction<IPaymentMethod[]>) => {
            state.paymentMethods = action.payload;
        },
        setIncomeCategories: (state, action: PayloadAction<IIncomeCategory[]>) => {
            state.incomeCategories = action.payload;
        },
        setExpenseCategories: (state, action: PayloadAction<IExpenseCategory[]>) => {
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
