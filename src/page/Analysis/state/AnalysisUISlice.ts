import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChartConfig } from "@/components/ui/chart";

export interface AnalysisUIState {
    chartType: "pie" | "bar"; // 차트 타입
    isPaymentDayBased: boolean; // 결제일 기준 여부
    selectedMonthDate: string; // 선택된 월
    incomeChartConfig: ChartConfig; // 수입 차트 설정
    expenseChartConfig: ChartConfig; // 지출 차트 설정
}

const initialState: AnalysisUIState = {
    chartType: "pie",
    isPaymentDayBased: false,
    selectedMonthDate: new Date().toISOString(),
    incomeChartConfig: {},
    expenseChartConfig: {},
};

const analysisUISlice = createSlice({
    name: "analysisUI",
    initialState,
    reducers: {
        // 결제일 기준 설정
        setPaymentDayBased: (state, action: PayloadAction<boolean>) => {
            state.isPaymentDayBased = action.payload;
        },
        // 선택된 월 설정
        setSelectedMonthDate: (state, action: PayloadAction<Date>) => {
            state.selectedMonthDate = action.payload.toISOString();
        },
        // 차트 타입 설정
        setChartType: (state, action: PayloadAction<"pie" | "bar">) => {
            state.chartType = action.payload;
        },
        // 차트 설정 업데이트
        updateChartConfigs: (
            state,
            action: PayloadAction<{
                incomeConfig: ChartConfig;
                expenseConfig: ChartConfig;
            }>
        ) => {
            state.incomeChartConfig = action.payload.incomeConfig;
            state.expenseChartConfig = action.payload.expenseConfig;
        },
    },
});

export const { setChartType, setPaymentDayBased, setSelectedMonthDate, updateChartConfigs } = analysisUISlice.actions;

export default analysisUISlice.reducer;
