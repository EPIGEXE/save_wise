import { Button } from "@/components/ui/button";

import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectValue, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAppSelector } from "@/store/AppStore";
import { useAppDispatch } from "@/store/AppStore";
import { resetTransaction, setCurrentTransaction, setShowModal } from "../state/CalendarDataSlice";
import { CalendarTransaction } from "./MyCalendar";

const { ipcRenderer } = window;

type TransactionType = 'income' | 'expense';

const TransactionDialog = ({ fetchTransaction }: { fetchTransaction: () => Promise<void> }) => {
    const dispatch = useAppDispatch();
    const { 
        showModal, 
        editMode, 
        selectedDate, 
        currentTransaction,
        paymentMethods,
        incomeCategories,
        expenseCategories
    } = useAppSelector(state => state.calendarData);

    const handleCloseModal = () => {
        dispatch(resetTransaction());
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

    const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch(setCurrentTransaction(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value })));
    };

    const handleTypeChange = (value: string) => {
        if (value === 'income' || value === 'expense') {  // 타입 가드
            dispatch(setCurrentTransaction(prev => ({
                ...prev,
                type: value as TransactionType,
                paymentMethodId: value === 'expense' ? prev.paymentMethodId : null,
                incomeCategoryId: value === 'income' ? null : undefined,
                expenseCategoryId: value === 'expense' ? null : undefined
            })));
        }
    };

    const handlePaymentMethodChange = (value: string) => {
        const selectedMethod = paymentMethods.find(method => method.id.toString() === value);
        dispatch(setCurrentTransaction(prev => ({
            ...prev,
            paymentMethodId: selectedMethod ? selectedMethod.id : null
        })));
    };


    const handleDeleteTransaction = async () => {
        await ipcRenderer.invoke('delete-transaction', currentTransaction);
        await fetchTransaction();
        handleCloseModal();
    }

    const handleCategoryChange = (value: string) => {
        dispatch(setCurrentTransaction((prev: CalendarTransaction) => ({
            ...prev,
            incomeCategoryId: prev.type === 'income' ? parseInt(value) : undefined,
            expenseCategoryId: prev.type === 'expense' ? parseInt(value) : undefined
        })));
    };

    return (
        <Dialog open={showModal} onOpenChange={(open) => dispatch(setShowModal(open))}>
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
    )
}

export default TransactionDialog;