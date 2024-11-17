
import { MonthPicker } from "@/components/custom/MonthPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, Cell, Line, Pie, PieChart, ReferenceArea, ReferenceLine, Sector, XAxis, YAxis } from "recharts";
import { fetchTransactionsChartData, fetchTransactionsChartDataByPaymentDay } from "./state/AnalysisDataSlice";
import { setChartType, setPaymentDayBased } from "./state/AnalysisUISlice";
import { setSelectedMonthDate } from "./state/AnalysisUISlice";
import { TransactionList } from "./module/TransactionList";
import { RootState, useAppSelector } from "@/store/AppStore";
import { useAppDispatch } from "@/store/AppStore";
import { PieSectorDataItem } from "recharts/types/polar/Pie";


const AnalysisPage = () => {
    const dispatch = useAppDispatch();
    const [chartKey, setChartKey] = useState({ income: 0, expense: 0 });

    const {
        isPaymentDayBased,
        selectedMonthDate,
        incomeChartConfig,
        expenseChartConfig,
        chartType
    } = useAppSelector((state: RootState) => state.analysisUI);

    const {
        incomeChartData,
        expenseChartData,
    } = useAppSelector((state: RootState) => state.analysisData);

    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    useEffect(() => {
        fetchTransactionsData();
    }, [isPaymentDayBased, selectedMonthDate]);

    useEffect(() => {
        setChartKey(prev => ({ ...prev, income: prev.income + 1, expense: prev.expense + 1 }));
    }, [incomeChartData, expenseChartData]);

    const fetchTransactionsData = () => {
        const params = {
            year: new Date(selectedMonthDate).getFullYear(),
            month: new Date(selectedMonthDate).getMonth() + 1
        };

        if (isPaymentDayBased) {
            dispatch(fetchTransactionsChartDataByPaymentDay(params));
        } else {
            dispatch(fetchTransactionsChartData(params));
        }
    };

    const handlePreviousMonth = () => {
        dispatch(setSelectedMonthDate(subMonths(selectedMonthDate, 1)));
    };

    const handleNextMonth = () => {
        dispatch(setSelectedMonthDate(addMonths(selectedMonthDate, 1)));
    };

    const handlePaymentDayChange = (checked: boolean) => {
        dispatch(setPaymentDayBased(checked));
    };

    const handleCategoryClick = (category: string) => {
        setExpandedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
    };

    const handleMonthChange = (date: Date) => {
        dispatch(setSelectedMonthDate(date));
    };

    const handleChartTypeChange = (type: 'pie' | 'bar') => {
        dispatch(setChartType(type));
    };

    const sortedIncomeData = useMemo(() => 
        [...incomeChartData].sort((a, b) => {
            if (a.category === "기타") return 1;
            if (b.category === "기타") return -1;
            return b.category?.localeCompare(a.category);
        }),
        [incomeChartData]
    );

    const sortedExpenseData = useMemo(() => 
        [...expenseChartData].sort((a, b) => {
            if (a.category === "기타") return 1;
            if (b.category === "기타") return -1;
            return b.category?.localeCompare(a.category);
        }),
        [expenseChartData]
    );

    return (
        <div className='p-5 flex flex-col gap-4 h-full'>
            <div className='title text-2xl font-bold'>분석</div>

            <div className="flex items-center justify-between gap-4">
                {/* 왼쪽 여백을 위한 빈 div */}
                <div className="flex-1"></div>

                {/* 차트 타입 스위치 추가 */}
                <div className="flex items-center gap-2">
                    <Switch
                        id="chart-type"
                        checked={chartType === 'bar'}
                        onCheckedChange={(checked) => handleChartTypeChange(checked ? 'bar' : 'pie')}
                    />
                    <Label htmlFor="chart-type">막대 그래프</Label>
                </div>
                
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
                        value={new Date(selectedMonthDate)}
                        onValueChange={handleMonthChange}
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
                                {chartType === 'pie' ?(
                                <PieChart>
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            hideLabel 
                                        />}
                                    />
                                    <Pie 
                                            key={chartKey.expense}
                                            data={incomeChartData} 
                                            dataKey="amount" 
                                            nameKey="category"
                                            outerRadius={130}
                                            labelLine={false}
                                            animationDuration={500}
                                            activeShape={({
                                                cx,
                                                cy,
                                                innerRadius,
                                                outerRadius = 0,
                                                startAngle,
                                                endAngle,
                                                fill,
                                                payload,
                                                ...props
                                            }: PieSectorDataItem) => {
                                                const fixedRatio = payload.fixedAmount / payload.amount;
                                                return (
                                                    <g>
                                                        {/* 기본 활성 섹터 */}
                                                        <Sector
                                                            cx={cx}
                                                            cy={cy}
                                                            innerRadius={innerRadius}
                                                            outerRadius={outerRadius}
                                                            startAngle={startAngle}
                                                            endAngle={endAngle}
                                                            fill={fill}
                                                        />
                                                        {/* 고정비 표시 섹터 */}
                                                        <Sector
                                                            cx={cx}
                                                            cy={cy}
                                                            innerRadius={outerRadius}
                                                            outerRadius={outerRadius + 10}
                                                            startAngle={startAngle}
                                                            endAngle={startAngle + (endAngle - startAngle) * fixedRatio}
                                                            fill={fill}
                                                            opacity={0.8}
                                                        />
                                                        {/* 비고정비 표시 섹터 */}
                                                        <Sector
                                                            cx={cx}
                                                            cy={cy}
                                                            innerRadius={outerRadius}
                                                            outerRadius={outerRadius + 10}
                                                            startAngle={startAngle + (endAngle - startAngle) * fixedRatio}
                                                            endAngle={endAngle}
                                                            fill={fill}
                                                            opacity={0.3}
                                                        />
                                                    </g>
                                                );
                                            }}
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
                                ) : (
                                    <BarChart 
                                    data={sortedIncomeData} 
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <defs>
                                        {sortedIncomeData.map((entry, index) => (
                                            <pattern
                                                key={`pattern-${index}`}
                                                id={`pattern-${index}`}
                                                patternUnits="userSpaceOnUse"
                                                width="8"
                                                height="8"
                                                patternTransform="rotate(45)"
                                            >
                                                <rect width="8" height="8" fill={entry.fill} />
                                                <line
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="8"
                                                    stroke="#000"
                                                    strokeWidth="2"
                                                    strokeOpacity="0.3"
                                                />
                                            </pattern>
                                        ))}
                                    </defs>
                                    <XAxis 
                                        dataKey="category" 
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                    />
                                    <YAxis />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            hideLabel 
                                        />}
                                    />
                                    {/* 고정비 Bar (아래쪽) - 빗금 패턴 */}
                                    <Bar 
                                        dataKey="fixedAmount" 
                                        stackId="a"
                                    >
                                        {sortedIncomeData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-fixed-${index}`}
                                                fill={`url(#pattern-${index})`}
                                            />
                                        ))}
                                    </Bar>
                                    {/* 변동비 Bar (위쪽) */}
                                    <Bar 
                                        dataKey={(data) => data.amount - data.fixedAmount}
                                        stackId="a"
                                    >
                                        {sortedIncomeData.map((entry, index) => (
                                            <Cell 
                                                key={`cell-variable-${index}`}
                                                fill={entry.fill}
                                            />
                                        ))}
                                    </Bar>
                                    
                                </BarChart>
                                )}
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
                                    {sortedIncomeData
                                        .map((item) => (
                                        <Collapsible 
                                            key={item.category}
                                            open={expandedCategories.includes(item.category)}
                                        >
                                            <CollapsibleTrigger className="w-full">
                                                <div 
                                                className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors"
                                                onClick={() => handleCategoryClick(item.category)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategories.includes(item.category) ? 'rotate-90' : ''}`} />
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
                                                <TransactionList transactions={item.rawTransactions} />
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
                                {chartType === 'pie' ?(
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent
                                                hideLabel 
                                            />}
                                        />
                                        <Pie 
                                            key={chartKey.expense}
                                            data={expenseChartData} 
                                            dataKey="amount" 
                                            nameKey="category"
                                            outerRadius={130}
                                            labelLine={false}
                                            animationDuration={500}
                                            activeShape={({
                                                cx,
                                                cy,
                                                innerRadius,
                                                outerRadius = 0,
                                                startAngle,
                                                endAngle,
                                                fill,
                                                payload,
                                                ...props
                                            }: PieSectorDataItem) => {
                                                const fixedRatio = payload.fixedAmount / payload.amount;
                                                return (
                                                    <g>
                                                        {/* 기본 활성 섹터 */}
                                                        <Sector
                                                            cx={cx}
                                                            cy={cy}
                                                            innerRadius={innerRadius}
                                                            outerRadius={outerRadius}
                                                            startAngle={startAngle}
                                                            endAngle={endAngle}
                                                            fill={fill}
                                                        />
                                                        {/* 고정비 표시 섹터 */}
                                                        <Sector
                                                            cx={cx}
                                                            cy={cy}
                                                            innerRadius={outerRadius}
                                                            outerRadius={outerRadius + 10}
                                                            startAngle={startAngle}
                                                            endAngle={startAngle + (endAngle - startAngle) * fixedRatio}
                                                            fill={fill}
                                                            opacity={0.8}
                                                        />
                                                        {/* 비고정비 표시 섹터 */}
                                                        <Sector
                                                            cx={cx}
                                                            cy={cy}
                                                            innerRadius={outerRadius}
                                                            outerRadius={outerRadius + 10}
                                                            startAngle={startAngle + (endAngle - startAngle) * fixedRatio}
                                                            endAngle={endAngle}
                                                            fill={fill}
                                                            opacity={0.3}
                                                        />
                                                    </g>
                                                );
                                            }}
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
                                ) : (
                                    <BarChart 
                                        data={sortedExpenseData} 
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <defs>
                                            {sortedExpenseData.map((entry, index) => (
                                                <pattern
                                                    key={`pattern-${index}`}
                                                    id={`pattern-${index}`}
                                                    patternUnits="userSpaceOnUse"
                                                    width="8"
                                                    height="8"
                                                    patternTransform="rotate(45)"
                                                >
                                                    <rect width="8" height="8" fill={entry.fill} />
                                                    <line
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="8"
                                                        stroke="#000"
                                                        strokeWidth="2"
                                                        strokeOpacity="0.3"
                                                    />
                                                </pattern>
                                            ))}
                                        </defs>
                                        <XAxis 
                                            dataKey="category" 
                                            tickLine={false}
                                            tickMargin={10}
                                            axisLine={false}
                                        />
                                        <YAxis />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent
                                                hideLabel 
                                            />}
                                        />
                                        {/* 고정비 Bar (아래쪽) - 빗금 패턴 */}
                                        <Bar 
                                            dataKey="fixedAmount" 
                                            stackId="a"
                                        >
                                            {sortedExpenseData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-fixed-${index}`}
                                                    fill={`url(#pattern-${index})`}
                                                />
                                            ))}
                                        </Bar>
                                        {/* 변동비 Bar (위쪽) */}
                                        <Bar 
                                            dataKey={(data) => data.amount - data.fixedAmount}
                                            stackId="a"
                                        >
                                            {sortedExpenseData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-variable-${index}`}
                                                    fill={entry.fill}
                                                />
                                            ))}
                                        </Bar>

                                        {/* 목표치까지 남은 금액 Bar */}
                                        <Bar 
                                            dataKey={(data) => data.target ? Math.max(0, data.target - data.amount) : 0}
                                            stackId="a"
                                            fill="#ff4d4f"
                                            fillOpacity={0.1}
                                            stroke="#ff4d4f"
                                            strokeDasharray="3 3"
                                            strokeWidth={1}
                                        >
                                            {/* 목표치 라벨 */}
                                            {sortedExpenseData.map((entry, index) => (
                                                entry.target && entry.target > entry.amount && (
                                                    <Label
                                                        key={`target-label-${index}`}
                                                        position="top"
                                                        fill="#ff4d4f"
                                                        fontSize={12}
                                                    >
                                                        {`목표: ${entry.target.toLocaleString()}원`}
                                                    </Label>
                                                )
                                            ))}
                                        </Bar>
                                        
                                    </BarChart>
                                )}
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
                                    {sortedExpenseData
                                        .map((item) => (
                                        <Collapsible 
                                            key={item.category}
                                            open={expandedCategories.includes(item.category)}
                                        >
                                            <CollapsibleTrigger className="w-full">
                                                <div 
                                                    className="flex justify-between items-center p-2 rounded-lg hover:bg-muted transition-colors"
                                                    onClick={() => handleCategoryClick(item.category)}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <ChevronRight className={`h-4 w-4 transition-transform ${expandedCategories.includes(item.category) ? 'rotate-90' : ''}`} />
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
                                                    <TransactionList transactions={item.rawTransactions} />
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