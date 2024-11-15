import { FixedCost } from "@/backend/db/entity/FixedCost";
import { ChartConfig } from "@/components/ui/chart";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const { ipcRenderer } = window;

interface FixedCostDataState {
    incomeData: FixedCost[];
    expenseData: FixedCost[];
    incomeChartConfig: ChartConfig;
    expenseChartConfig: ChartConfig;
}

const initialState: FixedCostDataState = {
    incomeData: [],
    expenseData: [],
    incomeChartConfig: {},
    expenseChartConfig: {}
}

export const fetchFixedCost = createAsyncThunk(
    'fixedCost/fetchFixedCost',
    async () => {
        return await ipcRenderer.invoke('get-all-fixedcost');
    }
)

export const addFixedCost = createAsyncThunk(
    'fixedCost/addFixedCost',
    async (fixedCost: FixedCost) => {
        return await ipcRenderer.invoke('add-fixedcost', fixedCost);
    }
)

export const updateFixedCost = createAsyncThunk(
    'fixedCost/updateFixedCost',
    async (fixedCost: FixedCost) => {
        return await ipcRenderer.invoke('update-fixedcost', fixedCost);
    }
)

export const deleteFixedCost = createAsyncThunk(
    'fixedCost/deleteFixedCost',
    async (fixedCost: FixedCost) => {
        return await ipcRenderer.invoke('delete-fixedcost', fixedCost);
    }
)

const fixedCostDataSlice = createSlice({
    name: 'fixedCostData',
    initialState,
    reducers: {
        updateFixedCostData: (state, action: PayloadAction<{
            incomeData: FixedCost[];
            expenseData: FixedCost[];
        }>) => {
            state.incomeData = action.payload.incomeData;
            state.expenseData = action.payload.expenseData;
        },
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
            .addCase(fetchFixedCost.fulfilled, (state, action) => {
                state.incomeData = action.payload.filter((item: FixedCost) => item.type === 'income');
                state.expenseData = action.payload.filter((item: FixedCost) => item.type === 'expense');
            })
            .addCase(addFixedCost.fulfilled, (state, action) => {
                state.incomeData.push(action.payload);
            })
            .addCase(updateFixedCost.fulfilled, (state, action) => {
                const index = state.incomeData.findIndex((item: FixedCost) => item.id === action.payload.id);
                state.incomeData[index] = action.payload;
            })
            .addCase(deleteFixedCost.fulfilled, (state, action) => {
                state.incomeData = state.incomeData.filter((item: FixedCost) => item.id !== action.payload.id);
                state.expenseData = state.expenseData.filter((item: FixedCost) => item.id !== action.payload.id);
            })
    }
})

export const { updateFixedCostData, updateChartConfigs } = fixedCostDataSlice.actions;
export default fixedCostDataSlice.reducer;
