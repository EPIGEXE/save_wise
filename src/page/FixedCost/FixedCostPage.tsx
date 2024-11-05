import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedCostSection } from "./module/FixedCostSection";
import { RootState, useAppDispatch, useAppSelector } from "../Analysis/state/AnalysisStore";

const { ipcRenderer } = window.require('electron');

export default function FixedCostPage() {
    const dispatch = useAppDispatch();
    
    const { 
        incomeData, 
        expenseData, 
    } = useAppSelector((state: RootState) => state.fixedCostData);

    const {
        editingItem,
        editForm,
    } = useAppSelector((state: RootState) => state.fixedCostUI);

    useEffect(() => {
        fetchFixedCost();
    }, []);

    const fetchFixedCost = async () => {
        dispatch(fetchFixedCostData());
    }

    // 차트 설정
    const chartConfig = {
        colors: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'],
        height: 350,
    };

    // 날짜 옵션
    const dateOptions = Array.from({length: 31}, (_, i) => i + 1);

    // 이벤트 핸들러
    const handleEdit = (item: any) => {
        setEditingItem(item.id);
        setEditForm({ 
            name: item.name, 
            value: item.value, 
            date: item.date 
        });
    };

    const handleDelete = (id: number, type: 'income' | 'expense') => {
        ipcRenderer.invoke('delete-fixedcost', { id, type });
        fetchFixedCost();
    };

    const handleSave = (id: number, type: 'income' | 'expense') => {
        ipcRenderer.invoke('update-fixedcost', { id, ...editForm, type });
        fetchFixedCost();
    };

    const handleCancel = () => {
        setEditingItem(null);
        setEditForm({ name: '', value: 0, date: 1 });
    };

    const handleEditFormChange = (field: string, value: string | number) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className='p-5 flex flex-col gap-4 h-full'>
            <div className='title text-2xl font-bold'>고정비용</div>
            
            <Tabs defaultValue="income" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="income">고정 수입</TabsTrigger>
                    <TabsTrigger value="expense">고정 지출</TabsTrigger>
                </TabsList>

                <TabsContent value="income">
                    <FixedCostSection
                        data={incomeData}
                        type="income"
                        chartConfig={chartConfig}
                        editingItem={editingItem}
                        editForm={editForm}
                        dateOptions={dateOptions}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onEditFormChange={handleEditFormChange}
                    />
                </TabsContent>

                <TabsContent value="expense">
                    <FixedCostSection
                        data={expenseData}
                        type="expense"
                        chartConfig={chartConfig}
                        editingItem={editingItem}
                        editForm={editForm}
                        dateOptions={dateOptions}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onEditFormChange={handleEditFormChange}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}