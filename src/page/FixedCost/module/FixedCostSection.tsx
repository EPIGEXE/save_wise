import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FixedCostItem } from "./FixedCostItem";
import { AddFixedCostDialog } from "./AddFixedCostDialog";
import { FixedCost } from "@/backend/db/entity/FixedCost";
import { Separator } from "@/components/ui/separator";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { useEffect, useState } from "react";

interface FixedCostSectionProps {
    data: FixedCost[];
    type: 'income' | 'expense';
    chartConfig: ChartConfig;
    dateOptions: number[];
    onAdd: (data: { name: string; amount: number; prospectDay: number; type: 'income' | 'expense' }) => void;
    onUpdate: (id: number, data: Partial<FixedCost>) => void;
    onDelete: (id: number, type: 'income' | 'expense') => void;
}

export function FixedCostSection({
    data,
    type,
    chartConfig,
    dateOptions,
    onAdd,
    onUpdate,
    onDelete,
}: FixedCostSectionProps) {
    const total = data.reduce((sum, item) => sum + item.amount, 0);
    const [chartKey, setChartKey] = useState(0);

    useEffect(() => {
        setChartKey(prev => prev + 1);
    }, [data]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
            {/* 왼쪽: 차트 */}
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <h3 className="text-lg font-semibold">
                        {type === 'income' ? '수입' : '지출'} 분포
                    </h3>
                </CardHeader>
                <CardContent className="flex-1">
                    <ChartContainer config={chartConfig} className="w-full h-full">
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie 
                                key={chartKey}
                                data={data} 
                                dataKey="amount"
                                nameKey="name"
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
                                            {`${payload.name} ${((payload.amount / total) * 100).toFixed(0)}%`}
                                        </text>
                                    )
                                }}
                            />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* 오른쪽: 입력 UI */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-semibold tracking-tight">
                            총 {type === 'income' ? '수입' : '지출'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            매월 {data.length}개 항목
                        </p>
                    </div>
                    <div className="text-2xl font-bold">
                        {total.toLocaleString()}
                        <span className="text-base ml-1">원</span>
                    </div>
                </CardHeader>
                <Separator className="mb-4" />
                <CardContent className="space-y-4">
                    <AddFixedCostDialog
                        type={type}
                        dateOptions={dateOptions}
                        onAdd={onAdd}
                    />
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                        {data.map((item) => (
                            <FixedCostItem
                                key={item.id}
                                item={item}
                                type={type}
                                dateOptions={dateOptions}
                                onUpdate={onUpdate}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}