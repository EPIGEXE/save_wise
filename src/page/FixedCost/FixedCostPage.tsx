import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedCostSection } from "./module/FixedCostSection";
import { RootState, useAppDispatch, useAppSelector } from "@/store/AppStore";
import { fetchFixedCost } from "./state/FixedCostDataSlice";
import { FixedCost } from "@/backend/db/entity/FixedCost";

const { ipcRenderer } = window.require('electron');


export default function FixedCostPage() {
    const dispatch = useAppDispatch();

    const { 
        incomeData,
        expenseData,
        incomeChartConfig,
        expenseChartConfig,
    } = useAppSelector((state: RootState) => state.fixedCostData);

    useEffect(() => {
        fetchFixedCostData();
    }, []);

    const fetchFixedCostData = async () => {
        dispatch(fetchFixedCost());
    }

    // 날짜 옵션
    const dateOptions = Array.from({length: 31}, (_, i) => i + 1);

    const handleDelete = async (id: number, type: 'income' | 'expense') => {
        try {
            await ipcRenderer.invoke('delete-fixedcost', { id, type });
            await fetchFixedCostData();
        } catch (error) {
            console.error('고정 비용 삭제 실패:', error);
        }
    };

    const handleUpdate = async (id: number, data: Partial<FixedCost>) => {
        try {
            await ipcRenderer.invoke('update-fixedcost', { id, ...data });
            await fetchFixedCostData();
        } catch (error) {
            console.error('고정 비용 수정 실패:', error);
        }
    };

    const handleAdd = async (data: Partial<FixedCost>) => {
        try {
            await ipcRenderer.invoke('create-fixedcost', data);
            await fetchFixedCostData();
        } catch (error) {
            console.error('고정 비용 추가 실패:', error);
        }
    };

    return (
        <div className='p-5 flex flex-col gap-4 h-full'>
            <div className='title text-2xl font-bold'>고정비용</div>
            
            <Tabs defaultValue="income" className="w-full flex flex-col flex-1">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="income">고정 수입</TabsTrigger>
                    <TabsTrigger value="expense">고정 지출</TabsTrigger>
                </TabsList>

                <TabsContent className="flex-1" value="income">
                    <FixedCostSection
                        data={incomeData}
                        type="income"
                        chartConfig={incomeChartConfig}
                        dateOptions={dateOptions}
                        onAdd={handleAdd}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                </TabsContent>

                <TabsContent className="flex-1" value="expense">
                    <FixedCostSection
                        data={expenseData}
                        type="expense"
                        chartConfig={expenseChartConfig}
                        dateOptions={dateOptions}
                        onAdd={handleAdd}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}