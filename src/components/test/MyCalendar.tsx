import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: 'income' | 'expense';
  }

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


const StyledCalendarWrapper = styled.div<{ animate: boolean }>`
    .rbc-calendar {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .rbc-month-view {
        border-radius: 8px;

        ${props => props.animate && css`
            animation: ${fadeIn} 0.5s ease-out;
        `}
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

const CustomToolbar = ({ date, onNavigate, triggerAnimation }) => {
    const [year, setYear] = useState(moment(date).year());
    const [month, setMonth] = useState(moment(date).month());
  
    const handleYearChange = (e) => {
      const newYear = parseInt(e.target.value);
      setYear(newYear);
      onNavigate('DATE', moment().year(newYear).month(month).toDate());
      triggerAnimation();
    };
  
    const handleMonthChange = (e) => {
      const newMonth = parseInt(e.target.value);
      setMonth(newMonth);
      onNavigate('DATE', moment().year(year).month(newMonth).toDate());
      triggerAnimation();
    };
    
    const goToToday = () => {
        const today = moment();
        setYear(today.year());
        setMonth(today.month());
        onNavigate('DATE', today.toDate());
        triggerAnimation();
    };

    const goToPreviousMonth = () => {
        const newDate = moment(date).subtract(1, 'month');
        setYear(newDate.year());
        setMonth(newDate.month());
        onNavigate('DATE', newDate.toDate());
        triggerAnimation();
    };

    const goToNextMonth = () => {
        const newDate = moment(date).add(1, 'month');
        setYear(newDate.year());
        setMonth(newDate.month());
        onNavigate('DATE', newDate.toDate());
        triggerAnimation();
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
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [animate, setAnimate] = useState(false);
    const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [editMode, setEditMode] = useState(false);

    // Data
    const [currentTransaction, setCurrentTransaction] = useState<Transaction>({ id: '', amount: 0, description: '', type: 'expense' });
    const [transactions, setTransactions] = useState<Record<string, Transaction[]>>({});


    const triggerAnimation = useCallback(() => {
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }
        setAnimate(false);
    }, []);

    useLayoutEffect(() => {
        if (!animate) {
            animationTimeoutRef.current = setTimeout(() => {
                setAnimate(true);
            }, 0);
        }
    }, [animate]);

    const handleSelectSlot = (slotInfo: { start: Date }) => {
        setSelectedDate(moment(slotInfo.start).format('YYYY-MM-DD'));
        setCurrentTransaction({ id: '', amount: 0, description: '', type: 'expense' });
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
        setCurrentTransaction({ id: '', amount: 0, description: '', type: 'expense' });
        setEditMode(false);
      };

    const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentTransaction(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
    };

    const handleTypeChange = (value: 'income' | 'expense') => {
        setCurrentTransaction(prev => ({ ...prev, type: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentTransaction.amount && selectedDate) {
          if (editMode) {
            setTransactions(prev => ({
              ...prev,
              [selectedDate]: prev[selectedDate].map(trans => 
                trans.id === currentTransaction.id ? currentTransaction : trans
              )
            }));
          } else {
            const newTransaction = { ...currentTransaction, id: Date.now().toString() };
            setTransactions(prev => ({
              ...prev,
              [selectedDate]: [...(prev[selectedDate] || []), newTransaction]
            }));
          }
          handleCloseModal();
        }
    };

    const events = Object.entries(transactions).flatMap(([date, dayTransactions]) =>
        dayTransactions.map(transaction => ({
          start: new Date(date),
          end: new Date(date),
          title: `${transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}원 - ${transaction.description}`,
          resource: transaction,
        }))
      );

    const dayPropGetter = (date) => {
        const dateString = moment(date).format('YYYY-MM-DD');
        const hasEvent = transactions[dateString] !== undefined;
        return {
            className: `cursor-pointer hover:bg-blue-100 relative group ${hasEvent ? 'has-event' : ''}`,
        }
    };

    return (
        <StyledCalendarWrapper className='flex-1' animate={animate}>
            <Calendar
                selectable
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
                    toolbar: (props) => <CustomToolbar {...props} triggerAnimation={triggerAnimation} />
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
                    <Select
                        value={currentTransaction.type}
                        onValueChange={handleTypeChange}
                    >
                    <SelectTrigger className="mb-2">
                        <SelectValue placeholder="거래 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="income">수입</SelectItem>
                        <SelectItem value="expense">지출</SelectItem>
                    </SelectContent>
                    </Select>
                    <Input
                        type="number"
                        name="amount"
                        value={currentTransaction.amount || ''}
                        onChange={handleTransactionChange}
                        placeholder="금액 입력"
                        className="mb-2"
                    />
                    <Input
                        type="text"
                        name="description"
                        value={currentTransaction.description}
                        onChange={handleTransactionChange}
                        placeholder="설명 입력"
                        className="mb-4"
                    />
                    <DialogFooter>
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