import { Calendar, momentLocalizer, ToolbarProps } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const { ipcRenderer } = window;

interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: 'income' | 'expense';
    paymentMethodId: number | null;
    paymentMethod?: {
        paymentDay?: number;
    };
    incomeCategoryId?: number | null | undefined;
    expenseCategoryId?: number | null | undefined;
}

interface PaymentMethod {
    id: number;
    name: string;
    paymentDay?: number;
}

interface IncomeCategory {
    id: number;
    name: string;
}

interface ExpenseCategory {
    id: number;
    name: string;
}

type TransactionType = 'income' | 'expense';

const StyledCalendarWrapper = styled.div`
    .rbc-calendar {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .rbc-month-view {
        border-radius: 8px;

    }

    .rbc-day-bg {
        position: relative;
        overflow: hidden;
        
        &::after {
            content: '이벤트 추가';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(59, 130, 246, 0.8);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            pointer-events: none;
        }
        
        &:hover::after {
            opacity: 1;
        }
        
        &.has-event::after {
            content: none;
        }

        &.has-event {
            & ~ .rbc-row-content {
                pointer-events: auto;
            }
        }
    }

    .rbc-row {
        pointer-events: none;

        &:has(.rbc-day-bg.has-event) {
            pointer-events: auto;
        }
    }

    .rbc-row-content {
        pointer-events: none;
    }

    .rbc-event {
        pointer-events: auto;
    }
`;

interface CalendarEvent {
    start: Date;
    end: Date;
    title: string;
    resource: Transaction;
}

interface CustomToolbarProps extends ToolbarProps<CalendarEvent> {
    handlePaymentDayChange: (checked: boolean) => void;
    isPaymentDayBased: boolean;
}

const CustomToolbar = ({ date, onNavigate, handlePaymentDayChange, isPaymentDayBased }: CustomToolbarProps) => {
    const [year, setYear] = useState(moment(date).year());
    const [month, setMonth] = useState(moment(date).month());
  
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newYear = parseInt(e.target.value);
      setYear(newYear);
      onNavigate('DATE', moment().year(newYear).month(month).toDate());
    };
  
    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newMonth = parseInt(e.target.value);
      setMonth(newMonth);
      onNavigate('DATE', moment().year(year).month(newMonth).toDate());
    };
    
    const goToToday = () => {
        const today = moment();
        setYear(today.year());
        setMonth(today.month());
        onNavigate('DATE', today.toDate());
    };

    const goToPreviousMonth = () => {
        const newDate = moment(date).subtract(1, 'month');
        setYear(newDate.year());
        setMonth(newDate.month());
        onNavigate('DATE', newDate.toDate());
    };

    const goToNextMonth = () => {
        const newDate = moment(date).add(1, 'month');
        setYear(newDate.year());
        setMonth(newDate.month());
        onNavigate('DATE', newDate.toDate());
    };
    
    const koreanMonths = [
        '1월', '2월', '3월', '4월', '5월', '6월',
        '7월', '8월', '9월', '10월', '11월', '12월'
    ];
  
    return (
        <div className='flex justify-between items-center mb-4'>
            <div className="flex gap-2 items-center">
                <select value={year} onChange={handleYearChange} className="p-2 border rounded">
                {Array.from({ length: 10 }, (_, i) => year - 5 + i).map(y => (
                    <option key={y} value={y}>{y}년</option>
                ))}
                </select>
                <select value={month} onChange={handleMonthChange} className="p-2 border rounded">
                {koreanMonths.map((m, i) => (
                    <option key={i} value={i}>{m}</option>
                ))}
                </select>
                <button 
                    onClick={goToToday} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                    오늘
                </button>
            </div>
            <div className="flex items-center space-x-2">
                <Switch
                    id="payment-day-mode"
                    checked={isPaymentDayBased}
                    onCheckedChange={handlePaymentDayChange}
                />
                <Label htmlFor="payment-day-mode">결제일 기준</Label>
            </div>
            <div className="flex gap-2 items-center">
                <button 
                    onClick={goToPreviousMonth}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                    ◀
                </button>
                <button 
                    onClick={goToNextMonth}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                >
                    ▶
                </button>
            </div>
        </div>
    );
  };

  const MyCalendar = () => {
    moment.locale('ko-KR');
    const localizer = momentLocalizer(moment);

    // UI
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isPaymentDayBased, setIsPaymentDayBased] = useState(false);

    // Data
    const [currentTransaction, setCurrentTransaction] = useState<Transaction>({ id: '', amount: 0, description: '', type: 'expense', paymentMethodId: null });
    const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [incomeCategories, setIncomeCategories] = useState<IncomeCategory[]>([]);
    const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);

    useEffect(() => {
        fetchTransaction()
        fetchPaymentMethods()
        fetchIncomeCategories()
        fetchExpenseCategories()
    }, [])

    const fetchTransaction = async () => {
        try {
            const fetchedTransactions = await ipcRenderer.invoke('get-all-transaction')
            console.log(fetchedTransactions)
            setTransactions(fetchedTransactions)
        } catch (error) {
            console.error('거래를 불러오는데 실패했습니다', error)
        }
    }

    const fetchPaymentMethods = async () => {
        try {
            const fetchedPaymentMethods = await ipcRenderer.invoke('get-all-paymentmethod');
            setPaymentMethods(fetchedPaymentMethods);
        } catch (error) {
            console.error('결제 방법을 불러오는데 실패했습니다', error);
        }
    };

    const fetchIncomeCategories = async () => {
        try {
            const fetchedIncomeCategories = await ipcRenderer.invoke('get-all-incomecategory');
            setIncomeCategories(fetchedIncomeCategories);
        } catch (error) {
            console.error('수입 카테고리를 불러오는데 실패했습니다', error);
        }
    };

    const fetchExpenseCategories = async () => {
        try {
            const fetchedExpenseCategories = await ipcRenderer.invoke('get-all-expensecategory');
            setExpenseCategories(fetchedExpenseCategories);
        } catch (error) {
            console.error('지출 카테고리를 불러오는데 실패했습니다', error);
        }
    };

    const handleSelectSlot = (slotInfo: { start: Date }) => {
        setSelectedDate(moment(slotInfo.start).format('YYYY-MM-DD'));
        setCurrentTransaction({ id: '', amount: 0, description: '', type: 'expense', paymentMethodId: null });
        setEditMode(false);
        setShowModal(true);
    };

    const handleSelectEvent = (event: { start: Date; resource: Transaction }) => {
        setSelectedDate(moment(event.start).format('YYYY-MM-DD'));
        setCurrentTransaction(event.resource);
        setEditMode(true);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentTransaction({ id: '', amount: 0, description: '', type: 'expense', paymentMethodId: null });
        setEditMode(false);
    };

    const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentTransaction(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
    };

    const handleTypeChange = (value: string) => {
        if (value === 'income' || value === 'expense') {  // 타입 가드
            setCurrentTransaction(prev => ({
                ...prev,
                type: value as TransactionType,
                paymentMethodId: value === 'expense' ? prev.paymentMethodId : null,
                incomeCategoryId: value === 'income' ? null : undefined,
                expenseCategoryId: value === 'expense' ? null : undefined
            }));
        }
    };

    const handlePaymentMethodChange = (value: string) => {
        const selectedMethod = paymentMethods.find(method => method.id.toString() === value);
        setCurrentTransaction(prev => ({
            ...prev,
            paymentMethodId: selectedMethod ? selectedMethod.id : null
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (currentTransaction.amount && selectedDate) {
            try {
                if (editMode) {
                    const { paymentMethod, ...updateTransaction } = currentTransaction;
                    console.log(updateTransaction)
                    await ipcRenderer.invoke('update-transaction', updateTransaction);
                } else {
                    await ipcRenderer.invoke('create-transaction', {
                        [selectedDate]: [currentTransaction]
                    });
                }
                await fetchTransaction();
                handleCloseModal();
            } catch (error) {
                console.error(`거래를 ${editMode ? '수정' : '저장'}하는데 실패했습니다`, error);
            }
        }
    };

    const handleDeleteTransaction = async () => {
        await ipcRenderer.invoke('delete-transaction', currentTransaction);
        await fetchTransaction();
        handleCloseModal();
    }

    const handleCategoryChange = (value: string) => {
        setCurrentTransaction(prev => ({
            ...prev,
            incomeCategoryId: prev.type === 'income' ? parseInt(value) : undefined,
            expenseCategoryId: prev.type === 'expense' ? parseInt(value) : undefined
        }));
    };

    const handlePaymentDayChange = (checked: boolean) => {
        setIsPaymentDayBased(checked);
        if (checked) {
            setTransactions(prev => {
                const newTransactions: Record<string, Transaction[]> = {};
        
                Object.entries(prev).forEach(([date, transactions]) => {
                    transactions.forEach(transaction => {
                        const transactionDate = moment(date);
                        let newDate;
        
                        if (transaction.paymentMethod?.paymentDay) {
                            // 결제일이 있으면 다음 달의 해당 일자로 설정
                            newDate = transactionDate.add(1, 'month').date(transaction.paymentMethod.paymentDay);
                        } else {
                            // 결제일이 없으면 현재 날짜 유지
                            newDate = transactionDate;
                        }
        
                        const newDateString = newDate.format('YYYY-MM-DD');
                        
                        if (!newTransactions[newDateString]) {
                            newTransactions[newDateString] = [];
                        }
                        newTransactions[newDateString].push(transaction);
                    });
                });
        
                return newTransactions;
            });
        } else {
            fetchTransaction(); // 원래 거래 내역으로 돌아가기
        }
    };

    const events = Object.entries(transactions).flatMap(([date, dayTransactions]) =>
        dayTransactions.map(transaction => ({
          start: new Date(date),
          end: new Date(date),
          title: `${transaction.type === 'income' ? '+' : '-'}${transaction.amount?.toLocaleString()}원`,
          resource: transaction,
        }))
      );

    const dayPropGetter = (date: Date) => {
        const dateString = moment(date).format('YYYY-MM-DD');
        const hasEvent = transactions[dateString] !== undefined;
        return {
            className: `cursor-pointer hover:bg-blue-100 relative group ${hasEvent ? 'has-event' : ''}`,
        }
    };

    return (
        <StyledCalendarWrapper className='flex-1'>
            <Calendar
                selectable={!isPaymentDayBased}
                localizer={localizer}
                defaultView="month"
                views={['month']}
                defaultDate={new Date()}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                components={{
                    toolbar: (props) => (
                        <CustomToolbar 
                            {...props} 
                            handlePaymentDayChange={handlePaymentDayChange} 
                            isPaymentDayBased={isPaymentDayBased} 
                        />
                    )
                }}
                events={events}
                eventPropGetter={(event) => ({
                    style: {
                        fontSize: '14px',
                        backgroundColor: event.resource.type === 'income' ? 'rgb(220, 252, 231)' : 'rgb(254, 226, 226)',
                        color: event.resource.type === 'income' ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)',
                        border: `1px solid ${event.resource.type === 'income' ? 'rgb(134, 239, 172)' : 'rgb(252, 165, 165)'}`,
                    },
                    className: 'transition-all duration-300 ease-in-out hover:brightness-90 hover:shadow-md',
                })}
                dayPropGetter={dayPropGetter}
            />
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editMode ? '거래 수정' : '거래 입력'} - {selectedDate}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="type">거래 유형</Label>
                                <ToggleGroup 
                                    type="single" 
                                    value={currentTransaction.type} 
                                    onValueChange={handleTypeChange} 
                                    className="w-full"
                                >
                                    <ToggleGroupItem 
                                        value="income" 
                                        aria-label="수입" 
                                        className="w-1/2 py-2 transition-all duration-200 data-[state=on]:bg-blue-500 data-[state=on]:text-white data-[state=on]:font-bold hover:bg-gray-100 rounded-l-lg"
                                    >
                                        수입
                                    </ToggleGroupItem>
                                    <ToggleGroupItem 
                                        value="expense" 
                                        aria-label="지출" 
                                        className="w-1/2 py-2 transition-all duration-200 data-[state=on]:bg-red-500 data-[state=on]:text-white data-[state=on]:font-bold hover:bg-gray-100 rounded-r-lg"
                                    >
                                        지출
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                            
                            <div className="space-y-1">
                                <Label htmlFor="amount">금액</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    name="amount"
                                    value={currentTransaction.amount || ''}
                                    onChange={handleTransactionChange}
                                    placeholder="금액 입력"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="category">{currentTransaction.type === 'income' ? '수입' : '지출'} 카테고리</Label>
                                <div
                                    key={currentTransaction.type}
                                    className="transition-all duration-300 ease-in-out transform"
                                >
                                    <ToggleGroup 
                                        type="single" 
                                        value={currentTransaction.type === 'income' 
                                            ? currentTransaction.incomeCategoryId?.toString() || ''
                                            : currentTransaction.expenseCategoryId?.toString() || ''
                                        } 
                                        onValueChange={handleCategoryChange} 
                                        className="w-full grid grid-cols-4 gap-2"
                                    >
                                        {(currentTransaction.type === 'income' ? incomeCategories : expenseCategories).map(category => (
                                            <ToggleGroupItem 
                                            key={category.id} 
                                            value={category.id.toString()}
                                            className={`py-2 px-4 transition-all duration-200 
                                                ${currentTransaction.type === 'income' 
                                                    ? 'data-[state=on]:bg-blue-500' 
                                                    : 'data-[state=on]:bg-red-500'} 
                                                data-[state=on]:text-white data-[state=on]:font-bold 
                                                hover:bg-gray-100 rounded-lg`}
                                        >
                                            {category.name}
                                        </ToggleGroupItem>
                                        ))}
                                    </ToggleGroup>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label htmlFor="paymentMethod" className={currentTransaction.type === 'income' ? 'text-gray-400' : ''}>
                                    결제 방법
                                </Label>
                                <Select
                                    value={currentTransaction.paymentMethodId?.toString() || ''}
                                    onValueChange={handlePaymentMethodChange}
                                    disabled={currentTransaction.type === 'income'}
                                >
                                    <SelectTrigger id="paymentMethod" className={currentTransaction.type === 'income' ? 'opacity-50 cursor-not-allowed' : ''}>
                                        <SelectValue placeholder="결제 방법 선택" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {paymentMethods.map(method => (
                                            <SelectItem key={method.id} value={method.id.toString()}>
                                                {method.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-1">
                                <Label htmlFor="description">설명</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    name="description"
                                    value={currentTransaction.description}
                                    onChange={handleTransactionChange}
                                    placeholder="설명 입력"
                                />
                            </div>
                        </div>
                        
                        <DialogFooter className="mt-6">
                            {editMode && (
                                <Button type="button" variant="destructive" onClick={handleDeleteTransaction}>
                                    삭제
                                </Button>
                            )}
                            <Button type="button" variant="outline" onClick={handleCloseModal}>
                                취소
                            </Button>
                            <Button type="submit">
                                {editMode ? '수정' : '추가'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </StyledCalendarWrapper>
    )
}

export default MyCalendar