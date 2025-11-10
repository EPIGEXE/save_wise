import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedCostSection } from "./module/FixedCostSection";
import { RootState, useAppDispatch, useAppSelector } from "@/store/AppStore";
import { fetchFixedCost } from "./state/FixedCostDataSlice";
import type { FixedCostItem as FixedCostItemType } from "./FixedCostType";

const { ipcRenderer } = window.require("electron");

// 고정비용 페이지
export default function FixedCostPage() {
    // ========================================== 전역 상태 ==========================================
    const dispatch = useAppDispatch();
    const {
        incomeData, // 수입 데이터
        expenseData, // 지출 데이터
        incomeChartConfig, // 수입 차트 설정
        expenseChartConfig, // 지출 차트 설정
    } = useAppSelector((state: RootState) => state.fixedCostData);

    // ========================================== 상수 정의 ==========================================
    // 날짜 옵션
    const dateOptions = Array.from({ length: 31 }, (_, i) => i + 1);

    // ========================================== useEffect ==========================================
    // 고정비용 데이터 가져오기
    useEffect(() => {
        fetchFixedCostData();
    }, []);

    // ========================================== fetch ==========================================
    const fetchFixedCostData = async () => {
        dispatch(fetchFixedCost());
    };

    // ========================================== 핸들러 ==========================================
    // 고정 비용 삭제
    const handleDelete = async (id: number, type: "income" | "expense") => {
        try {
            await ipcRenderer.invoke("delete-fixedcost", { id, type });
            await fetchFixedCostData();
        } catch (error) {
            console.error("고정 비용 삭제 실패:", error);
        }
    };

    // 고정 비용 수정
    const handleUpdate = async (id: number, data: Partial<FixedCostItemType>) => {
        try {
            await ipcRenderer.invoke("update-fixedcost", { id, ...data });
            await fetchFixedCostData();
        } catch (error) {
            console.error("고정 비용 수정 실패:", error);
        }
    };

    // 고정 비용 추가
    const handleAdd = async (data: Partial<FixedCostItemType>) => {
        try {
            await ipcRenderer.invoke("create-fixedcost", data);
            await fetchFixedCostData();
        } catch (error) {
            console.error("고정 비용 추가 실패:", error);
        }
    };

    return (
        <div className="p-5 flex flex-col gap-4 h-full">
            <div className="title text-2xl font-bold">고정비용</div>

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
