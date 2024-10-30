import * as React from "react"
import { format, addYears, subYears } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ko from "date-fns/locale/ko"
import type { Locale } from 'date-fns'

const koLocale = ko as unknown as Locale

export function MonthPicker({ value, onValueChange }: { value: Date, onValueChange: (date: Date) => void }) {

    // UI
    const [showMonths, setShowMonths] = React.useState(false)
    const [popoverOpen, setPopoverOpen] = React.useState(false)
    const [viewDate, setViewDate] = React.useState(new Date())

    // 데이터
    const [date, setDate] = React.useState<Date>(value)
    const [selectedYear, setSelectedYear] = React.useState<number>()

    // 현재 보고 있는 연도를 기준으로 10개의 연도 생성
    const getYearRange = (baseDate: Date) => {
        const baseYear = baseDate.getFullYear()
        const startYear = Math.floor(baseYear / 10) * 10
        return Array.from({ length: 10 }, (_, i) => startYear + i)
    }

    React.useEffect(() => {
        if (value) {
            setDate(value)
            setSelectedYear(value.getFullYear())
        }
    }, [value])

    const months = Array.from({ length: 12 }, (_, i) => i)

    const handlePreviousYears = () => {
        setViewDate(subYears(viewDate, 10))
    }

    const handleNextYears = () => {
        setViewDate(addYears(viewDate, 10))
    }

    const handleYearSelect = (year: number) => {
        setSelectedYear(year)
        setShowMonths(true)
    }

    const handleMonthSelect = (month: number) => {
        const newDate = new Date(selectedYear!, month)
        setDate(newDate)
        setPopoverOpen(false)
        onValueChange(newDate) 
    }

    const handlePopoverOpen = (open: boolean) => {
        setPopoverOpen(open)
        if (open) {
            setViewDate(date || new Date())
            setShowMonths(false)
        }
    }

    const years = getYearRange(viewDate)

    return (
        <Popover open={popoverOpen} onOpenChange={handlePopoverOpen}>
        <PopoverTrigger asChild>
            <Button
            variant={"outline"}
            className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
            )}
            >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "yyyy년 MM월", { locale: koLocale }) : <span>연도와 월을 선택해주세요</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4">
            {!showMonths ? (
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePreviousYears}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="font-semibold">
                        {years[0]} - {years[years.length - 1]}
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextYears}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setViewDate(new Date())}
                    className="w-full"
                >
                    Today
                </Button>
                <div className="grid grid-cols-2 gap-2">
                {years.map((year) => (
                    <Button
                    key={year}
                    variant={date?.getFullYear() === year ? "default" : "outline"}
                    onClick={() => handleYearSelect(year)}
                    className="w-full"
                    >
                    {year}
                    </Button>
                ))}
                </div>
            </div>
            ) : (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => setShowMonths(false)}
                >
                    ← {selectedYear}년
                </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                {months.map((month) => (
                    <Button
                    key={month}
                    variant={date && date.getFullYear() === selectedYear && date.getMonth() === month ? "default" : "outline"}
                    onClick={() => handleMonthSelect(month)}
                    className="w-full"
                    >
                    {month + 1}월
                    </Button>
                ))}
                </div>
            </div>
            )}
        </PopoverContent>
        </Popover>
    )
}