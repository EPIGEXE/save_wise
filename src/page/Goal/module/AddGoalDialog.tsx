import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Goal } from "@/backend/db/entity/Goal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/custom/CurrencyInput";

const AddGoalDialog = ({ onAdd }: { onAdd: (data: Goal) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [form, setForm] = useState({
        name: '',
        targetAmount: 0,
    });

    const handleFormChange = (field: string, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onAdd({ ...form, id: 0 });
        setForm({ name: '', targetAmount: 0 });
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                    <PlusCircle className="h-4 w-4" />
                    새 목표 추가
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>목표 추가</DialogTitle>
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
                            value={form.targetAmount || 0} 
                            onChange={(value) => handleFormChange('targetAmount', value)}
                            placeholder="금액"
                        />
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
    )
}

export default AddGoalDialog;