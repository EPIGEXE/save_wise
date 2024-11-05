import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from 'recharts';
import { FixedCostItem } from "./FixedCostItem";

interface FixedCostSectionProps {
    data: any[];
    type: 'income' | 'expense';
    chartConfig: {
        colors: string[];
        height: number;
    };
    editingItem: number | null;
    editForm: { name: string; value: number; date: number };
    dateOptions: number[];
    onEdit: (item: any) => void;
    onDelete: (id: number, type: 'income' | 'expense') => void;
    onSave: (id: number, type: 'income' | 'expense') => void;
    onCancel: () => void;
    onEditFormChange: (field: string, value: string | number) => void;
}

export function FixedCostSection({
    data,
    type,
    chartConfig,
    editingItem,
    editForm,
    dateOptions,
    onEdit,
    onDelete,
    onSave,
    onCancel,
    onEditFormChange,
}: FixedCostSectionProps) {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
        <div className="grid grid-cols-2 gap-6">
            <Card className="p-6">
                <ChartContainer config={chartConfig} className="w-full h-[350px]">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie 
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={130}
                            labelLine={false}
                            animationDuration={500}
                            label={({ name, value, ...props }) => {
                                const percent = ((value / total) * 100).toFixed(0);
                                return (
                                    <text {...props} fontSize="15">
                                        {`${name} ${percent}%`}
                                    </text>
                                )
                            }}
                        >
                            {data.map((_, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={chartConfig.colors[index % chartConfig.colors.length]} 
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </Card>
            
            <div className="space-y-4">
                <Card className="p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-muted-foreground">
                            총 {type === 'income' ? '수입' : '지출'}
                        </span>
                        <span className="text-2xl font-bold">
                            {total.toLocaleString()}
                            <span className="text-base ml-1">원</span>
                        </span>
                    </div>
                </Card>
                
                <div className="space-y-3">
                    {data.map((item) => (
                        <FixedCostItem 
                            key={item.id}
                            item={item}
                            type={type}
                            editingItem={editingItem}
                            editForm={editForm}
                            dateOptions={dateOptions}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onSave={onSave}
                            onCancel={onCancel}
                            onEditFormChange={onEditFormChange}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}