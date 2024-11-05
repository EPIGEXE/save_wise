import { configureStore } from "@reduxjs/toolkit";
import fixedCostDataReducer from "./FixedCostDataSlice";
import fixedCostUIReducer from "./FixedCostUISlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { TypedUseSelectorHook } from "react-redux";

export const fixedCostStore = configureStore({
    reducer: {
        fixedCostData: fixedCostDataReducer,
        fixedCostUI: fixedCostUIReducer,
    },
});

export type RootState = ReturnType<typeof fixedCostStore.getState>;
export type AppDispatch = typeof fixedCostStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;