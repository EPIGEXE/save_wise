import { Middleware } from "@reduxjs/toolkit";
import {
    fetchTransactionsChartData,
    fetchTransactionsChartDataByPaymentDay,
    updateChartData,
} from "./AnalysisDataSlice";
import { updateChartConfigs } from "./AnalysisUISlice";
import { generateColorForCategory } from "../../../utils/Utils";
import { RootState } from "@/store/AppStore";

// analysisData의 미들웨어
export const analysisDataMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    // 월별 거래 차트 데이터 가져오기 또는 결제일 기준 거래 차트 데이터 가져오기 완료 시
	// 색상을 추가하는 미들웨어
    if (
        fetchTransactionsChartData.fulfilled.match(action) ||
        fetchTransactionsChartDataByPaymentDay.fulfilled.match(action)
    ) {
        const state = store.getState() as RootState;
        const { incomeChartData, expenseChartData } = state.analysisData;

        // 1. 카테고리별 색상 설정 생성
        const categories = [...incomeChartData, ...expenseChartData].reduce((acc, item) => {
            if (!acc[item.category]) {
                acc[item.category] = {
                    color: generateColorForCategory(item.category),
                };
            }
            return acc;
        }, {} as Record<string, { color: string }>);

        // 2. 차트 데이터에 fill 속성 추가
        const updatedIncomeData = incomeChartData.map((item) => ({
            ...item,
            fill: categories[item.category].color,
        }));

        const updatedExpenseData = expenseChartData.map((item) => ({
            ...item,
            fill: categories[item.category].color,
        }));

        // 3. 업데이트된 데이터와 설정을 디스패치
        store.dispatch(
            updateChartData({
                incomeChartData: updatedIncomeData,
                expenseChartData: updatedExpenseData,
            })
        );

        store.dispatch(
            updateChartConfigs({
                incomeConfig: categories,
                expenseConfig: categories,
            })
        );
    }

    return result;
};
