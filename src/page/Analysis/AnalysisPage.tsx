import { ExpenseCategory } from "@/backend/db/entity/ExpenseCategory";
import { IncomeCategory } from "@/backend/db/entity/IncomeCategory";
import { TransactionChartData } from "@/backend/service/AnalysisService";
import { MonthPicker } from "@/components/custom/MonthPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";

const { ipcRenderer } = window;

const AnalysisPage = () => {

    const [isPaymentDayBased, setIsPaymentDayBased] = useState<boolean>(false)

    const [selectedMonthDate, setSelectedMonthDate] = useState<Date>(new Date())

    const [incomeChartData, setIncomeChartData] = useState<TransactionChartData[]>([])
    const [expenseChartData, setExpenseChartData] = useState<TransactionChartData[]>([])

    const [incomeChartConfig, setIncomeChartConfig] = useState<ChartConfig>({})
    const [expenseChartConfig, setExpenseChartConfig] = useState<ChartConfig>({})

    const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>([])
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([])

    useEffect(() => {
        fetchIncomeCategories()
        fetchExpenseCategories()
        fetchTransactionsChartData()
    }, [])

    useEffect(() => {
        fetchTransactionsChartData()
    }, [selectedMonthDate])

    useEffect(() => {
        // 수입 카테고리 설정
        incomeCategories.forEach((category) => {
            setIncomeChartConfig(prev => ({
                ...prev,
                [category.name]: {
                    label: category.name,
                    color: `hsl(var(--chart-${incomeCategories.indexOf(category) + 1}))`,
                }
            }))
        })
        // 수입 기타 카테고리 추가
        setIncomeChartConfig(prev => ({
            ...prev,
            "기타": {
                label: "기타",
                color: `hsl(var(--chart-${incomeCategories.length + 1}))`,
            }
        }))

        // 지출 카테고리 설정
        expenseCategories.forEach((category) => {
            setExpenseChartConfig(prev => ({
                ...prev,
                [category.name]: {
                    label: category.name,
                    color: `hsl(var(--chart-${expenseCategories.indexOf(category) + 1}))`,
                }
            }))
        })
        // 지출 기타 카테고리 추가
        setExpenseChartConfig(prev => ({
            ...prev,
            "기타": {
                label: "기타",
                color: `hsl(var(--chart-${expenseCategories.length + 1}))`,
            }
        }))
    }, [incomeCategories, expenseCategories])

    const fetchTransactionsChartData = async () => {
        try {
            const fetchedTransactionsChartData = await ipcRenderer.invoke('get-transactions-chart-data-by-month', selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1)
            setIncomeChartData(fetchedTransactionsChartData.filter((item: TransactionChartData) => item.type === 'income'))
            setExpenseChartData(fetchedTransactionsChartData.filter((item: TransactionChartData) => item.type === 'expense'))
        } catch (error) {
            console.error('월별 거래 차트 데이터를 불러오는데 실패했습니다', error);
        }
    }

    const fetchTransactionsChartDataByPaymentDay = async () => {
        try {
            const fetchedTransactionsChartData = await ipcRenderer.invoke('get-transactions-chart-data-by-payment-day', selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1)
            setIncomeChartData(fetchedTransactionsChartData.filter((item: TransactionChartData) => item.type === 'income'))
            setExpenseChartData(fetchedTransactionsChartData.filter((item: TransactionChartData) => item.type === 'expense'))
        } catch (error) {
            console.error('결제일별 거래 차트 데이터를 불러오는데 실패했습니다', error);
        }
    }

    const fetchIncomeCategories = async () => {
        try {
            const fetchedIncomeCategories = await ipcRenderer.invoke('get-all-incomecategory')
            setIncomeCategories(fetchedIncomeCategories)
        } catch (error) {
            console.error('수입 카테고리를 불러오는데 실패했습니다', error);
        }
    }

    const fetchExpenseCategories = async () => {
        try {
            const fetchedExpenseCategories = await ipcRenderer.invoke('get-all-expensecategory')
            setExpenseCategories(fetchedExpenseCategories)
        } catch (error) {
            console.error('지출 카테고리를 불러오는데 실패했습니다', error);
        }
    }

    const handlePreviousMonth = () => {
        setSelectedMonthDate(subMonths(selectedMonthDate, 1))
    }

    const handleNextMonth = () => {
        setSelectedMonthDate(addMonths(selectedMonthDate, 1))
    }

    const handlePaymentDayChange = (checked: boolean) => {
        setIsPaymentDayBased(checked)
        if(checked) {
            fetchTransactionsChartDataByPaymentDay()
        } else {
            fetchTransactionsChartData()
        }
    }

    return (
        <div className='p-5 flex flex-col gap-4 flex-1'>
            <div className='title text-2xl font-bold'>분석</div>

            <div className="flex items-center justify-between gap-4">
                {/* 왼쪽 여백을 위한 빈 div */}
                <div className="flex-1"></div>
                
                {/* 가운데 Switch */}
                <div className="flex items-center gap-2">
                    <Switch
                        id="payment-day-mode"
                        checked={isPaymentDayBased}
                        onCheckedChange={handlePaymentDayChange}
                    />
                    <Label htmlFor="payment-day-mode">결제일 기준</Label>
                </div>

                {/* 오른쪽 기존 컴포넌트들 */}
                <div className="flex-1 flex items-center justify-end gap-4">
                    <MonthPicker 
                        value={selectedMonthDate}
                        onValueChange={setSelectedMonthDate}
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
            </div>

            <div className="flex flex-row flex-1 gap-4">
                <div className="flex-1">
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <div className="font-bold text-2xl">총 수입</div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="flex-1">
                            <ChartContainer config={incomeChartConfig} className="w-full h-[350px] ">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            hideLabel 
                                        />}
                                    />
                                    <Pie 
                                        data={incomeChartData} 
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
                                                    {`${payload.category} ${((payload.amount / incomeChartData.reduce((sum, item) => sum + item.amount, 0)) * 100).toFixed(0)}%`}
                                                </text>
                                            )
                                        }}
                                    />
                                </PieChart>
                            </ChartContainer>
                            <Separator className="my-4" />
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold">총 수입액</span>
                                    <span className="text-xl font-bold text-primary">
                                        {incomeChartData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}원
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {incomeChartData
                                        .sort((a, b) => b.amount - a.amount)
                                        .map((item) => (
                                        <div key={item.category} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: item.fill ?? undefined }}
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
                            <ChartContainer config={expenseChartConfig} className="w-full h-[350px] ">
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            hideLabel 
                                        />}
                                    />
                                    <Pie 
                                        data={expenseChartData} 
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
                                                    {`${payload.category} ${((payload.amount / expenseChartData.reduce((sum, item) => sum + item.amount, 0)) * 100).toFixed(0)}%`}
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
                                        {expenseChartData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}원
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {expenseChartData
                                        .sort((a, b) => b.amount - a.amount)
                                        .map((item) => (
                                        <div key={item.category} className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors">
                                            <div className="flex items-center gap-2">
                                                <div 
                                                    className="w-3 h-3 rounded-full" 
                                                    style={{ backgroundColor: item.fill ?? undefined }}
                                                />
                                                <span>{item.category}</span>
                                                <div className="text-xs text-muted-foreground">{item.paymentMethodName}</div>
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