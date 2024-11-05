import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TransactionChartData } from '@/backend/service/AnalysisService';
import { ExpenseCategory } from '@/backend/db/entity/ExpenseCategory';
import { IncomeCategory } from '@/backend/db/entity/IncomeCategory';

const { ipcRenderer } = window;

interface AnalysisDataState {
  incomeChartData: TransactionChartData[];
  expenseChartData: TransactionChartData[];
  incomeCategories: IncomeCategory[];
  expenseCategories: ExpenseCategory[];
}

const initialState: AnalysisDataState = {
  incomeChartData: [],
  expenseChartData: [],
  incomeCategories: [],
  expenseCategories: []
};

export const fetchTransactionsChartData = createAsyncThunk(
  'analysisData/fetchTransactionsChartData',
  async ({ year, month }: { year: number; month: number }) => {
    return await ipcRenderer.invoke('get-transactions-chart-data-by-month', year, month);
  }
);

export const fetchTransactionsChartDataByPaymentDay = createAsyncThunk(
  'analysisData/fetchTransactionsChartDataByPaymentDay',
  async ({ year, month }: { year: number; month: number }) => {
    return await ipcRenderer.invoke('get-transactions-chart-data-by-payment-day', year, month);
  }
);

export const fetchCategories = createAsyncThunk(
  'analysisData/fetchCategories',
  async () => {
    const [incomeCategories, expenseCategories] = await Promise.all([
      ipcRenderer.invoke('get-all-incomecategory'),
      ipcRenderer.invoke('get-all-expensecategory')
    ]);
    return { incomeCategories, expenseCategories };
  }
);

const analysisDataSlice = createSlice({
  name: 'analysisData',
  initialState,
  reducers: {
    updateChartData: (state, action: PayloadAction<{
        incomeChartData: TransactionChartData[];
        expenseChartData: TransactionChartData[];
    }>) => {
        state.incomeChartData = action.payload.incomeChartData;
        state.expenseChartData = action.payload.expenseChartData;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsChartData.fulfilled, (state, action) => {
        const data = action.payload;
        state.incomeChartData = data.filter((item: TransactionChartData) => item.type === 'income');
        state.expenseChartData = data.filter((item: TransactionChartData) => item.type === 'expense');
      })
      .addCase(fetchTransactionsChartDataByPaymentDay.fulfilled, (state, action) => {
        const data = action.payload;
        state.incomeChartData = data.filter((item: TransactionChartData) => item.type === 'income');
        state.expenseChartData = data.filter((item: TransactionChartData) => item.type === 'expense');
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.incomeCategories = action.payload.incomeCategories;
        state.expenseCategories = action.payload.expenseCategories;
      });
  }
});

export const { updateChartData } = analysisDataSlice.actions;

export default analysisDataSlice.reducer;