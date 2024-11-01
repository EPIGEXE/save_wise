import { ExpenseCategory } from "@/backend/db/entity/ExpenseCategory";
import { IncomeCategory } from "@/backend/db/entity/IncomeCategory";
import { TransactionChartData } from "@/backend/service/AnalysisService";
import { MonthPicker } from "@/components/custom/MonthPicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { addMonths, format, subMonths } from "date-fns";
import { ko } from "date-fns/locale/ko";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Pie, PieChart } from "recharts";

const { ipcRenderer } = window;

const AnalysisPage = () => {

    const [isPaymentDayBased, setIsPaymentDayBased] = useState<boolean>(false)
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

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
        if (isPaymentDayBased) {
            fetchTransactionsChartDataByPaymentDay()
        } else {
            fetchTransactionsChartData()
        }
    }, [selectedMonthDate])

    useEffect(() => {
        // 수입 카테고리 설정
        setIncomeChartConfig(prev => {
            const newConfig = { ...prev };
            incomeCategories.forEach((category) => {
                // 이미 설정된 색상이 있으면 그대로 유지, 없으면 새로 설정
                if (!newConfig[category.name]) {
                    newConfig[category.name] = {
                        label: category.name,
                        color: `hsl(var(--chart-${Object.keys(newConfig).length + 1}))`,
                    }
                }
            })
            // 기타 카테고리가 없을 때만 추가
            if (!newConfig["기타"]) {
                newConfig["기타"] = {
                    label: "기타",
                    color: `hsl(var(--chart-${Object.keys(newConfig).length + 1}))`,
                }
            }
            return newConfig;
        })

        // 지출 카테고리 설정
        setExpenseChartConfig(prev => {
            const newConfig = { ...prev };
            expenseCategories.forEach((category) => {
                // 이미 설정된 색상이 있으면 그대로 유지, 없으면 새로 설정
                if (!newConfig[category.name]) {
                    newConfig[category.name] = {
                        label: category.name,
                        color: `hsl(var(--chart-${Object.keys(newConfig).length + 1}))`,
                    }
                }
            })
            // 기타 카테고리가 없을 때만 추가
            if (!newConfig["기타"]) {
                newConfig["기타"] = {
                    label: "기타",
                    color: `hsl(var(--chart-${Object.keys(newConfig).length + 1}))`,
                }
            }
            return newConfig;
        })
    }, [incomeCategories, expenseCategories])

    const fetchTransactionsChartData = async () => {
        try {
            const fetchedTransactionsChartData = await ipcRenderer.invoke('get-transactions-chart-data-by-month', selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1)
            
            setIncomeChartData(
                fetchedTransactionsChartData
                    .filter((item: TransactionChartData) => item.type === 'income')
                    .map((item: TransactionChartData) => ({
                        ...item,
                        // fill 속성을 chartConfig의 color 값으로 설정
                        fill: incomeChartConfig[item.category]?.color
                    }))
            )
            
            setExpenseChartData(
                fetchedTransactionsChartData
                    .filter((item: TransactionChartData) => item.type === 'expense')
                    .map((item: TransactionChartData) => ({
                        ...item,
                        fill: expenseChartConfig[item.category]?.color
                    }))
            )
        } catch (error) {
            console.error('월별 거래 차트 데이터를 불러오는데 실패했습니다', error);
        }
    }

    const fetchTransactionsChartDataByPaymentDay = async () => {
        try {
            const fetchedTransactionsChartData = await ipcRenderer.invoke('get-transactions-chart-data-by-payment-day', selectedMonthDate.getFullYear(), selectedMonthDate.getMonth() + 1)
            
            setIncomeChartData(
                fetchedTransactionsChartData
                    .filter((item: TransactionChartData) => item.type === 'income')
                    .map((item: TransactionChartData) => ({
                        ...item,
                        fill: incomeChartConfig[item.category]?.color
                    }))
            )
            setExpenseChartData(
                fetchedTransactionsChartData
                    .filter((item: TransactionChartData) => item.type === 'expense')
                    .map((item: TransactionChartData) => ({
                        ...item,
                        fill: expenseChartConfig[item.category]?.color
                    }))
            )
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
        setExpandedCategories(new Set())
    }

    const handleNextMonth = () => {
        setSelectedMonthDate(addMonths(selectedMonthDate, 1))
        setExpandedCategories(new Set())
    }

    const handlePaymentDayChange = (checked: boolean) => {
        setIsPaymentDayBased(checked)
        if(checked) {
            fetchTransactionsChartDataByPaymentDay()
        } else {
            fetchTransactionsChartData()
        }
    }

    const handleCategoryClick = (category: string) => {
        setExpandedCategories(prev => {
            const newSet = new Set(prev)
            if (newSet.has(category)) {
                newSet.delete(category)
            } else {
                newSet.add(category)
            }
            return newSet
        })
    }

    return (
        <div className='p-5 flex flex-col gap-4 h-full'>
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

            <div className="flex flex-row gap-4 min-h-0 flex-1">
                <div className="flex flex-col flex-1">
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <div className="font-bold text-2xl">총 수입</div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="flex flex-col flex-1 min-h-0">
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
                            <div className="flex flex-col flex-1 space-y-4 overflow-y-auto min-h-0">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold">총 수입액</span>
                                    <span className="text-xl font-bold text-primary">
                                        {incomeChartData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}원
                                    </span>
                                </div>
                                <div className="flex-1 space-y-2 overflow-y-auto">
                                    {incomeChartData
                                        .sort((a, b) => {
                                            // "기타" 카테고리는 항상 마지막으로
                                            if (a.category === "기타") return 1;
                                            if (b.category === "기타") return -1;
                                            // 나머지는 기존 정렬 방식 유지
                                            return b.category.localeCompare(a.category);
                                        })
                                        .map((item) => (
                                        <Collapsible key={item.category}>
                                        <CollapsibleTrigger className="w-full">
                                            <div 
                                                className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors"
                                                onClick={() => handleCategoryClick(item.category)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategories.has(item.category) ? 'rotate-90' : ''}`} />
                                                    <div 
                                                        className="w-3 h-3 rounded-full" 
                                                        style={{ backgroundColor: item.fill ?? undefined }}
                                                    />
                                                    <span>{item.category}</span>
                                                </div>
                                                <span className="font-medium">{item.amount.toLocaleString()}원</span>
                                            </div>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                                            <div className="ml-8 space-y-1 mt-2">
                                                {item.rawTransactions
                                                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                                    .map((transaction) => (
                                                    <div key={transaction.id} className="flex justify-between items-center p-2 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2">
                                                            <span>{format(new Date(transaction.date), 'M월 d일', { locale: ko })}</span>
                                                            <div className="text-black">{transaction.description}</div>
                                                        </div>
                                                        <span>{transaction.amount.toLocaleString()}원</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CollapsibleContent>
                                        </Collapsible>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex flex-col flex-1">
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <div className="font-bold text-2xl">총 지출</div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="flex flex-col flex-1 min-h-0">
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
                            <div className="flex flex-col flex-1 space-y-4 overflow-y-auto min-h-0">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-semibold">총 지출액</span>
                                    <span className="text-xl font-bold text-primary">
                                        {expenseChartData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}원
                                    </span>
                                </div>
                                <div className="flex-1 space-y-2 overflow-y-auto">
                                    {expenseChartData
                                        .sort((a, b) => {
                                            // "기타" 카테고리는 항상 마지막으로
                                            if (a.category === "기타") return 1;
                                            if (b.category === "기타") return -1;
                                            // 나머지는 기존 정렬 방식 유지
                                            return b.category.localeCompare(a.category);
                                        })
                                        .map((item) => (
                                        <Collapsible key={item.category}>
                                            <CollapsibleTrigger className="w-full">
                                                <div 
                                                    className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors"
                                                    onClick={() => handleCategoryClick(item.category)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategories.has(item.category) ? 'rotate-90' : ''}`} />
                                                        <div 
                                                            className="w-3 h-3 rounded-full" 
                                                            style={{ backgroundColor: item.fill ?? undefined }}
                                                        />
                                                        <span>{item.category}</span>
                                                    </div>
                                                    <span className="font-medium">{item.amount.toLocaleString()}원</span>
                                                </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown">
                                                <div className="ml-8 space-y-1 mt-2">
                                                    {item.rawTransactions
                                                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                                        .map((transaction) => (
                                                        <div key={transaction.id} className="flex justify-between items-center p-2 text-sm text-muted-foreground">
                                                            <div className="flex items-center gap-2">
                                                                <span>{format(new Date(transaction.date), 'M월 d일', { locale: ko })}</span>
                                                                <Badge 
                                                                    variant={transaction.paymentMethod?.type === 'credit' ? 'purple' : 'blue'}
                                                                >
                                                                    {transaction.paymentMethod?.name}
                                                                </Badge>
                                                                {isPaymentDayBased && transaction.paymentMethod?.paymentDay && <Badge variant="destructive">{transaction.paymentMethod?.paymentDay}일</Badge>}

                                                                <div className="text-black">{transaction.description}</div>
                                                            </div>
                                                            <span>{transaction.amount.toLocaleString()}원</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
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