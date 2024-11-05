import { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

interface FixedCostUIState {
    editingItem: number | null;
    editForm: { name: string, value: number, date: number };
}

const initialState: FixedCostUIState = {
    editingItem: null,
    editForm: { name: '', value: 0, date: 1 },
}

const fixedCostUISlice = createSlice({
    name: 'fixedCostUI',
    initialState,
    reducers: {
        setEditingItem: (state, action: PayloadAction<number | null>) => {
            state.editingItem = action.payload;
        },
        setEditForm: (state, action: PayloadAction<{ name: string, value: number, date: number }>) => {
            state.editForm = action.payload;
        },
    }
})

export const { setEditingItem, setEditForm } = fixedCostUISlice.actions;
export default fixedCostUISlice.reducer;
