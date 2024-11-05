import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChartConfig } from '@/components/ui/chart';

interface AnalysisUIState {
  isPaymentDayBased: boolean;
  expandedCategories: string[];
  selectedMonthDate: string;
  incomeChartConfig: ChartConfig;
  expenseChartConfig: ChartConfig;
}

const initialState: AnalysisUIState = {
  isPaymentDayBased: false,
  expandedCategories: [],
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
    toggleExpandedCategory: (state, action: PayloadAction<string>) => {
        const category = action.payload;
        const index = state.expandedCategories.indexOf(category);
        if (index === -1) {
          state.expandedCategories.push(category);
        } else {
          state.expandedCategories.splice(index, 1);
        }
      },
    setSelectedMonthDate: (state, action: PayloadAction<Date>) => {
      state.selectedMonthDate = action.payload.toISOString();
      state.expandedCategories = [];
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
  setPaymentDayBased,
  toggleExpandedCategory,
  setSelectedMonthDate,
  updateChartConfigs
} = analysisUISlice.actions;

export default analysisUISlice.reducer;