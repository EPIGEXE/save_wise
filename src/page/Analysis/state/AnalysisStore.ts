import { configureStore } from "@reduxjs/toolkit";
import { analysisDataMiddleware } from "./AnalysisMiddleWare";
import analysisDataReducer from "./AnalysisDataSlice";
import analysisUIReducer from "./AnalysisUISlice";

export const analysisStore = configureStore({
    reducer: {
        analysisData:analysisDataReducer,
        analysisUI:analysisUIReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(analysisDataMiddleware)
    },
})

export type RootState = ReturnType<typeof analysisStore.getState>;
export type AppDispatch = typeof analysisStore.dispatch;

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;