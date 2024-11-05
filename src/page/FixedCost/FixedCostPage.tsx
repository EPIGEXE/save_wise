import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FixedCostSection } from "./module/FixedCostSection";

export default function FixedCostPage() {
    // 상태 관리
    const [incomeData, setIncomeData] = useState([
        { id: 1, name: '급여', value: 3000000, date: 10 },
        { id: 2, name: '이자수입', value: 100000, date: 15 }
    ]);
    
    const [expenseData, setExpenseData] = useState([
        { id: 1, name: '월세', value: 1000000, date: 25 },
        { id: 2, name: '보험료', value: 150000, date: 15 },
        { id: 3, name: '통신비', value: 100000, date: 5 }
    ]);

    const [editingItem, setEditingItem] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ name: '', value: 0, date: 1 });

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
        if (type === 'income') {
            setIncomeData(prev => prev.filter(item => item.id !== id));
        } else {
            setExpenseData(prev => prev.filter(item => item.id !== id));
        }
    };

    const handleSave = (id: number, type: 'income' | 'expense') => {
        const updateData = (prev: any[]) => 
            prev.map(item => 
                item.id === id 
                    ? { ...item, ...editForm }
                    : item
            );

        if (type === 'income') {
            setIncomeData(updateData);
        } else {
            setExpenseData(updateData);
        }
        
        setEditingItem(null);
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