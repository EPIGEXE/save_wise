import { DatePicker } from "@/components/custom/DatePicker";
import { MonthPicker } from "@/components/custom/MonthPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";

const chartData = [
    { category: "식비", amount: 580000, fill: "hsl(var(--chart-1))" },
    { category: "교통", amount: 120000, fill: "hsl(var(--chart-2))" },
    { category: "쇼핑", amount: 350000, fill: "hsl(var(--chart-3))" },
    { category: "의료", amount: 80000, fill: "hsl(var(--chart-4))" },
]


const chartConfig = {
    amount: {
        label: "금액",
    },
    식비: {
        label: "식비",
        color: "hsl(var(--chart-1))",
    },
    교통: {
        label: "교통",
        color: "hsl(var(--chart-2))",
    },
    쇼핑: {
        label: "쇼핑",
        color: "hsl(var(--chart-3))",
    },
    의료: {
        label: "의료",
        color: "hsl(var(--chart-4))",
    },
} satisfies ChartConfig

const AnalysisPage = () => {
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())

    const handlePreviousMonth = () => {
        setSelectedMonth(subMonths(selectedMonth, 1))
    }

    const handleNextMonth = () => {
        setSelectedMonth(addMonths(selectedMonth, 1))
    }

    return (
        <div className='p-5 flex flex-col gap-4 flex-1'>
            <div className='title text-2xl font-bold'>분석</div>
            <div className="flex items-center justify-end gap-4">
                <MonthPicker 
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                />
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handlePreviousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={handleNextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="flex flex-row flex-1 gap-4">
                <div className="flex-1">
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <div className="font-bold text-2xl">총 지출</div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="flex-1">
                            <ChartContainer config={chartConfig} className="w-full h-[350px] ">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            hideLabel 
                                        />}
                                    />
                                    <Pie 
                                        data={chartData} 
                                        dataKey="amount" 
                                        nameKey="category"
                                        outerRadius={130}
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
                                                    fontSize="15"  // 글자 크기 조정
                                                >
                                                    {`${payload.category} ${((payload.amount / chartData.reduce((sum, item) => sum + item.amount, 0)) * 100).toFixed(0)}%`}
                                                </text>
                                            )
                                        }}
                                    />
                                </PieChart>
                            </ChartContainer>
                            <Separator className="my-4" />
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold">총 지출액</span>
                                    <span className="text-xl font-bold text-primary">
                                        {chartData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}원
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {chartData.map((item) => (
                                        <div key={item.category} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: item.fill }}
                                                />
                                                <span>{item.category}</span>
                                            </div>
                                            <span className="font-medium">{item.amount.toLocaleString()}원</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex-1">
                <Card className="flex flex-col h-full">
                        <CardHeader>
                            <div className="font-bold text-2xl">총 지출</div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="flex-1">
                            <ChartContainer config={chartConfig} className="w-full h-[350px] ">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            hideLabel 
                                        />}
                                    />
                                    <Pie 
                                        data={chartData} 
                                        dataKey="amount" 
                                        nameKey="category"
                                        outerRadius={130}
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
                                                    fontSize="15"  // 글자 크기 조정
                                                >
                                                    {`${payload.category} ${((payload.amount / chartData.reduce((sum, item) => sum + item.amount, 0)) * 100).toFixed(0)}%`}
                                                </text>
                                            )
                                        }}
                                    />
                                </PieChart>
                            </ChartContainer>
                            <Separator className="my-4" />
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold">총 지출액</span>
                                    <span className="text-xl font-bold text-primary">
                                        {chartData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}원
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {chartData.map((item) => (
                                        <div key={item.category} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: item.fill }}
                                                />
                                                <span>{item.category}</span>
                                            </div>
                                            <span className="font-medium">{item.amount.toLocaleString()}원</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
           
        </div>
    )
}

export default AnalysisPage;