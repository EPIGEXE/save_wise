import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { generateColorForCategory } from "@/utils/Utils";
import { Check } from "lucide-react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AddGoalDialog from "./module/AddGoalDialog";
import { CurrencyInput } from "@/components/custom/CurrencyInput";
import { Badge } from "@/components/ui/badge";
import { GoalItem } from "./GoalType";
import { IGoal } from "@/types";

const { ipcRenderer } = window.require('electron');

// 목표 페이지  
const GoalPage = () => {
    // ========================================== 상태 정의 ==========================================
    const [goals, setGoals] = useState<GoalItem[]>([]); // 목표 목록
    const [goalChartConfig, setGoalChartConfig] = useState<ChartConfig>({}); // 목표 차트 설정

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // 수정 다이얼로그 열림 여부
    const [editForm, setEditForm] = useState({
        name: '', 
        targetAmount: 0, 
    }); // 설정 폼 값

    // ========================================== useEffect ==========================================
    // 목표 데이터 가져오기
    useEffect(() => {
        fetchGoals();
    }, []);

    // ========================================== fetch ==========================================
    // 목표 데이터 가져오기
    const fetchGoals = async () => {
        const goals = await ipcRenderer.invoke('get-all-goal');

        const categories = goals.reduce((acc: Record<string, { color: string }>, item: IGoal) => {
            if (!acc[item.name]) {
                acc[item.name] = { color: generateColorForCategory(item.name) };
            }
            return acc;
        }, {} as Record<string, { color: string }>);

        setGoalChartConfig(categories as ChartConfig);

        // 목표 데이터 색상 설정
        const updatedGoals = goals.map((item: IGoal) => ({
            ...item,
            fill: categories[item.name].color
        }));

        setGoals(updatedGoals);
    }

    // ========================================== 핸들러 ==========================================
    // 설정 폼 변경 핸들러
    const handleEditFormChange = (field: string, value: string | number) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    // 저장 핸들러
    const handleSave = () => {
        ipcRenderer.invoke('update-goal', editForm);
        setIsEditDialogOpen(false);
        fetchGoals();
    };

    // 목표 추가 핸들러
    const handleAddGoal = (data: IGoal) => {
        ipcRenderer.invoke('create-goal', data);
        fetchGoals();
    };

    // 목표 삭제 핸들러
    const handleDelete = (id: number) => {
        ipcRenderer.invoke('delete-goal', id);
        fetchGoals();
    };

    return (
        <div className='p-5 flex flex-col gap-4 h-full'>
            <div className='title text-2xl font-bold'>목표 설정</div>
            
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 h-full'>
                <Card className='flex flex-col h-full'>
                    <CardHeader>
                        <h3 className='text-lg font-semibold'>목표 목록</h3>
                    </CardHeader>
                    <CardContent className='flex-1'>
                        <ChartContainer config={goalChartConfig} className='w-full h-full' >
                            <PieChart>
                                <ChartTooltip 
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie 
                                    data={goals} 
                                    dataKey='targetAmount' 
                                    nameKey='name' 
                                    outerRadius={180} 
                                    labelLine={false}
                                    animationDuration={500}
                                    label={({ payload, ...props }) => {
                                        return (
                                            <text
                                                cx={props.cx}
                                                cy={props.cy}
                                                x={props.x}
                                                y={props.y}
                                                textAnchor={props.textAnchor}
                                                dominantBaseline={props.dominantBaseline}
                                                fontSize="15"
                                            >
                                                {payload.name}
                                            </text>
                                        )
                                    }}
                                />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-semibold tracking-tight">
                                총 목표
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                매월 {goals.length}개 항목
                            </p>
                        </div>
                        <div className="text-2xl font-bold">
                            {goals.reduce((sum, item) => sum + item.targetAmount, 0).toLocaleString()}
                            <span className="text-base ml-1">원</span>
                        </div>
                    </CardHeader>
                    <Separator className="mb-4" />
                    <CardContent className="space-y-4">
                        <AddGoalDialog onAdd={handleAddGoal} />
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {goals.map((item) => (
                                <div key={item.id} className="group flex justify-between items-center p-4 bg-card hover:bg-accent/50 rounded-lg border shadow-sm transition-all duration-200">
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-4 h-4 rounded-full" 
                                            style={{ backgroundColor: item.fill }}
                                        />
                                        <div className="flex flex-row gap-1.5">
                                            <span className="font-medium">{item.name}</span>
                                            {item.expenseCategory && (
                                                <Badge variant="secondary" className="w-fit text-xs text-gray-500">
                                                    지출 카테고리: {item.expenseCategory.name}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="font-semibold text-lg">
                                                {item.targetAmount.toLocaleString()}
                                                <span className="text-sm text-muted-foreground ml-1">원</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Button 
                                                size="icon" 
                                                variant="ghost"
                                                onClick={() => {
                                                    setEditForm(item);
                                                    setIsEditDialogOpen(true);
                                                }}
                                                className="h-8 w-8"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button 
                                                size="icon" 
                                                variant="ghost"
                                                onClick={() => handleDelete(item.id)}
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>목표 수정</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>항목명</Label>
                                        <Input
                                            value={editForm.name}
                                            onChange={(e) => handleEditFormChange('name', e.target.value)}
                                            placeholder="항목명"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>금액</Label>
                                        <CurrencyInput
                                            value={editForm.targetAmount}
                                            onChange={(value) => handleEditFormChange('targetAmount', value)}
                                            placeholder="금액"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                        취소
                                    </Button>
                                    <Button onClick={handleSave} className="gap-2">
                                        <Check className="h-4 w-4" />
                                        저장
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
};

export default GoalPage;