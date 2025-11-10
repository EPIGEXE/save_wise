import { ChartConfig } from "@/components/ui/chart";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FixedCostItem } from "../FixedCostType";
import { IFixedCost } from "@/types";

const { ipcRenderer } = window;

export interface FixedCostDataState {
    incomeData: FixedCostItem[]; // 수입 데이터
    expenseData: FixedCostItem[]; // 지출 데이터
    incomeChartConfig: ChartConfig; // 수입 차트 설정
    expenseChartConfig: ChartConfig; // 지출 차트 설정
}

const initialState: FixedCostDataState = {
    incomeData: [],
    expenseData: [],
    incomeChartConfig: {},
    expenseChartConfig: {}
}

// ========================================== 비동기 액션 생성 ==========================================
// 고정비용 데이터 가져오기
export const fetchFixedCost = createAsyncThunk(
    'fixedCost/fetchFixedCost',
    async () => {
        return await ipcRenderer.invoke('get-all-fixedcost');
    }
)

// 고정비용 추가
export const addFixedCost = createAsyncThunk(
    'fixedCost/addFixedCost',
    async (fixedCost: FixedCostItem) => {
        return await ipcRenderer.invoke('add-fixedcost', fixedCost);
    }
)

// 고정비용 수정
export const updateFixedCost = createAsyncThunk(
    'fixedCost/updateFixedCost',
    async (fixedCost: FixedCostItem) => {
        return await ipcRenderer.invoke('update-fixedcost', fixedCost);
    }
)

// 고정비용 삭제
export const deleteFixedCost = createAsyncThunk(
    'fixedCost/deleteFixedCost',
    async (fixedCost: FixedCostItem) => {
        return await ipcRenderer.invoke('delete-fixedcost', fixedCost);
    }
)

const fixedCostDataSlice = createSlice({
    name: 'fixedCostData',
    initialState,
    reducers: {
        // 고정비용 데이터 업데이트
        updateFixedCostData: (state, action: PayloadAction<{
            incomeData: IFixedCost[];
            expenseData: IFixedCost[];
        }>) => {
            state.incomeData = action.payload.incomeData;
            state.expenseData = action.payload.expenseData;
        },
        // 차트 설정 업데이트
        updateChartConfigs: (state, action: PayloadAction<{
            incomeChartConfig: ChartConfig;
            expenseChartConfig: ChartConfig;
        }>) => {
            state.incomeChartConfig = action.payload.incomeChartConfig;
            state.expenseChartConfig = action.payload.expenseChartConfig;
        }
    },
    extraReducers: (builder) => {
        builder
            // 고정비용 데이터 가져오기 완료 시
            .addCase(fetchFixedCost.fulfilled, (state, action) => {
                state.incomeData = action.payload.filter((item: IFixedCost) => item.type === 'income');
                state.expenseData = action.payload.filter((item: IFixedCost) => item.type === 'expense');
            })
            // 고정비용 추가 완료 시
            .addCase(addFixedCost.fulfilled, (state, action) => {
                state.incomeData.push(action.payload);
            })
            // 고정비용 수정 완료 시
            .addCase(updateFixedCost.fulfilled, (state, action) => {
                const index = state.incomeData.findIndex((item: IFixedCost) => item.id === action.payload.id);
                state.incomeData[index] = action.payload;
            })
            // 고정비용 삭제 완료 시
            .addCase(deleteFixedCost.fulfilled, (state, action) => {
                state.incomeData = state.incomeData.filter((item: IFixedCost) => item.id !== action.payload.id);
                state.expenseData = state.expenseData.filter((item: IFixedCost) => item.id !== action.payload.id);
            })
    }
})

export const { updateFixedCostData, updateChartConfigs } = fixedCostDataSlice.actions;
export default fixedCostDataSlice.reducer;
