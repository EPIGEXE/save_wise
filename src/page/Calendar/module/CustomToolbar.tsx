import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { MonthPicker } from "@/components/custom/MonthPicker";
import { ToolbarProps } from "react-big-calendar";
import moment from "moment";
import { CalendarTransaction } from "./MyCalendar";

interface CalendarEvent {
    start: Date;
    end: Date;
    title: string;
    resource: CalendarTransaction;
}

interface CustomToolbarProps extends ToolbarProps<CalendarEvent> {
    handlePaymentDayChange: (checked: boolean) => void;
    isPaymentDayBased: boolean;
}

const CustomToolbar = ({ date, onNavigate, handlePaymentDayChange, isPaymentDayBased }: CustomToolbarProps) => {

    const handleMonthChange = (newDate: Date) => {
      onNavigate('DATE', newDate);
    };

    const handlePreviousMonth = () => {
        const newDate = moment(date).subtract(1, 'month');
        onNavigate('DATE', newDate.toDate());
    };

    const handleNextMonth = () => {
        const newDate = moment(date).add(1, 'month');
        onNavigate('DATE', newDate.toDate());
    };
  
    return (
        <div className="flex items-center justify-between mb-4">
            <MonthPicker
                value={date}
                onValueChange={handleMonthChange}
            />
            <div className="flex items-center space-x-2">
                <Switch
                    id="payment-day-mode"
                    checked={isPaymentDayBased}
                    onCheckedChange={handlePaymentDayChange}
                />
                <Label htmlFor="payment-day-mode">결제일 기준</Label>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handlePreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default CustomToolbar;