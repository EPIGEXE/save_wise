import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import CustomToolbar from "./CustomToolbar";
import { useAppDispatch } from "@/store/AppStore";
import {
    setIncomeCategories,
    setExpenseCategories,
    setSelectedDate,
    setPaymentMethods,
} from "../state/CalendarDataSlice";
import { setCurrentTransaction, setShowModal } from "../state/CalendarDataSlice";
import { setEditMode } from "../state/CalendarDataSlice";
import TransactionDialog from "./TransactionDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SelectedDateTransactionList from "./SelectedDateTransactionList";
import { StyledCalendarWrapper } from "@/style/styledComponents";
import { CalendarTransaction } from "../CalendarType";

const { ipcRenderer } = window;

const MyCalendar = () => {
    // ========================================== Hooks ===========================================
    moment.locale("ko-KR"); // 한국어 설정
    const localizer = momentLocalizer(moment); // 캘린더 로컬라이저(한국)
    const dispatch = useAppDispatch(); // 디스패치 함수

    // ========================================== 상태 관리 ===========================================
    const [isPaymentDayBased, setIsPaymentDayBased] = useState(false); // 결제일 기반 캘린더 여부, 사용일 기반 캘린더에서만 항목 추가 삭제 가능
    const [date, setDate] = useState(moment().startOf("month").toDate()); // 현재 선택된 날짜

    const [transactions, setTransactions] = useState<Record<string, CalendarTransaction[]>>({}); // 현재 거래들

    // ========================================== useEffect ===========================================
    // 컴포넌트 마운트 시 거래들 불러오기
    useEffect(() => {
        fetchTransaction(); // 거래들 불러오기
        fetchPaymentMethods(); // 결제 방법들 불러오기
        fetchIncomeCategories(); // 수입 카테고리들 불러오기
        fetchExpenseCategories(); // 지출 카테고리들 불러오기
    }, []);

    // 날짜 변경 시 거래들 불러오기
    useEffect(() => {
        fetchTransaction();
    }, [date]);

    // ========================================== fetch 함수 ===========================================
    // 거래들 불러오기
    const fetchTransaction = async () => {
        try {
            // 모든 트랜잭션 가져오기
            const fetchedTransactions = await ipcRenderer.invoke("get-all-transaction");

            // 현재 실제 날짜의 월과 보고 있는 달 계산
            const currentMonth = moment().startOf("month");
            const viewingMonth = moment(date).startOf("month");
            const previousMonth = viewingMonth.clone().subtract(1, "month");
            const nextMonth = viewingMonth.clone().add(1, "month");

            const mergedTransactions = { ...fetchedTransactions };

            // 각 달이 현재 달 이후인 경우에만 고정 비용 추가
            const monthsToProcess = [previousMonth, viewingMonth, nextMonth];

            for (const month of monthsToProcess) {
                if (month.isSameOrAfter(currentMonth)) {
                    const fixedCostTransactions = await convertFixedCostsToTransactions(month);
                    fixedCostTransactions.forEach(([date, transactions]) => {
                        // 해당 날짜의 기존 트랜잭션들
                        const existingTransactions = mergedTransactions[date] || [];

                        // 새로운 고정비 트랜잭션들 중 이미 등록되지 않은 것만 필터링
                        const newTransactions = transactions.filter((newTrans) => {
                            return !existingTransactions.some(
                                (existingTrans: CalendarTransaction) =>
                                    existingTrans.fixedCostId === newTrans.fixedCostId
                            );
                        });

                        mergedTransactions[date] = [...existingTransactions, ...newTransactions];
                    });
                }
            }

            // 현재 달 이후의 고정 비용 + 이번 달 거래
            setTransactions(mergedTransactions);
        } catch (error) {
            console.error("거래를 불러오는데 실패했습니다", error);
        }
    };

    // 고정 비용들을 거래로 변환
    const convertFixedCostsToTransactions = async (targetMonth: moment.Moment) => {
        const fixedCostTransactions: [string, CalendarTransaction[]][] = [];
        const fetchedFixedCosts = await ipcRenderer.invoke("get-all-fixedcost"); // 모든 고정 비용 가져오기

        // 고정 비용을 거래로 변환해서 return
        for (const fixedCost of fetchedFixedCosts) {
            const prospectDate = targetMonth.clone().date(fixedCost.prospectDay).format("YYYY-MM-DD");
            const transaction: CalendarTransaction = {
                id: `fixed-${fixedCost.id}`,
                amount: fixedCost.amount,
                description: fixedCost.name,
                type: fixedCost.type,
                paymentMethodId: null,
                incomeCategoryId: fixedCost.incomeCategoryId,
                expenseCategoryId: fixedCost.expenseCategoryId,
                fixedCostId: fixedCost.id,
                fixedCostProspect: true,
            };
            fixedCostTransactions.push([prospectDate, [transaction]]);
        }

        return fixedCostTransactions;
    };

    // 결제 방법들 불러오기
    const fetchPaymentMethods = async () => {
        try {
            const fetchedPaymentMethods = await ipcRenderer.invoke("get-all-paymentmethod");
            dispatch(setPaymentMethods(fetchedPaymentMethods));
        } catch (error) {
            console.error("결제 방법을 불러오는데 실패했습니다", error);
        }
    };

    // 수입 카테고리들 불러오기
    const fetchIncomeCategories = async () => {
        try {
            const fetchedIncomeCategories = await ipcRenderer.invoke("get-all-incomecategory");
            dispatch(setIncomeCategories(fetchedIncomeCategories));
        } catch (error) {
            console.error("수입 카테고리를 불러오는데 실패했습니다", error);
        }
    };

    // 지출 카테고리들 불러오기
    const fetchExpenseCategories = async () => {
        try {
            const fetchedExpenseCategories = await ipcRenderer.invoke("get-all-expensecategory");
            dispatch(setExpenseCategories(fetchedExpenseCategories));
        } catch (error) {
            console.error("지출 카테고리를 불러오는데 실패했습니다", error);
        }
    };

    // ========================================== 핸들러 ===========================================
    // 날짜 선택 시 거래 추가 다이얼로그 표시
    const handleSelectSlot = (slotInfo: { start: Date }) => {
        const dateStr = moment(slotInfo.start).format("YYYY-MM-DD");
        const existingTransactions = transactions[dateStr];

        if (existingTransactions && existingTransactions.length > 0) {
            return;
        }

        // 이벤트가 없는 경우 새 거래 추가 다이얼로그
        dispatch(setSelectedDate(moment(slotInfo.start).format("YYYY-MM-DD")));
        dispatch(
            setCurrentTransaction({
                id: "",
                amount: 0,
                description: "",
                type: "expense",
                paymentMethodId: null,
            })
        );
        dispatch(setEditMode(false));
        dispatch(setShowModal(true));
    };

    // 이벤트 선택 시 거래 추가 다이얼로그 표시
    const handleSelectEvent = (event: { start: Date; resource: CalendarTransaction }) => {
        dispatch(setSelectedDate(moment(event.start).format("YYYY-MM-DD")));

        // fixedCostProspect가 true인 경우 생성 모드로 설정
        if (event.resource.fixedCostProspect) {
            dispatch(
                setCurrentTransaction({
                    ...event.resource,
                    id: "", // 새로운 트랜잭션으로 처리하기 위해 id 초기화
                    fixedCostProspect: undefined, // 실제 트랜잭션으로 변환
                })
            );
            dispatch(setEditMode(false)); // 생성 모드
        } else {
            dispatch(setCurrentTransaction(event.resource));
            dispatch(setEditMode(true)); // 수정 모드
        }

        dispatch(setShowModal(true));
    };

    // 결제일 기반 캘린더 여부 변경 시 거래들 업데이트
    const handlePaymentDayChange = (checked: boolean) => {
        setIsPaymentDayBased(checked);
        if (checked) {
            setTransactions((prev) => {
                const newTransactions: Record<string, CalendarTransaction[]> = {};

                Object.entries(prev).forEach(([date, transactions]) => {
                    transactions.forEach((transaction) => {
                        const transactionDate = moment(date);
                        let newDate;

                        if (transaction.paymentMethod?.paymentDay) {
                            // 결제일이 있으면 다음 달의 해당 일자로 설정
                            newDate = transactionDate.add(1, "month").date(transaction.paymentMethod.paymentDay);
                        } else {
                            // 결제일이 없으면 현재 날짜 유지
                            newDate = transactionDate;
                        }

                        const newDateString = newDate.format("YYYY-MM-DD");

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

    // ========================================== 유틸 함수 ===========================================
    // 이벤트 데이터 생성
    const events = Object.entries(transactions).flatMap(([date, dayTransactions]) =>
        dayTransactions.map((transaction) => ({
            start: new Date(date),
            end: new Date(date),
            title: `${transaction.fixedCostId ? "⟳ " : ""}${
                transaction.type === "income" ? "+" : "-"
            }${transaction.amount?.toLocaleString()}원`,
            resource: transaction,
        }))
    );

    // 날짜 셀 스타일 설정
    const dayPropGetter = (date: Date) => {
        const dateString = moment(date).format("YYYY-MM-DD");
        const hasEvent = transactions[dateString] !== undefined;
        return {
            className: `cursor-pointer hover:bg-blue-100 relative group ${hasEvent ? "has-event" : ""}`,
        };
    };

    return (
        <StyledCalendarWrapper className="flex-1">
            <Calendar
                date={date}
                onNavigate={(newDate) => {
                    setDate(newDate);
                }}
                selectable={!isPaymentDayBased}
                localizer={localizer}
                defaultView="month"
                views={["month"]}
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
                    ),
                    dateCellWrapper: (props) => {
                        const dateStr = moment(props.value).format("YYYY-MM-DD");
                        const dayTransactions = transactions[dateStr];
                        const isCurrentMonth = moment(props.value).month() === moment(date).month();

                        const totals = dayTransactions?.reduce(
                            (acc, transaction) => {
                                if (transaction.type === "income") {
                                    acc.income += transaction.amount;
                                } else {
                                    acc.expense += transaction.amount;
                                }
                                return acc;
                            },
                            { income: 0, expense: 0 }
                        ) || { income: 0, expense: 0 };

                        const baseClasses = `
                            rbc-day-bg relative cursor-pointer
                            group hover:bg-blue-100
                            before:content-['이벤트_추가']
                            before:absolute before:top-1/2 before:left-1/2
                            before:-translate-x-1/2 before:-translate-y-1/2
                            before:bg-blue-500/80 before:text-white
                            before:px-1.5 before:py-0.5 before:rounded
                            before:text-xs before:opacity-0
                            before:transition-opacity before:duration-300
                            before:pointer-events-none
                            group-hover:before:opacity-100
                            ${dayTransactions ? "has-event before:hidden" : ""}
                            ${!isCurrentMonth ? "bg-gray-100" : ""} // 이전/다음 달 날짜 스타일
                        `;

                        if (!dayTransactions) {
                            return (
                                <div className={baseClasses} onClick={() => handleSelectSlot({ start: props.value })}>
                                    {(totals.income > 0 || totals.expense > 0) && (
                                        <div className="absolute bottom-0 right-0 left-0 px-1 py-0.5 text-[10px] text-right bg-white/80">
                                            {totals.income > 0 && (
                                                <div className="text-green-600">
                                                    +{totals.income.toLocaleString()}원
                                                </div>
                                            )}
                                            {totals.expense > 0 && (
                                                <div className="text-red-600">-{totals.expense.toLocaleString()}원</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className={`rbc-day-bg relative ${!isCurrentMonth ? "bg-gray-100" : ""}`}>
                                        {(totals.income > 0 || totals.expense > 0) && (
                                            <div
                                                className={`absolute bottom-0 right-0 left-0 px-1 py-0.5 text-[10px] text-right bg-white/80 ${
                                                    !isCurrentMonth ? "bg-gray-100" : ""
                                                }`}
                                            >
                                                {totals.income > 0 && (
                                                    <div className="text-green-600">
                                                        +{totals.income.toLocaleString()}원
                                                    </div>
                                                )}
                                                {totals.expense > 0 && (
                                                    <div className="text-red-600">
                                                        -{totals.expense.toLocaleString()}원
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-[320px] p-0" sideOffset={5} align="start">
                                    <SelectedDateTransactionList date={dateStr} transactions={dayTransactions} />
                                </PopoverContent>
                            </Popover>
                        );
                    },
                }}
                events={events}
                eventPropGetter={(event) => ({
                    style: {
                        fontSize: "14px",
                        backgroundColor: event.resource.fixedCostId
                            ? event.resource.fixedCostProspect
                                ? event.resource.type === "income"
                                    ? "rgb(240, 249, 255)" // 예정된 수입 고정비
                                    : "rgb(255, 241, 242)" // 예정된 지출 고정비
                                : event.resource.type === "income"
                                ? "rgb(219, 234, 254)" // 등록된 수입 고정비
                                : "rgb(254, 202, 202)" // 등록된 지출 고정비
                            : event.resource.type === "income"
                            ? "rgb(220, 252, 231)" // 일반 수입
                            : "rgb(254, 226, 226)", // 일반 지출
                        color: event.resource.fixedCostId
                            ? event.resource.fixedCostProspect
                                ? event.resource.type === "income"
                                    ? "rgb(59, 130, 246)" // 예정된 수입 고정비 텍스트
                                    : "rgb(239, 68, 68)" // 예정된 지출 고정비 텍스트
                                : event.resource.type === "income"
                                ? "rgb(37, 99, 235)" // 등록된 수입 고정비 텍스트
                                : "rgb(185, 28, 28)" // 등록된 지출 고정비 텍스트
                            : event.resource.type === "income"
                            ? "rgb(22, 163, 74)" // 일반 수입 텍스트
                            : "rgb(220, 38, 38)", // 일반 지출 텍스트
                        border: event.resource.fixedCostId
                            ? event.resource.fixedCostProspect
                                ? `1px dashed ${
                                      event.resource.type === "income"
                                          ? "rgb(147, 197, 253)" // 예정된 수입 고정비 테두리
                                          : "rgb(252, 165, 165)"
                                  }` // 예정된 지출 고정비 테두리
                                : `2px solid ${
                                      event.resource.type === "income"
                                          ? "rgb(147, 197, 253)" // 등록된 수입 고정비 테두리
                                          : "rgb(252, 165, 165)"
                                  }` // 등록된 지출 고정비 테두리
                            : `1px solid ${
                                  event.resource.type === "income"
                                      ? "rgb(134, 239, 172)" // 일반 수입 테두리
                                      : "rgb(252, 165, 165)"
                              }`, // 일반 지출 테두리
                        opacity: event.resource.fixedCostProspect ? 0.9 : 1,
                    },
                    className: "transition-all duration-300 ease-in-out hover:brightness-90 hover:shadow-md",
                })}
                dayPropGetter={dayPropGetter}
            />
            <TransactionDialog fetchTransaction={fetchTransaction} />
        </StyledCalendarWrapper>
    );
};

export default MyCalendar;
