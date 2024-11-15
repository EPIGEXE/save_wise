import { FixedCost } from "@/backend/db/entity/FixedCost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Check, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

interface FixedCostItemProps {
    item: FixedCost;
    type: 'income' | 'expense';
    dateOptions: number[];
    onUpdate: (id: number, data: Partial<FixedCost>) => void;
    onDelete: (id: number, type: 'income' | 'expense') => void;
}

export function FixedCostItem({
    item,
    type,
    dateOptions,
    onUpdate,
    onDelete,
}: FixedCostItemProps) {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: item.name,
        amount: item.amount,
        prospectDay: item.prospectDay
    });

    const handleEditFormChange = (field: string, value: string | number) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onUpdate(item.id, editForm);
        setIsEditDialogOpen(false);
    };

    return (
        <>
            <div className="group flex justify-between items-center p-4 bg-card hover:bg-accent/50 rounded-lg border shadow-sm transition-all duration-200">
                <div className="flex items-center gap-3">
                    <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.fill }}
                    />
                    <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="font-semibold text-lg">
                            {item.amount.toLocaleString()}
                            <span className="text-sm text-muted-foreground ml-1">원</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            매월 {item.prospectDay}일
                        </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => setIsEditDialogOpen(true)}
                            className="h-8 w-8"
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => onDelete(item.id, type)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>고정 {type === 'income' ? '수입' : '지출'} 수정</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>항목명</Label>
                            <Input
                                value={editForm.name}
                                onChange={(e) => handleEditFormChange('name', e.target.value)}
                                placeholder="항목명"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>금액</Label>
                            <Input
                                type="number"
                                value={editForm.amount}
                                onChange={(e) => handleEditFormChange('amount', Number(e.target.value))}
                                placeholder="금액"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>예상일</Label>
                            <Select 
                                value={editForm.prospectDay?.toString() || ''} 
                                onValueChange={(value) => handleEditFormChange('prospectDay', Number(value))}
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
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            취소
                        </Button>
                        <Button onClick={handleSave} className="gap-2">
                            <Check className="h-4 w-4" />
                            저장
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}