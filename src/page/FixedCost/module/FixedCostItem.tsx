import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Pencil, Trash2, X } from "lucide-react";

interface FixedCostItemProps {
    item: any;
    type: 'income' | 'expense';
    editingItem: number | null;
    editForm: { name: string; value: number; date: number };
    dateOptions: number[];
    onEdit: (item: any) => void;
    onDelete: (id: number, type: 'income' | 'expense') => void;
    onSave: (id: number, type: 'income' | 'expense') => void;
    onCancel: () => void;
    onEditFormChange: (field: string, value: string | number) => void;
}

export function FixedCostItem({
    item,
    type,
    editingItem,
    editForm,
    dateOptions,
    onEdit,
    onDelete,
    onSave,
    onCancel,
    onEditFormChange,
}: FixedCostItemProps) {
    if (editingItem === item.id) {
        return (
            <div className="transform transition-all duration-200 ease-out translate-y-0 opacity-100 flex justify-between items-center p-4 bg-card border rounded-lg shadow-sm">
                <div className="flex items-center gap-4 flex-1">
                    <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.fill }}
                    />
                    <div className="flex gap-4 flex-1">
                        <Input
                            value={editForm.name}
                            onChange={(e) => onEditFormChange('name', e.target.value)}
                            className="max-w-[200px]"
                            placeholder="항목명"
                        />
                        <Input
                            type="number"
                            value={editForm.value}
                            onChange={(e) => onEditFormChange('value', Number(e.target.value))}
                            className="max-w-[150px]"
                            placeholder="금액"
                        />
                        <Select 
                            value={editForm.date.toString()} 
                            onValueChange={(value) => onEditFormChange('date', Number(value))}
                        >
                            <SelectTrigger className="w-[120px]">
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
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => onSave(item.id, type)}
                        className="gap-2 transition-colors duration-200"
                    >
                        <Check className="h-4 w-4" />
                        저장
                    </Button>
                    <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={onCancel}
                        className="gap-2 transition-colors duration-200"
                    >
                        <X className="h-4 w-4" />
                        취소
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="transform transition-all duration-200 ease-out translate-y-0 group flex justify-between items-center p-4 bg-card hover:bg-accent/50 rounded-lg border shadow-sm">
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
                        {item.value.toLocaleString()}
                        <span className="text-sm text-muted-foreground ml-1">원</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        매월 {item.date}일
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => onEdit(item)}
                        className="h-8 w-8 transition-colors duration-200"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => onDelete(item.id, type)}
                        className="h-8 w-8 text-destructive hover:text-destructive transition-colors duration-200"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}