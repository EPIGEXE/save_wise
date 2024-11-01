import { Asset } from "@/backend/db/entity/Asset";
import { PaymentMethod } from "@/backend/db/entity/PaymentMethod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCardIcon, LinkIcon, Wallet2Icon } from "lucide-react";
import { useEffect, useState } from "react";

const { ipcRenderer } = window;

const PaymentSetting = () => {
    const [currentPaymentMethod, setCurrentPaymentMethod] = useState<PaymentMethod>({ id: 0, name: '', type: 'cash', paymentDay: null, description: ''});
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        fetchPaymentMethods()
    }, [])

    const fetchPaymentMethods = async () => {
        try {
            const fetchedPaymentMethods = await ipcRenderer.invoke('get-all-paymentmethod')
            setPaymentMethods(fetchedPaymentMethods)
        } catch (error) {
            console.error('결제 방법을 불러오는데 실패했습니다', error)
        }
    }

    const fetchAssets = async () => {
        try { 
            const fetchedAssets = await ipcRenderer.invoke('get-all-asset')
            setAssets(fetchedAssets)
        } catch (error) {
            console.error('자산을 불러오는데 실패했습니다', error)
        }
    }

    const handleAssetChange = (value: string) => {
        setCurrentPaymentMethod(prev => ({ ...prev, assetId: parseInt(value) }));
    }

    const handleAddPaymentMethod = () => {
        setIsSheetOpen(true);
    }

    const handleCardClick = (id: number) => {
        setIsEditMode(true);
        setIsSheetOpen(true);
        setCurrentPaymentMethod(paymentMethods.find(method => method.id === id) || { id: 0, name: '', type: 'cash', paymentDay: null, description: '' });
    }

    const handleTypeChange = (value: string) => {
        setCurrentPaymentMethod(prev => ({
            ...prev,
            type: value as 'cash' | 'credit',
            paymentDay: value === 'cash' ? null : prev.paymentDay
        }));
    }

    const handlePaymentDayChange = (value: string) => {
        if (currentPaymentMethod.type === 'credit') {
            setCurrentPaymentMethod(prev => ({ ...prev, paymentDay: parseInt(value) }));
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const submittedData = {
                ...currentPaymentMethod,
                paymentDay: currentPaymentMethod.type === 'credit' ? 
                    (currentPaymentMethod.paymentDay || null) : null
            };

            if(isEditMode) {
                await ipcRenderer.invoke('update-paymentmethod', submittedData)
            } else {
                await ipcRenderer.invoke('create-paymentmethod', submittedData)
            }
            
            await fetchPaymentMethods()
            handleCloseModal();

        } catch (error) {
            console.error('결제 방법을 추가하는데 실패했습니다', error)
        }

    }

    const handleCloseModal = () => {
        setIsSheetOpen(false);
        setIsEditMode(false);
        setCurrentPaymentMethod({id: 0, name: '', type: 'cash', paymentDay: null, description: ''});
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentPaymentMethod(prev => ({ ...prev, [name]: value }));
    }

    const handleDeletePaymentMethod = async () => {
        try {
            await ipcRenderer.invoke('delete-paymentmethod', currentPaymentMethod)
            await fetchPaymentMethods()
            handleCloseModal()
        } catch (error) {
            console.error('결제 방법을 삭제하는데 실패했습니다', error)
        }
    }

    return (
        <>
            <h3 className="text-lg font-semibold mb-4">결제 관리</h3>
            <div className="grid grid-cols-4 gap-4">
                {paymentMethods.map((paymentMethod) => (
                    <div 
                        onClick={() => handleCardClick(paymentMethod.id)} 
                        key={paymentMethod.id} 
                        className={`p-4 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105 cursor-pointer ${
                            paymentMethod.type === 'credit' 
                            ? 'bg-gradient-to-br from-purple-400 to-purple-600' 
                            : 'bg-gradient-to-br from-blue-400 to-blue-600'
                        }`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-lg">{paymentMethod.name}</h4>
                            {paymentMethod.type === 'credit' 
                                ? <CreditCardIcon className="w-6 h-6" /> 
                                : <Wallet2Icon className="w-6 h-6" />
                            }
                        </div>
                        {paymentMethod.asset && (
                            <div className="mt-4">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                    paymentMethod.type === 'credit'
                                    ? 'bg-purple-200/30 text-purple-50'
                                    : 'bg-blue-200/30 text-blue-50'
                                }`}>
                                    <LinkIcon className="w-3 h-3" />
                                    {paymentMethod.asset.name}
                                </span>
                            </div>
                        )}
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-xs">{paymentMethod.type === 'credit' ? '신용카드' : '체크카드'}</span>
                            {paymentMethod.type === 'credit' && paymentMethod.paymentDay && (
                                <span className="text-xs">결제일: {paymentMethod.paymentDay}일</span>
                            )}
                        </div>
                    </div>
                ))}

                <div onClick={handleAddPaymentMethod} className="bg-white p-4 rounded-lg shadow border-2 border-dotted border-gray-300 transition-all duration-300 ease-in-out hover:border-solid hover:border-blue-500 hover:scale-105 cursor-pointer" >
                    <h4 className="font-medium mb-2">결제 방법</h4>
                    <p className="text-sm text-gray-600">결제 수단을 추가하거나 관리합니다.</p>
                </div>
            </div>
            <Dialog open={isSheetOpen} onOpenChange={handleCloseModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>결제 방법 추가</DialogTitle>
                    </DialogHeader>
                
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            name="name"
                            placeholder="결제 방법" 
                            value={currentPaymentMethod.name}
                            onChange={handleInputChange}
                            className="mb-2"
                        />
                        <Select
                            value={currentPaymentMethod.assetId?.toString() || ''}
                            onValueChange={handleAssetChange}
                            onOpenChange={(open) => { if(open) fetchAssets()}}
                        >
                            <SelectTrigger className="mb-2">
                                <SelectValue placeholder="자산 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {assets.map(asset => (
                                    <SelectItem key={asset.id} value={asset.id.toString()}>
                                        {asset.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={currentPaymentMethod.type}
                            onValueChange={handleTypeChange}
                        >
                            <SelectTrigger className="mb-2">
                                <SelectValue placeholder="결제 방법 유형" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cash">체크 카드</SelectItem>
                                <SelectItem value="credit">신용 카드</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={currentPaymentMethod.paymentDay?.toString() || ''}
                            onValueChange={handlePaymentDayChange}
                            disabled={currentPaymentMethod.type !== 'credit'}
                        >
                            <SelectTrigger className={`mb-2 ${currentPaymentMethod.type !== 'credit' ? 'bg-red-100' : ''}`}>
                                <SelectValue placeholder="결제일 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({length: 31}, (_, i) => i + 1).map(day => (
                                    <SelectItem key={day} value={day.toString()}>
                                        {day}일
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Input 
                            type="text" 
                            name="description"
                            placeholder="결제 방법 설명" 
                            value={currentPaymentMethod.description}
                            onChange={handleInputChange}
                            className="mb-2"
                        />
                        <DialogFooter>
                            {isEditMode && (
                                <Button type="button" variant="destructive" onClick={handleDeletePaymentMethod}>
                                    삭제
                                </Button>
                            )}
                                <Button type="button" variant="outline" onClick={handleCloseModal}>
                                취소
                            </Button>
                            <Button type="submit">
                                {isEditMode ? '수정' : '추가'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default PaymentSetting