import { configureStore } from "@reduxjs/toolkit";
import analysisDataReducer from "../page/Analysis/state/AnalysisDataSlice";
import analysisUIReducer from "../page/Analysis/state/AnalysisUISlice";
import fixedCostDataReducer from "../page/FixedCost/state/FixedCostDataSlice";
import { analysisDataMiddleware } from "@/page/Analysis/state/AnalysisMiddleWare";
import { fixedCostListenerMiddleware } from "@/page/FixedCost/state/FixedCostMiddleWare";
import calendarDataReducer from "@/page/Calendar/state/CalendarDataSlice";
export const appStore = configureStore({
    reducer: {
        analysisData: analysisDataReducer,
        analysisUI: analysisUIReducer,
        fixedCostData: fixedCostDataReducer,
        calendarData: calendarDataReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(analysisDataMiddleware)
            .prepend(fixedCostListenerMiddleware.middleware)
    },
})

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;