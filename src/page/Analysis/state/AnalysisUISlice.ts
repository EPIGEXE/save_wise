import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChartConfig } from '@/components/ui/chart';

interface AnalysisUIState {
  chartType: 'pie' | 'bar';
  isPaymentDayBased: boolean;
  selectedMonthDate: string;
  incomeChartConfig: ChartConfig;
  expenseChartConfig: ChartConfig;
}

const initialState: AnalysisUIState = {
  chartType: 'pie',
  isPaymentDayBased: false,
  selectedMonthDate: new Date().toISOString(),
  incomeChartConfig: {},
  expenseChartConfig: {}
};

const analysisUISlice = createSlice({
  name: 'analysisUI',
  initialState,
  reducers: {
    setPaymentDayBased: (state, action: PayloadAction<boolean>) => {
      state.isPaymentDayBased = action.payload;
    },
    setSelectedMonthDate: (state, action: PayloadAction<Date>) => {
      state.selectedMonthDate = action.payload.toISOString();
    },
    setChartType: (state, action: PayloadAction<'pie' | 'bar'>) => {
      state.chartType = action.payload;
    },
    updateChartConfigs: (state, action: PayloadAction<{
      incomeConfig: ChartConfig;
      expenseConfig: ChartConfig;
    }>) => {
      state.incomeChartConfig = action.payload.incomeConfig;
      state.expenseChartConfig = action.payload.expenseConfig;
    }
  }
});

export const {
  setChartType,
  setPaymentDayBased,
  setSelectedMonthDate,
  updateChartConfigs
} = analysisUISlice.actions;

export default analysisUISlice.reducer;