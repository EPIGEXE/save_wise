import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { IExpenseCategory, IIncomeCategory, TransactionChartData } from "@/types";

const { ipcRenderer } = window;

export interface AnalysisDataState {
    incomeChartData: TransactionChartData []; // 수입 차트 데이터
    expenseChartData: TransactionChartData[]; // 지출 차트 데이터
    incomeCategories: IIncomeCategory[]; // 수입 카테고리들
    expenseCategories: IExpenseCategory[]; // 지출 카테고리들
}

const initialState: AnalysisDataState = {
    incomeChartData: [],
    expenseChartData: [],
    incomeCategories: [],
    expenseCategories: [],
};

// ========================================== 비동기 액션 생성 ===========================================
// 월별 거래 차트 데이터 가져오기
export const fetchTransactionsChartData = createAsyncThunk(
    "analysisData/fetchTransactionsChartData",
    async ({ year, month }: { year: number; month: number }) => {
        return await ipcRenderer.invoke("get-transactions-chart-data-by-month", year, month);
    }
);

// 결제일 기준 거래 차트 데이터 가져오기
export const fetchTransactionsChartDataByPaymentDay = createAsyncThunk(
    "analysisData/fetchTransactionsChartDataByPaymentDay",
    async ({ year, month }: { year: number; month: number }) => {
        return await ipcRenderer.invoke("get-transactions-chart-data-by-payment-day", year, month);
    }
);

// 카테고리 데이터 가져오기
export const fetchCategories = createAsyncThunk("analysisData/fetchCategories", async () => {
    const [incomeCategories, expenseCategories] = await Promise.all([
        ipcRenderer.invoke("get-all-incomecategory"),
        ipcRenderer.invoke("get-all-expensecategory"),
    ]);
    return { incomeCategories, expenseCategories };
});

// 슬라이스
const analysisDataSlice = createSlice({
    name: "analysisData",
    initialState,
    reducers: {
        // 차트 데이터 업데이트
        updateChartData: (
            state,
            action: PayloadAction<{
                incomeChartData: TransactionChartData[];
                expenseChartData: TransactionChartData[];
            }>
        ) => {
            state.incomeChartData = action.payload.incomeChartData;
            state.expenseChartData = action.payload.expenseChartData;
        },
    },
    extraReducers: (builder) => {
        builder
            // 월별 거래 차트 데이터 가져오기 완료 시
            .addCase(fetchTransactionsChartData.fulfilled, (state, action) => {
                const data = action.payload;
                state.incomeChartData = data.filter((item: TransactionChartData) => item.type === "income");
                state.expenseChartData = data.filter((item: TransactionChartData) => item.type === "expense");
            })
            // 결제일 기준 거래 차트 데이터 가져오기 완료 시
            .addCase(fetchTransactionsChartDataByPaymentDay.fulfilled, (state, action) => {
                const data = action.payload;
                state.incomeChartData = data.filter((item: TransactionChartData) => item.type === "income");
                state.expenseChartData = data.filter((item: TransactionChartData) => item.type === "expense");
            })
            // 카테고리 데이터 가져오기 완료 시
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.incomeCategories = action.payload.incomeCategories;
                state.expenseCategories = action.payload.expenseCategories;
            });
    },
});

export const { updateChartData } = analysisDataSlice.actions;

export default analysisDataSlice.reducer;
