import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { fetchFixedCost, addFixedCost, updateFixedCost, updateChartConfigs, updateFixedCostData } from './FixedCostDataSlice';
import { generateColorForCategory, resetColorCache } from '../../../utils/Utils';
import type { RootState } from '@/store/AppStore';

export const fixedCostListenerMiddleware = createListenerMiddleware();

// 리스너 추가
fixedCostListenerMiddleware.startListening({
  matcher: isAnyOf(
    fetchFixedCost.fulfilled,
    addFixedCost.fulfilled,
    updateFixedCost.fulfilled
  ),
  effect: async (action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const { incomeData, expenseData } = state.fixedCostData;
    
    // 카테고리별 색상 설정 생성
    const categories = [...incomeData, ...expenseData].reduce((acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = {
          color: generateColorForCategory(item.name),
        };
      }
      return acc;
    }, {} as Record<string, { color: string }>);

    const updatedIncomeData = incomeData.map(item => ({
      ...item,
      fill: categories[item.name].color
    }));

    const updatedExpenseData = expenseData.map(item => ({
      ...item,
      fill: categories[item.name].color
    }));

    listenerApi.dispatch(updateFixedCostData({
      incomeData: updatedIncomeData,
      expenseData: updatedExpenseData
    }));

    // 차트 설정 업데이트
    listenerApi.dispatch(updateChartConfigs({
      incomeChartConfig: categories,
      expenseChartConfig: categories
    }));
  }
});