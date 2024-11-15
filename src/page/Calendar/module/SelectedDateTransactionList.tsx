import { ArrowUpCircle } from "lucide-react";
import { ArrowDownCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import moment from "moment";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarTransaction } from "./MyCalendar";
import { useAppDispatch } from "@/store/AppStore";
import { setSelectedDate, setCurrentTransaction, setEditMode, setShowModal } from "../state/CalendarDataSlice";

const SelectedDateTransactionList = ({ date, transactions }: { 
    date: string, 
    transactions: CalendarTransaction[] 
}) => {
    const dispatch = useAppDispatch();
    
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0);
    
    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0);

    return (
        <Card className="border-none shadow-none">
            <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm font-medium">
                    {moment(date).format('YYYY년 MM월 DD일')}
                </CardTitle>
            </CardHeader>
            
            <div className="px-3 py-1 flex justify-between text-sm">
                <div className="flex items-center gap-1 text-green-600">
                    <ArrowUpCircle className="w-4 h-4" />
                    {totalIncome.toLocaleString()}원
                </div>
                <div className="flex items-center gap-1 text-red-600">
                    <ArrowDownCircle className="w-4 h-4" />
                    {totalExpense.toLocaleString()}원
                </div>
            </div>
            
            <Separator className="my-2" />
            
            <CardContent className="p-0">
                <ScrollArea className="h-[200px] px-3">
                    {transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            onClick={() => {
                                dispatch(setSelectedDate(date));
                                dispatch(setCurrentTransaction(transaction));
                                dispatch(setEditMode(true));
                                dispatch(setShowModal(true));
                            }}
                            className="group flex items-center justify-between p-2 rounded-md hover:bg-slate-100 cursor-pointer transition-colors"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-medium group-hover:text-blue-600">
                                    {transaction.description}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {transaction.fixedCostProspect ? '고정 비용' : 
                                     transaction.paymentMethod?.name || '현금'}
                                </span>
                            </div>
                            <span className={`text-sm font-medium ${
                                transaction.type === 'income' 
                                    ? 'text-green-600' 
                                    : 'text-red-600'
                            }`}>
                                {transaction.type === 'income' ? '+' : '-'}
                                {transaction.amount?.toLocaleString()}원
                            </span>
                        </div>
                    ))}
                </ScrollArea>
            </CardContent>
            
            <CardFooter className="p-3 pt-2">
                <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                        dispatch(setSelectedDate(date));
                        dispatch(setCurrentTransaction({ 
                            id: '', 
                            amount: 0, 
                            description: '', 
                            type: 'expense', 
                            paymentMethodId: null 
                        }));
                        dispatch(setEditMode(false));
                        dispatch(setShowModal(true));
                    }}
                >
                    <Plus className="w-4 h-4 mr-2" />
                    새 거래 추가
                </Button>
            </CardFooter>
        </Card>
    );
};

export default SelectedDateTransactionList;