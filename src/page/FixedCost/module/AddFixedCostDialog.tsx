import { CurrencyInput } from "@/components/custom/CurrencyInput";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

interface AddFixedCostDialogProps {
    type: 'income' | 'expense';
    dateOptions: number[];
    onAdd: (data: { name: string; amount: number; prospectDay: number; type: 'income' | 'expense' }) => void;
}

export function AddFixedCostDialog({ type, dateOptions, onAdd }: AddFixedCostDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({
        name: '',
        amount: 0,
        prospectDay: 1
    });

    const handleFormChange = (field: string, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onAdd({ ...form, type });
        setForm({ name: '', amount: 0, prospectDay: 1 });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                    <PlusCircle className="h-4 w-4" />
                    새 {type === 'income' ? '수입' : '지출'} 추가
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>고정 {type === 'income' ? '수입' : '지출'} 추가</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>항목명</Label>
                        <Input
                            value={form.name}
                            onChange={(e) => handleFormChange('name', e.target.value)}
                            placeholder="항목명"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>금액</Label>
                        <CurrencyInput
                            value={form.amount || 0} 
                            onChange={(value) => handleFormChange('amount', value)}
                            placeholder="금액"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>예상일</Label>
                        <Select 
                            value={form.prospectDay?.toString() || ''} 
                            onValueChange={(value) => handleFormChange('prospectDay', Number(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="날짜 선택" />
                            </SelectTrigger>
                            <SelectContent>
                                {dateOptions.map(date => (
                                    <SelectItem key={date} value={date.toString()}>
                                        {date}일
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        취소
                    </Button>
                    <Button onClick={handleSubmit}>
                        추가
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}